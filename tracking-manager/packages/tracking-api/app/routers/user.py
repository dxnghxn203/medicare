from fastapi import APIRouter, Depends
from starlette import status

from app.core import response, logger
from app.core.response import BaseResponse, SuccessResponse, JsonException
from app.entities.user.request import ItemUserRegisReq, ItemUserOtpReq, ItemUserVerifyEmailReq, ItemUserChangePassReq, \
    ItemUserUpdateProfileReq
from app.helpers import redis
from app.helpers.redis import delete_otp
from app.middleware import middleware
from app.models import user
from app.models.auth import handle_otp_verification, handle_password_verification, verify_password

router = APIRouter()

@router.post("/user/register_email", response_model=BaseResponse)
async def register_email(item: ItemUserRegisReq):
    try:
        return await user.add_user_email(item)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error register email: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/users/all-user-admin", response_model=BaseResponse)
async def get_all_user_admin(page: int = 1, page_size: int = 10, token: str = Depends(middleware.verify_token_admin)):
    try:
        result = await user.get_all_user(page, page_size)
        return SuccessResponse(data=result)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/users/otp")
async def send_otp(item: ItemUserOtpReq):
    try:
        email = item.email
        user_info = await user.get_by_email_and_auth_provider(email, "email")
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Người dùng không tồn tại."
            )
        if user_info.get("verified_email_at"):
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

@router.post("/users/verify-email", response_model=BaseResponse)
async def verify_user(request: ItemUserVerifyEmailReq):
    try:
        email, otp = request.email, request.otp
        user_info = await user.get_by_email_and_auth_provider(email, "email")

        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Người dùng không tồn tại."
            )

        if user_info.get("verified_email_at"):
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

        return await user.update_user_verification(email)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error verify email: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/users/current", response_model=BaseResponse)
async def get_user(token: str = Depends(middleware.verify_token)):
    try:
        data = await user.get_current(token)
        return SuccessResponse(data=data)
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/users/status", response_model=BaseResponse)
async def update_status_user(user_id: str, status_user: bool, token: str = Depends(middleware.verify_token_admin)):
    try:
        user_info = await user.get_by_id(user_id)
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="User not found"
            )
        return await user.update_status(user_id, status_user)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/users/forgot-password")
async def forgot_password(item: ItemUserOtpReq):
    try:
        user_info = await user.get_by_email_and_auth_provider(item.email, "email")
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Người dùng không tồn tại."
            )
        new_password = await handle_password_verification(item.email)
        await user.update_user_password(item.email, new_password)
        return SuccessResponse(message="Mật khẩu mới đã được gửi đến email của bạn.")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error forgot password: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/users/change-password")
async def change_password(item: ItemUserChangePassReq, token: str = Depends(middleware.verify_token)):
    try:
        user_info = await user.get_current(token)
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Người dùng không tồn tại."
            )

        if not await verify_password(user_info.password, item.old_password, user_info.active):
            raise response.JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Mật khẩu cũ không đúng!"
            )
        return await user.update_user_password(user_info.email, item.new_password)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error change password: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/users/profile", response_model=BaseResponse)
async def update_user_profile(item: ItemUserUpdateProfileReq, token: str = Depends(middleware.verify_token)):
    try:
        user_info = await user.get_current(token)
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Người dùng không tồn tại."
            )
        return await user.update_user_info(user_info.id, item)
    except JsonException as je:
        raise je
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )