from urllib.parse import quote_plus
from dotenv import load_dotenv
from app.core import logger
import pymongo
import os

load_dotenv()

logger.set_pymongo_log_level()

DB_NAME = os.getenv("API_MONGO_DB")
USERNAME = quote_plus(os.getenv("API_MONGO_USER"))
PASSWORD = quote_plus(os.getenv("API_MONGO_PWS"))
CLUSTER = os.getenv("MONGO_HOST")

# Build connection string
conn = f"mongodb+srv://{USERNAME}:{PASSWORD}@{CLUSTER}/{DB_NAME}"
logger.info("Connecting to MongoDB...")
logger.info("Url mongo : " + conn)
try:
    client = pymongo.MongoClient(
        conn,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000
    )

    client.admin.command('ping')
    db = client[DB_NAME]
    logger.info("MongoDB connection successful!")
except Exception as e:
    logger.error("Lỗi khi kết nối MongoDB!", error=e)