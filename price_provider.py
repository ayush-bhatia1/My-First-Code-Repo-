import yfinance as yf
import time
from models import CloseBar, PriceSeries

def get_prices(symbol: str) -> PriceSeries:
    """Return the past 6 months of closing prices for a stock symbol."""
    try:
        # Add small delay to avoid rate limiting
        time.sleep(0.1)
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="6mo", interval="1d")
        
        if df is None or df.empty:
            raise ValueError(f"No data found for {symbol}")

        bars = []
        for idx, row in df.iterrows():
            dt = idx.to_pydatetime()
            bars.append(CloseBar(date=dt, close=float(row["Close"])))

        return PriceSeries(symbol=symbol.upper(), bars=bars)
        
    except Exception as e:
        if "429" in str(e) or "Too Many Requests" in str(e):
            raise ValueError(f"Rate limited by Yahoo Finance. Please wait a few minutes and try again.")
        raise ValueError(f"Error fetching data for {symbol}: {str(e)}")
