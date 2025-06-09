from fastapi import APIRouter, status, UploadFile, File, Depends
from app.core import logger, response
from app.core.response import JsonException
from app.entities.category.request import MainCategoryInReq, SubCategoryInReq, ChildCategoryInReq
from app.models import category, admin
from app.middleware import middleware
router = APIRouter()

@router.get("/category/", response_model=response.BaseResponse)
async def get_categories():
    try:
        data = await category.get_all_categories()
        return response.SuccessResponse(data=data)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all categories: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/category/child-category", response_model=response.BaseResponse)
async def get_list_child_category():
    try:
        data = await category.get_list_child_category()
        if not data:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Category not found"
            )
        return response.SuccessResponse(data=data)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting list child category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/category/{main_slug}", response_model=response.BaseResponse)
async def get_category(main_slug: str):
    try:
        data = await category.get_category_by_slug(main_slug)
        return response.SuccessResponse(data=data)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting category by slug: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/category/{main_slug}/sub-category/{sub_slug}", response_model=response.BaseResponse)
async def get_sub_category(main_slug: str, sub_slug: str):
    try:
        data = await category.get_sub_category(main_slug, sub_slug)
        return response.SuccessResponse(data=data)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/category/{main_slug}/sub-category/{sub_slug}/child-category/{child_slug}", response_model=response.BaseResponse)
async def get_child_category(main_slug: str, sub_slug: str, child_slug: str):
    try:
        data = await category.get_child_category(main_slug, sub_slug, child_slug)
        if not data:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Category not found"
            )
        return response.SuccessResponse(data=data)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/category/add", response_model=response.BaseResponse)
async def create_category(new_category: MainCategoryInReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        await category.add_category(new_category, admin_info.email)
        return response.SuccessResponse(message="Main-category added successfully")

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error adding category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/category/{main_slug}/sub-category/add", response_model=response.BaseResponse)
async def create_sub_category(main_slug: str, sub_category: SubCategoryInReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
        )
        await category.add_sub_category(main_slug, sub_category, admin_info.email)
        return response.SuccessResponse(message="Sub-category added successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error adding sub-category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/category/{main_slug}/sub-category/{sub_slug}/child-category/add", response_model=response.BaseResponse)
async def create_child_category(main_slug: str, sub_slug: str, child_category: ChildCategoryInReq,
                                token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        await category.add_child_category(main_slug, sub_slug, child_category, admin_info.email)
        return response.SuccessResponse(message="Child-category added successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error adding child category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/category/update/{main_category_id}", response_model=response.BaseResponse)
async def update_main_category(
    main_category_id: str,
    main_category_name: str = None,
    main_category_slug: str = None,
    token: str = Depends(middleware.verify_token_admin)
):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        await category.update_main_category(main_category_id, main_category_name, main_category_slug, admin_info.email)
        return response.SuccessResponse(message="Main category updated successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating main category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/category/sub-category/update/{sub_category_id}", response_model=response.BaseResponse)
async def update_sub_category(
    sub_category_id: str,
    sub_category_name: str = None,
    sub_category_slug: str = None,
    token: str = Depends(middleware.verify_token_admin)
):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        await category.update_sub_category(sub_category_id, sub_category_name, sub_category_slug, admin_info.email)
        return response.SuccessResponse(message="Sub-category updated successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating sub-category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/category/child-category/update/{child_category_id}", response_model=response.BaseResponse)
async def update_child_category(
    child_category_id: str,
    child_category_name: str = None,
    child_category_slug: str = None,
    token: str = Depends(middleware.verify_token_admin)
):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        await category.update_child_category(child_category_id, child_category_name, child_category_slug, admin_info.email)
        return response.SuccessResponse(message="Child-category updated successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating child-category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/category/sub-category/{sub_category_id}/update-image", response_model=response.BaseResponse)
async def update_sub_category_image(sub_category_id: str, image: UploadFile = File(...), token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        await category.update_sub_category_image(sub_category_id, image, admin_info.email)
        return response.SuccessResponse(message="Sub-category image updated successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating sub-category image: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.put("/category/child-category/{child_category_id}/update-image", response_model=response.BaseResponse)
async def update_child_category_image(child_category_id: str, image: UploadFile = File(...), token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quản trị viên không tồn tại."
            )
        await category.update_child_category_image(child_category_id, image, admin_info.email)

        return response.SuccessResponse(message="Child-category image updated successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating child-category image: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/category/update-default-image", response_model=response.BaseResponse)
async def update_default_image(image: UploadFile = File(...)):
    try:
        await category.update_all_categories_image(image)

        return response.BaseResponse(message="Default image updated for all categories")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error updating default image: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/categories/get-all-for-admin", response_model=response.BaseResponse)
async def get_all_categories_for_admin():
    try:
        data = await category.get_all_categories_admin()
        return response.SuccessResponse(data=data)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error getting all categories for admin: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/category/main/{main_category_id}")
async def delete_main_category(main_category_id: str):
    try:
        return await category.delete_main_category(main_category_id)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error deleting main category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/category/sub/{sub_category_id}")
async def delete_sub_category(sub_category_id: str):
    try:
        return await category.delete_sub_category(sub_category_id)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error deleting sub-category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/category/child/{child_category_id}")
async def delete_child_category(child_category_id: str):
    try:
        return await category.delete_child_category(child_category_id)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error deleting child-category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )