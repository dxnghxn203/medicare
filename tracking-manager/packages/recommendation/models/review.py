from core.mongo import db
from core import logger
from typing import List, Dict, Any, Optional


async def get_product_ratings_recommendation() -> Dict[str, Dict[str, Any]]:
    """
    Lấy điểm đánh giá trung bình của các sản phẩm
    """
    try:
        pipeline = [
            {"$group": {
                "_id": "$product_id",
                "avg_rating": {"$avg": "$rating"},
                "rating_count": {"$sum": 1}
            }}
        ]

        result = db.reviews.aggregate(pipeline).to_list(length=None)
        ratings = {doc["_id"]: {
            "avg_rating": doc["avg_rating"],
            "rating_count": doc["rating_count"]
        } for doc in result}

        return ratings
    except Exception as e:
        logger.error(f"Error getting product ratings: {str(e)}")
        return {}