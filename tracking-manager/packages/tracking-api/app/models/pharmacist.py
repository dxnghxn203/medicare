from datetime import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response, mail
from app.entities.admin.request import ItemAdminRegisReq
from app.entities.admin.response import ItemAdminRes
from app.entities.pharmacist.request import ItemPharmacistRegisReq, ItemPharmacistUpdateProfileReq
from app.entities.pharmacist.response import ItemPharmacistRes
from app.helpers import redis
from app.helpers.time_utils import get_current_time
from app.middleware import middleware
from app.middleware.middleware import decode_jwt, generate_password

collection_name = "pharmacists"

async def get_by_email(email: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email})

async def get_all_pharmacist(page: int, page_size: int):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size
    pharmacist_list = collection.find().sort("created_at", -1).skip(skip_count).limit(page_size)
    total = collection.count_documents({})
    return {
            "total_pharmacists": total,
            "pharmacists": [ItemPharmacistRes.from_mongo(pharmacist) for pharmacist in pharmacist_list]
        }

async def create_pharmacist(item: ItemPharmacistRegisReq):
    try:
        if not item:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message='Vui lòng nhập thông tin pharmacist.'
            )

        if await get_by_email(item.email):
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Email đã tồn tại."
            )
        collection = database.db[collection_name]
        item_dict = item.dict()

        password = generate_password()
        item_dict["password"] = middleware.hash_password(password)

        item_dict.update({
            "created_at": get_current_time(),
            "updated_at": get_current_time(),
            "verified_email_at": None,
            "role_id": "pharmacist",
            "active": True,
            "auth_provider": "email",
            "login_history": []
        })

        insert_result = collection.insert_one(item_dict)
        logger.info(f"[create_pharmacist] Đã thêm pharmacist mới, ID: {insert_result.inserted_id}")
        pharmacist_id = insert_result.inserted_id
        try:
            otp = middleware.generate_otp()
            redis.save_otp_and_update_request_count(item.email, otp)
            mail.send_new_pharmacist_email(item.email, otp, password)

            return response.BaseResponse(
                status_code=status.HTTP_201_CREATED,
                status="created",
                message="Đã tạo dược sĩ thành công"
            )
        except Exception as e:
            logger.error("Failed [create_pharmacist] :", error=e)
            collection = database.db[collection_name]
            collection.delete_one({"_id": pharmacist_id})
            raise e
    except Exception as e:
        logger.error(f"Failed [create_pharmacist] :{e}")
        raise e

async def update_pharmacist_login_history(user_id: str):
    try:
        collection = database.db[collection_name]
        result = collection.update_one({"_id": ObjectId(user_id)}, {"$push": {"login_history": get_current_time()}})
        if result.modified_count == 0:
            logger.error(f"[update_pharmacist_login_history] Admin not found: {user_id}")
    except Exception as e:
        logger.error(f"Error updating pharmacist login history: {str(e)}")

async def update_pharmacist_verification(email: str):
    collection = database.db[collection_name]
    collection.update_one({"email": email}, {"$set": {"verified_email_at": get_current_time()}})
    return response.SuccessResponse(message="Email đã được xác thực")

async def get_by_id(pharmacist_id: str):
    try:
        collection = database.db[collection_name]
        pharmacist_info = collection.find_one({"_id": ObjectId(pharmacist_id)})
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Pharmacist not found"
            )
        return pharmacist_info
    except Exception as e:
        logger.error(f"Error getting pharmacist by id: {str(e)}")
        raise e

async def get_pharmacist_by_user_id(pharmacist_id: str):
    try:
        collection = database.db[collection_name]
        pharmacist_info = collection.find_one({"_id": ObjectId(pharmacist_id)})
        return pharmacist_info
    except Exception as e:
        return None

async def get_current(token: str) -> ItemPharmacistRes:
    try:
        payload = decode_jwt(token=token)
        pharmacist_info = await get_by_id(payload.get("username"))
        if pharmacist_info:
            pharmacist_info['token'] = token
            return ItemPharmacistRes.from_mongo(pharmacist_info)
        return None
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error get_current pharmacist: {str(e)}")
        raise e

async def update_pharmacist_password(email: str, new_password: str):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"email": email},
            {"$set": {"password": middleware.hash_password(new_password), "updated_at": get_current_time()}})
        return response.SuccessResponse(message="Cập nhật mật khẩu thành công")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"[update_pharmacist_password] Lỗi: {str(e)}")
        raise e

async def update_status(pharmacist_id: str, status: bool):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"_id": ObjectId(pharmacist_id)},
            {
                "$set": {
                    "active": status,
                    "updated_at": get_current_time()
                }
            }
        )
        return response.SuccessResponse(message=f"Cập nhật trạng thái pharmacist thành {status}")
    except Exception as e:
        logger.error(f"Error updating pharmacist status: {str(e)}")
        raise e

async def get_pharmacist_monthly_login_statistics(year: int):
    try:
        collection = database.db[collection_name]
        start_date = datetime(year, 1, 1)
        end_date = datetime(year + 1, 1, 1)

        pipeline = [
            {
                "$match": {
                    "login_history": {
                        "$elemMatch": {
                            "$gte": start_date,
                            "$lt": end_date
                        }
                    }
                }
            },
            {
                "$project": {
                    "login_history": {
                        "$filter": {
                            "input": "$login_history",
                            "as": "login",
                            "cond": {
                                "$and": [
                                    {"$gte": ["$$login", start_date]},
                                    {"$lt": ["$$login", end_date]}
                                ]
                            }
                        }
                    }
                }
            },
            {
                "$unwind": "$login_history"
            },
            {
                "$group": {
                    "_id": {"month": {"$month": "$login_history"}},
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "month": "$_id.month",
                    "count": 1
                }
            }
        ]

        results = collection.aggregate(pipeline).to_list(length=12)

        counts = [0] * 12

        for item in results:
            counts[item["month"] - 1] = item["count"]

        return counts

    except Exception as e:
        logger.error(f"Failed to get login stats for pharmacist in year {year}: {e}")
        raise e

async def update_pharmacist_info(pharmacist_id: str, item: ItemPharmacistUpdateProfileReq):
    try:
        collection = database.db[collection_name]
        item_dict = item.dict()
        item_dict["updated_at"] = get_current_time()
        collection.update_one({"_id": ObjectId(pharmacist_id)}, {"$set": item_dict})
        return response.SuccessResponse(message="Cập nhật thông tin thành công")
    except Exception as e:
        logger.error(f"Error updating pharmacist info: {str(e)}")
        raise e