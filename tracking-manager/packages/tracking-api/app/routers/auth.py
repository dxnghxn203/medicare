from typing import Optional

from fastapi import APIRouter, status, Form, Depends

from app.core import logger
from app.core.authGoogle import google_auth
from app.core.response import BaseResponse, JsonException, SuccessResponse
from app.entities.auth.request import GoogleAuthRequest
from app.entities.user.response import ItemUserRes
from app.helpers.redis import get_session, save_session
from app.middleware import middleware
from app.models import user, auth
from app.models.auth import handle_otp_verification

router = APIRouter()

@router.post("/auth/google-auth", response_model=BaseResponse)
async def login(request: GoogleAuthRequest):
    try:
        auth_google = await google_auth(request.id_token)
        if not auth_google or auth_google["email"] != request.email:
            return BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Access token hoặc email không hợp lệ!"
            )

        user_info = await user.add_user_google(request.email, auth_google["name"])

        jwt_token = await auth.get_token(
            username=user_info.data["user_id"],
            role_id="user",
            device_id="web")

        await user.update_user_login_history(user_info.data["user_id"])

        return SuccessResponse(message=user_info.message, data={"token": jwt_token})
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error google auth", error=str(e))
        return BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
@router.post("/auth/login")
async def login(email: str = Form(), password: str = Form(), device_id: Optional[str] = Form(None)):
    try:
        us = await user.get_by_email_and_auth_provider(email, "email")
        if not us:
            raise JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Người dùng không tồn tại."
            )
        if not await auth.verify_password(us["password"], password, us["active"]):
            raise JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Tên đăng nhập hoặc mật khẩu không đúng!"
            )

        if us.get("verified_email_at") is None:
            await handle_otp_verification(email)
            return BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Tài khoản chưa xác thực. Vui lòng nhập OTP!"
            )

        device_id = device_id if device_id else "web"

        jwt_token = await auth.get_token(
            username=str(us.get("_id")),
            role_id=us.get("role_id"),
            device_id=device_id)
        res = ItemUserRes.from_mongo(us)
        res.token = jwt_token

        await user.update_user_login_history(str(us.get("_id")))

        return SuccessResponse(message="Đăng nhập thành công", data=res)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error login email: {e}")
        return BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/auth/logout", response_model=BaseResponse)
async def logout(token: str = Depends(middleware.destroy_token)):
    try:
        logger.info("Hủy token thành công")
        return SuccessResponse(message="Đã đăng xuất")
    except Exception as e:
        logger.error("Error logout", error=str(e))
        return BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/auth/check-session", response_model=BaseResponse)
async def check_session(session: str):
    try:
        check = get_session(session)
        if not check:
            return BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Session không hợp lệ"
            )
        return SuccessResponse(message="Session hợp lệ")
    except Exception as e:
        logger.error("Error check session", error=str(e))
        return BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/auth/new-session", response_model=BaseResponse)
async def new_session():
    try:
        session = save_session()
        return SuccessResponse(data=session)
    except Exception as e:
        logger.error("Error new session", error=str(e))
        return BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
