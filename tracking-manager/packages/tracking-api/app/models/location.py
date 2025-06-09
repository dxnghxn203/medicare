import asyncio
import datetime
from typing import Union

from starlette import status
from starlette.status import HTTP_400_BAD_REQUEST

from app.core import database, logger, response
from app.entities.location.request import ItemLocationReq
from app.helpers.constant import CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX, generate_id, special_cities
from app.helpers.time_utils import get_current_time
from app.helpers.es_helpers import delete_index, insert_es_common, query_es_data, search_es
from app.models import user
from app.core import ghn

collection_name = "locations"

async def delete_cities():
    delete_index(CITY_INDEX)

async def delete_districts():
    delete_index(DISTRICT_INDEX)

async def delete_wards():
    delete_index(WARD_INDEX)

async def delete_regions():
    delete_index(REGION_INDEX)

async def insert_cities_into_elasticsearch():
    await insert_es_common(CITY_INDEX, 'ghn_cities.xlsx')

async def insert_districts_into_elasticsearch():
    await insert_es_common(DISTRICT_INDEX, 'ghn_districts.xlsx')

async def insert_wards_into_elasticsearch():
    await insert_es_common(WARD_INDEX, 'ghn_wards.xlsx')

async def insert_regions_into_elasticsearch():
    await insert_es_common(REGION_INDEX, 'regions.xlsx')

async def get_cities():
    return await query_es_data(CITY_INDEX, {"query": {"match_all": {}}, "size": 65})

async def get_districts_by_city(city_code: str):
    return await query_es_data(DISTRICT_INDEX, {"query": {"match": {"city_code": city_code}}, "size": 1000})

async def get_wards_by_district(district_code: str):
    return await query_es_data(WARD_INDEX, {"query": {"match": {"district_code": district_code}}, "size": 1000})

async def get_regions():
    return await query_es_data(REGION_INDEX, {"query": {"match_all": {}}, "size": 65})

async def get_domestic_name(province_code: int) -> Union[str, response.JsonException]:
    result = await search_es(CITY_INDEX, {"code": province_code})

    if isinstance(result, response.JsonException) or not result:
        raise response.JsonException(
            status_code=HTTP_400_BAD_REQUEST,
            message="Province code không tồn tại"
        )

    return result.get("domestic_name")

async def determine_route(sender_code: int, receiver_code: int) -> str:
    if sender_code == receiver_code:
        return "intra_province"
    if sender_code in special_cities and receiver_code in special_cities:
        return "cross_metro"

    sender_domain, receiver_domain = await asyncio.gather(
        get_domestic_name(sender_code),
        get_domestic_name(receiver_code)
    )

    if isinstance(sender_domain, response.JsonException):
        return sender_domain
    if isinstance(receiver_domain, response.JsonException):
        return receiver_domain

    return "same_region" if sender_domain == receiver_domain else "cross_region"

async def get_all_locations_by_user(token: str):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        location = collection.find_one({"user_id": user_info.id})
        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Lấy danh sách địa chỉ thành công",
            data={
                "default_location": location["default_location"] if location else None,
                "locations": location["locations"] if location else []
            }
        )
    except Exception as e:
        logger.error(f"Error getting all locations: {str(e)}")
        raise e

async def create_location(item: ItemLocationReq, token: str):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        location = collection.find_one({"user_id": user_info.id})
        location_id = generate_id("LOCATION")

        n_location = {
            "location_id": location_id,
            "name": item.name,
            "phone_number": item.phone_number,
            "email": item.email,
            "address": item.address,
            "ward": item.ward,
            "district": item.district,
            "province": item.province,
            "province_code": item.province_code,
            "district_code": item.district_code,
            "ward_code": item.ward_code,
            "created_at": get_current_time()
        }
        if not location:
            collection.insert_one({
                "user_id": user_info.id,
                "default_location": location_id,
                "locations": [n_location]
            })
            return response.BaseResponse(
                status_code=status.HTTP_200_OK,
                message="Thêm địa chỉ thành công"
            )
        data_locations = location["locations"]
        if len(data_locations) >= 5:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Đã đạt giới hạn địa chỉ"
            )
        data_locations.append(n_location)
        if item.is_default or len(data_locations) == 1:
            collection.update_one({"user_id": user_info.id},
                              {"$set": {"locations": data_locations,
                                "default_location": location_id}})
        else:
            collection.update_one({"user_id": user_info.id},
                              {"$set": {"locations": data_locations}})
        return response.BaseResponse(
                status_code=status.HTTP_200_OK,
                message="Thêm địa chỉ thành công"
            )
    except Exception as e:
        logger.error(f"Error create location: {str(e)}")
        raise e

async def update_location(token: str, location_id: str, item: ItemLocationReq):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        location = collection.find_one({"user_id": user_info.id})
        updated = False
        new_locations = []
        is_default = item.is_default
        item.dict(exclude={"is_default"})
        for loc in location["locations"]:
            if loc["location_id"] == location_id:
                loc.update({k: v for k, v in item.dict().items() if v is not None})
                updated = True
            new_locations.append(loc)
        if not updated:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy địa chỉ để cập nhật"
            )

        if is_default:
            collection.update_one({"user_id": user_info.id},
                                  {"$set": {"default_location": location_id}})

        collection.update_one({"user_id": user_info.id},
                              {"$set":{
                                    "locations": new_locations,
                             }})

        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Cập nhật địa chỉ thành công"
        )
    except Exception as e:
        logger.error(f"Error update location: {str(e)}")
        raise e

async def delete_location(token: str, location_id: str):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]

        result = collection.find_one({"user_id": user_info.id})
        locations = result["locations"]
        updated_locations = [loc for loc in locations if loc["location_id"] != location_id]
        if len(updated_locations) == len(locations):
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy địa chỉ để xóa"
            )

        update_data = {"locations": updated_locations}
        if result["default_location"] == location_id:
            if updated_locations:
                update_data["default_location"] = updated_locations[0]["location_id"]
            else:
                update_data["default_location"] = None

        collection.update_one({"user_id": user_info.id}, {"$set": update_data})

        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Xóa địa chỉ thành công"
        )

    except Exception as e:
        logger.error(f"Error delete location: {str(e)}")
        raise e

def get_provinces_ghn():
    try:
        return ghn.send_request_get(
            function="/shiip/public-api/master-data/province",
            haveshopid=False,
            isPayload=False
        )
    except Exception as e:
        return None

def get_wards_ghn(district_id: int):
    try:
        return ghn.send_request_post(
            function="/shiip/public-api/master-data/ward?district_id",
            haveshopid= False,
            payload= {"district_id": district_id}
        )
    except Exception as e:
        return None

def get_districts_ghn(province_id: int):
    try:
        return ghn.send_request_get(
            function="/shiip/public-api/master-data/district",
            haveshopid=False,
            payload={"province_id": province_id},
            isPayload=True
        )
    except Exception as e:
        return None
