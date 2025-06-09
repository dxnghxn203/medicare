import json

import  requests
import os

from dotenv import load_dotenv

TIME_OUT = 5
BASE_URL = os.getenv("RECOMMENDATION_API_URL")

headers = {
  'accept': 'application/json'
}

def response_recommendation(response_re):
    try:
        my_json = response_re.decode('utf8').replace("'", '"')
        data = json.loads(my_json)
        return data
    except Exception as e:
        raise Exception(f"fail response_spx: {str(e)}")

def send_request(function, payload=None):
    try:
        url = BASE_URL + function
        response = requests.request("GET", url, headers=headers, params=payload, timeout=TIME_OUT)
        if response.status_code == 200:
            return response_recommendation(response.content)
        else:
            return None
    except Exception as e:
        print(e)
        return None
