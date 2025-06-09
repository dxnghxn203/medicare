from fastapi import APIRouter, Depends
from starlette import status

from app.core import response, logger
from app.core.response import JsonException
from app.entities.comment.request import ItemCommentReq, ItemAnswerReq
from app.middleware import middleware
from app.models import comment

router = APIRouter()

@router.post("/comment/add", response_model=response.BaseResponse)
async def create_comment(item: ItemCommentReq, token: str = Depends(middleware.verify_token)):
    try:
        return await comment.create_comment(item, token)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error create comment: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/comment/product/{product_id}", response_model=response.BaseResponse)
async def get_comment_by_product(product_id: str, page: int = 1, page_size: int = 5, sort_type: str = "oldest"):
    try:
        result = await comment.get_comment_by_product(product_id, page, page_size, sort_type)
        return response.SuccessResponse(
            message="Lấy bình luận theo sản phẩm thành công",
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting comment: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/comment/answer", response_model=response.BaseResponse)
async def answer_comment(item: ItemAnswerReq, token: str = Depends(middleware.verify_token)):
    try:
        return await comment.answer_to_comment(item, token)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error answer to comment: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )