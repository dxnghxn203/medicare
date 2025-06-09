from app.core import logger
from app.core.database import db
from app.core.s3 import upload_file
from app.entities.article.request import ItemArticleRequestCreate, ItemArticle, ItemArticleRequestUpdate
from app.helpers.constant import generate_id

ARTICLE_COLLECTION = db['articles']
ID_ARTICLE_DEFAULT = "AR"
ARICLE_FOLDER = "articles"

async def create_article(article_data: ItemArticleRequestCreate, image= None):
    try:
        article_id = generate_id(ID_ARTICLE_DEFAULT)
        image_url = ""
        if image:
            image_url = upload_file(image, ARICLE_FOLDER)

        n_article = ItemArticle(
            article_id=article_id,
            **article_data.dict(),
            image_thumbnail=image_url
        )
        article = ARTICLE_COLLECTION.insert_one(n_article.dict())
        return article.inserted_id
    except Exception as e:
        logger.error(f"Error creating article: {e}")
        return None

async def get_article_by_id(article_id):
    try:
        article = ARTICLE_COLLECTION.find_one({"article_id": article_id})
        if not article:
            return None
        article['_id'] = str(article['_id'])
        return article
    except Exception as e:
        return None

async def get_all_articles_by_admin():
    try:
        articles = ARTICLE_COLLECTION.find({}).to_list(length=None)
        if not articles:
            return None
        list_article = []
        for article in articles:
            item = article
            item['_id'] = str(article['_id'])
            list_article.append(item)
        return list_article
    except Exception as e:
        return None

async def get_all_articles():
    try:
        articles = ARTICLE_COLLECTION.find({"active": True}).to_list(length=None)
        if not articles:
            return None
        list_article = []
        for article in articles:
            item = article
            item['_id'] = str(article['_id'])
            list_article.append(item)
        return list_article
    except Exception as e:
        return None

async def update_article(article: ItemArticleRequestUpdate):
    try:
        updated_article = ARTICLE_COLLECTION.update_one({"article_id": article.article_id}, {
            "$set": {
               **article.dict(),
            }
        })
        return updated_article.modified_count > 0
    except Exception as e:
        logger.error(f"Error updating article: {e}")
        return None

async def update_article_image(article_id: str, image):
    try:
        image_url = None
        if image:
            image_url = upload_file(image, ARICLE_FOLDER)
        updated_article = ARTICLE_COLLECTION.update_one({"article_id": article_id}, {
            "$set": {
               "image_thumbnail": image_url
            }
        })
        return updated_article.modified_count > 0
    except Exception as e:
        logger.error(f"Error updating article image: {e}")
        return None

async def delete_article(article_id: str):
    try:
        deleted_article = ARTICLE_COLLECTION.delete_one({"article_id": article_id})
        return deleted_article.deleted_count > 0
    except Exception as e:
        logger.error(f"Error deleting article: {e}")
        return None