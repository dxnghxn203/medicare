from typing import Optional, List, Dict, Any

from bson import ObjectId
from fuzzywuzzy import fuzz
import re

from core import logger
from core.mongo import db

products_collection = db['products']

def product_helper(product) -> dict:
    if product and "_id" in product:
        product["id"] = str(product["_id"])

    return {
        **{k: str(v) if isinstance(v, ObjectId) else v for k, v in product.items()}
    }


def get_product_by_id(product_id: str):
    product_doc = None
    try:
        product_doc = products_collection.find_one({"product_id": product_id})
        if product_doc:
            return product_helper(product_doc)

    except Exception as e:
        print(f"Error finding product by ID '{product_id}': {e}")

    return None

def get_all_products():
    product_docs = []
    try:
        for product in products_collection.find():
            product_docs.append(product_helper(product))
    except Exception as e:
        print(f"Error getting all products: {e}")
        return []
    return product_docs

async def get_product_by_price_id(product_id: str, price_id: str):
    try:

        product = products_collection.find_one({
            "product_id": product_id,
            "prices.price_id": price_id,
            "is_approved": True,
            "active": True
        },{"_id": 0})


        product["prices"] = [
            price for price in product.get("prices", [])
            if price.get("price_id") == price_id
        ]

        return product_helper(product)
    except Exception as e:
        return None


async def get_product_inventory(product_id: str, price_id: str):
    try:
        inventory_collection = db["products_inventory"]
        inventory_doc = inventory_collection.find_one({
            "product_id": product_id,
            "price_id": price_id
        })

        if not inventory_doc:
            return None

        return inventory_doc

    except Exception as e:
        logger.error(f"Error getting product inventory: {str(e)}")
        raise e

def check_out_of_stock(product_id: str, price_id: str):
    try:
        inventory_data = get_product_inventory(product_id=product_id, price_id=price_id)

        if not inventory_data:
            return None

        inventory = inventory_data.get("inventory", 0)
        sell = inventory_data.get("sell", 0)

        return inventory <= sell
    except Exception as e:
        logger.error(f"Error checking out of stock for product ID {product_id}: {e}")
        return None


def search_products_by_text(search_text: str, limit: int = 5) -> list[dict]:
    if not search_text:
        return []

    query = {
        "$text": {
            "$search": search_text
        }
    }

    projection = {
        "score": {
            "$meta": "textScore"
        }
    }

    sort_order = [
        ("score", {"$meta": "textScore"})
    ]

    try:
        product_docs = []
        results = products_collection.find(query, projection).sort(sort_order).limit(limit)
        for product in results:
            product_docs.append(product_helper(product))
        return product_docs
    except Exception as e:
        logger.error(f"Error searching products by text '{search_text}': {e}")
        return []

#recommendation
async def get_all_products_recommendation() -> List[Dict[str, Any]]:

    try:
        products = db.products.find({"active": True}).to_list(length=None)
        return [product_helper(p) for p in products]
    except Exception as e:
        logger.error(f"Error fetching all products for recommendation: {str(e)}")
        return []

async def get_product_by_id_recommendation(product_id: str) -> Optional[Dict[str, Any]]:

    try:
        product = db.products.find_one({"product_id": product_id})
        if product:
            return product_helper(product)
        return None
    except Exception as e:
        logger.error(f"Error fetching product by ID {product_id} for recommendation: {str(e)}")
        return None

async def get_products_by_category_recommendation(category_slug: str) -> List[Dict[str, Any]]:
    try:
        products = db.products.find({
            "active": True,
            "$or": [
                {"category.main_category_slug": category_slug},
                {"category.sub_category_slug": category_slug},
                {"category.child_category_slug": category_slug}
            ]
        }).to_list(length=None)
        return products
    except Exception as e:
        logger.error(f"Error fetching products by category {category_slug}: {str(e)}")
        return []

async def get_products_with_discount_recommendation(min_discount: int = 10) -> List[Dict[str, Any]]:
    try:
        products = db.products.find({
            "active": True,
            "prices": {
                "$elemMatch": {
                    "discount": {"$gte": min_discount}
                }
            }
        }).to_list(length=None)
        return products
    except Exception as e:
        logger.error(f"Error fetching products with discount: {str(e)}")
        return []

async def get_newest_products_recommendation(limit: int = 20) -> List[Dict[str, Any]]:

    try:
        products = db.products.find({"active": True}).sort("created_at", -1).limit(limit).to_list(length=limit)
        return products
    except Exception as e:
        logger.error(f"Error fetching newest products: {str(e)}")
        return []



def search_medicine(extracted_data):

    if extracted_data.registration_number:
        product = db.products.find_one({"registration_number": extracted_data.registration_number})
        if product:
            return product_helper(product)

    # Bước 2: Tìm theo kết hợp tên và thương hiệu
    if extracted_data.name and extracted_data.brand:
        query = {
            "$and": [
                {"product_name": {"$regex": re.escape(extracted_data.name), "$options": "i"}},
                {"brand": {"$regex": re.escape(extracted_data.brand), "$options": "i"}}
            ]
        }
        product = db.products.find_one(query)
        if product:
            return product_helper(product)

    # Bước 3: Tìm chỉ theo tên sản phẩm
    if extracted_data.name:
        query = {
            "$or": [
                {"product_name": {"$regex": re.escape(extracted_data.name), "$options": "i"}},
                {"name_primary": {"$regex": re.escape(extracted_data.name), "$options": "i"}}
            ]
        }
        product = db.products.find_one(query)
        if product:
            return product_helper(product)

    # Bước 4: Tìm theo hoạt chất (nếu có)
    if extracted_data.active_ingredients and len(extracted_data.active_ingredients) > 0:
        # Tìm tất cả sản phẩm có ít nhất 1 thành phần khớp
        matching_products = []
        all_products = list(db.products.find())

        for product in all_products:
            score = 0
            if "ingredients" in product:
                for extracted_ingredient in extracted_data.active_ingredients:
                    for db_ingredient in product["ingredients"]:
                        if extracted_ingredient.lower() in db_ingredient["ingredient_name"].lower():
                            score += 1 / len(extracted_data.active_ingredients)
                            break

            # Tăng điểm nếu có thông tin khác khớp
            if extracted_data.brand and product.get("brand") and \
                    extracted_data.brand.lower() in product["brand"].lower():
                score += 0.3

            if extracted_data.dosage_form and product.get("dosage_form") and \
                    extracted_data.dosage_form.lower() in product["dosage_form"].lower():
                score += 0.2

            if score > 0.5:  # Ngưỡng điểm tối thiểu
                matching_products.append((product, score))

        if matching_products:
            # Sắp xếp theo điểm giảm dần
            matching_products.sort(key=lambda x: x[1], reverse=True)
            return product_helper(matching_products[0][0])

    # Bước 5: Tìm kiếm mờ khi các phương pháp khác thất bại
    if extracted_data.name:
        best_match = None
        best_score = 0

        for product in list(db.products.find()):
            name_score = max(
                fuzz.token_set_ratio(extracted_data.name.lower(), product["product_name"].lower()),
                fuzz.token_set_ratio(extracted_data.name.lower(), product.get("name_primary", "").lower())
            ) / 100

            if name_score > best_score and name_score > 0.7:
                best_match = product
                best_score = name_score

        if best_match:
            return product_helper(best_match)

    return None