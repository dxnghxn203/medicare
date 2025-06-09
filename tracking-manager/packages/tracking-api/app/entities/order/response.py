from datetime import datetime

from pydantic import BaseModel, Field
from typing import List, Optional, Union

from app.entities.product.response import ItemProductRes
from app.entities.voucher.response import ItemVoucherOrderRes


class AddressOrderRes(BaseModel):
    address: Optional[Union[str, None]] = None
    ward: Optional[Union[str, None]] = None
    district:  Optional[Union[str, None]] = None
    province: Optional[Union[str, None]] = None

class InfoAddressOrderRes(BaseModel):
    name: Optional[Union[str, None]] = None
    phone_number: Optional[Union[str, None]] = None
    email: Optional[Union[str, None]] = None
    address:  AddressOrderRes

class ItemOrderRes(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    order_id: Optional[Union[str, None]] = None
    order_3pl_code: Optional[Union[str, None]] = None
    tracking_id: Optional[Union[str, None]] = None
    status: Optional[Union[str, None]] = None
    shipper_id: Optional[Union[str, None]] = None
    shipper_name: Optional[Union[str, None]] = None
    product: List[Optional[Union[ItemProductRes, None]]] = None
    voucher: List[Optional[Union[ItemVoucherOrderRes, None]]] = None
    pick_from: Optional[Union[InfoAddressOrderRes, None]] = None
    pick_to: Optional[Union[InfoAddressOrderRes, None]] = None
    sender_province_code: int = 0
    sender_district_code: int = 0
    sender_commune_code: int = 0
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0
    created_by: Optional[Union[str, None]] = None
    delivery_time: Optional[Union[datetime, None]] = None
    delivery_instruction: Optional[Union[str, None]] = None
    payment_type: Optional[Union[str, None]] = None
    payment_status: Optional[Union[str, None]] = None
    weight: float = 0
    basic_total_fee: float = 0
    estimated_total_fee: float = 0
    shipping_fee: float = 0
    product_fee: float = 0
    voucher_order_discount: float = 0
    voucher_delivery_discount: float = 0
    created_date: Optional[Union[datetime, None]] = None
    updated_date: Optional[Union[datetime, None]] = None

    @classmethod
    def from_mongo(cls, data):
        if '_id' in data:
            data['_id'] = str(data.get('_id'))
        return cls(**data)

class ItemOrderImageRes(BaseModel):
    images_id: Optional[Union[str, None]] = None
    images_url: Optional[Union[str, None]] = None

class ItemOrderForPTRes(BaseModel):
    request_id: Optional[Union[str, None]] = None
    status: Optional[Union[str, None]] = None
    product: List[ItemProductRes]
    pick_to: InfoAddressOrderRes
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0
    created_by: Optional[Union[str, None]] = None
    verified_by: Optional[Union[str, None]] = None
    pharmacist_name: Optional[Union[str, None]] = None
    note : Optional[Union[str, None]] = None
    images: List[Optional[Union[ItemOrderImageRes, None]]] = None
