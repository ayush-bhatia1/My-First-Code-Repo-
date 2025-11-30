import "../congress.css";

export default function CongressTradesTable({ rows }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Ticker</th>
            <th>Owner</th>
            <th>Chamber</th>
            <th>Party</th>
            <th>State</th>
            <th>Asset</th>
            <th>Transaction</th>
            <th>Amount Range</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.tx_date}</td>
              <td>{r.ticker}</td>
              <td>{r.owner}</td>
              <td>{r.chamber}</td>
              <td>{r.party}</td>
              <td>{r.state}</td>
              <td>{r.asset_type}</td>
              <td>{r.transaction}</td>
              <td>{r.amount_range}</td>
              <td>{r.source}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={10} className="empty">No trades match your filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
