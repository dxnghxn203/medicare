from fastapi import Request
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def logging_middleware(request: Request, call_next):
    start_time = datetime.utcnow()
    response = await call_next(request)
    end_time = datetime.utcnow()
    
    logger.info(
        f"Path: {request.url.path} "
        f"Method: {request.method} "
        f"Time: {(end_time - start_time).microseconds / 1000}ms"
    )
    
    return response
