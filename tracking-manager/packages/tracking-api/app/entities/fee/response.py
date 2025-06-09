from pydantic import BaseModel
from typing import List

class ItemPricingRes(BaseModel):
    weight_less_than_equal: float
    price: float

class FeeRes(BaseModel):
    route_id: str
    route_code: str
    vn_route: str
    eng_route: str
    pricing: List[ItemPricingRes]
    threshold_weight: float
    additional_price_per_step: float
    step_weight: float