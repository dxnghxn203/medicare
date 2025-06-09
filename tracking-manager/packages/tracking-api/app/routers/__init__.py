from .user import router as user_router
from .auth import router as authen_router
from .admin import router as admin_router
from .order import router as order_router
from .product import router as product_router
from .location import router as location_router
from .category import router as category_router
from .review import router as review_router
from .comment import router as comment_router
from .cart import router as cart_router
from .fee import router as fee_router
from .time import router as time_router
from .pharmacist import router as pharmacist_router
from .chat_box import router as chat_box_router
from .voucher import router as voucher_router
from .brand import router as brand_router
from .article import router as article_router
from .document import router as document_router

__all__ = [
    'cart_router',
    'user_router',
    'authen_router',
    'admin_router',
    'pharmacist_router',
    'order_router',
    'product_router',
    'location_router',
    'category_router',
    'review_router',
    'comment_router',
    'fee_router',
    'time_router',
    'voucher_router',
    'brand_router',
    'chat_box_router',
    'article_router',
    'document_router'
]
