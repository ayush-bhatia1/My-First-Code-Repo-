import React from "react";
import CongressTradeAlerts from "./components/CongressTradeAlerts";

export default function App() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      {/* Congressional trade banner */}
      <CongressTradeAlerts />

      {/* ---- Your existing app content goes below ---- */}
      <header style={{ marginTop: 12, marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Stock & Sentiment Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Live prices, sentiment overlays, and congressional trading activity
        </p>
      </header>

      {/* Example placeholders — keep or replace with your actual components */}
      <section style={{ marginTop: 16 }}>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Watchlist</h2>
          {/* <Watchlist /> */}
          <p style={{ opacity: 0.7 }}>Your watchlist appears here.</p>
        </div>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Sentiment Overview</h2>
          {/* <SentimentOverview /> */}
          <p style={{ opacity: 0.7 }}>
            Sentiment heatmaps and trend charts appear here.
          </p>
        </div>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Congressional Trades Feed</h2>
          {/* <CongressTradesTable /> */}
          <p style={{ opacity: 0.7 }}>
            Recent filings and trade details appear here.
          </p>
        </div>
      </section>
    </div>
  );
}
