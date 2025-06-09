import datetime
from typing import Optional

from pydantic import BaseModel, field_validator, model_validator

from app.common import password
from app.helpers.time_utils import get_current_time

class ItemPharmacistRegisReq(BaseModel):
    phone_number: Optional[str] = None
    user_name: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    birthday: datetime.datetime = None

    @model_validator(mode='before')
    def validate_root(cls, values: dict):
        required_fields = ["user_name", "phone_number", "email"]
        for field in required_fields:
            if not values.get(field):
                raise ValueError(f"{field} là bắt buộc.")
        return values

    @field_validator("user_name", mode='before')
    def validate_username(cls, v):
        if not v.strip():
            raise ValueError("Tên đăng nhập không được để trống.")
        return v

    @field_validator('email', mode='before')
    def validate_email(cls, v):
        if not v.strip():
            raise ValueError("Email không được để trống.")
        return v

    @field_validator('birthday', mode="before")
    def validate_birthday(cls, v):
        if v is None:
            return datetime.datetime(1970, 1, 1)

        if isinstance(v, datetime.datetime):
            return v
        try:
            parsed_date = datetime.datetime.fromisoformat(v.replace("Z", "+00:00"))
            parsed_date = parsed_date.replace(tzinfo=None)
            if parsed_date > get_current_time():
                raise ValueError("Ngày sinh không thể lớn hơn ngày hiện tại")
            return parsed_date
        except ValueError:
            raise ValueError("Định dạng ngày tháng không hợp lệ, yêu cầu ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)")


class ItemPharmacistOtpReq(BaseModel):
    email: str

    @field_validator('email', mode='before')
    def validate_email(cls, v):
        if not v.strip():
            raise ValueError("Email không được để trống.")

        return v

class ItemPharmacistVerifyEmailReq(ItemPharmacistOtpReq):
    otp: str
    @field_validator('otp')
    def otp_length(cls, value):
        if len(value) != 6:
            raise ValueError("OTP must be 6 characters long")
        return value

class ItemPharmacistChangePassReq(BaseModel):
    old_password: str
    new_password: str

    @field_validator('old_password', 'new_password')
    def validate_password(cls, v):
        password.validate_password(v)
        return v

class ItemPharmacistUpdateProfileReq(BaseModel):
    user_name: Optional[str] = None
    phone_number: Optional[str] = None
    gender: Optional[str] = None
    birthday: datetime.datetime = None