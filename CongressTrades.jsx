import CongressTradesTable from "./components/CongressTradesTable.jsx";
import { useCongressTrades } from "./hooks/useCongressTrades.js";

export default function CongressTrades() {
  const {
    filtered, loading, error,
    query, setQuery,
    chamber, setChamber,
    party, setParty,
  } = useCongressTrades({ txDate: "90d", pageLimit: 1 });

  return (
    <div style={{ padding: 16 }}>
      <h2>Congressional Trading</h2>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          placeholder="Search ticker, name, state..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select value={chamber} onChange={e => setChamber(e.target.value)}>
          <option>All</option>
          <option>House</option>
          <option>Senate</option>
        </select>
        <select value={party} onChange={e => setParty(e.target.value)}>
          <option>All</option>
          <option>Democrat</option>
          <option>Republican</option>
          <option>Independent</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && <CongressTradesTable rows={filtered} />}
    </div>
  );
}
