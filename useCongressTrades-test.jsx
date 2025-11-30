import React, { useEffect, useState } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";

import useCongressTrades from "../useCongressTrades";

const flush = () => new Promise((r) => setTimeout(r, 0));

function Harness({ options }) {
  const { trades, newTrades, clearNewTrades, demoNewTrade } = useCongressTrades(options);
  return (
    <div>
      <div data-testid="trades-count">{trades?.length ?? 0}</div>
      <div data-testid="new-trades-count">{newTrades?.length ?? 0}</div>
      <button onClick={clearNewTrades}>clear</button>
      <button onClick={demoNewTrade}>demo</button>
    </div>
  );
}

describe("useCongressTrades hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const store = {};
    vi.stubGlobal("localStorage", {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => { store[k] = v; },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    });
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("1) initial fetch sets baseline; no 'newTrades' on first load", async () => {
    const initial = [
      {
        id: "a1",
        ticker: "NVDA",
        type: "BUY",
        disclosure_date: "2025-11-03T21:05:00Z",
      },
    ];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => initial });

    render(<Harness options={{ pollMs: 30000, feedUrl: "/mock.json", persistSeen: true }} />);
    await act(async () => {
      await flush();
    });

    expect(screen.getByTestId("trades-count").textContent).toBe("1");
    expect(screen.getByTestId("new-trades-count").textContent).toBe("0");
  });

  it("2) on subsequent poll, unseen IDs appear in newTrades", async () => {
    const initial = [
      { id: "a1", ticker: "NVDA", type: "BUY", disclosure_date: "2025-11-03T21:05:00Z" },
    ];
    const next = [
      ...initial,
      { id: "a2", ticker: "MSFT", type: "SELL", disclosure_date: "2025-11-03T21:10:00Z" },
    ];

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => initial }) // first load
      .mockResolvedValueOnce({ ok: true, json: async () => next });    // second poll

    render(<Harness options={{ pollMs: 1000, feedUrl: "/mock.json", persistSeen: true }} />);

    await act(async () => { await flush(); });
    expect(screen.getByTestId("new-trades-count").textContent).toBe("0");

    await act(async () => {
      vi.advanceTimersByTime(1005);
      await flush();
    });
    expect(screen.getByTestId("new-trades-count").textContent).toBe("1");
  });

  it("3) clearNewTrades empties the newTrades array", async () => {
    const initial = [
      { id: "a1", ticker: "NVDA", type: "BUY", disclosure_date: "2025-11-03T21:05:00Z" },
    ];
    const next = [
      ...initial,
      { id: "a2", ticker: "MSFT", type: "SELL", disclosure_date: "2025-11-03T21:10:00Z" },
    ];

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => initial })
      .mockResolvedValueOnce({ ok: true, json: async () => next });

    render(<Harness options={{ pollMs: 1000, feedUrl: "/mock.json", persistSeen: true }} />);

    await act(async () => { await flush(); });
    await act(async () => {
      vi.advanceTimersByTime(1005);
      await flush();
    });
    expect(screen.getByTestId("new-trades-count").textContent).toBe("1");

    fireEvent.click(screen.getByText(/clear/i));
    expect(screen.getByTestId("new-trades-count").textContent).toBe("0");
  });

  it("4) demoNewTrade synthesizes a new trade and flags it", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<Harness options={{ pollMs: 30000, feedUrl: "/mock.json", persistSeen: true }} />);

    await act(async () => { await flush(); });
    fireEvent.click(screen.getByText(/demo/i));
    expect(Number(screen.getByTestId("trades-count").textContent)).toBeGreaterThanOrEqual(1);
    expect(Number(screen.getByTestId("new-trades-count").textContent)).toBe(1);
  });
});
