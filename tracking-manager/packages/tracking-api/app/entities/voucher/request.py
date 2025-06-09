from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List
from app.helpers.time_utils import get_current_time

class ItemVoucherDBReq(BaseModel):
    voucher_id: str = ""
    voucher_name: str = ""
    inventory: int = 0
    used: int = 0
    description: str = ""
    discount: float = 0
    active: bool = True
    created_at: datetime = get_current_time()
    updated_at: datetime = get_current_time()
    created_by: str = ""
    updated_by: str = ""
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: str = "order"
    used_by: List[str] = []
    expired_date: datetime = get_current_time()

class ItemVoucherDBInReq(BaseModel):
    voucher_name: str = ""
    inventory: int = 0
    description: str = ""
    discount: float = 0
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: str = "order"
    expired_date: datetime = get_current_time()

class ItemVoucherReq(BaseModel):
    voucher_id: str = ""
    voucher_name: str = ""
    discount: float = 0
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: str = "order"
    expired_date: str = ""