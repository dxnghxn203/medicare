from datetime import datetime

from starlette import status
from app.core import database, logger, response
from app.entities.voucher.request import ItemVoucherDBInReq, ItemVoucherDBReq
from app.entities.voucher.response import ItemVoucherDBRes, ItemVoucherRes
from app.helpers.constant import generate_id
from app.helpers.time_utils import get_current_time

collection_name = "vouchers"

async def get_all_vouchers(page: int, page_size: int):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size
    voucher_list = collection.find().sort("created_at", -1).skip(skip_count).limit(page_size)
    return {
        "total_vouchers": collection.count_documents({}),
        "vouchers": [ItemVoucherRes(**voucher) for voucher in voucher_list]
    }

async def get_all_vouchers_for_users():
    collection = database.db[collection_name]

    now = get_current_time()

    voucher_list = collection.aggregate([
        {
            "$match": {
                "active": True,
                "expired_date": {"$gte": now}
            }
        },
        {
            "$addFields": {
                "effective_discount": {
                    "$min": [
                        {
                            "$multiply": [
                                "$min_order_value",
                                { "$divide": ["$discount", 100] }
                            ]
                        },
                        "$max_discount_value"
                    ]
                }
            }
        },
        {
            "$sort": {
                "effective_discount": -1
            }
        }
    ])

    return [ItemVoucherRes(**voucher) for voucher in voucher_list]


async def get_voucher_by_id(voucher_id: str, is_admin: bool = False):
    try:
        collection = database.db[collection_name]
        voucher = collection.find_one({"voucher_id": voucher_id})
        if not voucher:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Voucher không tồn tại"
            )
        if is_admin:
            return ItemVoucherDBRes(**voucher)
        else:
            return ItemVoucherRes(**voucher)
    except Exception as e:
        logger.error(f"Error getting voucher: {str(e)}")
        raise e

async def create_voucher(item: ItemVoucherDBInReq, email: str):
    try:
        item_data = ItemVoucherDBReq(
            **item.dict(),
            voucher_id=generate_id("VOUCHER"),
            created_by=email,
            updated_by=email,
        )
        collection = database.db[collection_name]
        insert_result = collection.insert_one(item_data.dict())
        logger.info(f"[create_voucher] Đã thêm voucher mới, ID: {insert_result.inserted_id}")
    except Exception as e:
        logger.error(f"Error creating voucher: {str(e)}")
        raise e

async def update_status(voucher_id: str, status: bool, email):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"voucher_id": voucher_id},
            {
                "$set": {
                    "active": status,
                    "updated_at": get_current_time(),
                    "updated_by": email
                }
            }
        )
        return response.SuccessResponse(message=f"Cập nhật trạng thái voucher thành {status}")
    except Exception as e:
        logger.error(f"Error updating voucher status: {str(e)}")
        raise e

async def delete_voucher(voucher_id: str):
    try:
        collection = database.db[collection_name]
        collection.delete_one({"voucher_id": voucher_id})
        return response.SuccessResponse(message="Xóa voucher thành công")
    except Exception as e:
        logger.error(f"Error deleting voucher: {str(e)}")
        raise e

async def update_voucher(voucher_id: str, item: ItemVoucherDBInReq, email: str):
    try:
        voucher_info = await get_voucher_by_id(voucher_id, is_admin=True)
        if not voucher_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Voucher không tồn tại"
            )

        collection = database.db[collection_name]
        collection.update_one(
            {"voucher_id": voucher_id},
            {"$set": item.dict()}
        )
        return response.SuccessResponse(message="Cập nhật voucher thành công")
    except Exception as e:
        logger.error(f"Error [update_voucher]: {str(e)}")
        raise e

async def restore_voucher(voucher_id: str, user_id: str):
    try:
        collection = database.db["vouchers"]

        result = collection.update_one(
            {
                "voucher_id": voucher_id,
            },
            {
                "$inc": {"used": -1},
                "$pull": {"used_by": user_id}
            }
        )

        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Voucher not found or not used by this user"
            )

        logger.info(f"Voucher usage restored successfully for voucher_id: {voucher_id}, user_id: {user_id}")
    except Exception as e:
        logger.error(f"Error restoring voucher: {str(e)}")
        raise e
