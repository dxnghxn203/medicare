import dotenv
import os
from app.core import logger
import requests

dotenv.load_dotenv()

TIME_OUT = 5
GHN_API_URL_PRO = os.getenv("GHN_API_URL_PRO")
GHN_SHOP_ID_PRO = os.getenv("GHN_SHOP_ID_PRO")
GHN_TOKEN_PRO = os.getenv("GHN_TOKEN_PRO")

GHN_API_URL = os.getenv("GHN_API_URL")
GHN_SHOP_ID = os.getenv("GHN_SHOP_ID")
GHN_TOKEN = os.getenv("GHN_TOKEN")


def response_ghn(response_re):
    try:
        my_json = response_re.decode('utf8').replace("'", '"')
        data = my_json
        return data
    except Exception as e:
        raise Exception(f"fail response_ghn: {str(e)}")

def get_header_ghn(haveshopid=True, isPro=True):
    headers = {
        'accept': 'application/json',
        'token': GHN_TOKEN_PRO if isPro else GHN_TOKEN
    }

    if haveshopid:
        headers['ShopId'] = GHN_SHOP_ID_PRO if isPro else GHN_SHOP_ID

    return headers

def send_request_get(function, haveshopid = True, isPro = True, isPayload=False, payload=None):
    try:
        url = (GHN_API_URL_PRO if isPro else GHN_API_URL) + function
        headers = get_header_ghn(haveshopid, isPro)
        if isPayload and payload is not None:
            response = requests.request("GET", url, headers=headers, json=payload, timeout=TIME_OUT)
        else:
            response = requests.request("GET", url, headers=headers, timeout=TIME_OUT)
        logger.info(f"Request to GHN API: {url} with payload: {payload}")
        if response.status_code == 200:
            return response_ghn(response.content)
        else:
            return None
    except Exception as e:
        logger.error(f"Error in send_request: {str(e)}")
        return None

def send_request_post(function, haveshopid = True,  isPro = True, payload=None):
    try:
        url = (GHN_API_URL_PRO if isPro else GHN_API_URL) + function
        headers = get_header_ghn(haveshopid, isPro)

        response = requests.request("POST", url, headers=headers, json=payload, timeout=TIME_OUT)
        logger.info(f"Request to GHN API: {url} with payload: {payload}")
        if response.status_code == 200:
            return response_ghn(response.content)
        else:
            return None
    except Exception as e:
        logger.error(f"Error in send_request: {str(e)}")
        return None


