from typing import Dict, Any, List
from datetime import datetime, timezone
from functools import lru_cache
import yfinance as yf

@lru_cache(maxsize=16)
def _fetch_raw(symbol: str) -> Dict[str, Any]:
    t = yf.Ticker(symbol)
    fast = getattr(t, "fast_info", {}) or {}
    info = t.info or {}
    market_cap = fast.get("market_cap") or info.get("marketCap")
    volume = fast.get("last_volume") or info.get("volume")
    pe = info.get("trailingPE") or info.get("forwardPE")
    return {
        "symbol": symbol,
        "name": info.get("shortName") or symbol,
        "market_cap": int(market_cap) if market_cap is not None else None,
        "pe_ratio": float(pe) if pe is not None else None,
        "volume": int(volume) if volume is not None else None,
    }

def get_stock_metrics(symbols: List[str]) -> List[Dict[str, Any]]:
    results = []
    for symbol in symbols:
        try:
            raw = _fetch_raw(symbol.upper())
            result = {**raw, "fetched_at": datetime.now(timezone.utc).isoformat()}
            results.append(result)
        except Exception as e:
            results.append({
                "symbol": symbol,
                "error": str(e),
                "fetched_at": datetime.now(timezone.utc).isoformat()
            })
    return results

