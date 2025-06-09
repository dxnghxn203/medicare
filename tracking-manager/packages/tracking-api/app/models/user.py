from datetime import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response, mail
from app.entities.user.request import ItemUserRegisReq, ItemUserUpdateProfileReq
from app.entities.user.response import ItemUserRes
from app.helpers import redis
from app.middleware import middleware
from app.middleware.middleware import decode_jwt
from app.helpers.time_utils import get_current_time
collection_name = "users"

async def get_by_email_and_auth_provider(email: str, auth_provider: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email, "auth_provider": auth_provider})

async def get_all_user(page: int, page_size: int):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size
    user_list = collection.find().sort("created_at", -1).skip(skip_count).limit(page_size)
    total = collection.count_documents({})
    return {
            "total_users": total,
            "users": [ItemUserRes.from_mongo(user) for user in user_list]
        }

async def create_user(item: ItemUserRegisReq, auth_provider: str, password: str = None):
    collection = database.db[collection_name]
    item_dict = item.dict()

    if password:
        item_dict["password"] = middleware.hash_password(password)

    item_dict.update({
        "created_at": get_current_time(),
        "updated_at": get_current_time(),
        "verified_email_at": get_current_time() if auth_provider == "google" else None,
        "role_id": "user",
        "active": True,
        "auth_provider": auth_provider,
        "login_history": []
    })

    insert_result = collection.insert_one(item_dict)
    logger.info(f"[create_user] Đã thêm user mới, ID: {insert_result.inserted_id}")
    return insert_result.inserted_id

async def add_user_email(item: ItemUserRegisReq):
    try:
        if not item:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message='Vui lòng nhập thông tin user.'
            )

        if await get_by_email_and_auth_provider(item.email, "email"):
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Email đã tồn tại."
            )
        user_id = await create_user(item, auth_provider="email", password=item.password)
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
            logger.error("Failed [add_user_email] :", error=e)
            collection = database.db[collection_name]
            collection.delete_one({"_id": user_id})
            raise e
    except Exception as e:
        logger.error(f"Failed [add_user_email] :{e}")
        raise e

async def add_user_google(email: str, user_name: str):
    try:
        existing_user = await get_by_email_and_auth_provider(email, 'google')
        if existing_user:
            return response.BaseResponse(
                message="Tài khoản Google đã tồn tại.",
                data={"user_id": str(existing_user["_id"])}
            )
        item = ItemUserRegisReq(
            email=email,
            user_name=user_name,
            phone_number="Google",
            password="Google@123",
            gender="Google",
            birthday=get_current_time()
        )

        user_id = await create_user(item, auth_provider="google", password="Google@123")

        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            status="created",
            message="Đã Đăng ký thành công",
            data={"user_id": str(user_id)}
        )
    except Exception as e:
        logger.error(f"Failed [add_user_google]: {e}")
        raise e

async def update_user_verification(email: str):
    collection = database.db[collection_name]
    collection.update_one({"email": email, "auth_provider": "email"}, {"$set": {"verified_email_at": get_current_time()}})
    return response.SuccessResponse(message="Email đã được xác thực")

async def update_user_login_history(user_id: str):
    try:
        collection = database.db[collection_name]
        result = collection.update_one({"_id": ObjectId(user_id)}, {"$push": {"login_history": get_current_time()}})
        if result.modified_count == 0:
            logger.error(f"[update_user_login_history] User not found: {user_id}")
    except Exception as e:
        logger.error(f"Error updating user login history: {str(e)}")


async def get_by_id(user_id: str):
    try:
        collection = database.db[collection_name]
        user_info = collection.find_one({"_id": ObjectId(user_id)})
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="User not found"
            )
        return user_info
    except Exception as e:
        logger.error(f"Error getting user by id: {str(e)}")
        raise e

async def update_status(user_id: str, status: bool):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "active": status,
                    "updated_at": get_current_time()
                }
            }
        )
        return response.SuccessResponse(message=f"Cập nhật trạng thái user thành {status}")
    except Exception as e:
        logger.error(f"Error updating user status: {str(e)}")
        raise e

async def get_current(token: str) -> ItemUserRes:
    try:
        payload = decode_jwt(token=token)
        user_info = await get_by_id(payload.get("username"))
        if user_info:
            user_info['token'] = token
            return ItemUserRes.from_mongo(user_info)
        return None
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error get_current user: {str(e)}")
        raise e

async def update_user_password(email: str, new_password: str):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"email": email, "auth_provider": "email"},
            {"$set": {"password": middleware.hash_password(new_password), "updated_at": get_current_time()}})
        return response.SuccessResponse(message="Cập nhật mật khẩu thành công")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"[update_user_password] Lỗi: {str(e)}")
        raise e

async def get_user_monthly_login_statistics(year: int):
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
        logger.error(f"Failed to get login stats for user in year {year}: {e}")
        raise e

async def update_user_info(user_id: str, item: ItemUserUpdateProfileReq):
    try:
        collection = database.db[collection_name]
        item_dict = item.dict()
        item_dict["updated_at"] = get_current_time()
        collection.update_one({"_id": ObjectId(user_id)}, {"$set": item_dict})
        return response.SuccessResponse(message="Cập nhật thông tin thành công")
    except Exception as e:
        logger.error(f"Error updating user info: {str(e)}")
        raise e