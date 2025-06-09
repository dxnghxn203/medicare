import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response
from app.core.s3 import upload_file
from app.entities.review.request import ItemReviewReq, ItemReplyReq
from app.entities.review.response import ItemReviewRes
from app.helpers.constant import generate_id
from app.helpers.time_utils import get_current_time
from app.models import user

collection_name = "reviews"


async def create_review(item: ItemReviewReq, token, images):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        item_dict = item.dict()
        item_dict["user_id"] = user_info.id
        item_dict["user_name"] = user_info.user_name
        image_urls = []
        if images:
            image_urls = [upload_file(img, "reviews") for img in images if img]

        item_dict["images"] = image_urls
        item_dict["created_at"] = get_current_time()
        item_dict["replies"] = []
        insert_result = collection.insert_one(item_dict)
        logger.info(f"[create_review] Đã thêm đánh giá mới, ID: {insert_result.inserted_id}")
        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            message="Tạo đánh giá thành công"
        )
    except Exception as e:
        raise e

async def get_review_by_product(product_id: str, page: int, page_size: int, rating: float):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size

    query = {"product_id": product_id}

    if rating != 0:
        query["rating"] = rating

    reviews = list(collection.find(query)
                   .sort("created_at", -1)
                   .skip(skip_count)
                   .limit(page_size))

    review_list = [ItemReviewRes.from_mongo(review) for review in reviews]
    total_reviews = collection.count_documents({"product_id": product_id})

    return {
        "reviews": review_list,
        "total": total_reviews
    }

async def reply_to_review(item: ItemReplyReq, token, images):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        review_id = ObjectId(item.review_id)
        review = collection.find_one({"_id": ObjectId(review_id)})
        if not review:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy đánh giá"
            )
        image_urls = []
        if images:
            image_urls = [upload_file(img, "reviews") for img in images if img]

        reply = {
            "reply_id": generate_id("REPLY"),
            "user_id": user_info.id,
            "user_name": user_info.user_name,
            "comment": item.comment,
            "created_at": get_current_time(),
            "images": image_urls
        }

        collection.update_one(
            {"_id": review_id},
            {"$push": {"replies": reply}}
        )

        logger.info(f"[reply_to_review] Thêm phản hồi thành công vào review_id: {item.review_id}")
        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Thêm phản hồi thành công"
        )
    except Exception as e:
        raise e

async def count_reviews(product_id: str) -> int:
    collection = database.db[collection_name]
    return collection.count_documents({"product_id": product_id, "rating": {"$exists": True}})

async def average_rating(product_id: str) -> float:
    collection = database.db[collection_name]
    pipeline = [
        {"$match": {"product_id": product_id, "rating": {"$exists": True}}},
        {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
    ]

    result = list(collection.aggregate(pipeline))
    return round(result[0]["avg_rating"], 1) if result else 0.0