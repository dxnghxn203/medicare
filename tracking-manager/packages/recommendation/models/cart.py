from core.mongo import db
from core import logger
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from bson import ObjectId


async def get_all_carts_recommendation() -> List[Dict[str, Any]]:
    """
    Lấy tất cả giỏ hàng cho hệ thống gợi ý
    """
    try:
        carts = db['carts'].find({}).to_list(length=None)
        return carts
    except Exception as e:
        logger.error(f"Error fetching all carts for recommendation: {str(e)}")
        return []


async def get_cart_by_user_recommendation(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Lấy giỏ hàng theo user_id cho hệ thống gợi ý
    """
    try:
        cart =  db['carts'].find_one({"user_id": user_id})
        return cart
    except Exception as e:
        logger.error(f"Error fetching cart for user {user_id} for recommendation: {str(e)}")
        return None


async def get_active_carts_recommendation(days: int = 7) -> List[Dict[str, Any]]:
    """
    Lấy giỏ hàng hoạt động (được cập nhật trong khoảng thời gian) cho hệ thống gợi ý
    """
    try:
        start_date = datetime.now() - timedelta(days=days)
        carts =  db['carts'].find(
            {"updated_at": {"$gte": start_date}}
        ).to_list(length=None)
        return carts
    except Exception as e:
        logger.error(f"Error fetching active carts for recommendation: {str(e)}")
        return []


async def get_popular_cart_items_recommendation(days: int = 30) -> Dict[str, int]:
    """
    Lấy số lượng xuất hiện của từng sản phẩm trong giỏ hàng cho hệ thống gợi ý
    """
    try:
        start_date = datetime.now() - timedelta(days=days)
        pipeline = [
            {"$match": {"updated_at": {"$gte": start_date}}},
            {"$unwind": "$products"},
            {"$match": {"products.product_id": {"$ne": "undefined"}}},  # Lọc bỏ sản phẩm không xác định
            {"$group": {
                "_id": "$products.product_id",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}}
        ]

        result =  db['carts'].aggregate(pipeline).to_list(length=None)

        # Chuyển thành dictionary
        product_counts = {item["_id"]: item["count"] for item in result}
        return product_counts
    except Exception as e:
        logger.error(f"Error getting popular cart items for recommendation: {str(e)}")
        return {}


async def get_related_cart_products_recommendation(product_id: str) -> List[str]:
    """
    Lấy sản phẩm thường xuất hiện cùng một sản phẩm trong giỏ hàng cho hệ thống gợi ý
    """
    try:
        pipeline = [
            {"$match": {"products.product_id": product_id}},
            {"$unwind": "$products"},
            {"$match": {
                "$and": [
                    {"products.product_id": {"$ne": product_id}},
                    {"products.product_id": {"$ne": "undefined"}}
                ]
            }},
            {"$group": {
                "_id": "$products.product_id",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]

        result =  db['carts'].aggregate(pipeline).to_list(length=None)

        # Trả về danh sách ID sản phẩm
        related_products = [item["_id"] for item in result]
        return related_products
    except Exception as e:
        logger.error(f"Error getting related cart products for {product_id} for recommendation: {str(e)}")
        return []


async def get_cart_item_quantity_recommendation(days: int = 30) -> Dict[str, int]:
    """
    Lấy tổng số lượng của từng sản phẩm trong giỏ hàng cho hệ thống gợi ý
    """
    try:
        start_date = datetime.now() - timedelta(days=days)
        pipeline = [
            {"$match": {"updated_at": {"$gte": start_date}}},
            {"$unwind": "$products"},
            {"$match": {"products.product_id": {"$ne": "undefined"}}},
            {"$group": {
                "_id": "$products.product_id",
                "total_quantity": {"$sum": "$products.quantity"}
            }},
            {"$sort": {"total_quantity": -1}}
        ]

        result =  db['carts'].aggregate(pipeline).to_list(length=None)

        # Chuyển thành dictionary
        quantity_counts = {item["_id"]: item["total_quantity"] for item in result}
        return quantity_counts
    except Exception as e:
        logger.error(f"Error getting cart item quantities for recommendation: {str(e)}")
        return {}