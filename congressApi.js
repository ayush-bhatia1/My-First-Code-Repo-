const API_URL = (import.meta && import.meta.env && import.meta.env.VITE_CONGRESS_API) || "/api/congress-trades";

export async function getCongressTrades({ txDate = "90d", pageLimit = 1 } = {}) {
  const url = new URL(API_URL, window.location.origin);
  url.searchParams.set("txDate", txDate);
  url.searchParams.set("pageLimit", String(pageLimit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
