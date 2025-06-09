from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import List, Dict, Any, Optional

from core import logger, response
from models.product import search_medicine
from services.document_extractor import process_document, extract_drug_information
from models.document import (
    DocumentExtractionRequest,
    DocumentExtractionResponse,
    # get_document,
    # get_user_documents,
    DrugExtractionResponse
)

router = APIRouter()

@router.post("/extract", response_model=DocumentExtractionResponse)
async def extract_document(
        file: UploadFile = File(...),
        request_id: Optional[str] = Form(None)
):

    allowed_extensions = ["jpg", "jpeg", "png", "pdf"]

    if not file.filename or "." not in file.filename:
        raise HTTPException(
            status_code=400,
            detail="Tên file không hợp lệ, không thể xác định định dạng"
        )

    file_ext = file.filename.split(".")[-1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Định dạng file không được hỗ trợ. Chỉ chấp nhận: {', '.join(allowed_extensions)}"
        )

    file_size_limit = 10 * 1024 * 1024
    file_content = await file.read()
    file_size = len(file_content)
    await file.seek(0)

    if file_size > file_size_limit:
        raise HTTPException(
            status_code=400,
            detail=f"Kích thước file vượt quá giới hạn cho phép (10MB)"
        )

    request = DocumentExtractionRequest(
        request_id=request_id
    )

    return await process_document(file, request)

@router.post("/extract-drugs")
async def extract_drugs_from_images(
        files: List[UploadFile] = File(...),
        extraction_method: str = Form("hybrid")
):
    try:
        if len(files) > 2:
            logger.warn(f"Too many files submitted: {len(files)}")
            return response.BaseResponse(
                status_code=400,
                message="Maximum 2 images allowed",
                data=None
            )

        allowed_extensions = ["jpg", "jpeg", "png"]
        for file in files:
            if not file.filename or "." not in file.filename:
                logger.warn(f"Invalid filename: {file.filename}")
                return response.BaseResponse(
                    status_code=400,
                    message="Invalid file format. Only images are supported.",
                    data=None
                )

            file_ext = file.filename.split(".")[-1].lower()
            if file_ext not in allowed_extensions:
                logger.warn(f"Unsupported file extension: {file_ext}")
                return response.BaseResponse(
                    status_code=400,
                    message=f"Unsupported file format: {file_ext}. Only images are supported.",
                    data=None
                )

            file_size_limit = 5 * 1024 * 1024
            file_content = await file.read()
            file_size = len(file_content)
            await file.seek(0)

            if file_size > file_size_limit:
                logger.warn(f"File too large: {file.filename} ({file_size} bytes)")
                return response.BaseResponse(
                    status_code=400,
                    message=f"File {file.filename} is too large. Maximum size is 5MB per file.",
                    data=None
                )

        logger.info(f"Processing {len(files)} drug image(s) with {extraction_method} extraction method")
        result = await extract_drug_information(files, extraction_method)
        drug_response = DrugExtractionResponse(**result)

        product_result = []
        for product in drug_response.drugs:
            product_info = search_medicine(product)
            product_result.append({
                "product": product_info,
                "raw_text": product,
            })

        return response.BaseResponse(
            status_code=200,
            message="Drug information extracted successfully",
            data=product_result
        )

    except HTTPException as he:
        logger.error(f"HTTP Exception in drug extraction: {he.detail}")
        return response.BaseResponse(
            status_code=he.status_code,
            message=he.detail,
            data=None
        )
    except Exception as e:
        logger.error(f"Unexpected error in drug extraction: {str(e)}", exc_info=True)
        return response.BaseResponse(
            status_code=500,
            message=f"Error processing drug images: {str(e)}",
            data=None
        )