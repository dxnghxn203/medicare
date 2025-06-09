from typing import List, Optional, Union

from pydantic import BaseModel

class ChildCategoryRes(BaseModel):
    child_category_id: Optional[Union[str, None]] = None
    child_category_name: Optional[Union[str, None]] = None
    child_category_slug: Optional[Union[str, None]] = None
    child_image_url: Optional[Union[str, None]] = None

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)

class SubCategoryRes(BaseModel):
    sub_category_id: Optional[Union[str, None]] = None
    sub_category_name: Optional[Union[str, None]] = None
    sub_category_slug: Optional[Union[str, None]] = None
    sub_image_url: Optional[Union[str, None]] = None
    child_category: List[Optional[Union[ChildCategoryRes, None]]] = None

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)

class MainCategoryReq(BaseModel):
    main_category_id: Optional[Union[str, None]] = None
    main_category_name: Optional[Union[str, None]] = None
    main_category_slug: Optional[Union[str, None]] = None
    sub_category: List[Optional[Union[SubCategoryRes, None]]] = None

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)
