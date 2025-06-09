from fastapi import APIRouter, Query, Path, BackgroundTasks
from typing import Optional
from services.recommendation import (
    get_top_selling_products,
    get_related_products,
    get_best_deals,
    get_featured_products,
    refresh_recommendations
)
from core import response

router = APIRouter()

@router.get("/top-selling/", response_model=response.BaseResponse)
async def top_selling(
    top_n: int = Query(10, ge=1, le=50, description="Số lượng sản phẩm trả về"),
    time_window: int = Query(30, ge=1, le=365, description="Khoảng thời gian (ngày)")
):
    """
    Lấy danh sách sản phẩm bán chạy nhất
    """
    try:
        return response.BaseResponse(
            data=await get_top_selling_products(limit=top_n, time_window_days=time_window),
            message="Lấy danh sách sản phẩm bán chạy thành công"
        )
    except Exception as e:
        return response.BaseResponse(
            data=None,
            message="Lỗi khi lấy danh sách sản phẩm bán chạy",
            status_code=500,
        )

@router.get("/related/{product_id}", response_model=response.BaseResponse)
async def related(
    product_id: str = Path(..., description="ID của sản phẩm"),
    top_n: int = Query(10, ge=1, le=50, description="Số lượng sản phẩm trả về")
):
    """
    Lấy danh sách sản phẩm liên quan đến một sản phẩm cụ thể
    """
    try:
        return response.BaseResponse(
            data=await get_related_products(product_id=product_id, limit=top_n),
            message="Lấy danh sách sản phẩm liên quan thành công"
        )
    except Exception as e:
        return response.BaseResponse(
            data=None,
            message="Lỗi khi lấy danh sách sản phẩm liên quan",
            status_code=500,
        )

@router.get("/deals/", response_model=response.BaseResponse)
async def deals(
    user_id: Optional[str] = Query(None, description="ID của người dùng (nếu đã đăng nhập)"),
    top_n: int = Query(10, ge=1, le=50, description="Số lượng sản phẩm trả về")
):
    """
    Lấy danh sách deals tốt nhất cho người dùng
    """
    try:
        return response.BaseResponse(
            data=await get_best_deals(user_id=user_id, limit=top_n),
            message="Lấy danh sách deals tốt nhất thành công"
        )
    except Exception as e:
        return response.BaseResponse(
            data=None,
            message="Lỗi khi lấy danh sách deals tốt nhất",
            status_code=500,
        )

@router.get("/featured/", response_model=response.BaseResponse)
async def featured(
    user_id: Optional[str] = Query(None, description="ID của người dùng (nếu đã đăng nhập)"),
    top_n: int = Query(10, ge=1, le=50, description="Số lượng sản phẩm trả về")
):
    """
    Lấy danh sách sản phẩm nổi bật
    """
    try:
        return response.BaseResponse(
            data=await get_featured_products(user_id=user_id, limit=top_n),
            message="Lấy danh sách sản phẩm nổi bật thành công"
        )
    except Exception as e:
        return response.BaseResponse(
            data=None,
            message="Lỗi khi lấy danh sách sản phẩm nổi bật",
            status_code=500,
        )

@router.post("/refresh", status_code=202)
async def refresh_all_recommendations(background_tasks: BackgroundTasks):
    """
    Làm mới tất cả các khuyến nghị (xóa cache và tính toán lại)
    """
    background_tasks.add_task(refresh_recommendations)
    return {"message": "Recommendation refresh initiated in background"}