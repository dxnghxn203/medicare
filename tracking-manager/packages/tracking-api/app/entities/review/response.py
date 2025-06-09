from datetime import datetime
from typing import Optional, List, Union

from pydantic import BaseModel, Field

class ItemReplyRes(BaseModel):
    reply_id: Optional[str] = None
    user_id: str
    user_name: Optional[str] = None
    images: List[Optional[Union[str, None]]] = None
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ItemReviewRes(BaseModel):
    id: str = Field(..., alias='_id')
    product_id: str
    user_id: str
    user_name: Optional[str] = None
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    images: List[Optional[Union[str, None]]] = None
    replies: List[ItemReplyRes] = []
    created_at: datetime

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)