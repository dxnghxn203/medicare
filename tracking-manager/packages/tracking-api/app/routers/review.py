from typing import Optional, List

from fastapi import APIRouter, Depends, UploadFile, File
from pyfa_converter_v2 import BodyDepends
from starlette import status

from app.core import response, logger
from app.core.response import JsonException
from app.entities.review.request import ItemReviewReq, ItemReplyReq
from app.middleware import middleware
from app.models import review

router = APIRouter()

@router.post("/review/add", response_model=response.BaseResponse)
async def create_review(
        item: ItemReviewReq = BodyDepends(ItemReviewReq),
        images: Optional[List[UploadFile]] = File(None),
        token: str = Depends(middleware.verify_token)):
    try:
        return await review.create_review(item, token, images)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error create review: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/review/product/{product_id}", response_model=response.BaseResponse)
async def get_review_by_product(product_id: str, page: int = 1, page_size: int = 5, rating: float = 0):
    try:
        result = await review.get_review_by_product(product_id, page, page_size, rating)
        return response.SuccessResponse(
            message="Lấy đánh giá theo sản phẩm thành công",
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting review: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/review/reply", response_model=response.BaseResponse)
async def reply_review(
        item: ItemReplyReq = BodyDepends(ItemReplyReq),
        images: Optional[List[UploadFile]] = File(None),
        token: str = Depends(middleware.verify_token)):
    try:
        return await review.reply_to_review(item, token, images)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error replying to review: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )