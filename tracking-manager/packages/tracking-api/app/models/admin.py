from datetime import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response, mail
from app.entities.admin.request import ItemAdminRegisReq, ItemAdminUpdateProfileReq
from app.entities.admin.response import ItemAdminRes
from app.helpers import redis
from app.helpers.time_utils import get_current_time
from app.middleware import middleware
from app.middleware.middleware import decode_jwt, generate_password

collection_name = "admin"
collection_user = "users"
collection_pharmacist = "pharmacists"
collection_order = "orders"

async def get_by_email(email: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email})

async def get_all_admin(page: int, page_size: int):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size
    admin_list = collection.find().sort("created_at", -1).skip(skip_count).limit(page_size)
    total = collection.count_documents({})
    return {
            "total_admin": total,
            "admin": [ItemAdminRes.from_mongo(admin) for admin in admin_list]
        }

async def create_admin(item: ItemAdminRegisReq):
    try:
        if not item:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message='Vui lòng nhập thông tin admin.'
            )

        if await get_by_email(item.email):
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Email đã tồn tại."
            )
        collection = database.db[collection_name]
        item_dict = item.dict()

        item_dict["password"] = middleware.hash_password(item.password)

        item_dict.update({
            "created_at": get_current_time(),
            "updated_at": get_current_time(),
            "verified_email_at": None,
            "role_id": "admin",
            "active": True,
            "auth_provider": "email",
            "login_history": []
        })

        insert_result = collection.insert_one(item_dict)
        logger.info(f"[create_admin] Đã thêm admin mới, ID: {insert_result.inserted_id}")
        admin_id = insert_result.inserted_id
        try:
            otp = middleware.generate_otp()
            redis.save_otp_and_update_request_count(item.email, otp)
            mail.send_otp_email(item.email, otp)

            return response.BaseResponse(
                status_code=status.HTTP_201_CREATED,
                status="created",
                message="Đã Đăng ký thành công"
            )
        except Exception as e:
            logger.error("Failed [create_admin] :", error=e)
            collection = database.db[collection_name]
            collection.delete_one({"_id": admin_id})
            raise e
    except Exception as e:
        logger.error(f"Failed [create_admin] :{e}")
        raise e

async def update_admin_login_history(user_id: str):
    try:
        collection = database.db[collection_name]
        result = collection.update_one({"_id": ObjectId(user_id)}, {"$push": {"login_history": get_current_time()}})
        if result.modified_count == 0:
            logger.error(f"[update_admin_login_history] Admin not found: {user_id}")
    except Exception as e:
        logger.error(f"Error updating admin login history: {str(e)}")

async def update_admin_verification(email: str):
    collection = database.db[collection_name]
    collection.update_one({"email": email}, {"$set": {"verified_email_at": get_current_time()}})
    return response.SuccessResponse(message="Email đã được xác thực")

async def get_by_id(admin_id: str):
    try:
        collection = database.db[collection_name]
        admin_info = collection.find_one({"_id": ObjectId(admin_id)})
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Admin not found"
            )
        return admin_info
    except Exception as e:
        logger.error(f"Error getting admin by id: {str(e)}")
        raise e

async def get_current(token: str) -> ItemAdminRes:
    try:
        payload = decode_jwt(token=token)
        admin_info = await get_by_id(payload.get("username"))
        if admin_info:
            admin_info['token'] = token
            return ItemAdminRes.from_mongo(admin_info)
        return None
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error get_current admin: {str(e)}")
        raise e

async def update_admin_password(email: str, new_password: str):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"email": email},
            {"$set": {"password": middleware.hash_password(new_password), "updated_at": get_current_time()}})
        return response.SuccessResponse(message="Cập nhật mật khẩu thành công")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"[update_admin_password] Lỗi: {str(e)}")
        raise e

async def get_user_role_statistics():
    try:

        user_count = database.db[collection_user].count_documents({})
        pharmacist_count = database.db[collection_pharmacist].count_documents({})
        admin_count = database.db[collection_name].count_documents({})

        return {
            "user": user_count,
            "pharmacist": pharmacist_count,
            "admin": admin_count
        }

    except Exception as e:
        logger.error(f"Failed [get_user_role_statistics]: {e}")
        raise e

async def get_top_customers_by_revenue(top_n: int = 5):
    try:
        order_collection = database.db[collection_order]
        user_collection = database.db[collection_user]

        pipeline = [
            {
                "$match": {
                    "status": "delivery_success"
                }
            },
            {
                "$addFields": {
                    "created_by_obj": {"$toObjectId": "$created_by"}
                }
            },
            {
                "$group": {
                    "_id": "$created_by_obj",
                    "total_revenue": {"$sum": "$product_fee"},
                    "order_count": {"$sum": 1}
                }
            },
            {
                "$sort": {"total_revenue": -1}
            },
            {
                "$limit": top_n
            },
            {
                "$lookup": {
                    "from": collection_user,
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            {
                "$unwind": "$user"
            },
            {
                "$project": {
                    "_id": 0,
                    "user_id": "$_id",
                    "user_name": "$user.user_name",
                    "email": "$user.email",
                    "phone_number": "$user.phone_number",
                    "total_revenue": 1,
                    "order_count": 1
                }
            }
        ]

        results = order_collection.aggregate(pipeline).to_list(length=top_n)
        for result in results:
            result["user_id"] = str(result["user_id"])

        return results

    except Exception as e:
        logger.error(f"Failed [get_top_customers_by_revenue]: {e}")
        raise e

async def get_admin_monthly_login_statistics(year: int):
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
        logger.error(f"Failed to get login stats for admin in year {year}: {e}")
        raise e

async def update_admin_info(admin_id: str, item: ItemAdminUpdateProfileReq):
    try:
        collection = database.db[collection_name]
        item_dict = item.dict()
        item_dict["updated_at"] = get_current_time()
        collection.update_one({"_id": ObjectId(admin_id)}, {"$set": item_dict})
        return response.SuccessResponse(message="Cập nhật thông tin thành công")
    except Exception as e:
        logger.error(f"Error updating admin info: {str(e)}")
        raise e