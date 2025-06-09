from fastapi import APIRouter, Depends
from starlette import status

from app.core import response, logger
from app.core.response import BaseResponse, SuccessResponse, JsonException
from app.entities.voucher.request import ItemVoucherDBInReq
from app.middleware import middleware
from app.models import voucher, admin

router = APIRouter()

@router.post("/vouchers/add" , response_model=BaseResponse)
async def create_voucher(item: ItemVoucherDBInReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại"
            )
        await voucher.create_voucher(item, admin_info.email)
        return response.SuccessResponse(status="success", message="Thêm voucher thành công")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error creating voucher: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/vouchers/search", response_model=BaseResponse)
async def get_voucher_by_id(voucher_id: str):
    try:
        result = await voucher.get_voucher_by_id(voucher_id)
        return SuccessResponse(data=result)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting voucher: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/vouchers/all-vouchers-admin", response_model=BaseResponse)
async def get_all_voucher_admin(page: int = 1, page_size: int = 10, token: str = Depends(middleware.verify_token_admin)):
    try:
        result = await voucher.get_all_vouchers(page, page_size)
        return SuccessResponse(data=result)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all voucher: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/vouchers/all-vouchers", response_model=BaseResponse)
async def get_all_voucher():
    try:
        result = await voucher.get_all_vouchers_for_users()
        return SuccessResponse(data=result)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all voucher for user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/vouchers/status", response_model=BaseResponse)
async def update_status_voucher(voucher_id: str, status_voucher: bool = True, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại"
            )
        voucher_info = await voucher.get_voucher_by_id(voucher_id, is_admin=True)
        return await voucher.update_status(voucher_id, status_voucher, admin_info.email)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/vouchers/update", response_model=BaseResponse)
async def update_voucher(voucher_id: str, item: ItemVoucherDBInReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại"
            )
        return await voucher.update_voucher(voucher_id, item, admin_info.email)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating voucher: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/vouchers/delete", response_model=BaseResponse)
async def delete_voucher(voucher_id: str, token: str = Depends(middleware.verify_token_admin)):
    try:
        return await voucher.delete_voucher(voucher_id)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )