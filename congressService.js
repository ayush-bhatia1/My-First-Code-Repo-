const DEFAULT_TX_DATE = "90d";
const DEFAULT_PAGE_LIMIT = 1;

let _fetch = global.fetch;
if (typeof _fetch !== "function") {
  _fetch = (...args) => import("node-fetch").then(m => m.default(...args));
}

async function fetchCongressTrades({ txDate = DEFAULT_TX_DATE, pageLimit = DEFAULT_PAGE_LIMIT } = {}) {
  const datasetUrl = `https://api.apify.com/v2/actor-tasks/ZCw3DkK5mWeYoS8LK/run-sync-get-dataset-items?txDate=${encodeURIComponent(txDate)}&maxPagesPerQuery=${encodeURIComponent(pageLimit)}`;
  const res = await _fetch(datasetUrl);
  if (!res.ok) {
    throw new Error(`Upstream error ${res.status}`);
  }
  const data = await res.json();

  return (data || []).map((r) => ({
    tx_date: r.txDate || r.transaction_date || r.date,
    ticker: r.ticker || r.symbol || "",
    owner: r.owner || r.politician || r.name || "",
    chamber: r.chamber || "",
    party: r.party || "",
    state: r.state || "",
    asset_type: r.assetType || r.asset_type || "",
    transaction: r.type || r.transaction || "",
    amount_range: r.size || r.amount || "",
    source: "CapitolTrades",
  }));
}

module.exports = {
  fetchCongressTrades,
};
