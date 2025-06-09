import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response
from app.entities.comment.request import ItemCommentReq, ItemAnswerReq
from app.entities.comment.response import ItemCommentRes
from app.helpers.constant import generate_id
from app.helpers.time_utils import get_current_time
from app.models import user

collection_name = "comments"


async def create_comment(item: ItemCommentReq, token):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        item_dict = item.dict()
        item_dict["user_id"] = user_info.id
        item_dict["user_name"] = user_info.user_name
        item_dict["created_at"] = get_current_time()
        item_dict["answers"] = []
        insert_result = collection.insert_one(item_dict)
        logger.info(f"[create_comment] Đã thêm bình luận mới, ID: {insert_result.inserted_id}")
        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            message="Tạo bình luận thành công"
        )
    except Exception as e:
        raise e

async def get_comment_by_product(product_id: str, page: int, page_size: int, sort_type: str = "oldest"):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size

    sort_order = 1
    if sort_type == "newest":
        sort_order = -1

    comments = list(collection.find({"product_id": product_id})
                    .sort("created_at", sort_order)
                    .skip(skip_count)
                    .limit(page_size))

    comment_list = [ItemCommentRes.from_mongo(comment) for comment in comments]

    total_comments = collection.count_documents({"product_id": product_id})

    return {
        "comments": comment_list,
        "total": total_comments
    }

async def answer_to_comment(item: ItemAnswerReq, token):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        comment_id = ObjectId(item.comment_id)
        comment = collection.find_one({"_id": ObjectId(comment_id)})
        if not comment:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy bình luận"
            )
        answer = {
            "answer_id": generate_id("ANSWER"),
            "user_id": user_info.id,
            "user_name": user_info.user_name,
            "comment": item.comment,
            "created_at": get_current_time()
        }

        collection.update_one(
            {"_id": comment_id},
            {"$push": {"answers": answer}}
        )

        logger.info(f"[answer_to_comment] Thêm câu trả lời thành công vào comment_id: {item.comment_id}")
        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Thêm câu trả lời thành công"
        )
    except Exception as e:
        raise e

async def count_comments(product_id: str) -> int:
    collection = database.db[collection_name]
    return collection.count_documents({"product_id": product_id, "comment": {"$exists": True, "$ne": ""}})
