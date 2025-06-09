from typing import Optional, List

from fastapi import APIRouter, UploadFile, File, Depends
from pyfa_converter_v2 import BodyDepends

from app.core import response, logger
from app.entities.brand.request import ItemBrandRequestCreate, ItemBrandRequestUpdate
from app.middleware import middleware
from app.models.brand import create_brand, get_all_brands, get_brand_by_id, update_brand, delete_brand, \
    update_brand_logo

router = APIRouter()
@router.get("/brands/get-brands", response_model=response.BaseResponse)
async def get_all_brands_api():
    try:
        brands = await get_all_brands()
        return response.BaseResponse(data=brands)
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error", data=str(e))

@router.get("/brands/get-brands-admin", response_model=response.BaseResponse)
async def get_all_brands_admin_api(token: str = Depends(middleware.verify_token_admin)):
    try:
        brands = await get_all_brands()
        if not brands:
            return response.BaseResponse(status_code=404, message="No brands found")
        return response.BaseResponse(data=brands)
    except Exception as e:
        logger.error(f"Error fetching brands: {e}")
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.get("/brands/{brand_id}", response_model=response.BaseResponse)
async def get_brand_by_id_api(brand_id: str):
    try:
        brand = await get_brand_by_id(brand_id)
        if not brand:
            return response.BaseResponse(status_code=404, message="Brand not found")
        return response.BaseResponse(data=brand)
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.post("/brands/add", response_model=response.BaseResponse)
async def create_brand_api(
        brand_data: ItemBrandRequestCreate = BodyDepends(ItemBrandRequestCreate),
        logo: Optional[UploadFile] = File(None),
token: str = Depends(middleware.verify_token_admin)):
    try:
        brand_id = await create_brand(brand_data, logo)
        if not brand_id:
            return response.BaseResponse(status_code=500, message="Failed to create brand")
        return response.BaseResponse()
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.put("/brands/update", response_model=response.BaseResponse)
async def update_brand_api(
        brand_data: ItemBrandRequestUpdate = BodyDepends(ItemBrandRequestUpdate),
token: str = Depends(middleware.verify_token_admin)):
    try:
        updated = await update_brand(brand_data)
        if not updated:
            return response.BaseResponse(status_code=500, message="Failed to update brand")
        return response.BaseResponse(data={"brand_id": brand_data.brand_id})
    except Exception as e:
        logger.error(f"Error updating brand444: {e}")
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.put("/brands/update-logo", response_model=response.BaseResponse)
async def update_brand_logo_api(
        brand_id: str,
        logo: UploadFile = File(...),
token: str = Depends(middleware.verify_token_admin)):
    try:
        updated = await update_brand_logo(brand_id, logo)
        if not updated:
            return response.BaseResponse(status_code=500, message="Failed to update brand logo")
        return response.BaseResponse(data={"brand_id": brand_id})
    except Exception as e:
        logger.error(f"Error updating brand444: {e}")
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.delete("/brands/delete/{brand_id}", response_model=response.BaseResponse)
async def delete_brand_api(brand_id: str,
                           token: str = Depends(middleware.verify_token_admin)):
    try:
        deleted = await delete_brand(brand_id)
        if not deleted:
            return response.BaseResponse(status_code=404, message="Brand not found")
        return response.BaseResponse(data={"brand_id": brand_id})
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")


