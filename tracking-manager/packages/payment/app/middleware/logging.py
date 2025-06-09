from fastapi import Request
import time

from fastapi.logger import logger


async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url} {response.status_code} {process_time:.2f}ms"
    )
    return response
