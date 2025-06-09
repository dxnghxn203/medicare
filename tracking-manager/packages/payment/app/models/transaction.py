from app.core.database import db

collection_name = "transactions"


async def create_transaction(item: any):
    try:
        collection = db[collection_name]
        insert_result = collection.insert_one(item)
        return insert_result.inserted_id
    except Exception as e:
        return False
