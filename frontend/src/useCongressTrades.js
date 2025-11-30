import { useEffect, useRef, useState } from "react";

const LS_KEY = "congress_last_seen_ids";

export default function useCongressTrades(options = {}) {
  const {
    pollMs = 30000,
    feedUrl = "/mock/congress_trades.json",
    persistSeen = true,
  } = options;

  const [trades, setTrades] = useState([]);
  const [newTrades, setNewTrades] = useState([]);

  // Initialize Set of last-seen IDs (baseline)
  const lastSeenIds = useRef(() => {
    if (!persistSeen) return new Set();
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return new Set();
      return new Set(JSON.parse(raw));
    } catch {
      return new Set();
    }
  })();

  const saveSeen = () => {
    if (!persistSeen) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(lastSeenIds)));
    } catch {
      // ignore
    }
  };

  const fetchTrades = async () => {
    const res = await fetch(`${feedUrl}?_=${Date.now()}`); // cache-bust
    const data = await res.json();

    const sorted = data
      .slice()
      .sort(
        (a, b) =>
          new Date(b.disclosure_date).getTime() -
          new Date(a.disclosure_date).getTime()
      );

    setTrades(sorted);

    const unseen = sorted.filter((t) => !lastSeenIds.has(t.id));
    if (unseen.length > 0 && lastSeenIds.size > 0) {
      setNewTrades(unseen);
    }

    for (const t of sorted) lastSeenIds.add(t.id);
    saveSeen();
  };

  useEffect(() => {
    fetchTrades(); // initial
    const i = setInterval(fetchTrades, pollMs);
    return () => clearInterval(i);
  }, [pollMs, feedUrl]);

  const demoNewTrade = () => {
    const demo = {
      id: `demo-${Date.now()}`,
      ticker: "AAPL",
      type: "BUY",
      size_usd: 15000,
      member: "Rep. Demo Person (TX)",
      disclosure_date: new Date().toISOString(),
      transaction_date: new Date().toISOString().slice(0, 10),
      source: "house",
      link: "https://clerk.house.gov/FinancialDisclosure",
    };

    setTrades((prev) => [demo, ...prev]);
    setNewTrades([demo]);
    lastSeenIds.add(demo.id);
    saveSeen();
  };

  const clearNewTrades = () => setNewTrades([]);

  return {
    trades,
    newTrades,        // NEW: array of fresh filings
    clearNewTrades,   // NEW: dismiss banner
    demoNewTrade,     // NEW: demo button
  };
}

