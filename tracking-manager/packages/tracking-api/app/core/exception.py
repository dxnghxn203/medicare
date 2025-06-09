from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette import status

from . import response, logger
from .response import JsonException

async def json_exception_handler(request: Request, exc: JsonException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message}
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    simplified = [
        {
            "field": ".".join(str(loc) for loc in err["loc"]),
            "error": err["msg"]
        }
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "Dữ liệu không hợp lệ",
            "errors": simplified
        }
    )