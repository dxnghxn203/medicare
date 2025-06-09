from core.mongo import db
from core import logger
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta


async def get_product_purchase_counts_recommendation(days: int = 30) -> Dict[str, int]:
    """
    Lấy số lượng mua của từng sản phẩm trong khoảng thời gian
    """
    try:
        start_date = datetime.now() - timedelta(days=days)
        pipeline = [
            {"$match": {"created_date": {"$gte": start_date}, "status": {"$ne": "CANCELED"}}},
            {"$unwind": "$product"},
            {"$group": {
                "_id": "$product.product_id",
                "count": {"$sum": "$product.quantity"}
            }},
            {"$sort": {"count": -1}}
        ]

        result = db.orders.aggregate(pipeline).to_list(length=None)

        # Chuyển thành dictionary
        product_counts = {item["_id"]: item["count"] for item in result}
        return product_counts
    except Exception as e:
        logger.error(f"Error getting product purchase counts: {str(e)}")
        return {}


async def get_orders_by_user_recommendation(user_id: str) -> List[Dict[str, Any]]:
    """
    Lấy đơn hàng theo user_id
    """
    try:
        orders = db.orders.find({"created_by": user_id, "status": {"$ne": "CANCELED"}}).to_list(length=None)
        return orders
    except Exception as e:
        logger.error(f"Error fetching orders for user {user_id}: {str(e)}")
        return []