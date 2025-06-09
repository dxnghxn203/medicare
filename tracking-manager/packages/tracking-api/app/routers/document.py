from fastapi import APIRouter
from app.models.document import get_document_by_request_id, get_documents
from app.core import  logger, response
router = APIRouter()


@router.get("/documents/{request_id}")
async def get_document(request_id: str):
    try:
        document = await get_document_by_request_id(request_id)
        if not document:
            return response.BaseResponse(
                status_code=404,
                message="Document not found"
            )
        return response.BaseResponse(
            status_code=200,
            message="Document retrieved successfully",
            data=document
        )
    except Exception as e:
        return response.BaseResponse(
            status_code=500,
            message="An error occurred while retrieving the document"
        )

@router.get("/documents")
async def get_all_documents():
    try:
        documents = await get_documents()
        return response.BaseResponse(
            status_code=200,
            message="Documents retrieved successfully",
            data=documents
        )
    except Exception as e:
        logger.error(f"Error retrieving documents: {e}")
        return response.BaseResponse(
            status_code=500,
            message="An error occurred while retrieving the documents"
        )

@router.put("/documents/{request_id}")
async def update_document(request_id: str, document_data: dict):
    try:
        updated = await get_document_by_request_id(request_id)
        if not updated:
            return response.BaseResponse(
                status_code=404,

                message="Document not found"
            )
        result = await update_document(request_id, document_data)
        if not result:
            return response.BaseResponse(
                status_code=500,
                message="Failed to update document"
            )
        return response.BaseResponse(
            status_code=200,
            message="Document updated successfully",
            data=result
        )
    except Exception as e:
        logger.error(f"Error updating document: {e}")
        return response.BaseResponse(
            status_code=500,
            message="An error occurred while updating the document"
        )