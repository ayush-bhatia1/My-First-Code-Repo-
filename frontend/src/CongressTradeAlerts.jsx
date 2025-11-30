import React, { useMemo } from "react";
import useCongressTrades from "../hooks/useCongressTrades";

export default function CongressTradeAlerts() {
  const { newTrades, clearNewTrades, demoNewTrade } = useCongressTrades({
    pollMs: 30000,                   
    feedUrl: "/mock/congress_trades.json", 
    persistSeen: true,
  });

  const latest = useMemo(() => newTrades?.[0], [newTrades]);

  if (!latest) {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
        <small style={{ opacity: 0.7 }}>
          Congressional Trade Alerts: no new trades.
        </small>
        <button
          onClick={demoNewTrade}
          style={{
            border: "1px solid #ccc",
            padding: "4px 8px",
            borderRadius: 6,
            cursor: "pointer",
            background: "white",
          }}
        >
          Demo new trade
        </button>
      </div>
    );
  }

  const isBuy = String(latest.type || "").toUpperCase() === "BUY";

  return (
    <div
      role="alert"
      style={{
        background: isBuy ? "#eaffea" : "#ffecec",
        border: isBuy ? "1px solid #9ee29e" : "1px solid #f0a3a3",
        padding: "10px 12px",
        borderRadius: 10,
        margin: "10px 0",
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <strong style={{ fontSize: 14 }}>
          New Congressional Trade: {latest.member}
        </strong>
        <span style={{ fontSize: 13 }}>
          {String(latest.type || "").toUpperCase()} {latest.ticker}
          {latest.size_usd ? ` (~$${Number(latest.size_usd).toLocaleString()})` : ""} •{" "}
          {new Date(latest.disclosure_date).toLocaleString()}
          {latest.link ? (
            <>
              {" "}
              •{" "}
              <a href={latest.link} target="_blank" rel="noreferrer">
                source
              </a>
            </>
          ) : null}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={clearNewTrades}
          style={{
            background: "white",
            border: "1px solid #ccc",
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
