from typing import Any

from pydantic import BaseModel

class JsonException(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message


class BaseResponse(BaseModel):
    status_code: int = 200
    message: str = None
    data: Any = None

