from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from models import PriceSeries
from price_provider import get_prices
from metrics import get_stock_metrics

from io import BytesIO
import matplotlib
matplotlib.use("Agg")  # headless backend for servers/CI
import matplotlib.pyplot as plt
from fastapi.responses import Response

app = FastAPI(title="Stock Sentiment API", version="0.1.0")

# Allow requests from your Vite frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later to your deployed origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/prices/{symbol}", response_model=PriceSeries)
def api_prices(symbol: str):
    """
    Return the last 6 months of daily close prices for the given stock symbol.
    """
    try:
        return get_prices(symbol.upper())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/plot/{symbol}.png")
def plot_png(symbol: str):
    """
    Return a PNG line chart of the last 6 months of CLOSE prices for the given stock symbol.
    """
    series = get_prices(symbol.upper())
    dates = [b.date for b in series.bars]
    closes = [b.close for b in series.bars]

    fig, ax = plt.subplots(figsize=(8, 3))
    ax.plot(dates, closes)  # default line
    ax.set_title(f"{series.symbol} – 6M Close")
    ax.set_xlabel("Date")
    ax.set_ylabel("Close")
    fig.autofmt_xdate()

    buf = BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return Response(content=buf.read(), media_type="image/png")

@app.get("/api/metrics")
def metrics_endpoint(symbols: str = Query(..., description="CSV e.g. AAPL,MSFT")):
    """
    Return metrics for one or more stock symbols (comma-separated).
    """
    parts = [p.strip() for p in symbols.split(",") if p.strip()]
    if not parts:
        raise HTTPException(status_code=400, detail="No symbols provided.")
    return {"results": get_stock_metrics(parts)}