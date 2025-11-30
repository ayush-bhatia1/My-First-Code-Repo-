import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import CongressTradeAlerts from "../CongressTradeAlerts";

vi.mock("../../hooks/useCongressTrades", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    __esModule: true,
    default: vi.fn(() => ({
      newTrades: [],
      clearNewTrades: vi.fn(),
      demoNewTrade: vi.fn(),
    })),
  };
});

import useCongressTrades from "../../hooks/useCongressTrades";

describe("CongressTradeAlerts banner", () => {
  beforeEach(() => vi.clearAllMocks());

  it("1) shows 'no new trades' status and demo button when newTrades is empty", () => {
    useCongressTrades.mockReturnValue({
      newTrades: [],
      clearNewTrades: vi.fn(),
      demoNewTrade: vi.fn(),
    });
    render(<CongressTradeAlerts />);
    expect(
      screen.getByText(/congressional trade alerts: no new trades/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /demo new trade/i })).toBeInTheDocument();
  });

  it("2) clicking 'Demo new trade' calls demoNewTrade()", () => {
    const demoNewTrade = vi.fn();
    useCongressTrades.mockReturnValue({
      newTrades: [],
      clearNewTrades: vi.fn(),
      demoNewTrade,
    });
    render(<CongressTradeAlerts />);
    fireEvent.click(screen.getByRole("button", { name: /demo new trade/i }));
    expect(demoNewTrade).toHaveBeenCalled();
  });

  it("3) renders an alert banner when there is a new trade and shows core fields", () => {
    useCongressTrades.mockReturnValue({
      newTrades: [
        {
          id: "x1",
          ticker: "NVDA",
          type: "BUY",
          size_usd: 25000,
          member: "Rep. Jane Doe (CA)",
          disclosure_date: "2025-11-03T21:05:00Z",
          link: "https://clerk.house.gov/FinancialDisclosure",
        },
      ],
      clearNewTrades: vi.fn(),
      demoNewTrade: vi.fn(),
    });
    render(<CongressTradeAlerts />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByText(/new congressional trade: rep\. jane doe \(ca\)/i)).toBeInTheDocument();
    expect(screen.getByText(/buy nvda/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /source/i });
    expect(link).toHaveAttribute("href", "https://clerk.house.gov/FinancialDisclosure");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringMatching(/noreferrer/i));
  });

  it("4) clicking Dismiss calls clearNewTrades()", () => {
    const clearNewTrades = vi.fn();
    useCongressTrades.mockReturnValue({
      newTrades: [
        {
          id: "x1",
          ticker: "MSFT",
          type: "SELL",
          size_usd: 12000,
          member: "Sen. John Roe (NY)",
          disclosure_date: "2025-11-03T21:10:00Z",
        },
      ],
      clearNewTrades,
      demoNewTrade: vi.fn(),
    });
    render(<CongressTradeAlerts />);
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(clearNewTrades).toHaveBeenCalled();
  });

  it("5) BUY trade uses the 'buy' visual style (green-ish background/border)", () => {
    useCongressTrades.mockReturnValue({
      newTrades: [
        {
          id: "x1",
          ticker: "AAPL",
          type: "BUY",
          size_usd: 15000,
          member: "Rep. Demo (TX)",
          disclosure_date: "2025-11-03T21:10:00Z",
        },
      ],
      clearNewTrades: vi.fn(),
      demoNewTrade: vi.fn(),
    });
    render(<CongressTradeAlerts />);
    const alert = screen.getByRole("alert");
    // Inline style check (matches the provided component’s palette)
    expect(alert).toHaveStyle({ background: "#eaffea" });
  });

  it("6) SELL trade uses the 'sell' visual style (red-ish background/border)", () => {
    useCongressTrades.mockReturnValue({
      newTrades: [
        {
          id: "x2",
          ticker: "AAPL",
          type: "SELL",
          size_usd: 15000,
          member: "Rep. Demo (TX)",
          disclosure_date: "2025-11-03T21:10:00Z",
        },
      ],
      clearNewTrades: vi.fn(),
      demoNewTrade: vi.fn(),
    });
    render(<CongressTradeAlerts />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveStyle({ background: "#ffecec" });
  });
});
