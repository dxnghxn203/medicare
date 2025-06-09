from datetime import datetime
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, ConfigDict

from core.mongo import db
from core import logger
from helpers.constant import generate_id

documents_collection = db.documents

class PrescriptionProduct(BaseModel):
    product_name: str
    dosage: Optional[str] = None
    quantity_value: Optional[str] = None
    quantity_unit: Optional[str] = None
    usage_instruction: Optional[str] = None


class InvoiceProduct(BaseModel):
    product_name: str
    quantity_value: Optional[str] = None
    quantity_unit: Optional[str] = None
    unit_price: Optional[str] = None
    total_price: Optional[str] = None


class DocumentExtractionRequest(BaseModel):
    request_id: Optional[str] = None

class DocumentExtractionResponse(BaseModel):
    document_id: str
    document_type: str
    raw_text: Optional[str] = None
    products: List[Union[PrescriptionProduct, InvoiceProduct]]
    total_pages: Optional[int] = None
    current_page: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.now)

    patient_information: Optional[Dict[str, Any]] = None
    document_date: Optional[str] = None
    issuing_organization: Optional[str] = None

    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
    medical_code: Optional[str] = None
    invoice_id: Optional[str] = None
    prescription_id: Optional[str] = None
    prescribing_doctor: Optional[str] = None


async def save_document(
        document_type: str,
        raw_text: Optional[str],
        products: List[Dict[str, Any]],
        file_name: str,
        request_id: Optional[str] = None,
        total_pages: Optional[int] = None,
        current_page: Optional[int] = None,
        patient_information: Optional[Dict[str, Any]] = None,
        document_date: Optional[str] = None,
        issuing_organization: Optional[str] = None,
        medical_code: Optional[str] = None,
        invoice_id: Optional[str] = None,
        prescription_id: Optional[str] = None,
        prescribing_doctor: Optional[str] = None
) -> str:
    document_id = generate_id("DOC")

    document_data = {
        "document_id": document_id,
        "document_type": document_type,
        "raw_text": raw_text,
        "products": products,
        "file_name": file_name,
        "created_at": datetime.now(),
        "total_pages": total_pages,
        "current_page": current_page,
        "patient_information": patient_information,
        "document_date": document_date,
        "issuing_organization": issuing_organization,
        "medical_code": medical_code,
        "invoice_id": invoice_id,
        "prescription_id": prescription_id,
        "prescribing_doctor": prescribing_doctor
    }

    if request_id:
        document_data["request_id"] = request_id

    try:
        collection_to_use = documents_collection
        if collection_to_use is not None:
            collection_to_use.insert_one(document_data)
            logger.info(f"Document saved to MongoDB collection for '{document_type}' with ID: {document_id}")
        else:
            logger.error(f"No collection determined for document_type: {document_type}. Document not saved.")
            raise ValueError(f"Could not determine collection for document_type: {document_type}")

        return document_id
    except Exception as e:
        logger.error(f"Failed to save document to MongoDB: {str(e)}")
        raise

class DrugInformation(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    origin: Optional[str] = None
    serial_number: Optional[str] = None
    dosage_form: Optional[str] = None
    active_ingredients: Optional[List[str]] = None
    composition: Optional[str] = None
    manufacturer: Optional[str] = None
    expiration_date: Optional[str] = None
    batch_number: Optional[str] = None
    registration_number: Optional[str] = None
    additional_info: Optional[dict] = {}

class DrugExtractionResponse(BaseModel):
    drugs: List[DrugInformation] = []
    raw_text: Optional[str] = None
    extraction_method: str
