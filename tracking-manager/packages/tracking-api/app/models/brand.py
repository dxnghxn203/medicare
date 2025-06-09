from app.core import logger
from app.core.database import db
from app.core.s3 import upload_file
from app.entities.brand.request import ItemBrand, ItemBrandRequestUpdate, ItemBrandRequestCreate
from app.helpers.constant import generate_id

BRAND_COLLECTION = db['brands']
ID_BRAND_DEFAULT = "BR"

async def create_brand(brand_data: ItemBrandRequestCreate, logo):
    try:
        brand_id = generate_id(ID_BRAND_DEFAULT)
        logo_url = None
        if logo:
            try:
                logo_url = upload_file(logo, brand_id)
            except Exception as e:
                return None

        n_brand = ItemBrand(
            brand_id=brand_id,
            **brand_data.dict(),
            logo=logo_url)
        brand =  BRAND_COLLECTION.insert_one(n_brand.dict())
        return brand.inserted_id
    except Exception as e:
        logger.error(f"Error creating brand: {e}")
        return None

async def get_brand_by_id(brand_id):
    try:
        brand =  BRAND_COLLECTION.find_one({"brand_id": brand_id})
        brand['_id'] = str(brand['_id'])
        return brand
    except Exception as e:
        return None

async def get_all_brands_by_admin():
    try:
        brands =  BRAND_COLLECTION.find({}).to_list(length=None)
        if not brands:
            return None
        list_brand = []
        for brand in brands:
            item = brand
            item['_id'] = str(brand['_id'])
            list_brand.append(item)
        return list_brand
    except Exception as e:
        return None

async def get_all_brands():
    try:
        brands =  BRAND_COLLECTION.find({"active": True}).to_list(length=None)
        if not brands:
            return None
        list_brand = []
        for brand in brands:
            item = brand
            item['_id'] = str(brand['_id'])
            list_brand.append(item)
        return list_brand
    except Exception as e:
        return None

async def update_brand(brand: ItemBrandRequestUpdate):
    try:
        updated_brand = BRAND_COLLECTION.update_one({"brand_id": brand.brand_id}, {
            "$set": {
               **brand.dict(),
            }
        })
        return updated_brand.modified_count > 0
    except Exception as e:
        logger.error(f"Error updating brand: {e}")
        return None
async def update_brand_logo(brand_id: str, logo):
    try:
        logo_url = None
        if logo:
            try:
                logo_url = upload_file(logo, brand_id)
            except Exception as e:
                return None

        updated_brand = BRAND_COLLECTION.update_one({"brand_id": brand_id}, {
            "$set": {
                "logo": logo_url
            }
        })
        return updated_brand.modified_count > 0
    except Exception as e:
        logger.error(f"Error updating brand logo: {e}")
        return None
async def delete_brand(brand_id: str):
    try:
        deleted_brand = BRAND_COLLECTION.delete_one({"brand_id": brand_id})
        return  deleted_brand.deleted_count > 0
    except Exception as e:
        return None