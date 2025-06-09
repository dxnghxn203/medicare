import base64
import os
import random
import secrets
import string
from typing import Optional

import bcrypt
import jwt
from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import ValidationError

from app.core import logger, response
from app.helpers import redis as redis_helper

security = HTTPBearer(
    scheme_name='Authorization'
)

# ===== JWT AUTHENTICATION =====

def validate_and_decode_token(cred: HTTPAuthorizationCredentials):
    if not cred or cred.scheme != "Bearer":
        raise response.JsonException(status_code=status.HTTP_401_UNAUTHORIZED, message="Mã xác thực không hợp lệ")

    token = cred.credentials
    payload = decode_jwt(token)

    if not redis_helper.get_jwt_token(payload["username"], payload["device_id"]):
        raise response.JsonException(status_code=status.HTTP_401_UNAUTHORIZED, message="Phiên đăng nhập đã hết hạn")

    return payload

def verify_token(cred: HTTPAuthorizationCredentials = Depends(security)):
    validate_and_decode_token(cred)
    return cred.credentials

def verify_token_optional(cred: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))):

    if not cred or not cred.credentials:
        return None
    validate_and_decode_token(cred)
    return cred.credentials

def verify_token_admin(cred: HTTPAuthorizationCredentials = Depends(security)):
    payload = validate_and_decode_token(cred)

    if not payload.get("role_id") or payload.get("role_id") != "admin":
        raise response.JsonException(status_code=status.HTTP_403_FORBIDDEN, message="Không có quyền truy cập")

    return cred.credentials

def verify_token_pharmacist(cred: HTTPAuthorizationCredentials = Depends(security)):
    payload = validate_and_decode_token(cred)

    logger.info(f"Payload: {payload}")
    if not payload.get("role_id") or payload.get("role_id") != "pharmacist":
        raise response.JsonException(status_code=status.HTTP_403_FORBIDDEN, message="Không có quyền truy cập")

    return cred.credentials

def destroy_token(cred: HTTPAuthorizationCredentials = Depends(security)):
    payload = validate_and_decode_token(cred)
    update_destroy_token(payload)

def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, get_public_key(), algorithms=[os.getenv("ALGORITHM")])
    except jwt.ExpiredSignatureError:
        logger.error("Token expired")
        raise response.JsonException(status_code=status.HTTP_403_FORBIDDEN, message="Token đã hết hạn")
    except(jwt.PyJWTError, ValidationError) as e:
        logger.error(f"Token decoding error = {e}")
        raise response.JsonException(status_code=status.HTTP_403_FORBIDDEN, message="Không thể xác thực mã thông báo")

def update_destroy_token(payload):
    try:
        redis_helper.delete_jwt_token(payload["username"], payload["device_id"])
    except Exception as e:
        logger.error(f"Lỗi khi xóa JWT khỏi Redis: {e}")
        raise response.JsonException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, message="Lỗi hệ thống")

# ===== PASSWORD & OTP GENERATION =====

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=13, prefix=b"2b")).decode('utf-8')

def generate_password():
    lower_case = string.ascii_lowercase
    upper_case = string.ascii_uppercase
    digits = string.digits
    safe_special_chars = ''.join(c for c in string.punctuation if c not in ['\\', '"', "'"])

    password_chars = [
        random.choice(lower_case),
        random.choice(upper_case),
        random.choice(digits),
        random.choice(safe_special_chars)
    ]

    all_chars = lower_case + upper_case + digits + safe_special_chars
    password_chars += random.choices(all_chars, k=8)

    random.shuffle(password_chars)
    return ''.join(password_chars)

def generate_otp():
    return ''.join(secrets.choice(string.digits + string.ascii_uppercase) for _ in range(6))

def fix_base64_padding(b64_str):
    b64_str = b64_str.replace("\n", "").replace(" ", "")
    missing_padding = len(b64_str) % 4
    if missing_padding:
        b64_str += "=" * (4 - missing_padding)
    return b64_str

def get_private_key():
    return base64.b64decode(fix_base64_padding(os.getenv("JWT_PRIVATE_KEY", ""))).decode("utf-8")

def get_public_key():
    return base64.b64decode(fix_base64_padding(os.getenv("JWT_PUBLIC_KEY", ""))).decode("utf-8")