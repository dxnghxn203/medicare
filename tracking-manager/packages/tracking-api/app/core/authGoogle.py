import requests
from app.core import logger

GOOGLE_USERINFO_URL = "https://oauth2.googleapis.com/tokeninfo"

async def google_auth(id_token: str):
    try:
        paramsGG = {
            "id_token": id_token
        }
        response = requests.get(GOOGLE_USERINFO_URL, params=paramsGG)
        if response.status_code == 200:
            return response.json()
        return None

    except Exception as e:
        logger.error(f"error google_auth = {e}")
        return None
