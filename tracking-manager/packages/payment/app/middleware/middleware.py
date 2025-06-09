import os

from dotenv import load_dotenv
from fastapi import Request, HTTPException

from app.core import logger
load_dotenv()

API_KEY=os.getenv("API_KEY")
KEY_AUTH_PAYMENT=os.getenv("KEY_AUTH_PAYMENT")

def verify_api_key(request: Request):
    api_key = request.headers.get("Authorization")
    key_auth = f"{API_KEY} {KEY_AUTH_PAYMENT}"
    if not api_key or api_key != key_auth:
        raise HTTPException(status_code=401, detail="Invalid API Key")