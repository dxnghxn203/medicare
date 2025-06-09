import base64
import json
import os
import io
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Tuple, Dict, Union
from calendar import monthrange
from bson.son import SON
import httpx
from bson import ObjectId
from bson.errors import InvalidId
from dateutil.parser import parse
from starlette import status
from starlette.responses import StreamingResponse

from app.core import logger, response, rabbitmq, database, ghn
from app.core.file import create_image_json_payload
from app.core.mail import send_invoice_email
from app.core.s3 import upload_file
from app.entities.fee.request import FeeGHNReq
from app.entities.order.request import ItemOrderInReq, ItemOrderReq, OrderRequest, ItemUpdateStatusReq, \
    ItemOrderForPTInReq, ItemOrderForPTReq, ItemOrderApproveReq, ItemOrderImageReq, InfoAddressOrderReq, \
    ShippingOrderGHN
from app.entities.order.response import ItemOrderRes, ItemOrderForPTRes
from app.entities.pharmacist.response import ItemPharmacistRes
from app.entities.product.request import ItemProductInReq, ItemProductReq
from app.entities.product.response import ItemProductRes
from app.entities.time.request import TimeGHNReq
from app.entities.user.response import ItemUserRes
from app.entities.voucher.request import ItemVoucherReq
from app.helpers import redis
from app.helpers.constant import get_create_order_queue, generate_id, PAYMENT_COD, BANK_IDS, \
    FEE_INDEX, get_update_status_queue, WAREHOUSE_ADDRESS, SENDER_PROVINCE_CODE, SENDER_DISTRICT_CODE, \
    SENDER_COMMUNE_CODE, get_extract_document_queue, WARD_INDEX
from app.helpers.time_utils import get_current_time
from app.helpers.es_helpers import search_es
from app.helpers.pdf_helpers import export_invoice_to_pdf
from app.helpers.redis import remove_cart_item
from app.models.cart import remove_product_from_cart
from app.models.fee import calculate_shipping_fee, get_fee_ghn
from app.models.location import determine_route
from app.models.product import restore_product_sell, check_all_product_discount_expired, \
    get_product_inventory, get_product_by_id
from app.models.time import get_range_time, get_delivery_time_ghn
from app.models.user import get_by_id
from app.models.voucher import get_voucher_by_id, restore_voucher, get_all_vouchers_for_users

PAYMENT_API_URL = os.getenv("PAYMENT_API_URL")

collection_name = "orders"
request_collection_name = "orders_requests"

async def get_total_orders():
    try:
        collection = database.db[collection_name]
        total_orders = collection.count_documents({})
        return total_orders
    except Exception as e:
        logger.error(f"Failed [get_total_orders]: {e}")
        raise e

async def get_total_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = get_current_time() - timedelta(days=365)
        total_orders = collection.count_documents({"created_date": {"$gte": one_year_ago}})
        return total_orders
    except Exception as e:
        logger.error(f"Failed [get_total_orders_last_365_days]: {e}")
        raise e

async def get_new_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = get_current_time() - timedelta(days=365)
        new_orders = collection.count_documents({"status": "created", "created_date": {"$gte": one_year_ago}})
        return new_orders
    except Exception as e:
        logger.error(f"Failed [get_new_orders_last_365_days]: {e}")
        raise e

async def get_completed_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = get_current_time() - timedelta(days=365)
        completed_orders = collection.count_documents({"status": "delivery_success", "created_date": {"$gte": one_year_ago}})
        return completed_orders
    except Exception as e:
        logger.error(f"Failed [get_completed_orders_last_365_days]: {e}")
        raise e

async def get_popular_products(top_n=3):
    try:
        orders_collection = database.db[collection_name]
        pipeline = [
            {"$unwind": "$product"},
            {"$group": {"_id": "$product.product_id", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": top_n}
        ]
        logger.info(f"Pipeline: {pipeline}")
        popular_products = list(orders_collection.aggregate(pipeline))
        return [p["_id"] for p in popular_products]
    except Exception as e:
        logger.error(f"Failed [get_popular_products]: {e}")
        raise e

async def get_cancel_orders_last_365_days():
    try:
        collection = database.db[collection_name]
        one_year_ago = get_current_time() - timedelta(days=365)
        cancel_orders = collection.count_documents({"status": "canceled", "created_date": {"$gte": one_year_ago}})
        return cancel_orders
    except Exception as e:
        logger.error(f"Failed [get_cancel_orders_last_365_days]: {e}")
        raise e

async def get_all_order(page: int, page_size: int, status: Optional[str] = None):
    try:
        collection = database.db[collection_name]
        skip_count = (page - 1) * page_size

        query = {}
        if status:
            query["status"] = status

        status_counts = {
            "total": collection.count_documents({}),
            "created": collection.count_documents({"status": "created"}),
            "waiting_to_pick": collection.count_documents({"status": "waiting_to_pick"}),
            "picking": collection.count_documents({"status": "picking"}),
            "delivering": collection.count_documents({"status": "delivering"}),
            "delivery_success": collection.count_documents({"status": "delivery_success"}),
            "delivery_fail": collection.count_documents({"status": "delivery_fail"}),
            "waiting_to_return": collection.count_documents({"status": "waiting_to_return"}),
            "returned": collection.count_documents({"status": "returned"}),
            "canceled": collection.count_documents({"status": "canceled"}),
        }

        order_cursor = (
            collection.find(query)
            .sort("created_date", -1)
            .skip(skip_count)
            .limit(page_size)
        )

        total = collection.count_documents(query)
        orders = [ItemOrderRes.from_mongo(order) for order in order_cursor]

        return {
            "total_orders": total,
            "orders": orders,
            "status_counts": status_counts
        }
    except Exception as e:
        logger.error(f"Failed [get_all_order]: {e}")
        raise e

async def get_tracking_order_by_order_id(order_id: str):
    try:
        collection = database.db["trackings"]
        trackings = collection.find({"order_id": order_id})
        lst = []
        for tracking in trackings:
            data = tracking
            data["_id"] = str(tracking["_id"])
            lst.append(data)
        return lst
    except Exception as e:
        logger.error(f"Failed [get_tracking_order_by_order_id]: {e}")
        return []

async def process_order_products(products: List[ItemProductInReq]) -> Tuple[
    List[ItemProductReq], float, float, List[Dict[str, str]], List[Dict[str, str]]
]:
    total_price = 0
    weight = 0
    product_items = []
    out_of_stock = []
    out_of_date = []

    for product in products:
        # Lấy thông tin sản phẩm và đơn giá theo price_id
        try:
            product_info = await get_product_by_id(product_id=product.product_id, price_id=product.price_id)
        except response.JsonException as e:
            out_of_stock.append({"product_id": product.product_id})
            continue

        # Lấy thông tin tồn kho đúng đơn vị (price_id)
        try:
            inventory_data = await get_product_inventory(product_id=product.product_id, price_id=product.price_id)
        except response.JsonException as e:
            out_of_stock.append({"product_id": product.product_id})
            continue

        # Tổng số lượng đã bán + số lượng cần đặt không vượt quá tồn kho
        total_requested = product.quantity + inventory_data.sell
        if total_requested > inventory_data.inventory:
            out_of_stock.append({
                "product_id": product.product_id,
                "price_id": product.price_id
            })
            continue

        price_info = product_info.prices[0]

        # Kiểm tra hạn dùng
        now = get_current_time()
        expired_date = price_info.expired_date
        is_expired = (
                expired_date
                and isinstance(expired_date, datetime)
                and expired_date < now
                and price_info.discount > 0
        )
        if is_expired:
            out_of_date.append({
                "product_id": product.product_id,
                "price_id": product.price_id,
            })

        actual_price = price_info.original_price if is_expired else price_info.price

        total_price += actual_price * product.quantity
        weight += price_info.weight * product.quantity
        expired_date = price_info.expired_date
        if expired_date and expired_date.tzinfo is None:
            expired_date = expired_date.replace(tzinfo=timezone.utc)
        product_item = ItemProductReq(
            product_id=product.product_id,
            price_id=product.price_id,
            product_name=product_info.product_name,
            unit=price_info.unit,
            quantity=product.quantity,
            price=actual_price,
            weight=price_info.weight,
            original_price=price_info.original_price,
            discount=0 if is_expired else price_info.discount,
            images_primary=product_info.images_primary,
            expired_date=expired_date.isoformat()
        )
        product_items.append(product_item)

    if out_of_date:
        await check_all_product_discount_expired()

    return product_items, total_price, weight, out_of_stock, out_of_date


async def process_single_voucher(voucher_id: str, expected_type: str, user_id: str = None) -> Union[ItemVoucherReq, Dict[str, str]]:
    try:
        voucher = await get_voucher_by_id(voucher_id)
    except response.JsonException as je:
        return {voucher_id: je.message}
    if voucher.voucher_type != expected_type:
        return {voucher_id: "Voucher không hợp lệ"}
    if voucher.expired_date < get_current_time():
        return {voucher_id: "Voucher hết hạn"}
    if voucher.used >= voucher.inventory:
        return {voucher_id: "Voucher hết số lượng"}

    if user_id:
        user_info = ItemUserRes.from_mongo(await get_by_id(ObjectId(user_id)))
        if not user_info:
            return {voucher_id: "Vui lòng đăng nhập tài khoản để sử dụng voucher"}
        if user_id in voucher.used_by:
            return {voucher_id: "Voucher chỉ được sử dụng 1 lần"}
    else:
        return {voucher_id: "Vui lòng đăng nhập tài khoản để sử dụng voucher"}
    expired_date = voucher.expired_date
    if expired_date and expired_date.tzinfo is None:
        expired_date = expired_date.replace(tzinfo=timezone.utc)
    return ItemVoucherReq(
        voucher_id=voucher.voucher_id,
        voucher_name=voucher.voucher_name,
        discount=voucher.discount,
        min_order_value=voucher.min_order_value,
        max_discount_value=voucher.max_discount_value,
        voucher_type=voucher.voucher_type,
        expired_date=expired_date.isoformat()
    )

async def process_order_voucher(
    voucher_order_id: str,
    voucher_delivery_id: str,
    user_id: str = None
) -> Tuple[List[ItemVoucherReq], List[Dict[str, str]]]:
    try:
        voucher_list = []
        voucher_error = []

        if voucher_order_id:
            order_voucher = await process_single_voucher(voucher_order_id, "order", user_id=user_id)
            if isinstance(order_voucher, dict):
                for key, msg in order_voucher.items():
                    voucher_error.append({"voucher_id": key, "message": msg})
            else:
                voucher_list.append(order_voucher)
        if voucher_delivery_id:
            delivery_voucher = await process_single_voucher(voucher_delivery_id, "delivery", user_id=user_id)
            if isinstance(delivery_voucher, dict):
                for key, msg in delivery_voucher.items():
                    voucher_error.append({"voucher_id": key, "message": msg})
            else:
                voucher_list.append(delivery_voucher)

        return voucher_list, voucher_error

    except Exception as e:
        logger.error(f"Failed [process_order_voucher]: {e}")
        raise e

async def get_shipping_fee(
    product_items: List[ItemProductReq],
    receiver_province_code: int,
    receiver_district_code: int,
    receiver_commune_code: int,
    product_price: float,
    weight: float
) -> Tuple[float, str]:
    try:
        # route_code = await determine_route(
        #         sender_code=SENDER_PROVINCE_CODE,
        #         receiver_code=receiver_province_code
        #     )
        #
        # delivery_time = await get_range_time(route_code)
        #
        # if product_price > 500_000:
        #     shipping_fee = 0
        # else:
        #     fee_data = await search_es(index=FEE_INDEX, conditions={"route_code": route_code})
        #     if isinstance(fee_data, response.JsonException):
        #         raise fee_data
        #
        #     shipping_fee = calculate_shipping_fee(fee_data, weight)

        from_result = await search_es(WARD_INDEX, {"code": str(SENDER_COMMUNE_CODE)})
        if isinstance(from_result, response.JsonException):
            raise from_result
        from_ward = from_result.get("ghn_code")
        from_district = from_result.get("ghn_district_code")
        logger.info(f"from_ward: {from_ward}, from_district: {from_district}")

        to_result = await search_es(WARD_INDEX, {"code": str(receiver_commune_code)})
        if isinstance(to_result, response.JsonException):
            raise to_result
        to_ward = to_result.get("ghn_code")
        to_district = to_result.get("ghn_district_code")
        logger.info(f"to_ward: {to_ward}, to_district: {to_district}")

        total_quantity = sum(item.quantity for item in product_items)

        if total_quantity == 1:
            length, width, height = 1, 1, 1
        elif total_quantity < 10:
            length, width, height = 20, 5, 5
        else:
            length, width, height = 20, 30, 20

        shipping_data = FeeGHNReq(**{
            "service_type_id": 2,
            "from_district_id": int(from_district),
            "from_ward_code": str(from_ward),
            "to_district_id": int(to_district),
            "to_ward_code": str(to_ward),
            "length": length,
            "width": width,
            "height": height,
            "weight": int(weight * 1000),
            "insurance_value": int(product_price),
            "coupon": None,
            "items": [
                {
                    "name": item.product_name or "Product",
                    "quantity": item.quantity,
                    "length": length,
                    "width": width,
                    "height": height,
                    "weight": int(item.weight*1000),
                } for item in product_items
            ]
        })

        logger.info(f"shipping_data: {shipping_data}")

        ghn_response = get_fee_ghn(shipping_data)
        logger.info(f"ghn_response: {ghn_response}")

        if isinstance(ghn_response, str):
            ghn_response = json.loads(ghn_response)

        if isinstance(ghn_response, response.JsonException):
            raise ghn_response

        shipping_fee = ghn_response["data"]["total"]

        time_response = get_delivery_time_ghn(TimeGHNReq(**{
            "from_district_id": from_district,
            "from_ward_code": from_ward,
            "to_district_id": to_district,
            "to_ward_code": to_ward,
            "service_id": 53320  # nhẹ
        }))

        logger.info(f"time_response: {time_response}")

        if isinstance(time_response, response.JsonException):
            raise time_response

        if isinstance(time_response, str):
            time_response = json.loads(time_response)

        delivery_time = time_response["data"]["leadtime_order"]["to_estimate_date"]
        return shipping_fee, delivery_time
    except Exception as e:
        logger.error(f"Failed [get_shipping_fee]: {e}")
        raise e

async def check_shipping_fee(
        product_items: List[ItemProductReq],
        receiver_province_code: int,
        receiver_district_code: int,
        receiver_commune_code: int,
        product_price: float,
        weight: float,
        voucher: Optional[List[ItemVoucherReq]] = None,
        voucher_error: Optional[List[Dict[str, str]]] = None,
        shipping_fee: Optional[float] = None,
        delivery_time: Optional[str] = None
    ):
    try:
        if receiver_province_code == 0:
            now = get_current_time()
            shipping_fee = 0
            order_discount_amount = 0
            delivery_discount_amount = 0

            if voucher:
                for v in voucher:
                    if v.voucher_type == "order" and product_price >= v.min_order_value:
                        discount = min(product_price * v.discount / 100, v.max_discount_value)
                        order_discount_amount += discount
                    elif v.voucher_type == "delivery":
                        # Vì shipping_fee = 0 => không giảm
                        continue

            total_fee = product_price

            return {
                "product_fee": product_price,
                "shipping_fee": 0,
                "delivery_time": now,
                "weight": weight,
                "voucher_order_discount": order_discount_amount,
                "voucher_delivery_discount": delivery_discount_amount,
                "basic_total_fee": total_fee,
                "estimated_total_fee": total_fee - order_discount_amount - delivery_discount_amount,
                "out_of_stock": [],
                "out_of_date": [],
                "voucher_error": voucher_error or []
            }

        if not shipping_fee and not delivery_time:
            shipping_fee, delivery_time = await get_shipping_fee(
                product_items=product_items,
                receiver_province_code=receiver_province_code,
                receiver_district_code=receiver_district_code,
                receiver_commune_code=receiver_commune_code,
                product_price=product_price,
                weight=weight
            )

        order_discount_amount = 0
        delivery_discount_amount = 0
        if voucher:
            for v in voucher:
                if v.voucher_type == "order" and product_price >= v.min_order_value:
                    discount = min(product_price * v.discount / 100, v.max_discount_value)
                    order_discount_amount += discount
                elif v.voucher_type == "delivery" and shipping_fee >= v.min_order_value:
                    discount = min(shipping_fee * v.discount / 100, v.max_discount_value)
                    delivery_discount_amount += discount

        total_fee = product_price + shipping_fee

        return {
            "product_fee": product_price,
            "shipping_fee": shipping_fee,
            "delivery_time": delivery_time,
            "weight": weight,
            "voucher_order_discount": order_discount_amount,
            "voucher_delivery_discount": delivery_discount_amount,
            "basic_total_fee": total_fee,
            "estimated_total_fee": total_fee - order_discount_amount - delivery_discount_amount,
            "out_of_stock": [],
            "out_of_date": [],
            "voucher_error": voucher_error or []
        }
    except Exception as e:
        logger.error(f"Failed [check_shipping_fee]: {e}")
        raise e

async def check_order(item: ItemOrderInReq, user_id: str):
    try:
        order_id = generate_id("ORDER")
        tracking_id = f"{generate_id('TRACKING')}_V{1:03}"

        product_items, product_price, weight, out_of_stock, out_of_date = await process_order_products(item.product)

        voucher_items, voucher_error = await process_order_voucher(
            item.voucher_order_id, item.voucher_delivery_id, user_id
        )

        if out_of_stock or out_of_date or voucher_error:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Một số sản phẩm hoặc voucher không khả dụng, vui lòng làm mới lại trang",
                data={
                    "out_of_stock": out_of_stock,
                    "out_of_date": out_of_date,
                    "voucher_error": voucher_error
                }
            )

        fee_data = await check_shipping_fee(
            product_items=product_items,
            receiver_province_code=item.receiver_province_code,
            receiver_district_code=item.receiver_district_code,
            receiver_commune_code=item.receiver_commune_code,
            product_price=product_price,
            weight=weight,
            voucher=voucher_items,
            voucher_error=voucher_error
        )
        logger.info(f"Fee data: {fee_data}")

        if not await save_order_to_redis(item, order_id, tracking_id, user_id, fee_data, product_items, voucher_items):
            return response.BaseResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Không thể lưu đơn hàng"
            )

        qr_code = None
        if item.payment_type and item.payment_type != PAYMENT_COD:
            qr_code = await generate_qr_code(order_id, fee_data["estimated_total_fee"], item.payment_type)
            if not qr_code:
                return response.BaseResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message="Không thể tạo QR thanh toán"
                )

        if item.payment_type == PAYMENT_COD:
            await add_order(OrderRequest(order_id=order_id))

        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            status="success",
            message="Đơn hàng đã được tạo",
            data={"order_id": order_id, "qr_code": qr_code} if qr_code else {"order_id": order_id}
        )

    except Exception as e:
        logger.error(f"Failed [check_order]: {e}")
        raise e

async def remove_item_cart_by_order(orders: ItemOrderReq, identifier: str):
    try:
        try:
            user_info = ItemUserRes.from_mongo(await get_by_id(ObjectId(identifier)))
        except (InvalidId, TypeError):
            user_info = None
        logger.info(f"user_info: {user_info}")
        if user_info:
            for product in orders.product:
                logger.info(f"product: {product}")
                await remove_product_from_cart(user_info.id, product.product_id, product.price_id)
            return True
        else:
            for product in orders.product:
                remove_cart_item(identifier, f"{product.product_id}_{product.price_id}")
            return True
    except Exception as e:
        logger.error(f"Failed [remove_item_cart_by_order]: {e}")
        return False

async def generate_qr_code(order_id: str, total_price: float, payment_type: str) -> Optional[str]:
    try:
        qr_payload = {
            "bank_id": BANK_IDS.get(payment_type),
            "order_id": order_id,
            "amount": total_price
        }

        async with httpx.AsyncClient() as client:
            qr_response = await client.post(
                f"{PAYMENT_API_URL}/api/v1/payment/qr",
                headers={"accept": "application/json", "Content-Type": "application/json"},
                json=qr_payload
            )

        if qr_response.status_code == 200:
            return base64.b64encode(qr_response.content).decode("utf-8")

        logger.error(f"Failed to generate QR: {qr_response.text}")
        return None

    except Exception as e:
        logger.error(f"Error generating QR code: {e}")
        return None

async def save_order_to_redis(
        item: ItemOrderInReq,
        order_id: str,
        tracking_id: str,
        user_id: str,
        fee_data: dict,
        product_items: List[ItemProductReq],
        voucher_items: Optional[List[ItemVoucherReq]] = None
    ):
    try:
        item_data = ItemOrderReq(
            **item.model_dump(exclude={"product"}),
            product=product_items,
            voucher=voucher_items or [],
            order_id=order_id,
            tracking_id=tracking_id,
            status="created",
            created_by=user_id,
            delivery_time=fee_data["delivery_time"],
            shipping_fee=fee_data["shipping_fee"],
            product_fee=fee_data["product_fee"],
            basic_total_fee=fee_data["basic_total_fee"],
            estimated_total_fee=fee_data["estimated_total_fee"],
            voucher_order_discount=fee_data["voucher_order_discount"],
            voucher_delivery_discount=fee_data["voucher_delivery_discount"],
            weight=fee_data["weight"],
            pick_from=WAREHOUSE_ADDRESS,
            sender_province_code=SENDER_PROVINCE_CODE,
            sender_district_code=SENDER_DISTRICT_CODE,
            sender_commune_code=SENDER_COMMUNE_CODE,
        )
        logger.info("item", json=item_data)

        redis.save_order(item_data)
        return True
    except Exception as e:
        logger.error(f"Failed [save_order_to_redis]: {e}")
        return False

async def add_order(item: OrderRequest):
    try:
        order_data = redis.get_order(item.order_id)
        if not order_data:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy thông tin đơn hàng"
            )

        order_dict = json.loads(order_data)
        logger.info(order_dict)

        order_json = json.dumps(order_dict, ensure_ascii=False)

        rabbitmq.send_message(get_create_order_queue(), order_json)

        order_item = ItemOrderReq(**order_dict)

        user_name = "Khách lẻ"
        try:
            user_info = ItemUserRes.from_mongo(await get_by_id(ObjectId(order_item.created_by)))
            user_name = user_info.user_name
        except (InvalidId, TypeError):
            logger.error(f"User not found: {order_item.created_by}")

        pdf_bytes = export_invoice_to_pdf(order_item, user_name)
        if not pdf_bytes:
            raise response.JsonException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Không thể tạo file PDF"
            )

        # send_invoice_email(order_item.pick_to.email, pdf_bytes, order_item.order_id)

        return item.order_id
    except Exception as e:
        logger.error(f"Failed [add_order]: {e}")
        raise e

async def update_status_order(item: ItemUpdateStatusReq):
    try:
        order_info = await get_order_by_id(item.order_id)
        if not order_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy thông tin đơn hàng"
            )
        order_dict = item.dict()
        logger.info(order_dict)
        order_json = json.dumps(order_dict, ensure_ascii=False)

        rabbitmq.send_message(get_update_status_queue(), order_json)

        return item.order_id
    except Exception as e:
        logger.error(f"Failed [update_status_order]: {e}")
        raise e

async def get_order_by_user(user_id: str):
    try:
        collection = database.db[collection_name]
        order_list = collection.find({"created_by": user_id})
        logger.info(f"Order list: {order_list}")

        return [ItemOrderRes.from_mongo(order) for order in order_list]
    except Exception as e:
        logger.error(f"Failed [get_order_by_user]: {e}")
        raise e

async def get_order_by_id(order_id: str):
    try:
        collection = database.db[collection_name]
        order = collection.find_one({"order_id": order_id})

        if not order:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy đơn hàng"
            )

        return ItemOrderRes.from_mongo(order)

    except Exception as e:
        logger.error(f"Failed [get_order_by_id]: {e}")
        raise e


async def cancel_order(order_id: str):
    try:
        order = await get_order_by_id(order_id)
        if not order:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy đơn hàng"
            )
        if order.status != "created":
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không thể hủy đơn hàng"
            )

        collection = database.db[collection_name]
        update_result = collection.update_one(
            {"order_id": order_id},
            {"$set": {"status": "canceled"}}
        )

        if update_result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Hủy đơn hàng thất bại"
            )

        for product in order.product:
            await restore_product_sell(product.product_id, product.price_id, product.quantity)

        for voucher in order.voucher:
            await restore_voucher(voucher.voucher_id, order.created_by)
        logger.info(f"Đã hủy đơn hàng: {order_id}")
        return response.SuccessResponse(message="Hủy đơn hàng thành công")

    except Exception as e:
        logger.error(f"Failed [cancel_order]: {e}")
        raise e

async def get_order_invoice(order_id: str):
    try:
        order = await get_order_by_id(order_id)
        if not order:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy đơn hàng"
            )

        user_name = "Khách lẻ"
        try:
            user_info = ItemUserRes.from_mongo(await get_by_id(ObjectId(order.created_by)))
            user_name = user_info.user_name
        except (InvalidId, TypeError):
            logger.error(f"User not found: {order.created_by}")

        pdf_bytes = export_invoice_to_pdf(order, user_name)
        if not pdf_bytes:
            raise response.JsonException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Không thể tạo file PDF"
            )

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{order_id}.pdf"'
            }
        )
    except Exception as e:
        logger.error(f"Failed [get_order_invoice]: {e}")
        raise e

async def request_order_prescription(item: ItemOrderForPTInReq, user_id: str, images):
    try:
        product_items = []
        if item.product:
            if item.product.product:
                product_items, _, _, out_of_stock, out_of_date = await process_order_products(item.product.product)
                if out_of_stock or out_of_date:
                    return response.BaseResponse(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        message="Một số sản phẩm không khả dụng, vui lòng làm mới lại trang",
                        data={
                            "out_of_stock": out_of_stock,
                            "out_of_date": out_of_date
                        }
                    )

        request_sku = generate_id("REQUEST")
        image_list = []

        for img in images:
            try:
                await img.seek(0)
                json_image = await create_image_json_payload(img)
                await img.seek(0)
                file_url = await upload_file(img, "images_orders")

                data_queue = json.dumps({
                    "request_id": request_sku,
                    **json_image
                })

                rabbitmq.send_message(get_extract_document_queue(), data_queue)
                logger.info(f"Sent to extract document queue: {request_sku}")
                if file_url:
                    image_obj = ItemOrderImageReq(
                        images_id=generate_id("IMAGES_ORDERS"),
                        images_url=file_url,
                    )
                    image_list.append(image_obj)
            except Exception as e:
                logger.error(f"Failed to upload image: {e}")

        logger.info(f"{image_list}")

        order_request = ItemOrderForPTReq(
            **item.model_dump(exclude={"product"}),
            request_id=request_sku,
            product=product_items,
            created_by=user_id,
            images=image_list
        )

        logger.info(f"order_request: {order_request}")

        collection = database.db[request_collection_name]
        collection.insert_one(order_request.dict())


        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            status="success",
            message="Yêu cầu đã được tạo",
        )
    except Exception as e:
        logger.error(f"Failed [request_order_prescription]: {e}")
        raise e

async def get_approve_order(email: str, page: int, page_size: int, status: str = None):
    try:
        collection = database.db[request_collection_name]
        skip_count = (page - 1) * page_size

        query = {
            "verified_by": {"$in": [None, "", email]}
        }

        if status == "approved" or status == "rejected" or status == "uncontacted":
            query["status"] = status
            query["verified_by"] = email
        elif status == "pending":
            query["verified_by"] = {"$in": [None, ""]}
        else:
            query["verified_by"] = {"$in": [None, "", email]}

        order_iist = collection.find(query).skip(skip_count).limit(page_size)

        return {
            "total_orders": collection.count_documents(query),
            "orders": (ItemOrderForPTRes(**order) for order in order_iist)
        }
    except Exception as e:
        logger.error(f"Failed [get_approve_order]: {e}")
        raise e

async def get_requested_order(user_id: str):
    try:
        collection = database.db[request_collection_name]
        order_list = collection.find({"created_by": user_id})
        return (ItemOrderForPTRes(**order) for order in order_list)
    except Exception as e:
        logger.error(f"Failed [get_requested_order]: {e}")
        raise e

async def approve_order(item: ItemOrderApproveReq, pharmacist: ItemPharmacistRes):
    try:
        collection = database.db[request_collection_name]
        order_request = collection.find_one({"request_id": item.request_id})
        if not order_request:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy yêu cầu"
            )
        order_request = ItemOrderForPTRes(**order_request)

        if order_request.status in ["approved", "rejected"]:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Yêu cầu này đã duyệt"
            )

        if order_request.verified_by and order_request.verified_by != pharmacist.email:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có quyền duyệt yêu cầu này"
            )

        if item.status not in ["approved", "rejected", "uncontacted"]:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Trang thái không hợp lệ"
            )

        if not item.product:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy sản phẩm"
            )

        product_items, _, _, out_of_stock, out_of_date = await process_order_products(item.product)

        if out_of_stock or out_of_date:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Một số sản phẩm không khả dụng, vui lòng làm mới lại trang",
                data={
                    "out_of_stock": out_of_stock,
                    "out_of_date": out_of_date
                }
            )

        collection.update_one(
            {"request_id": item.request_id},
            {
                "$set": {
                    "status": item.status,
                    "note": item.note,
                    "verified_by": pharmacist.email,
                    "pharmacist_name": pharmacist.user_name
                }
            }
        )

        if item.status == "approved":
            order_data = ItemOrderInReq(
                product=item.product,
                pick_to=InfoAddressOrderReq(**order_request.pick_to.dict()),
                receiver_province_code=order_request.receiver_province_code,
                receiver_district_code=order_request.receiver_district_code,
                receiver_commune_code=order_request.receiver_commune_code,
                payment_type="COD",
                delivery_instruction=item.note
            )

            return await check_order(order_data, user_id=order_request.created_by)

        return response.SuccessResponse(message="Duyệt yêu cầu thành công")

    except Exception as e:
        logger.error(f"Failed [approve_order]: {e}")
        raise e

async def check_fee_approve_order(item: ItemOrderApproveReq, pharmacist: ItemPharmacistRes):
    try:
        collection = database.db[request_collection_name]
        order_request = collection.find_one({"request_id": item.request_id})
        if not order_request:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy yêu cầu"
            )
        order_request = ItemOrderForPTRes(**order_request)


        if not item.product:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy sản phẩm"
            )
        product_items, total_price, weight, out_of_stock, out_of_date = await process_order_products(item.product)

        if out_of_stock or out_of_date:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Một số sản phẩm không khả dụng, vui lòng làm mới lại trang",
                data={
                    "out_of_stock": out_of_stock,
                    "out_of_date": out_of_date
                }
            )

        voucher_list_all = await get_all_vouchers_for_users()

        now = get_current_time()
        valid_vouchers = [
            v for v in voucher_list_all
            if v.used < v.inventory
               and v.expired_date > now
               and order_request.created_by not in v.used_by
        ]

        shipping_fee, delivery_time = await get_shipping_fee(
            product_items=product_items,
            receiver_province_code=order_request.receiver_province_code,
            receiver_district_code=order_request.receiver_district_code,
            receiver_commune_code=order_request.receiver_commune_code,
            product_price=total_price,
            weight=weight
        )
        logger.info(f"shipping_fee: {shipping_fee}, delivery_time: {delivery_time}")

        order_voucher = next((v for v in valid_vouchers if v.voucher_type == "order" and v.max_discount_value <= total_price), None)
        delivery_voucher = next((v for v in valid_vouchers if v.voucher_type == "delivery" and v.max_discount_value <= shipping_fee), None)

        order_voucher_id = order_voucher.voucher_id if order_voucher else None
        delivery_voucher_id = delivery_voucher.voucher_id if delivery_voucher else None

        voucher_list, voucher_error = await process_order_voucher(order_voucher_id, delivery_voucher_id, order_request.created_by)
        return await check_shipping_fee(
            product_items=product_items,
            receiver_province_code=order_request.receiver_province_code,
            receiver_district_code=order_request.receiver_district_code,
            receiver_commune_code=order_request.receiver_commune_code,
            product_price=total_price,
            weight=weight,
            voucher=voucher_list,
            voucher_error=voucher_error,
            shipping_fee=shipping_fee,
            delivery_time=delivery_time
        )

    except Exception as e:
        logger.error(f"Failed [check_fee_approve_order]: {e}")
        raise e

async def reset_dev_system():
    order_result = database.db[collection_name].delete_many({})
    logger.info(f"Deleted {order_result.deleted_count} orders")

    product_result = database.db["products"].update_many(
        {},
        {
            "$set": {
                "prices.$[].sell": 0,
                "prices.$[].delivery": 0
            }
        }
    )
    logger.info(f"Updated {product_result.modified_count} products in MongoDB")

    inventory_result = database.db["products_inventory"].update_many(
        {},
        {
            "$set": {
                "sell": 0,
                "delivery": 0
            }
        }
    )
    logger.info(f"Updated {inventory_result.modified_count} products in Redis")

    return {
        "orders_deleted": order_result.deleted_count,
        "products_updated": product_result.modified_count,
        "inventory_updated": inventory_result.modified_count
    }

async def get_order_overview_statistics():
    try:
        collection = database.db[collection_name]

        now = get_current_time()
        start_of_day = datetime(now.year, now.month, now.day)
        end_of_day = start_of_day + timedelta(days=1)

        pipeline = [
            {
                "$match": {
                    "created_date": {
                        "$gte": start_of_day,
                        "$lt": end_of_day
                    }
                }
            },
            {
                "$facet": {
                    "total_orders": [{"$count": "count"}],
                    "total_revenue": [
                        {"$match": {"payment_status": "PAID"}},
                        {
                            "$group": {
                                "_id": None,
                                "total": {"$sum": "$estimated_total_fee"}
                            }
                        }
                    ],
                    "total_customers": [
                        {
                            "$group": {"_id": "$created_by"}
                        },
                        {"$count": "count"}
                    ],
                    "total_products_sold": [
                        {"$match": {"status": {"$nin": ["canceled", "returned"]}}},
                        {"$unwind": "$product"},
                        {
                            "$group": {
                                "_id": None,
                                "total": {"$sum": "$product.quantity"}
                            }
                        }
                    ]
                }
            }
        ]

        result = collection.aggregate(pipeline).to_list(length=1)
        if not result:
            return {
                "total_orders": 0,
                "total_revenue": 0,
                "total_customers": 0,
                "total_products_sold": 0
            }

        data = result[0]

        return {
            "total_orders": data["total_orders"][0]["count"] if data["total_orders"] else 0,
            "total_revenue": data["total_revenue"][0]["total"] if data["total_revenue"] else 0,
            "total_customers": data["total_customers"][0]["count"] if data["total_customers"] else 0,
            "total_products_sold": data["total_products_sold"][0]["total"] if data["total_products_sold"] else 0
        }

    except Exception as e:
        logger.error(f"Failed [get_order_statistics]: {e}")
        raise e

async def get_monthly_revenue(year: int):
    try:
        collection = database.db[collection_name]
        monthly_revenue = []

        for month in range(1, 13):
            start_date = datetime(year, month, 1)
            end_day = monthrange(year, month)[1]
            end_date = datetime(year, month, end_day, 23, 59, 59)

            pipeline = [
                {
                    "$match": {
                        "created_date": {
                            "$gte": start_date,
                            "$lte": end_date
                        },
                        "payment_status": "PAID"
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "total": {"$sum": "$estimated_total_fee"}
                    }
                }
            ]

            result = collection.aggregate(pipeline).to_list(length=1)
            revenue = result[0]["total"] if result else 0
            monthly_revenue.append(revenue)

        return monthly_revenue

    except Exception as e:
        logger.error(f"Failed [get_monthly_revenue]: {e}")
        raise e

async def get_category_monthly_revenue(month: int, year: int):
    try:
        collection = database.db[collection_name]

        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        pipeline = [
            {
                "$match": {
                    "created_date": {
                        "$gte": start_date,
                        "$lt": end_date
                    },
                    "payment_status": "PAID"
                }
            },
            {"$unwind": "$product"},
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product.product_id",
                    "foreignField": "product_id",
                    "as": "product_info"
                }
            },
            {"$unwind": "$product_info"},
            {
                "$addFields": {
                    "matched_price": {
                        "$first": {
                            "$filter": {
                                "input": "$product_info.prices",
                                "as": "item",
                                "cond": {
                                    "$eq": ["$$item.price_id", "$product.price_id"]
                                }
                            }
                        }
                    }
                }
            },
            {
                "$addFields": {
                    "revenue": {
                        "$multiply": ["$matched_price.price", "$product.quantity"]
                    }
                }
            },
            {
                "$addFields": {
                    "category_group": {
                        "$switch": {
                            "branches": [
                                {
                                    "case": {"$eq": ["$product_info.category.main_category_id", "MAIN9X41742425621"]},
                                    "then": {"id": "thuc_pham_chuc_nang", "name": "Thực phẩm chức năng"}
                                },
                                {
                                    "case": {"$eq": ["$product_info.category.main_category_id", "MAINWQL1742427875"]},
                                    "then": {"id": "duoc_my_pham", "name": "Dược mỹ phẩm"}
                                },
                                {
                                    "case": {
                                        "$and": [
                                            {"$eq": ["$product_info.category.main_category_id", "MAINI5T1742429250"]},
                                            {"$eq": ["$product_info.prescription_required", True]}
                                        ]
                                    },
                                    "then": {"id": "thuoc_ke_don", "name": "Thuốc kê đơn"}
                                },
                                {
                                    "case": {
                                        "$and": [
                                            {"$eq": ["$product_info.category.main_category_id", "MAINI5T1742429250"]},
                                            {"$eq": ["$product_info.prescription_required", False]}
                                        ]
                                    },
                                    "then": {"id": "thuoc_khong_ke_don", "name": "Thuốc không kê đơn"}
                                },
                                {
                                    "case": {"$eq": ["$product_info.category.main_category_id", "MAINYXM1742430328"]},
                                    "then": {"id": "cham_soc_ca_nhan", "name": "Chăm sóc cá nhân"}
                                },
                                {
                                    "case": {"$eq": ["$product_info.category.main_category_id", "MAINSGU1742431170"]},
                                    "then": {"id": "thiet_bi_y_te", "name": "Thiết bị y tế"}
                                },
                                {
                                    "case": {"$eq": ["$product_info.category.main_category_id", "MAINC9H1742431707"]},
                                    "then": {"id": "me_va_be", "name": "Mẹ và bé"}
                                }
                            ],
                            "default": {"id": "khac", "name": "Khác"}
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": "$category_group",
                    "revenue": {"$sum": "$revenue"}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "category_id": "$_id.id",
                    "category_name": "$_id.name",
                    "revenue": 1
                }
            }
        ]

        data = collection.aggregate(pipeline).to_list(length=None)
        default_categories = {
            "thuc_pham_chuc_nang": "Thực phẩm chức năng",
            "duoc_my_pham": "Dược mỹ phẩm",
            "thuoc_ke_don": "Thuốc kê đơn",
            "thuoc_khong_ke_don": "Thuốc không kê đơn",
            "cham_soc_ca_nhan": "Chăm sốc cá nhân",
            "thiet_bi_y_te": "Thiết bị y tế",
            "me_va_be": "Mẹ và bé",
            "khac": "Khác"
        }

        result = []
        data_map = {d["category_id"]: d for d in data}

        for cat_id, cat_name in default_categories.items():
            result.append({
                "category_id": cat_id,
                "category_name": cat_name,
                "revenue": data_map.get(cat_id, {}).get("revenue", 0)
            })

        return result

    except Exception as e:
        logger.error(f"Failed [get_category_monthly_revenue]: {e}")
        raise e

async def get_payment_type_monthly_revenue(month: int, year: int):
    try:
        collection = database.db[collection_name]

        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        pipeline = [
            {
                "$match": {
                    "created_date": {
                        "$gte": start_date,
                        "$lt": end_date
                    },
                    "payment_status": "PAID",
                }
            },
            {
                "$group": {
                    "_id": "$payment_type",
                    "total_revenue": {"$sum": "$estimated_total_fee"}
                }
            },
        ]

        result = collection.aggregate(pipeline).to_list(length=None)

        revenue_cod = 0
        revenue_bank = 0

        for item in result:
            if item["_id"] == "COD":
                revenue_cod = item["total_revenue"]
            else:
                revenue_bank = item["total_revenue"]

        return {
            "revenue_cod": revenue_cod,
            "revenue_bank": revenue_bank,
            "revenue_all": revenue_cod + revenue_bank
        }

    except Exception as e:
        logger.error(f"Failed [get_category_monthly_revenue]: {e}")
        raise e

async def get_sold_quantity_by_month(year: int):
    try:
        collection = database.db[collection_name]

        start_date = datetime(year, 1, 1)
        end_date = datetime(year + 1, 1, 1)

        pipeline = [
            {
                "$match": {
                    "created_date": {
                        "$gte": start_date,
                        "$lt": end_date
                    },
                    "status": "delivery_success"
                }
            },
            { "$unwind": "$product" },
            {
                "$group": {
                    "_id": { "month": { "$month": "$created_date" } },
                    "total_quantity": { "$sum": "$product.quantity" }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "month": "$_id.month",
                    "total_quantity": 1
                }
            }
        ]

        result = collection.aggregate(pipeline).to_list(length=12)

        monthly_quantities = [0] * 12

        for item in result:
            month_index = item["month"] - 1    
            monthly_quantities[month_index] = item["total_quantity"]

        return monthly_quantities

    except Exception as e:
        logger.error(f"Failed [get_sold_quantity_by_month]: {e}")
        raise e

async def get_top_selling_products_by_month(month: int, year: int, top_n: int = 10):
    try:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        pipeline = [
            {
                "$match": {
                    "payment_status": "PAID",
                    "created_date": {
                        "$gte": start_date,
                        "$lt": end_date
                    }
                }
            },
            { "$unwind": "$product" },
            {
                "$group": {
                    "_id": {
                        "product_id": "$product.product_id",
                        "product_name": "$product.product_name",
                        "images_primary": "$product.images_primary",
                    },
                    "total_quantity": { "$sum": "$product.quantity" }
                }
            },
            {
                "$sort": { "total_quantity": -1 }
            },
            {
                "$limit": top_n
            },
            {
                "$project": {
                    "product_id": "$_id.product_id",
                    "product_name": "$_id.product_name",
                    "images_primary": "$_id.images_primary",
                    "total_quantity": 1,
                    "_id": 0
                }
            }
        ]

        result = database.db[collection_name].aggregate(pipeline).to_list(length=top_n)
        return result

    except Exception as e:
        logger.error(f"Error in get_top_selling_products_by_month: {e}")
        raise e

async def get_monthly_order_counts(year: int):
    try:
        pipeline = [
            {
                "$match": {
                    "created_date": {
                        "$gte": datetime(year, 1, 1),
                        "$lt": datetime(year + 1, 1, 1)
                    }
                }
            },
            {
                "$group": {
                    "_id": { "$month": "$created_date" },
                    "count": { "$sum": 1 }
                }
            }
        ]

        collection = database.db[collection_name]
        results = collection.aggregate(pipeline).to_list(length=12)

        monthly_counts = [0] * 12

        for result in results:
            monthly_counts[result["_id"] - 1] = result["count"]

        return monthly_counts
    except Exception as e:
        logger.error(f"Failed [get_monthly_order_counts]: {e}")
        raise e

def create_order_ghn(item: ShippingOrderGHN):
    try:
        create_req = ghn.send_request_post(
            function="/shiip/public-api/v2/shipping-order/create",
            isPro=False,
            payload=item.dict()
        )
        logger.info(create_req)
        return create_req if create_req else None
    except Exception as e:
        logger.error(f"Error creating GHN order: {e}")
        return None