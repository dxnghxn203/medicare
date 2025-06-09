from typing import Any

from pydantic import BaseModel


class JsonException(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message

class BaseResponse(BaseModel):
    status_code: int = 200
    status: str = "success"
    message: str = ""
    data: Any = None

class SuccessResponse(BaseModel):
    status_code: int = 200
    status: str = "success"
    message: str = "Thành công!"
    data: Any = None

class PagingSearch(BaseModel):
    total_pages: int = 1
    total_rows: int = 1
    current_page: int = 1
    page_size: int = 10