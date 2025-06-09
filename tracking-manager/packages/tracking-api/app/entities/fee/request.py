from pydantic import BaseModel
from typing import List, Optional


class ItemPricingReq(BaseModel):
    weight_less_than_equal: float
    price: float

class RouteReq(BaseModel):
    id: str
    code: str
    vn_route: str
    eng_route: str

class AdditionalPricingReq(BaseModel):
    threshold_weight: float
    additional_price_per_step: float
    step_weight: float

class FeeReq(BaseModel):
    route: RouteReq
    pricing: List[ItemPricingReq]
    additional_pricing: AdditionalPricingReq

class ShippingItemFeeGHNReq(BaseModel):
    name: str
    quantity: int
    length: int
    width: int
    height: int
    weight: int

class FeeGHNReq(BaseModel):
    service_type_id: int
    from_district_id: int
    from_ward_code: str
    to_district_id: int
    to_ward_code: str
    length: int
    width: int
    height: int
    weight: int
    insurance_value: int
    coupon: Optional[str]
    items: List[ShippingItemFeeGHNReq]