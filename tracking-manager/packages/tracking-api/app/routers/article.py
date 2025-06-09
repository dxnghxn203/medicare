from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form
from pyfa_converter_v2 import BodyDepends

from app.core import response
from app.entities.article.request import ItemArticleRequestCreate, ItemArticleRequestUpdate
from app.middleware import middleware
from app.models.article import get_all_articles, get_article_by_id, create_article, delete_article, \
    update_article_image, update_article

router = APIRouter()

@router.get("/articles/get-articles", response_model=response.BaseResponse)
async def get_all_articles_api():
    try:
        articles = await get_all_articles()
        if not articles:
            return response.BaseResponse(status_code=404, message="No articles found")
        return response.BaseResponse(data=articles)
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.get("/articles/get-articles-admin", response_model=response.BaseResponse)
async def get_all_articles_admin_api(token: str = Depends(middleware.verify_token_admin)):
    try:
        articles = await get_all_articles()
        if not articles:
            return response.BaseResponse(status_code=404, message="No articles found")
        return response.BaseResponse(data=articles)
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.get("/articles/{article_id}", response_model=response.BaseResponse)
async def get_article_by_id_api(article_id: str):
    try:
        article = await get_article_by_id(article_id)
        if not article:
            return response.BaseResponse(status_code=404, message="Article not found")
        return response.BaseResponse(data=article)
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.post("/articles/add", response_model=response.BaseResponse)
async def create_article_api(
        article_data: ItemArticleRequestCreate = BodyDepends(ItemArticleRequestCreate),
        image: Optional[UploadFile] = File(None),
        token: str = Depends(middleware.verify_token_admin)):
    try:
        article_id = await create_article(article_data, image)
        if not article_id:
            return response.BaseResponse(status_code=500, message="Failed to create article")
        return response.BaseResponse()
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.put("/articles/update", response_model=response.BaseResponse)
async def update_article_api(
        article_data: ItemArticleRequestUpdate= BodyDepends(ItemArticleRequestUpdate),
token: str = Depends(middleware.verify_token_admin)):
    try:
        updated = await update_article(article_data)
        if not updated:
            return response.BaseResponse(status_code=500, message="Failed to update article")
        return response.BaseResponse()
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.put("/articles/update-image", response_model=response.BaseResponse)
async def update_article_image_api(
        article_id: str,
        image: UploadFile = File(...),
        token: str = Depends(middleware.verify_token_admin)):
    try:
        updated = await update_article_image(article_id, image)
        if not updated:
            return response.BaseResponse(status_code=500, message="Failed to update article image")
        return response.BaseResponse()
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")

@router.delete("/articles/delete/{article_id}", response_model=response.BaseResponse)
async def delete_article_api(
        article_id: str,
        token: str = Depends(middleware.verify_token_admin)):
    try:
        deleted = await delete_article(article_id)
        if not deleted:
            return response.BaseResponse(status_code=500, message="Failed to delete article")
        return response.BaseResponse()
    except Exception as e:
        return response.BaseResponse(status_code=500, message="Internal server error")