import json
from urllib.parse import quote_plus

from bson import json_util
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
    # Connect to MongoDB
    client = pymongo.MongoClient(
        conn,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000
    )
    
    # Test connection
    client.admin.command('ping')
    # Connect to MongoDB
    # Get database instance
    db = client[DB_NAME]
    logger.info("MongoDB connection successful!")

    existing_collections = db.list_collection_names()
    logger.info("Existing collections: " + str(existing_collections))
    collections = [
        'admin', 'categories', 'orders',
        'comments', 'products', 'reviews',
        'users','trackings', 'pharmacists',
        'orders_requests', 'products_imports',
        'vouchers', 'products_inventory',]

    for collection in collections:
        if collection not in existing_collections:
            db.create_collection(collection)
            logger.info(f"Collection '{collection}' đã được tạo.")
        else:
            logger.info(f"Collection '{collection}' đã tồn tại.")


except Exception as e:
    logger.error("Lỗi khi kết nối MongoDB!", error=e)


