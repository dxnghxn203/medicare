from typing import Optional, Union, List
from datetime import datetime
from pydantic import BaseModel
from app.helpers.time_utils import get_current_time


class ItemVoucherDBRes(BaseModel):
    voucher_id: Optional[Union[str, None]] = None
    voucher_name: Optional[Union[str, None]] = None
    inventory: int = 0
    used: int = 0
    description: Optional[Union[str, None]] = None
    discount: float = 0
    active: bool = True
    created_at: datetime = get_current_time()
    updated_at: datetime = get_current_time()
    created_by: Optional[Union[str, None]] = None
    updated_by: Optional[Union[str, None]] = None
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: Optional[Union[str, None]] = None
    used_by: List[str] = []
    expired_date: datetime = get_current_time()

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)

class ItemVoucherRes(BaseModel):
    voucher_id: Optional[Union[str, None]] = None
    voucher_name: Optional[Union[str, None]] = None
    inventory: int = 0
    used: int = 0
    description: Optional[Union[str, None]] = None
    discount: float = 0
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: Optional[Union[str, None]] = None
    expired_date: datetime = get_current_time()
    used_by: List[str] = []

class ItemVoucherOrderRes(BaseModel):
    voucher_id: Optional[Union[str, None]] = None
    voucher_name: Optional[Union[str, None]] = None
    discount: float = 0
    min_order_value: float = 0
    max_discount_value: float = 0
    voucher_type: str = "order"
    expired_date: datetime = get_current_time()