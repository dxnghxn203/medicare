from core.mongo import db
from core import logger
from typing import List, Dict, Any, Optional


async def get_user_viewed_products_recommendation(user_id: str, limit: int = 20) -> List[str]:
    """
    Lấy sản phẩm đã xem của người dùng
    """
    try:
        views = db.product_views.find(
            {"user_id": user_id}
        ).sort("viewed_at", -1).limit(limit).to_list(length=limit)

        return [view["product_id"] for view in views]
    except Exception as e:
        logger.error(f"Error fetching viewed products for user {user_id}: {str(e)}")
        return []


async def get_user_cart_products_recommendation(user_id: str) -> List[str]:
    """
    Lấy sản phẩm trong giỏ hàng
    """
    try:
        cart = db.carts.find_one({"user_id": user_id})
        if cart and "products" in cart:
            return [item["product_id"] for item in cart["products"] if item.get("product_id") != "undefined"]
        return []
    except Exception as e:
        logger.error(f"Error fetching cart products for user {user_id}: {str(e)}")
        return []


async def get_user_wishlist_products_recommendation(user_id: str) -> List[str]:
    """
    Lấy sản phẩm trong wishlist
    """
    try:
        wishlist = db.wishlists.find_one({"user_id": user_id})
        if wishlist and "products" in wishlist:
            return wishlist["products"]
        return []
    except Exception as e:
        logger.error(f"Error fetching wishlist products for user {user_id}: {str(e)}")
        return []