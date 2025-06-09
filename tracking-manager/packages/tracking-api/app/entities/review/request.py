from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

class ItemReplyReq(BaseModel):
    review_id: Optional[str] = Field(default="")
    comment: Optional[str] = Field(default="")

class ItemReviewReq(BaseModel):
    product_id: Optional[str] = Field(default="")
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(default="")