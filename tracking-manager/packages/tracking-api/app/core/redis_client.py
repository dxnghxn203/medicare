import redis as r
from dotenv import load_dotenv
import os

load_dotenv()
redis_host = os.getenv('REDIS_HOST')

try:
    # Create a Redis connection
    redis = r.Redis(
        host='redis-18988.c124.us-central1-1.gce.redns.redis-cloud.com',
        port=18988,
        decode_responses=True,
        username="default",
        password="m3kR4XnG3rIGEaDu8Q9uabOdFpFsjaLT"
    )

    # Test the connection
    redis.ping()
    print("Connected to Redis successfully!")

except r.ConnectionError as e:
    print("Error: Unable to connect to Redis.", e)
except Exception as e:
    print("An unexpected error occurred:", e)