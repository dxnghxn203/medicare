from typing import Optional

from fastapi import APIRouter, Depends, Form
from fastapi.exceptions import RequestValidationError
from starlette import status

from app.core import response, logger
from app.core.response import BaseResponse, SuccessResponse, JsonException
from app.entities.pharmacist.response import ItemPharmacistRes
from app.entities.pharmacist.request import ItemPharmacistRegisReq, ItemPharmacistOtpReq, ItemPharmacistVerifyEmailReq, \
    ItemPharmacistChangePassReq, ItemPharmacistUpdateProfileReq
from app.helpers import redis
from app.helpers.redis import delete_otp
from app.middleware import middleware
from app.models import auth, pharmacist
from app.models.auth import handle_otp_verification, handle_password_verification
router = APIRouter()

@router.post("/pharmacist/insert")
async def insert_pharmacist(item: ItemPharmacistRegisReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        return await pharmacist.create_pharmacist(item)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error register admin: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/pharmacist/otp")
async def send_otp(item: ItemPharmacistOtpReq):
    try:
        email = item.email
        pharmacist_info = await pharmacist.get_by_email(email)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )
        if pharmacist_info.get("verified_email_at"):
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message="Tài khoản đã được xác thực."
            )

        await handle_otp_verification(email)
        return SuccessResponse(message="OTP đã được gửi đến email của bạn.")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error send otp: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/pharmacist/verify-email", response_model=BaseResponse)
async def verify_pharmacist(request: ItemPharmacistVerifyEmailReq):
    try:
        email, otp = request.email, request.otp
        pharmacist_info = await pharmacist.get_by_email(email)

        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )

        if pharmacist_info.get("verified_email_at"):
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message="Tài khoản đã được xác thực."
            )

        if redis.get_otp(email) != otp:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="OTP không hợp lệ hoặc đã hết hạn."
            )

        delete_otp(email)

        return await pharmacist.update_pharmacist_verification(email)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error verify email: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/pharmacist/login")
async def login(email: str = Form(), password: str = Form(), device_id: Optional[str] = Form(None)):
    try:
        pt = await pharmacist.get_by_email(email)
        if not pt:
            raise JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )
        if not await auth.verify_password(pt["password"], password, pt["active"]):
            raise JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Tên đăng nhập hoặc mật khẩu không đúng!"
            )

        if pt.get("verified_email_at") is None:
            await handle_otp_verification(email)
            return BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Tài khoản chưa xác thực. Vui lòng nhập OTP!"
            )

        device_id = device_id if device_id else "web"

        jwt_token = await auth.get_token(
            username=str(pt.get("_id")),
            role_id=pt.get("role_id"),
            device_id=device_id)
        res = ItemPharmacistRes.from_mongo(pt)
        res.token = jwt_token

        await pharmacist.update_pharmacist_login_history(str(pt.get("_id")))

        return SuccessResponse(message="Đăng nhập thành công", data=res)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error login email: {e}")
        return BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/pharmacist/current", response_model=BaseResponse)
async def get_pharmacist(token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        data = await pharmacist.get_current(token)
        return SuccessResponse(data=data)
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/pharmacist/forgot-password")
async def forgot_password(item: ItemPharmacistOtpReq):
    try:
        pharmacist_info = await pharmacist.get_by_email(item.email)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )
        new_password = await handle_password_verification(item.email)
        await pharmacist.update_pharmacist_password(item.email, new_password)
        return SuccessResponse(message="Mật khẩu mới đã được gửi đến email của bạn.")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error forgot password: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/pharmacist/change-password")
async def change_password(item: ItemPharmacistChangePassReq, token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )

        if not await auth.verify_password(pharmacist_info.password, item.old_password, pharmacist_info.active):
            raise response.JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Mật khẩu cũ không đúng!"
            )
        return await pharmacist.update_pharmacist_password(pharmacist_info.email, item.new_password)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error change password: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/pharmacist/all-pharmacist-admin", response_model=BaseResponse)
async def get_all_pharmacist_admin(page: int = 1, page_size: int = 10, token: str = Depends(middleware.verify_token_admin)):
    try:
        result = await pharmacist.get_all_pharmacist(page, page_size)
        return SuccessResponse(data=result)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all pharmacist: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/pharmacist/status", response_model=BaseResponse)
async def update_status_pharmacist(pharmacist_id: str, status_pharmacist: bool, token: str = Depends(middleware.verify_token_admin)):
    try:
        pharmacist_info = await pharmacist.get_by_id(pharmacist_id)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Pharmacist not found"
            )
        return await pharmacist.update_status(pharmacist_id, status_pharmacist)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/pharmacist/profile", response_model=BaseResponse)
async def update_user_profile(item: ItemPharmacistUpdateProfileReq, token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )
        return await pharmacist.update_pharmacist_info(pharmacist_info.id, item)
    except JsonException as je:
        raise je
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )