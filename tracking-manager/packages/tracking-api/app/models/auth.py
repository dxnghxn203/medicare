import os
from datetime import datetime, timedelta

import bcrypt
import jwt
from starlette import status

from app.core import logger, response, mail
from app.helpers import redis
from app.helpers.time_utils import get_current_time
from app.middleware.middleware import get_private_key, generate_otp, generate_password

TOKEN_EXPIRY_SECONDS = 31536000

async def get_token(username: str, role_id: str, device_id: str = "web"):
    token = redis.get_jwt_token(username, device_id)
    if token:
        return token
    expire = get_current_time() + timedelta(seconds=TOKEN_EXPIRY_SECONDS)
    payload = {"exp": expire, "username": username, "role_id": role_id, "device_id": device_id}
    encoded_jwt = jwt.encode(payload, get_private_key(), algorithm=os.getenv("ALGORITHM"))
    redis.save_jwt_token(username, encoded_jwt, device_id)
    return encoded_jwt

async def handle_otp_verification(email: str):
    try:
        if not redis.check_request_count(email):
            ttl = redis.get_ttl(redis.request_count_key(email))
            logger.info(f"TTL for OTP request of {email}: {ttl}")
            if ttl is None or not isinstance(ttl, int):
                ttl = 60

            time_block = f"{ttl} giây" if ttl < 60 else f"{ttl // 60} phút"
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message=f"Bạn đã gửi quá số lần cho phép, hãy thử lại sau {time_block}."
            )

        otp = redis.get_otp(email) or generate_otp()
        redis.save_otp(email, otp)
        redis.update_otp_request_count_value(email)
        mail.send_otp_email(email, otp)
        return otp
    except Exception as e:
        logger.error(f"Error handle_otp_verification: {e}")
        raise e

async def verify_password(p_email: str, p: str, status: bool):
    try:
        if bcrypt.checkpw(p.encode('utf-8'), p_email.encode('utf-8')) and status:
            return True
        return None
    except Exception as e:
        raise e

async def handle_password_verification(email: str):
    try:
        if not redis.check_request_count(email):
            ttl = redis.get_ttl(redis.request_count_key(email))
            logger.info(f"TTL for request of {email}: {ttl}")
            if ttl is None or not isinstance(ttl, int):
                ttl = 60

            time_block = f"{ttl} giây" if ttl < 60 else f"{ttl // 60} phút"
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message=f"Bạn đã gửi quá số lần cho phép, hãy thử lại sau {time_block}."
            )

        password =  generate_password()
        mail.send_new_password_email(email, password)
        redis.update_otp_request_count_value(email)
        return password
    except Exception as e:
        logger.error(f"Error handle_password_verification: {e}")
        raise e