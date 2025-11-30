import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.metrics import get_stock_metrics

client = TestClient(app)


def test_get_stock_metrics_single_symbol():
    """Test get_stock_metrics returns correct structure for single symbol"""
    result = get_stock_metrics(["AAPL"])
    
    assert isinstance(result, list)
    assert len(result) == 1
    
    metrics = result[0]
    assert "symbol" in metrics
    assert "name" in metrics
    assert "market_cap" in metrics
    assert "pe_ratio" in metrics
    assert "volume" in metrics
    assert "fetched_at" in metrics


def test_get_stock_metrics_multiple_symbols():
    """Test get_stock_metrics works with multiple symbols"""
    symbols = ["AAPL", "MSFT", "GOOGL"]
    result = get_stock_metrics(symbols)
    
    assert isinstance(result, list)
    assert len(result) == 3
    
    # Check each result has correct structure
    for metrics in result:
        assert "symbol" in metrics
        assert metrics["symbol"] in symbols


def test_get_stock_metrics_data_types():
    """Test that returned data has correct types"""
    result = get_stock_metrics(["AAPL"])
    metrics = result[0]
    
    assert isinstance(metrics["symbol"], str)
    assert isinstance(metrics["name"], str)
    assert metrics["market_cap"] is None or isinstance(metrics["market_cap"], int)
    assert metrics["pe_ratio"] is None or isinstance(metrics["pe_ratio"], float)
    assert metrics["volume"] is None or isinstance(metrics["volume"], int)
    assert isinstance(metrics["fetched_at"], str)


def test_get_stock_metrics_invalid_symbol():
    """Test that invalid symbols are handled gracefully"""
    result = get_stock_metrics(["INVALID_TICKER_123"])
    
    assert isinstance(result, list)
    assert len(result) == 1
    
    metrics = result[0]
    assert "error" in metrics
    assert metrics["symbol"] == "INVALID_TICKER_123"


def test_metrics_api_endpoint_single():
    """Test /api/metrics endpoint with single symbol"""
    response = client.get("/api/metrics?symbols=AAPL")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "results" in data
    assert len(data["results"]) == 1
    assert data["results"][0]["symbol"] == "AAPL"


def test_metrics_api_endpoint_multiple():
    """Test /api/metrics endpoint with multiple symbols"""
    response = client.get("/api/metrics?symbols=AAPL,MSFT,GOOGL")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "results" in data
    assert len(data["results"]) == 3
    
    symbols = [result["symbol"] for result in data["results"]]
    assert "AAPL" in symbols
    assert "MSFT" in symbols
    assert "GOOGL" in symbols


def test_metrics_api_endpoint_empty_symbols():
    """Test /api/metrics endpoint with empty symbols parameter"""
    response = client.get("/api/metrics?symbols=")
    
    assert response.status_code == 400


def test_metrics_api_endpoint_csv_with_spaces():
    """Test /api/metrics endpoint handles CSV with spaces correctly"""
    response = client.get("/api/metrics?symbols=AAPL, MSFT , GOOGL")
    
    assert response.status_code == 200
    data = response.json()
    
    assert len(data["results"]) == 3