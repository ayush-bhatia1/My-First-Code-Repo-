export async function getPrices(symbol, range = "1y", interval = "1d") {
  const r = await fetch(`/api/prices/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}