from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

class ItemAsnswerRes(BaseModel):
    answer_id: Optional[str] = None
    user_id: str
    user_name: Optional[str] = None
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ItemCommentRes(BaseModel):
    id: str = Field(..., alias='_id')
    product_id: str
    user_id: str
    user_name: Optional[str] = None
    comment: Optional[str] = None
    answers: List[ItemAsnswerRes] = []
    created_at: datetime

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)