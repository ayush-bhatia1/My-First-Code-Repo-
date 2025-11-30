'''from fastapi.testclient import TestClient
from backend.app import app
from backend.models import PriceBar, PriceSeries
from backend.price_provider import get_prices

client = TestClient(app)

# checking app.py: /api/prices endpoint returns correct structure
def test_prices_endpoint_functionality():
    resp = client.get("/api/prices/SBUX?range=1mo&interval=1d")
    data = resp.json()
    assert "symbol" in data and "bars" in data            # structure of JSON output
    assert all("close" in b for b in data["bars"])        # every bar contains close price

# checking models.py: PriceBar fields and logic
def test_pricebar_data_structure():
    bar = PriceBar(date="2025-01-01", open=100, high=105, low=98, close=102, volume=1000)
    assert bar.close >= bar.low
    assert isinstance(bar.high, (int, float))

# checking models.py: PriceSeries composition and types
def test_priceseries_holds_bars():
    bar = PriceBar(date="2025-01-01", open=1, high=2, low=0.5, close=1.5, volume=500)
    ps = PriceSeries(symbol="SBUX", interval="1d", range="1mo", bars=[bar])
    assert isinstance(ps.bars[0], PriceBar)
    assert ps.symbol == "SBUX"

# checking price_provider.py: function returns expected structure
def test_price_provider_output_structure():
    series = get_prices("SBUX", interval="1d", range_="1mo")
    assert isinstance(series, PriceSeries)
    assert all(hasattr(b, "close") for b in series.bars)

# checking price_provider.py: returned data is numerically consistent
def test_price_values_consistency():
    series = get_prices("AAPL", interval="1d", range_="1mo")
    closes = [b.close for b in series.bars]
    assert all(c >= 0 for c in closes)
    assert len(closes) > 5
'''