from datetime import datetime
from fastapi.testclient import TestClient

from app import app
from models import CloseBar, PriceSeries
from price_provider import get_prices


def run_tests():
    print("\nRunning backend tests (10 assert statements)…\n")
    client = TestClient(app)

    # 1–2) price_provider.get_prices: returns PriceSeries with enough data
    series = get_prices("AAPL")
    assert isinstance(series, PriceSeries)
    assert len(series.bars) > 20  # ~6 months daily -> plenty of bars
    print("PASS: Tests 1–2 – get_prices returns expected structure and length")

    # 3–4) HTTP endpoint /api/prices/{symbol}: correct shape and symbol
    resp = client.get("/api/prices/MSFT")
    data = resp.json()
    assert resp.status_code == 200
    assert data["symbol"] == "MSFT"
    print("PASS: Tests 3–4 – /api/prices/MSFT returns 200 and correct symbol")

    # 5–6) CloseBar model: type/logic correctness
    bar = CloseBar(date=datetime(2025, 1, 1), close=123.45)
    assert isinstance(bar.date, datetime)
    assert bar.close >= 0
    print("PASS: Tests 5–6 – CloseBar validates fields")

    # 7–8) Another ticker path: GOOGL should work and include close values
    series_googl = get_prices("GOOGL")
    closes_googl = [b.close for b in series_googl.bars]
    assert isinstance(series_googl, PriceSeries)
    assert all(isinstance(c, (int, float)) and c >= 0 for c in closes_googl)
    print("PASS: Tests 7–8 – get_prices(GOOGL) returns valid non-negative closes")

    # 9–10) Error handling: invalid symbol raises 404 on endpoint and ValueError in function
    bad_symbol = "NOT_A_REAL_TICKER_123"
    resp_bad = client.get(f"/api/prices/{bad_symbol}")
    assert resp_bad.status_code == 404
    try:
        _ = get_prices(bad_symbol)
        assert False, "Expected ValueError for invalid symbol"
    except ValueError:
        assert True
    print("PASS: Tests 9–10 – invalid symbol handled (404 / ValueError)")

    print("\nAll 10 assert statements passed.\n")


if __name__ == "__main__":
    run_tests()
