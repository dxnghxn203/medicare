from fastapi import APIRouter, status

from app.core import logger
from app.core import response
from app.models import time

router = APIRouter()

@router.post("/time")
async def insert_time():
    try:
        await time.insert_time_into_elasticsearch()
    except Exception as e:
        logger.error(f"Error inserting time: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/time")
async def delete_time():
    try:
        await time.delete_time()
    except Exception as e:
        logger.error(f"Error deleting time: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/time", response_model=response.SuccessResponse)
async def get_all_time():
    try:
        return await time.get_time()
    except Exception as e:
        logger.error("Error getting current", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )