from pydantic import BaseModel, validator


class GoogleAuthRequest(BaseModel):
    id_token: str = None
    email: str = None

class AuthRequest(BaseModel):
    phoneNumber: str = None
    password: str = None

    @validator('phoneNumber')
    def validate_phone_number(cls, v):
        if not v:
            raise ValueError('Phone number is required')
        if len(v) < 10:
            raise ValueError('Phone number must be at least 10 characters')
        return v