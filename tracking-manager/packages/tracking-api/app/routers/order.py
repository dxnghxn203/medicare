from fastapi import APIRouter, status, Depends, UploadFile, File
from pyfa_converter_v2 import BodyDepends
from starlette.responses import FileResponse
from typing import Optional, List

from app.core import logger, response
from app.entities.order.request import ItemOrderInReq, OrderRequest, ItemUpdateStatusReq, ItemOrderForPTInReq, \
    ItemOrderApproveReq
from app.helpers.constant import PAYMENT_COD
from app.middleware import middleware
from app.models import order, user, pharmacist
from app.models.order import request_collection_name

router = APIRouter()

@router.post("/order/check_shipping_fee", response_model=response.BaseResponse)
async def check_shipping_fee(item: ItemOrderInReq, session: str= None, token: str = Depends(middleware.verify_token_optional)):
    try:
        user_id = session
        is_session_user = True

        if token:
            user_info = await user.get_current(token)
            user_id = user_info.id
            is_session_user = False

        product_items, total_price, weight, out_of_stock, out_of_date = await order.process_order_products(item.product)
        if out_of_stock or out_of_date:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Một số sản phẩm không khả dụng, vui lòng làm mới lại trang",
                data={
                    "product_fee": 0,
                    "shipping_fee": 0,
                    "delivery_time": "",
                    "weight": 0,
                    "voucher_order_discount": 0,
                    "voucher_delivery_discount": 0,
                    "basic_total_fee": 0,
                    "estimated_total_fee": 0,
                    "out_of_stock": out_of_stock,
                    "out_of_date": out_of_date,
                    "voucher_error": []
                }
            )

        voucher_list, voucher_error = await order.process_order_voucher(item.voucher_order_id, item.voucher_delivery_id, user_id)

        return response.SuccessResponse(
            data=await order.check_shipping_fee(
                product_items,
                item.receiver_province_code or 0,
                item.receiver_district_code or 0,
                item.receiver_commune_code or 0,
                total_price,
                weight,
                voucher_list, voucher_error
            )
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error checking shipping fee {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/order/check", response_model=response.BaseResponse)
async def check_order(item: ItemOrderInReq, session: str= None, token: str = Depends(middleware.verify_token_optional)):
    try:
        user_id = session
        is_session_user = True

        if token:
            user_info = await user.get_current(token)
            user_id = user_info.id
            is_session_user = False

        return await order.check_order(item, user_id)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error checking order {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/order/add", response_model=response.BaseResponse)
async def add_order(item: OrderRequest):
    try:
        result = await order.add_order(item)
        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            status="created",
            message=f"order added successfully",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error adding order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
@router.get("/order/tracking", response_model=response.BaseResponse)
async def get_tracking_order(order_id: str, token: str = Depends(middleware.verify_token)):
    try:
        result = await order.get_tracking_order_by_order_id(order_id)
        return response.BaseResponse(
            message=f"order found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting tracking order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
@router.put("/order/update_status", response_model=response.BaseResponse)
async def update_status_order(item: ItemUpdateStatusReq):
    try:
        result = await order.update_status_order(item)
        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            status="created",
            message=f"status order updated successfully",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating status order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/order", response_model=response.BaseResponse)
async def get_order_by_user(token: str = Depends(middleware.verify_token)):
    try:
        user_info = await user.get_current(token)
        logger.info(f"user_info: {user_info}")
        result = await order.get_order_by_user(user_info.id)
        return response.BaseResponse(
            message=f"order found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting order by user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/all-orders-admin", response_model=response.BaseResponse)
async def get_all_order(page: int = 1, page_size: int = 10, status: Optional[str] = None,
                        token: str = Depends(middleware.verify_token_admin)):
    try:
        result = await order.get_all_order(page, page_size, status)
        return response.BaseResponse(
            message=f"orders found",
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/statistic-last-365-days", response_model=response.BaseResponse)
async def get_total_orders_last_365_days():
    try:
        total = await order.get_total_orders_last_365_days()
        new = await order.get_new_orders_last_365_days()
        cancel = await order.get_cancel_orders_last_365_days()
        completed = await order.get_completed_orders_last_365_days()
        return response.BaseResponse(
            message="Statistic orders in the last 365 days found",
            data={
                "total": total,
                "new": new,
                "cancel": cancel,
                "completed": completed
            }
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting total orders last 365 days: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/order/delete", response_model=response.BaseResponse)
async def cancel_order(order_id: str):
    try:
        return await order.cancel_order(order_id)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error cancelling order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/invoice", response_model=response.BaseResponse)
async def get_invoice(order_id: str):
    try:
        return await order.get_order_invoice(order_id)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting invoice: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/order/request-prescription", response_model=response.BaseResponse)
async def request_prescription(item: ItemOrderForPTInReq = BodyDepends(ItemOrderForPTInReq),
                               images: Optional[List[UploadFile]] = File(None),
                               token: str = Depends(middleware.verify_token)):
    try:
        user_info = await user.get_current(token)
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="User not found"
            )
        logger.info(f"item: {item}")
        return await order.request_order_prescription(item, user_info.id, images)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error requesting prescription: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/approve-prescription", response_model=response.BaseResponse)
async def get_approve_prescription(
        page: int = 1, page_size: int = 10, status: Optional[str] = None,
        token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại"
            )
        result = await order.get_approve_order(pharmacist_info.email, page, page_size, status)
        return response.SuccessResponse(
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting approve prescription: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/request-order", response_model=response.BaseResponse)
async def get_request_order(token: str = Depends(middleware.verify_token)):
    try:
        user_info = await user.get_current(token)
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="User not found"
            )
        result = await order.get_requested_order(user_info.id)
        return response.SuccessResponse(
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting request order: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/order/approve", response_model=response.BaseResponse)
async def approve_order(item: ItemOrderApproveReq, token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Pharmacist not found"
            )
        return await order.approve_order(item, pharmacist_info)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error accepting request prescription: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/order/approve-fee", response_model=response.BaseResponse)
async def check_fee_approve_order(item: ItemOrderApproveReq, token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Pharmacist not found"
            )
        result = await order.check_fee_approve_order(item, pharmacist_info)
        return response.SuccessResponse(
            data=result
        )
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error checking fee request prescription: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/order/reset-system", response_model=response.BaseResponse)
async def reset_system_api(token: str = Depends(middleware.verify_token_admin)):
    try:
        result = await order.reset_dev_system()
        return response.SuccessResponse(
            message="Đã reset hệ thống thành công",
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Lỗi reset hệ thống: {str(e)}"
        )

@router.get("/order/overview-statistics", response_model=response.BaseResponse)
async def get_overview_statistics(
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result =await order.get_order_overview_statistics()
        return response.SuccessResponse(
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/monthly-revenue-statistics", response_model=response.BaseResponse)
async def get_monthly_revenue(
        year: int,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result =await order.get_monthly_revenue(year)
        return response.SuccessResponse(
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.get("/order/category-monthly-revenue-statistics", response_model=response.BaseResponse)
async def get_category_monthly_revenue(
        month: int, year: int,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await order.get_category_monthly_revenue(month, year)
        return response.SuccessResponse(
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/type-monthly-revenue-statistics", response_model=response.BaseResponse)
async def get_type_monthly_revenue(
        month: int, year: int,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await order.get_payment_type_monthly_revenue(month, year)
        return response.SuccessResponse(
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/monthly-product-sold-statistics", response_model=response.BaseResponse)
async def get_monthly_product_sold(
        year: int,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await order.get_sold_quantity_by_month(year)
        return response.SuccessResponse(
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/monthly-top-selling-product-statistics", response_model=response.BaseResponse)
async def get_monthly_top_selling_product(
        month: int, year: int, top_n: int,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await order.get_top_selling_products_by_month(month, year, top_n)
        return response.SuccessResponse(
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/order/monthly-count-order-statistics", response_model=response.BaseResponse)
async def get_monthly_count_order(
        year: int,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await order.get_monthly_order_counts(year)
        return response.SuccessResponse(
            data=result
        )
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )