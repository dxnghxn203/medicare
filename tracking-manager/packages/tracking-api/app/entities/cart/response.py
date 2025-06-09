from typing import Optional, Union, List

from pydantic import BaseModel

class ItemCartReq(BaseModel):
    product_id: Optional[Union[str, None]] = None
    price_id: Optional[Union[str, None]] = None
    quantity: int = 0

class CartResponse(BaseModel):
    user_id: str
    products: List[ItemCartReq] = []

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)