import datetime
from typing import Optional, Union, List

from pydantic import BaseModel, Field


class ItemUserRes(BaseModel):
    id: str = Field(..., alias='_id')
    phone_number: Optional[Union[str, None]] = None
    user_name: Optional[Union[str, None]] = None
    email: Optional[Union[str, None]] = None
    gender: Optional[Union[str, None]] = None
    auth_provider: Optional[Union[str, None]] = None
    birthday: Optional[Union[datetime.datetime, None]] = None
    #image_url: Optional[Union[str, None]] = None
    role_id: Optional[Union[str, None]] = None
    active: bool = True
    verified_email_at: Optional[Union[datetime.datetime, None]] = None
    created_at: Optional[Union[datetime.datetime, None]] = None
    updated_at: Optional[Union[datetime.datetime, None]] = None
    token: Optional[Union[str, None]] = None
    password: Optional[Union[str, None]] = None
    login_history: Optional[List[datetime.datetime]] = []

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)