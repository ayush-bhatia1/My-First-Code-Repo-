from pydantic import BaseModel
from datetime import datetime
from typing import List

class CloseBar(BaseModel):
    date: datetime
    close: float

class PriceSeries(BaseModel):
    symbol: str
    bars: List[CloseBar]
