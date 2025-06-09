from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.helpers.time_utils import get_current_time


class ChildCategoryReq(BaseModel):
    child_category_id: str = ""
    child_category_name: str = ""
    child_category_slug: str = ""
    child_image_url: str = ""

class SubCategoryReq(BaseModel):
    sub_category_id: str = ""
    sub_category_name: str = ""
    sub_category_slug: str = ""
    sub_image_url: str = ""
    child_category: List[ChildCategoryReq]

class MainCategoryReq(BaseModel):
    main_category_id: str = ""
    main_category_name: str = ""
    main_category_slug: str = ""
    sub_category: List[SubCategoryReq]
    created_by: str = ""
    updated_by: str = ""
    created_at: datetime = get_current_time()
    updated_at: datetime = get_current_time()

class ChildCategoryInReq(BaseModel):
    child_category_name: str = ""
    child_category_slug: str = ""

class SubCategoryInReq(BaseModel):
    sub_category_name: str = ""
    sub_category_slug: str = ""
    child_category: List[ChildCategoryInReq]

class MainCategoryInReq(BaseModel):
    main_category_name: str = ""
    main_category_slug: str = ""
    sub_category: List[SubCategoryInReq]

