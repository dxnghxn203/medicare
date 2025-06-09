from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from .response import JsonException

async def json_exception_handler(request: Request, exc: JsonException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message}
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"message": "Validation error", "details": exc.errors()}
    )
