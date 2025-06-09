from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

class ItemAnswerReq(BaseModel):
    comment_id: str = ""
    comment: str = ""

class ItemCommentReq(BaseModel):
    product_id: str = ""
    comment: str = ""