from app.core.database import db

DOCUMENT_COLLECTION = db['documents']

async def get_document_by_request_id(request_id: str):
    try:
        document = DOCUMENT_COLLECTION.find_one({"request_id": request_id})
        if not document:
            return None
        document['_id'] = str(document['_id'])
        return document
    except Exception as e:
        return None

async def get_documents():
    try:
        documents = DOCUMENT_COLLECTION.find({}).to_list(length=None)
        if not documents:
            return None
        list_documents = []
        for document in documents:
            item = document
            item['_id'] = str(document['_id'])
            list_documents.append(item)
        return list_documents
    except Exception as e:
        return None

async def update_document_by_request_id(request_id: str, document_data: dict):
    try:
        update_result = DOCUMENT_COLLECTION.update_one(
            {"request_id": request_id},
            {"$set": document_data}
        )
        if update_result.modified_count == 0:
            return None
        return True
    except Exception as e:
        return None