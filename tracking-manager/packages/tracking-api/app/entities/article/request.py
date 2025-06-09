from datetime import datetime

from pydantic import BaseModel, Field
from typing import Optional, List

from app.helpers.time_utils import get_current_time


class ItemArticle(BaseModel):
    article_id: str
    title: str = None
    content: str = None
    # image_url: str = None
    category: str = None
    tags: list[str] = None
    created_by: str = None
    created_date: datetime = get_current_time()
    updated_date: datetime = get_current_time()
    active: bool = True
    slug: str = None
    image_thumbnail: str = None

class ItemArticleRequestCreate(BaseModel):
    title: Optional[str] = Field(default="")
    content: Optional[str] = Field(default="")
    category: Optional[str] = Field(default="")
    tags: Optional[list[str]] = Field(None)
    created_by: Optional[str] = Field(default="")
    slug: Optional[str] = Field(default="")

class ItemArticleRequestUpdate(BaseModel):
    article_id: str
    title: str = None
    content: str = None
    category: str = None
    created_by: str = None
    tags: list[str] = None
    updated_date: datetime = get_current_time()
    active: bool = True
    slug: str = None
