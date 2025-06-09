from typing import Optional
from pydantic import BaseModel


class ItemLocationReq(BaseModel):
    name: str
    phone_number: str
    email: str
    address: str
    ward: str
    district:  str
    province: str
    province_code: int
    district_code: int
    ward_code: int
    is_default: Optional[bool] = False

