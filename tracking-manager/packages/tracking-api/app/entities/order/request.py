from datetime import datetime
from enum import Enum
from typing import List, Optional
import json
from pydantic import BaseModel, Field, model_validator

from app.entities.product.request import ItemProductReq, ItemProductInReq
from app.entities.voucher.request import ItemVoucherReq


class AddressOrderReq(BaseModel):
    address: str = ""
    ward: str = ""
    district:  str = ""
    province: str = ""

class InfoAddressOrderReq(BaseModel):
    name: str = ""
    phone_number: str = ""
    email: str = ""
    address:  AddressOrderReq

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid InfoAddressOrderReq format")

class ItemOrderReq(BaseModel):
    order_id: str = ""
    tracking_id: str = ""
    status: str = ""
    shipper_id: str = ""
    shipper_name: str = ""
    product: List[ItemProductReq]
    voucher: List[ItemVoucherReq]
    pick_from: InfoAddressOrderReq
    pick_to: InfoAddressOrderReq
    sender_province_code: int = 0
    sender_district_code: int = 0
    sender_commune_code: int = 0
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0
    created_by: str = ""
    delivery_time: str = ""
    delivery_instruction: str = ""
    payment_type: str = ""
    weight: float = 0
    shipping_fee: float = 0
    product_fee: float = 0
    basic_total_fee: float = 0
    estimated_total_fee: float = 0
    voucher_order_discount: float = 0
    voucher_delivery_discount: float = 0

class ItemOrderInReq(BaseModel):
    product: List[ItemProductInReq]
    pick_to: Optional[InfoAddressOrderReq] = None
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0
    delivery_instruction: str = ""
    payment_type: str = ""
    voucher_order_id: str = ""
    voucher_delivery_id: str = ""

class OrderRequest(BaseModel):
    order_id: str = ""

class ItemUpdateStatusReq(BaseModel):
    order_id: str = ""
    status: str = ""
    shipper_id: str = ""
    shipper_name: str = ""
    delivery_instruction: str = ""

class ItemOrderImageReq(BaseModel):
    images_id: str = ""
    images_url: str = ""

class ItemOrderForPTReq(BaseModel):
    request_id: str = ""
    status: str = "pending"
    product: List[ItemProductReq]
    pick_to: InfoAddressOrderReq
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int
    images: List[ItemOrderImageReq] = None
    created_by: str = ""
    verified_by: str = ""
    pharmacist_name: str = ""
    note: str = ""

class ListProductInReq(BaseModel):
    product: List[ItemProductInReq]

    @model_validator(mode="before")
    @classmethod
    def to_py_dict(cls, data):
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, dict):
            return data
        raise ValueError("Invalid ListProductInReq format")

class ItemOrderForPTInReq(BaseModel):
    product: Optional[ListProductInReq] = Field(None)
    pick_to: Optional[InfoAddressOrderReq] = Field(None)
    receiver_province_code: int = 0
    receiver_district_code: int = 0
    receiver_commune_code: int = 0

class ItemOrderApproveReq(BaseModel):
    request_id: str = ""
    status: str = ""
    product: List[ItemProductInReq]
    note: str = ""

#GHN
class RequiredNote(str, Enum):
    CHOTHUHANG = "CHOTHUHANG"
    CHOXEMHANGKHONGTHU = "CHOXEMHANGKHONGTHU"
    KHONGCHOXEMHANG = "KHONGCHOXEMHANG"

class CategoryGHN(BaseModel):
    level1: Optional[str] = None
    level2: Optional[str] = None
    level3: Optional[str] = None


class ShippingGHNItem(BaseModel):
    name: str = ""
    code: str = ""
    quantity: int = 0
    price: int = 0
    length: int = 0
    width: int = 0
    height: int = 0
    weight: int = 0
    category: Optional[CategoryGHN] = None

class ShippingOrderGHN(BaseModel):

    from_name: Optional[str] = None
    from_phone: Optional[str] = None
    from_address: Optional[str] = None
    from_ward_name: Optional[str] = None
    from_district_name: Optional[str] = None
    from_province_name: Optional[str] = None

    to_name: str = ""
    to_phone: str = ""
    to_address: str = ""
    to_ward_name: str = ""
    to_district_name: str = ""
    to_province_name: str = ""

    return_phone: Optional[str] = None
    return_address: Optional[str] = None
    return_district_name: Optional[str] = None
    return_ward_name: Optional[str] = None
    return_province_name: Optional[str] = None

    client_order_code: Optional[str] = None
    cod_amount: int = 0
    content: Optional[str] = None

    weight: Optional[int] = None
    length: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None

    pick_station_id: Optional[int] = None
    insurance_value: int = 0
    service_type_id: int = 0
    payment_type_id: int = 0
    coupon: Optional[str] = None

    note: Optional[str] = None
    required_note: RequiredNote = RequiredNote.KHONGCHOXEMHANG

    pickup_time: Optional[int] = None
    pick_shift: Optional[List[int]] = None

    cod_failed_amount: Optional[int] = None

    items: List[ShippingGHNItem] = []