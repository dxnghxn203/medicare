import asyncio

from starlette import status
from datetime import datetime
from app.core import response
from app.core.database import db
from app.core.s3 import upload_file
from app.entities.category.request import MainCategoryInReq, MainCategoryReq, ChildCategoryReq, SubCategoryReq, \
    SubCategoryInReq, ChildCategoryInReq
from app.entities.product.response import ItemProductDBRes
from app.helpers.constant import generate_id
from app.helpers.time_utils import get_current_time
from app.middleware.logging import logger
from app.models.comment import count_comments
from app.models.review import count_reviews, average_rating

collection_name = "categories"
product_collection_name = "products"
default_image_url = "https://kltn2025.s3.ap-southeast-2.amazonaws.com/default/1742882469"

async def get_all_categories_admin():
    try:
        collection = db[collection_name]
        categories = collection.find({}, {"_id": 0})
        return list(categories)
    except Exception as e:
        logger.error(f"Error getting all categories: {str(e)}")
        raise e

async def get_all_categories():
    try:
        collection = db[collection_name]
        return list(collection.find({}, {"_id": 0, "main_category_id": 1, "main_category_name": 1, "main_category_slug": 1}))
    except Exception as e:
        raise e

async def get_category_by_slug(main_slug: str):
    try:
        collection = db[collection_name]
        category = collection.find_one({"main_category_slug": main_slug}, {"_id": 0})
        if not category:
            return None

        product_collection = db[product_collection_name]
        products = list(product_collection.find({
            "category.main_category_slug": main_slug,
            "is_approved": True,
            "active": True
        }, {"_id": 0}))
        enriched_products = []

        for prod in products:
            product_id = prod["product_id"]
            count_review, count_comment, avg_rating = await asyncio.gather(
                count_reviews(product_id),
                count_comments(product_id),
                average_rating(product_id),
            )

            enriched_products.append(
                ItemProductDBRes(
                    **prod,
                    count_review=count_review,
                    count_comment=count_comment,
                    rating=avg_rating
                )
            )

        category["products"] = enriched_products

        return category
    except Exception as e:
        logger.error(f"Error getting category by slug: {str(e)}")
        raise e

async def get_sub_category(main_slug: str, sub_slug: str):
    try:
        collection = db[collection_name]
        category = collection.find_one({"main_category_slug": main_slug}, {"_id": 0, "sub_category": 1})
        if not category:
            return None

        sub_category = next((sub for sub in category.get("sub_category", []) if sub["sub_category_slug"] == sub_slug),
                            None)
        if not sub_category:
            return None

        product_collection = db[product_collection_name]
        products = list(product_collection.find({
            "category.main_category_slug": main_slug,
            "category.sub_category_slug": sub_slug,
            "is_approved": True,
            "active": True
        },{"_id": 0}))
        enriched_products = []

        for prod in products:
            product_id = prod["product_id"]
            count_review, count_comment, avg_rating = await asyncio.gather(
                count_reviews(product_id),
                count_comments(product_id),
                average_rating(product_id),
            )

            enriched_products.append(
                ItemProductDBRes(
                    **prod,
                    count_review=count_review,
                    count_comment=count_comment,
                    rating=avg_rating
                )
            )

        sub_category["products"] = enriched_products

        return sub_category
    except Exception as e:
        raise e

async def get_child_category(main_slug: str, sub_slug: str, child_slug: str):
    try:
        collection = db[collection_name]
        category = collection.find_one({"main_category_slug": main_slug}, {"_id": 0, "sub_category": 1})
        if not category:
            return None

        for sub in category.get("sub_category", []):
            if sub["sub_category_slug"] == sub_slug:
                child_category = next(
                    (child for child in sub.get("child_category", []) if child["child_category_slug"] == child_slug),
                    None)
                if not child_category:
                    return None

                product_collection = db[product_collection_name]
                products = list(
                    product_collection.find({
                        "category.main_category_slug": main_slug,
                        "category.sub_category_slug": sub_slug,
                        "category.child_category_slug": child_slug,
                        "is_approved": True,
                        "active": True
                    }, {"_id": 0}))
                enriched_products = []

                for prod in products:
                    product_id = prod["product_id"]
                    count_review, count_comment, avg_rating = await asyncio.gather(
                        count_reviews(product_id),
                        count_comments(product_id),
                        average_rating(product_id),
                    )

                    enriched_products.append(
                        ItemProductDBRes(
                            **prod,
                            count_review=count_review,
                            count_comment=count_comment,
                            rating=avg_rating
                        )
                    )

                child_category["products"] = enriched_products
                return child_category

        return None
    except Exception as e:
        logger.error(f"Error getting child-category: {str(e)}")
        raise e

async def add_category(item: MainCategoryInReq, email):
    try:
        collection = db[collection_name]
        existing = collection.find_one({"main_category_slug": item.main_category_slug})
        if existing:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục chính đã tồn tại"
            )

        main_category_id = generate_id("MAIN")
        sub_categories = []

        for sub in item.sub_category:
            sub_category_id = generate_id("SUB")
            child_categories = []

            for child in sub.child_category:
                child_category_id = generate_id("CHILD")
                child_categories.append(ChildCategoryReq(
                    child_category_id=child_category_id,
                    child_category_name=child.child_category_name,
                    child_category_slug=child.child_category_slug,
                    child_image_url=default_image_url
                ))

            sub_categories.append(SubCategoryReq(
                sub_category_id=sub_category_id,
                sub_category_name=sub.sub_category_name,
                sub_category_slug=sub.sub_category_slug,
                child_category=child_categories,
                sub_image_url=default_image_url
            ))

        category_data = MainCategoryReq(
            main_category_id=main_category_id,
            main_category_name=item.main_category_name,
            main_category_slug=item.main_category_slug,
            sub_category=sub_categories,
            created_by=email,
            updated_by=email,
        )

        collection.insert_one(category_data.dict())
    except Exception as e:
        logger.error(f"Error adding category: {str(e)}")
        raise e


async def add_sub_category(main_slug: str, sub_category: SubCategoryInReq, email):
    try:
        collection = db[collection_name]
        category = collection.find_one({"main_category_slug": main_slug})

        if not category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục chính không tồn tại"
            )

        existing_sub = next(
            (sub for sub in category.get("sub_category", []) if
             sub["sub_category_slug"] == sub_category.sub_category_slug),
            None
        )
        if existing_sub:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục con đã tồn tại"
            )

        sub_category_id = generate_id("SUB")
        child_categories = [ChildCategoryReq(
            child_category_id=generate_id("CHILD"),
            child_category_name=child.child_category_name,
            child_category_slug=child.child_category_slug,
            child_image_url=default_image_url
        ) for child in sub_category.child_category]

        new_sub_category = SubCategoryReq(
            sub_category_id=sub_category_id,
            sub_category_name=sub_category.sub_category_name,
            sub_category_slug=sub_category.sub_category_slug,
            child_category=child_categories,
            sub_image_url=default_image_url
        )

        collection.update_one(
            {"main_category_slug": main_slug},
            {"$push": {"sub_category": new_sub_category.dict()},
             "$set": {"updated_by": email, "updated_at": get_current_time()}}
        )
    except Exception as e:
        logger.error(f"Error adding sub-category: {str(e)}")
        raise e

async def add_child_category(main_slug: str, sub_slug: str, child_category: ChildCategoryInReq, email):
    try:
        collection = db[collection_name]
        category = collection.find_one({"main_category_slug": main_slug})

        if not category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục chính không tồn tại"
            )

        for sub in category.get("sub_category", []):
            if sub["sub_category_slug"] == sub_slug:
                existing_child = next(
                    (child for child in sub.get("child_category", []) if
                     child["child_category_slug"] == child_category.child_category_slug),
                    None
                )
                if existing_child:
                    raise response.JsonException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        message="Danh mục con cấp 2 đã tồn tại"
                    )

                child_category_id = generate_id("CHILD")
                new_child_category = ChildCategoryReq(
                    child_category_id=child_category_id,
                    child_category_name=child_category.child_category_name,
                    child_category_slug=child_category.child_category_slug,
                    child_image_url=default_image_url
                )

                collection.update_one(
                    {"main_category_slug": main_slug, "sub_category.sub_category_slug": sub_slug},
                    {"$push": {"sub_category.$.child_category": new_child_category.dict()},
                     "$set": {"updated_by": email, "updated_at": get_current_time()}}
                )
                return

        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Danh mục con không tồn tại"
        )
    except Exception as e:
        logger.error(f"Error adding child category: {str(e)}")
        raise e

async def update_main_category(main_category_id: str, main_category_name: str, main_category_slug: str, email):
    try:
        collection = db[collection_name]
        update_data = {}

        if main_category_name:
            update_data["main_category_name"] = main_category_name
        if main_category_slug:
            update_data["main_category_slug"] = main_category_slug

        if not update_data:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có dữ liệu để cập nhật"
            )
        update_data["updated_by"] = email
        update_data["updated_at"] = get_current_time()

        result = collection.update_one(
            {"main_category_id": main_category_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có danh mục chính nào được cập nhật"
            )

        if "main_category_slug" in update_data:
            product_collection = db[product_collection_name]
            product_collection.update_many(
                {"main_category_id": main_category_id},
                {"$set": {"main_category_slug": update_data["main_category_slug"]}}
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật danh mục chính: {str(e)}")
        raise e

async def update_sub_category(sub_category_id: str, sub_category_name: str, sub_category_slug: str, email):
    try:
        collection = db[collection_name]

        update_data = {}
        if sub_category_name:
            update_data["sub_category.$.sub_category_name"] = sub_category_name
        if sub_category_slug:
            update_data["sub_category.$.sub_category_slug"] = sub_category_slug

        if not update_data:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có dữ liệu để cập nhật"
            )

        update_data["updated_by"] = email
        update_data["updated_at"] = get_current_time()

        result = collection.update_one(
            {"sub_category.sub_category_id": sub_category_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có danh mục con nào được cập nhật"
            )

        if "sub_category.$.sub_category_slug" in update_data:
            product_collection = db[product_collection_name]
            product_collection.update_many(
                {"sub_category_id": sub_category_id},
                {"$set": {"sub_category_slug": update_data["sub_category.$.sub_category_slug"]}}
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật danh mục con: {str(e)}")
        raise e

async def update_child_category(child_category_id: str, child_category_name: str, child_category_slug: str, email):
    try:
        collection = db[collection_name]

        update_data = {}
        if child_category_name:
            update_data["sub_category.$[].child_category.$[child].child_category_name"] = child_category_name
        if child_category_slug:
            update_data["sub_category.$[].child_category.$[child].child_category_slug"] = child_category_slug

        if not update_data:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có dữ liệu để cập nhật"
            )

        update_data["updated_by"] = email
        update_data["updated_at"] = get_current_time()

        result = collection.update_one(
            {"sub_category.child_category.child_category_id": child_category_id},
            {"$set": update_data},
            array_filters=[{"child.child_category_id": child_category_id}]
        )

        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có danh mục con cấp 2 nào được cập nhật"
            )

        if "sub_category.$[].child_category.$[child].child_category_slug" in update_data:
            product_collection = db[product_collection_name]
            product_collection.update_many(
                {"child_category_id": child_category_id},
                {"$set": {"child_category_slug": update_data["sub_category.$[].child_category.$[child].child_category_slug"]}}
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật danh mục con cấp 2: {str(e)}")
        raise e

async def update_sub_category_image(sub_category_id: str, image: str, email):
    try:
        image_url = upload_file(image, "sub_category")
        if not image_url:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không thể tải ảnh lên"
            )

        collection = db[collection_name]
        result = collection.update_one(
        {"sub_category.sub_category_id": sub_category_id},
            {"$set": {"sub_category.$.sub_image_url": image_url, "updated_by": email, "updated_at": get_current_time()}}
        )
        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có danh mục con nào được cập nhật"
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật ảnh danh mục con: {str(e)}")
        raise e

async def update_child_category_image(child_category_id: str, image: str, email):
    try:
        image_url = upload_file(image, "child_category")

        if not image_url:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không thể tải ảnh lên"
            )
        collection = db[collection_name]
        result = collection.update_one(
            {"sub_category.child_category.child_category_id": child_category_id},
            {"$set": {"sub_category.$[].child_category.$[child].child_image_url": image_url,
                      "updated_by": email, "updated_at": get_current_time()}},
            array_filters=[{"child.child_category_id": child_category_id}]
        )
        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có danh mục con cấp 2 nào được cập nhật"
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật ảnh danh mục con cấp 2: {str(e)}")
        raise e

async def update_all_categories_image(image_url):
    try:
        image_url = upload_file(image_url, "default")
        if not image_url:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không thể tải ảnh lên"
            )
        collection = db[collection_name]

        categories = collection.find({})
        categories = categories.to_list(length=None)

        updated_count = 0

        for category in categories:
            updated = False

            if "sub_category" in category:
                for sub in category["sub_category"]:
                    if "sub_image_url" not in sub or sub["sub_image_url"] == "":
                        sub["sub_image_url"] = image_url
                        updated = True

                    if "child_category" in sub:
                        for child in sub["child_category"]:
                            if "child_image_url" not in child or child["child_image_url"] == "":
                                child["child_image_url"] = image_url
                                updated = True

            if updated:
                collection.update_one(
                    {"_id": category["_id"]}, {"$set": {"sub_category": category["sub_category"]}}
                )
                updated_count += 1

        if updated_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có danh mục nào được cập nhật"
            )

        logger.info(f"Updated {updated_count} categories with default image.")
    except Exception as e:
        logger.error(f"Lỗi cập nhật ảnh mặc định: {str(e)}")
        raise e

async def delete_main_category(main_category_id: str):
    try:
        product_collection = db[product_collection_name]
        products = list(product_collection.find({"category.main_category_id": main_category_id}, {"_id": 0}))

        if products:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục đang được sử dụng",
                data=products
            )

        collection = db[collection_name]
        result = collection.delete_one({"main_category_id": main_category_id})
        if result.deleted_count == 0:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Không tìm thấy danh mục chính")

        return response.SuccessResponse(message="Xóa danh mục chính thành công")
    except Exception as e:
        logger.error(f"Lỗi xóa danh mục chính: {str(e)}")
        raise e

async def delete_sub_category(sub_category_id: str):
    try:
        product_collection = db[product_collection_name]
        products = list(product_collection.find({"category.sub_category_id": sub_category_id}, {"_id": 0}))

        if products:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục con đang được sử dụng",
                data=products
            )

        collection = db[collection_name]
        result = collection.update_one(
            {"sub_category.sub_category_id": sub_category_id},
            {"$pull": {"sub_category": {"sub_category_id": sub_category_id}}}
        )
        if result.modified_count == 0:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Không tìm thấy danh mục con")

        return response.SuccessResponse(message="Xóa danh mục con thành công")
    except Exception as e:
        logger.error(f"Lỗi xóa danh mục con: {str(e)}")
        raise e


async def delete_child_category(child_category_id: str):
    try:
        product_collection = db[product_collection_name]
        products = list(product_collection.find({"category.child_category_id": child_category_id}, {"_id": 0}))

        if products:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục con cấp 2 đang được sử dụng",
                data=products
            )

        collection = db[collection_name]
        result = collection.update_one(
            {"sub_category.child_category.child_category_id": child_category_id},
            {"$pull": {"sub_category.$[].child_category": {"child_category_id": child_category_id}}}
        )
        if result.modified_count == 0:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Không tìm thấy danh mục con cấp 2")

        return response.SuccessResponse(message="Xóa danh mục con cấp 2 thành công")
    except Exception as e:
        logger.error(f"Lỗi xóa danh mục con cấp 2: {str(e)}")
        raise e

async def update_product_created_updated():
    collection = db[collection_name]
    collection.update_many(
        {},
        {"$set": {
            "created_by": "tuannguyen23823@gmail.com",
            "updated_by": "tuannguyen23823@gmail.com",
            "created_at": get_current_time(),
            "updated_at": get_current_time()
        }}
    )