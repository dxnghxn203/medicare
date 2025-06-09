from typing import Optional, List

from fastapi import APIRouter, status, UploadFile, File, Depends
from pyfa_converter_v2 import BodyDepends

from app.core import logger, response
from app.core.response import JsonException, SuccessResponse
from app.core.s3 import upload_any_file
from app.entities.product.request import ItemProductDBInReq, UpdateCategoryReq, ApproveProductReq, \
    UpdateProductStatusReq, ItemUpdateProductReq
from app.helpers.redis import get_session, get_recently_viewed, save_recently_viewed, save_session
from app.middleware import middleware
from app.models import order, pharmacist, user, admin
from app.models.product import (get_product_by_slug, add_product_db, get_all_product, update_product_category, \
                                delete_product,
                                get_product_top_selling,
                                get_product_featured,
                                get_product_by_list_id,
                                get_related_product, \
                                get_product_best_deals,
                                approve_product, get_approved_product, update_product_status, update_product_fields, \
                                update_product_images, update_product_images_primary, update_product_certificate_file,
                                search_products_by_name, \
                                import_products, get_product_brands, get_imported_products, delete_imported_products, \
                                get_discount_product, check_all_product_discount_expired, getAvailableQuantity, \
                                normalize_products_inventory, get_low_stock_products, get_discount_product_for_admin)

router = APIRouter()

@router.get("/products/top-selling", response_model=response.BaseResponse)
async def get_top_selling(top_n: int = 5):
    try:
        return await get_product_top_selling(top_n)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting top selling product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/featured", response_model=response.BaseResponse)
async def get_featured(main_category_id: str, sub_category_id: Optional[str] = None, child_category_id: Optional[str] = None, top_n: int = 5):
    try:
        return await get_product_featured(main_category_id, sub_category_id, child_category_id, top_n)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting featured product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/product/session/{slug}", response_model=response.BaseResponse)
async def get_product(slug: str, session_id: str = None):
    try:
        check = get_session(session_id)
        logger.info("check: "+str(check))
        product = await get_product_by_slug(slug)
        if not product:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )
        logger.info(f"check: {check}")
        cur_session = session_id if check else save_session()
        save_recently_viewed(cur_session, product.product_id, False)

        return response.BaseResponse(
            data={
            "product": product,
            "session_id": cur_session
        })

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/product/{slug}/", response_model=response.BaseResponse)
async def get_product(slug: str, token: str = Depends(middleware.verify_token)):
    try:
        us = await user.get_current(token)
        if not us:
            return response.BaseResponse(
                status="error",
                message="User not found",
                data=None
            )

        product = await get_product_by_slug(slug)

        if not product:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )
        save_recently_viewed(us.id,product.product_id, True)

        return response.BaseResponse(
            data={
                "product": product,
                "session_id": None
        })
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/product/add", response_model=response.BaseResponse)
async def add_product(item: ItemProductDBInReq = BodyDepends(ItemProductDBInReq),
                      images_primary: Optional[UploadFile] = File(None),
                      images: Optional[List[UploadFile]] = File(None),
                      certificate_file: Optional[UploadFile] = File(None),
                      token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        logger.info(f"item router: {item}")
        await add_product_db(item, images_primary, images, admin_info.email, certificate_file)
        return response.SuccessResponse(status="success", message="Thêm sản phẩm thành công")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/getAvailableQuantity", response_model=response.BaseResponse)
async def get_available_quantity(product_id: str, price_id: str):
    try:
        result = await getAvailableQuantity(product_id, price_id)
        return response.BaseResponse(
            message="Available quantity found",
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting available quantity", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.get("/products/all-product-admin", response_model=response.BaseResponse)
async def get_all_product_admin(
        page: int = 1, page_size: int = 10,
        low_stock_status: Optional[bool] = None,
        main_category: Optional[str] = None,
        best_seller: Optional[bool] = None,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await get_all_product(page, page_size, low_stock_status, main_category, best_seller)
        return response.BaseResponse(
            message="Tìm thấy sản phẩm",
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/discount", response_model=response.BaseResponse)
async def get_product_discount(page: int = 1, page_size: int = 10):
    try:
        data = await get_discount_product(page, page_size)
        return response.BaseResponse(
            message="Tìm thấy sản phẩm giảm giá",
            data=data
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting product discount", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/discount-admin", response_model=response.BaseResponse)
async def get_product_discount_for_admin(
        page: int = 1, page_size: int = 10, is_approved: bool = False,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        data = await get_discount_product_for_admin(page, page_size, is_approved)
        return response.BaseResponse(
            message="Tìm thấy sản phẩm giảm giá cho quản trị viên",
            data=data
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting product discount for admin", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/product/update_category", response_model=response.BaseResponse)
async def update_category_product(item: UpdateCategoryReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        return await update_product_category(item, admin_info.email)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error updating product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/popular", response_model=response.BaseResponse)
async def get_popular(top_n: int = 5):
    try:
        data = await order.get_popular_products(top_n)
        return response.BaseResponse(
            message="Popular products found",
            data=data
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting popular product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/product/delete", response_model=response.BaseResponse)
async def delete_product_id(product_id: str):
    try:
        return await delete_product(product_id)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error deleting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/get-relate/", response_model=response.BaseResponse)
async def get_relate_product(product_id: str, top_n: int = 5):
    try:
        return await get_related_product(product_id, top_n)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting relate products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/get-recently-viewed/{session}", response_model=response.BaseResponse)
async def get_recently_viewed_session(session: str):
    try:
        check = get_session(session)
        if not check:
            return response.BaseResponse(
                status="error",
                message="Session not found",
                data=None
            )
        data = get_recently_viewed(session)
        products = await get_product_by_list_id(data)
        return response.BaseResponse(
            message="Recently viewed products found",
            data=products
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting recently viewed products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/get-recently-viewed", response_model=response.BaseResponse)
async def get_recently_viewed_token(token: str = Depends(middleware.verify_token)):
    try:
        us = await user.get_current(token)
        if not us:
            return response.BaseResponse(
                status="error",
                message="User not found",
                data=None
            )
        logger.info(f"us: {us}")
        data = get_recently_viewed(us.id)
        logger.info(f"data: {data}")
        products = await get_product_by_list_id(data)
        logger.info(f"products: {products}")
        return response.BaseResponse(
            message="Recently viewed products found",
            data=products
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting recently viewed products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/best-deal", response_model=response.BaseResponse)
async def get_best_deals(top_n: int = 5):
    try:
        return await get_product_best_deals(top_n)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting best deals product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/products/upload", response_model=response.BaseResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        return response.SuccessResponse(
            data=upload_any_file(file, "certificates")
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error uploading product image", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/products/approve", response_model=response.BaseResponse)
async def pharmacist_approve_product(item: ApproveProductReq, token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )
        return await approve_product(item, pharmacist_info)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error approving product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/get-approve-product", response_model=response.BaseResponse)
async def pharmacist_get_product(
        page: int = 1, page_size: int = 10,
        keyword: Optional[str] = None,
        main_category: Optional[str] = None,
        prescription_required: Optional[bool] = None,
        status: Optional[str] = None,
        token: str = Depends(middleware.verify_token_pharmacist)):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        if not pharmacist_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dược sĩ không tồn tại."
            )
        return SuccessResponse(
            data=await get_approved_product(pharmacist_info.email, page, page_size, keyword,main_category, prescription_required, status)
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting approve product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/products/update-status", response_model=response.BaseResponse)
async def admin_update_product_status(item: UpdateProductStatusReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quan trị viên không tồn tại."
            )
        return await update_product_status(item, admin_info.email)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error updating product status", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/products/update-images", response_model=response.BaseResponse)
async def admin_update_images(
    product_id: str,
    files: Optional[List[UploadFile]] = File(None),
    token: str = Depends(middleware.verify_token_admin)
):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        return await update_product_images(product_id, files, admin_info.email)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error updating images", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/products/update-images-primary", response_model=response.BaseResponse)
async def admin_update_images_primary(
    product_id: str,
    file: UploadFile = File(...),
    token: str = Depends(middleware.verify_token_admin)
):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        return await update_product_images_primary(product_id, file, admin_info.email)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error updating images_primary", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/products/update-certificate-file", response_model=response.BaseResponse)
async def admin_update_certificate_file(
    product_id: str,
    file: UploadFile = File(...),
    token: str = Depends(middleware.verify_token_admin)
):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        return await update_product_certificate_file(product_id, file, admin_info.email)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error updating certificate_file", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.put("/products/update-product", response_model=response.BaseResponse)
async def admin_update_product(item: ItemUpdateProductReq,
                               token: str = Depends(middleware.verify_token_admin)
                               ):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        return await update_product_fields(item, admin_info.email)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error updating product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/search", response_model=response.BaseResponse)
async def search_product(query: str):
    try:
        result = await search_products_by_name(query)
        return response.SuccessResponse(
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error searching product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/get_all_brands", response_model=response.BaseResponse)
async def get_all_brands():
    try:
        result = await get_product_brands()
        return response.SuccessResponse(
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting all brands", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/products/import", response_model=response.BaseResponse)
async def admin_import_products(file: Optional[UploadFile] = File(None), token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        if not file:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="File is required"
            )
        await import_products(file, admin_info.email)
        return response.SuccessResponse(status="success", message="Import sản phẩm thành công")
    except JsonException as je:
        raise je
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/import", response_model=response.BaseResponse)
async def admin_get_imported_products(
        page: int = 1, page_size: int = 10,
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await get_imported_products(page, page_size)
        return response.SuccessResponse(
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting imported products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/products/import", response_model=response.BaseResponse)
async def admin_delete_imported_products(import_id: str):
    try:
        return await delete_imported_products(import_id)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error deleting imported products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/products/dev", response_model=response.BaseResponse)
async def dev():
    try:
        result = await normalize_products_inventory()
        return response.SuccessResponse(
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error dev products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/automatic", response_model=response.BaseResponse)
async def automatic():
    try:
        result = await check_all_product_discount_expired()
        return response.SuccessResponse(
            data=f"{result} products updated"
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error automatic", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/low-stock", response_model=response.BaseResponse)
async def get_product_low_stock(
        token: str = Depends(middleware.verify_token_admin)
):
    try:
        result = await get_low_stock_products()
        return response.BaseResponse(
            message="Tìm thấy sản sắp hết hàng",
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )