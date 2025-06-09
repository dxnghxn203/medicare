import os
import tempfile
import re
import json
import base64
from typing import Dict, Any, List, Optional, Union
from fastapi import UploadFile, HTTPException
from pathlib import Path
from PIL import Image
import io

# Thêm import cho pdf2image
from pdf2image import convert_from_path
from pdf2image.exceptions import (
    PDFInfoNotInstalledError,
    PDFPageCountError,
    PDFSyntaxError,
    PDFPopplerTimeoutError
)

from core.llm_config import llm
from core import logger
from services.ocr_processor import extract_text_from_image, detect_layout_type, is_tesseract_available
from models.document import (
    PrescriptionProduct,
    InvoiceProduct,
    DocumentExtractionRequest,
    DocumentExtractionResponse,
    save_document
)

from langchain_core.messages import HumanMessage, SystemMessage


def encode_file_to_base64(file_path: Union[str, Path]) -> str:
    try:
        with open(file_path, "rb") as file:
            return base64.b64encode(file.read()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error encoding file to base64: {str(e)}")
        raise


def encode_image_to_base64(image_path: Union[str, Path]) -> str:  # Should be identical to encode_file_to_base64
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error encoding image to base64: {str(e)}")
        raise


def extract_json_from_response(response_text: str, document_type: str) -> Dict[str, Any]:
    # This function aims to parse JSON from LLM, with fallback for patient_information
    # to be a dict if it's a string.
    parsed_data = {
        "document_type": document_type, "products": [], "patient_information": {},  # Default to empty dict
        "document_date": None, "issuing_organization": None, "medical_code": None,
        "invoice_id": None, "prescription_id": None, "prescribing_doctor": None, "raw_text": ""
    }

    try:
        data = json.loads(response_text)
        parsed_data.update(data)  # Update with all fields from LLM

        # Ensure products is a list
        parsed_data["products"] = data.get("products", []) if isinstance(data.get("products"), list) else []

        # Handle patient_information: ensure it's a dict
        patient_info_val = parsed_data.get("patient_information")
        if patient_info_val is not None:
            if isinstance(patient_info_val, str):
                logger.warn(
                    f"LLM returned 'patient_information' as a string: '{patient_info_val}'. Converting to dict: {{'description': 'string_value'}}.")
                parsed_data["patient_information"] = {"description": patient_info_val}
            elif not isinstance(patient_info_val, dict):
                logger.warn(
                    f"LLM returned 'patient_information' as non-dict/non-string: {type(patient_info_val)}. Resetting to empty dict.")
                parsed_data["patient_information"] = {}
        else:  # If patient_information is None or missing from LLM
            parsed_data["patient_information"] = {}

        return parsed_data
    except json.JSONDecodeError:
        json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
        match = re.search(json_pattern, response_text)
        if match:
            try:
                data = json.loads(match.group(1))
                parsed_data.update(data)
                parsed_data["products"] = data.get("products", []) if isinstance(data.get("products"), list) else []

                patient_info_val = parsed_data.get("patient_information")
                if patient_info_val is not None:
                    if isinstance(patient_info_val, str):
                        logger.warn(
                            f"LLM (from markdown) returned 'patient_information' as a string: '{patient_info_val}'. Converting to dict.")
                        parsed_data["patient_information"] = {"description": patient_info_val}
                    elif not isinstance(patient_info_val, dict):
                        logger.warn(
                            f"LLM (from markdown) returned 'patient_information' as non-dict/non-string: {type(patient_info_val)}. Resetting to empty dict.")
                        parsed_data["patient_information"] = {}
                else:
                    parsed_data["patient_information"] = {}
                return parsed_data
            except json.JSONDecodeError:
                logger.warn("Failed to parse JSON from markdown code block in LLM response.")
        else:
            logger.warn(
                "LLM response is not a direct JSON or a markdown JSON code block. Attempting markdown parsing for products.")

    # Fallback parsing for products if no valid JSON is found (simplified)
    # This part might need to be more robust if LLM often fails to produce JSON
    products = []
    # ... (Your existing markdown parsing logic for products could go here if needed)
    # For simplicity, if JSON fails, and markdown parsing is complex, we might just return empty products
    # or rely on the initial parsed_data["products"] which would be [].

    # Ensure patient_information is a dict if all parsing fails
    if not isinstance(parsed_data.get("patient_information"), dict):
        parsed_data["patient_information"] = {}

    # parsed_data["products"] would already be set from the initial try or markdown block try.
    return parsed_data


async def extract_with_llm(file_path: Path, document_type: str, file_type: str, ocr_text: Optional[str] = None,
                           page_number: Optional[int] = None, total_pages: Optional[int] = None) -> Dict[str, Any]:
    # file_path here is expected to be an image file (original image or a page converted from PDF)
    base64_content = encode_image_to_base64(file_path)  # Use encode_image_to_base64
    logger.info(f"File type for LLM: {file_type}, Base64 content length: {len(base64_content)}")

    common_extraction_info = """
        Ngoài danh sách sản phẩm/thuốc, hãy trích xuất các thông tin chung sau từ tài liệu nếu có:
        - patient_information: Trích xuất thông tin về người liên quan chính trong tài liệu (ví dụ: bệnh nhân nếu là đơn thuốc, khách hàng/người mua nếu là hóa đơn). 
            * QUAN TRỌNG: Trường này BẮT BUỘC PHẢI LÀ MỘT ĐỐI TƯỢNG JSON (OBJECT).
            * Ví dụ về cấu trúc mong muốn cho `patient_information`:
              {
                "name": "Nguyễn Văn A (Khách hàng)", // Hoặc "Trần Thị B (Bệnh nhân)"
                "identifier": "Mã KH: 12345 / Số CMND: 001089xxxxxx", // Mã khách hàng, mã bệnh nhân, hoặc giấy tờ tùy thân nếu có
                "age": "35 tuổi", // Nếu có và phù hợp
                "gender": "Nam", // Nếu có và phù hợp
                "address": "Số 10, Đường X, Phường Y, Quận Z, TP. HCM",
                "phone": "090xxxxxxx",
                "email": "email@example.com", // Nếu có
                "diagnosis_or_purpose": "Mua hàng tiêu dùng", // Hoặc "Viêm họng cấp" (chẩn đoán nếu là đơn thuốc)
                "notes": "Khách hàng VIP. Giao hàng nhanh." // Hoặc "Tiền sử dị ứng Penicillin."
              }
            * Hãy cố gắng điền các trường con bên trong `patient_information` một cách hợp lý dựa trên loại tài liệu.
            * Nếu một số thông tin con không có hoặc không phù hợp, hãy để giá trị là `null` hoặc bỏ qua khóa đó.
            * Nếu không có bất kỳ thông tin nào về người liên quan có thể trích xuất, hãy trả về một ĐỐI TƯỢNG RỖNG: `{}` cho `patient_information`.
            * TUYỆT ĐỐI KHÔNG trả về `patient_information` dưới dạng một chuỗi văn bản thuần túy.
        - document_date: Ngày tháng của tài liệu (ví dụ: "2023-10-26"). Luôn là một chuỗi.
        - issuing_organization: Tên tổ chức phát hành. Luôn là một chuỗi.
        - medical_code: Mã y tế liên quan (nếu có). Luôn là một chuỗi.
        - invoice_id: Mã số hóa đơn (nếu là hóa đơn). Luôn là một chuỗi.
        - prescription_id: Mã số toa thuốc (nếu là toa thuốc). Luôn là một chuỗi.
        - prescribing_doctor: Tên bác sĩ kê đơn (nếu là toa thuốc). Luôn là một chuỗi.

        Hãy trả về kết quả dưới dạng một đối tượng JSON duy nhất. Đối tượng JSON này nên bao gồm các khóa:
        "patient_information", "document_date", "issuing_organization", "medical_code", 
        "invoice_id", "prescription_id", "prescribing_doctor", và "products".
        Trong đó, "products" là một danh sách các đối tượng sản phẩm/thuốc.
        Ví dụ cấu trúc JSON cho một sản phẩm trong danh sách "products":
        {
          "product_name": "Paracetamol 500mg",
          "dosage": "1 viên/lần",
          "quantity_value": "20",
          "quantity_unit": "viên",
          "usage_instruction": "Uống khi sốt, cách 4-6 tiếng"
        }
        Nếu một thông tin không có hoặc không áp dụng cho các trường chuỗi khác, hãy để giá trị là `null`.
        """
    page_context_info = ""
    if page_number is not None and total_pages is not None:
        page_context_info = f"Đây là trang {page_number} của tổng số {total_pages} trang tài liệu. Hãy xem xét thông tin này trong ngữ cảnh của toàn bộ tài liệu nếu có thể."

    if document_type == "prescription":
        system_prompt = f"""
        Bạn là trợ lý trích xuất thông tin từ đơn thuốc. {page_context_info} Hãy phân tích tài liệu đơn thuốc và trích xuất các thông tin sau cho mỗi thuốc:
        1. product_name: Tên thuốc
        2. dosage: Liều lượng
        3. quantity_value: Số lượng (phần số)
        4. quantity_unit: Đơn vị tính của số lượng
        5. usage_instruction: Hướng dẫn sử dụng
        {common_extraction_info}
        Đối với mỗi thuốc trong danh sách "products", hãy sử dụng các khóa: "product_name", "dosage", "quantity_value", "quantity_unit", "usage_instruction".
        """
    else:  # invoice
        system_prompt = f"""
        Bạn là trợ lý trích xuất thông tin từ hóa đơn thuốc. {page_context_info} Hãy phân tích tài liệu hóa đơn và trích xuất các thông tin sau cho mỗi sản phẩm:
        1. product_name: Tên sản phẩm
        2. quantity_value: Số lượng (phần số)
        3. quantity_unit: Đơn vị tính của số lượng
        4. unit_price: Đơn giá (phần số)
        5. total_price: Thành tiền (phần số)
        {common_extraction_info}
        Đối với mỗi sản phẩm trong danh sách "products", hãy sử dụng các khóa: "product_name", "quantity_value", "quantity_unit", "unit_price", "total_price".
        """

    data_url: str
    if file_type.lower() in ["jpeg", "jpg"]:
        data_url = f"data:image/jpeg;base64,{base64_content}"
    elif file_type.lower() == "png":
        data_url = f"data:image/png;base64,{base64_content}"
    elif file_type.lower() == "webp":
        data_url = f"data:image/webp;base64,{base64_content}"
    elif file_type.lower() == "gif":
        data_url = f"data:image/gif;base64,{base64_content}"
    else:
        data_url = f"data:application/octet-stream;base64,{base64_content}"  # Fallback
        logger.warn(f"Using fallback MIME type for file_type: {file_type} in extract_with_llm")

    user_content_parts: List[Dict[str, Any]] = [{"type": "image_url", "image_url": {"url": data_url}}]

    instructional_text = "Hãy phân tích hình ảnh được cung cấp (đây là một trang từ tài liệu gốc) và trích xuất thông tin theo yêu cầu vào định dạng JSON đã chỉ định."
    if page_context_info:
        instructional_text = f"{page_context_info} {instructional_text}"

    if ocr_text:
        user_content_parts.append(
            {"type": "text", "text": f"Văn bản OCR (tham khảo thêm nếu cần, đặc biệt nếu hình ảnh mờ):\n{ocr_text}"})
        # Modify instructional_text to acknowledge OCR text
        base_instruction = "Hãy phân tích hình ảnh và văn bản OCR kèm theo (nếu có) để trích xuất thông tin theo yêu cầu vào định dạng JSON đã chỉ định."
        if page_context_info:
            instructional_text = f"{page_context_info} {base_instruction}"
        else:
            instructional_text = base_instruction

    user_content_parts.append({"type": "text", "text": instructional_text})
    messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_content_parts)]

    try:
        page_info_log = f"(page {page_number}/{total_pages} from PDF, as {file_type})" if page_number else f"(image {file_type})"
        logger.info(f"Calling LLM for {document_type} document {page_info_log}. OCR text provided: {bool(ocr_text)}")

        response = await llm.ainvoke(messages)
        content = response.content if hasattr(response, 'content') else str(response)  # Ensure content is string

        logger.debug(f"LLM response {page_info_log} (first 500 chars): {content[:500]}...")

        extracted_data_full = extract_json_from_response(content, document_type)
        extracted_data_full["raw_text"] = ocr_text or ""

        products_typed = []
        llm_products = extracted_data_full.get("products", [])
        if not isinstance(llm_products, list):
            logger.warn(
                f"LLM {page_info_log} returned 'products' not as a list: {llm_products}. Defaulting to empty list.")
            llm_products = []

        for item in llm_products:
            if not isinstance(item, dict):
                logger.warn(f"Skipping non-dict item in products list {page_info_log}: {item}")
                continue
            if document_type == "prescription":
                products_typed.append(PrescriptionProduct(
                    product_name=item.get("product_name", "Không xác định"),
                    dosage=item.get("dosage"),
                    quantity_value=item.get("quantity_value"),
                    quantity_unit=item.get("quantity_unit"),
                    usage_instruction=item.get("usage_instruction")
                ))
            else:
                products_typed.append(InvoiceProduct(
                    product_name=item.get("product_name", "Không xác định"),
                    quantity_value=item.get("quantity_value"),
                    quantity_unit=item.get("quantity_unit"),
                    unit_price=item.get("unit_price"),
                    total_price=item.get("total_price")
                ))

        # Ensure patient_information is a dict as per Pydantic model and extract_json_from_response's goal
        final_patient_info = extracted_data_full.get("patient_information", {})  # Default to {} if missing
        if not isinstance(final_patient_info, dict):  # Double check, though extract_json_from_response should handle it
            logger.error(
                f"Critical: patient_information is not a dict after extract_json_from_response {page_info_log}. Value: {final_patient_info}, Type: {type(final_patient_info)}")
            final_patient_info = {"error": "failed to parse patient_information as dict",
                                  "original_value": str(final_patient_info)}

        return {
            "document_type": extracted_data_full.get("document_type", document_type),
            "raw_text": extracted_data_full.get("raw_text", ocr_text or ""),
            "products": [p.model_dump() for p in products_typed],
            "patient_information": final_patient_info,
            "document_date": extracted_data_full.get("document_date"),
            "issuing_organization": extracted_data_full.get("issuing_organization"),
            "medical_code": extracted_data_full.get("medical_code"),
            "invoice_id": extracted_data_full.get("invoice_id"),
            "prescription_id": extracted_data_full.get("prescription_id"),
            "prescribing_doctor": extracted_data_full.get("prescribing_doctor")
        }

    except Exception as e:
        page_info_log = f"(page {page_number})" if page_number else ""
        logger.error(f"LLM extraction error {page_info_log}: {str(e)}", exc_info=True)
        return {
            "document_type": document_type, "raw_text": ocr_text or "", "products": [],
            "patient_information": {},  # Ensure it's a dict on error
            "document_date": None, "issuing_organization": None,
            "medical_code": None, "invoice_id": None, "prescription_id": None, "prescribing_doctor": None
        }

def convert_image_to_jpeg(temp_file_orig_path: Path):
    with Image.open(temp_file_orig_path) as img:
        img_rgb = img
        if img.mode in ('RGBA', 'LA', 'P'):
            img_rgb = Image.new("RGB", img.size, (255, 255, 255))
            alpha_mask = None
            if img.mode == 'P' and 'transparency' in img.info:
                alpha_mask = img.convert('RGBA').split()[-1]
            elif 'A' in img.mode:
                alpha_mask = img.split()[-1]
            img_rgb.paste(img, (0, 0), mask=alpha_mask)
        elif img.mode != 'RGB':
            img_rgb = img.convert('RGB')

        fd_jpeg, temp_jpeg_path_str = tempfile.mkstemp(suffix=".jpeg")
        os.close(fd_jpeg)
        temp_jpeg_path = Path(temp_jpeg_path_str)

        img_rgb.save(temp_jpeg_path, "JPEG", quality=95)
        logger.info(f"Converted image to JPEG: {temp_jpeg_path}")
        return temp_jpeg_path,  "jpeg"

async def process_document(
        file: UploadFile,
        request: DocumentExtractionRequest
) -> DocumentExtractionResponse:
    temp_file_orig_path: Optional[Path] = None
    temp_image_page_path: Optional[Path] = None

    try:
        file_content = await file.read()
        await file.seek(0)

        file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        supported_image_exts = ['jpg', 'jpeg', 'png']

        if file_ext not in ['pdf'] + supported_image_exts:
            raise HTTPException(status_code=400, detail=f"Định dạng file không được hỗ trợ: {file_ext}.")

        ocr_available = is_tesseract_available()
        if not ocr_available :
            logger.warn("Tesseract OCR không khả dụng cho phương thức 'ocr'. Chuyển sang chế độ 'llm'.")
            # request.extraction_method = "llm"

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as temp_file_orig:
            temp_file_orig.write(file_content)
            temp_file_orig_path = Path(temp_file_orig.name)
        logger.info(f"Đã lưu file gốc tạm thời tại: {temp_file_orig_path}")

        all_pages_extracted_data: List[Dict[str, Any]] = []
        aggregated_raw_text_list = []

        if file_ext == 'pdf':
            logger.info("Xử lý file PDF bằng cách chuyển đổi sang hình ảnh từng trang...")
            poppler_bin_path_windows: Optional[str] = None

            try:
                pdf_poppler_path = None
                if os.name == 'nt' and poppler_bin_path_windows:
                    if Path(poppler_bin_path_windows).is_dir():
                        pdf_poppler_path = poppler_bin_path_windows
                        logger.info(f"Sử dụng Poppler path cho Windows: {pdf_poppler_path}")
                    else:
                        logger.warn(
                            f"Đường dẫn Poppler bin cho Windows được cung cấp không hợp lệ: {poppler_bin_path_windows}. Thử không có poppler_path.")

                images_from_path = convert_from_path(temp_file_orig_path, poppler_path=pdf_poppler_path)
                total_pages_processed = len(images_from_path)
                logger.info(f"PDF có {total_pages_processed} trang, đang chuyển đổi và xử lý từng trang.")

                for i, image_page in enumerate(images_from_path):
                    page_number = i + 1
                    fd, temp_image_page_path_str = tempfile.mkstemp(suffix=".jpeg")
                    os.close(fd)
                    temp_image_page_path = Path(temp_image_page_path_str)

                    image_page.save(temp_image_page_path, "JPEG")

                    logger.info(
                        f"Đang xử lý trang {page_number}/{total_pages_processed} của PDF (ảnh tạm: {temp_image_page_path})")

                    page_ocr_text: Optional[str] = None
                    if ocr_available:
                        page_ocr_text = extract_text_from_image(temp_image_page_path)
                        if page_ocr_text:
                            aggregated_raw_text_list.append(f"--- Trang {page_number} ---\n{page_ocr_text}\n")
                        logger.info(f"Trích xuất OCR từ trang {page_number} (ảnh): {len(page_ocr_text or '')} ký tự.")

                    if page_ocr_text:
                        current_page_document_type = (page_ocr_text)
                    else:
                        current_page_document_type = "prescription"

                    page_extracted_data = await extract_with_llm(
                        file_path=temp_image_page_path,
                        document_type=current_page_document_type,
                        file_type="jpeg",
                        ocr_text=page_ocr_text,
                        page_number=page_number,
                        total_pages=total_pages_processed
                    )
                    all_pages_extracted_data.append(page_extracted_data)
                    os.unlink(temp_image_page_path)
                    temp_image_page_path = None

                final_document_type = "prescription"
                if all_pages_extracted_data:
                    type_counts = {}
                    for data in all_pages_extracted_data:
                        dt = data.get("document_type", "prescription")
                        type_counts[dt] = type_counts.get(dt, 0) + 1
                    if type_counts:
                        final_document_type = max(type_counts, key=type_counts.get)
                    else:
                        final_document_type = "prescription"

            except PDFInfoNotInstalledError as e:
                logger.error(
                    f"Lỗi Poppler: {str(e)}. Đảm bảo Poppler đã được cài đặt và trong PATH, hoặc chỉ định 'poppler_path' chính xác cho Windows.",
                    exc_info=True)
                raise HTTPException(status_code=500,
                                    detail=f"Lỗi xử lý PDF: Poppler không được tìm thấy hoặc cấu hình sai. Chi tiết: {str(e)}")
            except (PDFPageCountError, PDFSyntaxError, PDFPopplerTimeoutError) as e:
                logger.error(f"Lỗi xử lý PDF với pdf2image: {str(e)}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Lỗi xử lý file PDF: {str(e)}.")
            except Exception as e:
                logger.error(f"Lỗi không mong muốn khi xử lý PDF thành ảnh: {str(e)}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Lỗi không mong muốn khi chuyển đổi PDF: {str(e)}")

        else:
            total_pages_processed = 1
            logger.info(f"Xử lý file hình ảnh gốc: {file.filename} ({file_ext})")

            temp_image_to_process_path = temp_file_orig_path
            processed_file_type_for_llm = file_ext

            if file_ext not in ["jpeg", "jpg"]:
                try:
                    logger.info(f"Attempting to convert image {file.filename} to JPEG for consistency.")
                    temp_image_to_process_path, processed_file_type_for_llm = convert_image_to_jpeg(temp_file_orig_path)

                except Exception as e_img_convert:
                    logger.warn(f"Could not convert image {file.filename} to JPEG: {e_img_convert}. Using original.")

            ocr_text_for_llm: Optional[str] = None
            if ocr_available:
                ocr_text_for_llm = extract_text_from_image(temp_image_to_process_path)
                if ocr_text_for_llm:
                    aggregated_raw_text_list.append(ocr_text_for_llm)
                logger.info(f"Trích xuất OCR từ hình ảnh '{file.filename}': {len(ocr_text_for_llm or '')} ký tự.")

            if ocr_text_for_llm:
                final_document_type = detect_layout_type(ocr_text_for_llm)
            else:
                final_document_type = "prescription"

            single_page_data = await extract_with_llm(
                file_path=temp_image_to_process_path,
                document_type=final_document_type,
                file_type=processed_file_type_for_llm,
                ocr_text=ocr_text_for_llm,
                page_number=1,
                total_pages=1
            )
            all_pages_extracted_data.append(single_page_data)

            if temp_image_to_process_path != temp_file_orig_path and os.path.exists(temp_image_to_process_path):
                os.unlink(temp_image_to_process_path)

        if not all_pages_extracted_data:
            logger.error("Không có dữ liệu nào được trích xuất từ các trang.")
            raise HTTPException(status_code=500, detail="Không thể trích xuất dữ liệu từ tài liệu.")

        final_result: Dict[str, Any] = {
            "document_type": final_document_type,
            "raw_text": "\n".join(aggregated_raw_text_list).strip(),
            "products": [],
            "patient_information": {},
            "document_date": None, "issuing_organization": None, "medical_code": None,
            "invoice_id": None, "prescription_id": None, "prescribing_doctor": None
        }

        first_patient_info_found = False
        first_doc_date_found = False

        for page_data in all_pages_extracted_data:
            final_result["products"].extend(page_data.get("products", []))

            current_page_patient_info = page_data.get("patient_information")
            if isinstance(current_page_patient_info,
                          dict) and current_page_patient_info and not first_patient_info_found:
                final_result["patient_information"] = current_page_patient_info
                first_patient_info_found = True

            if not final_result["document_date"] and page_data.get("document_date"):
                final_result["document_date"] = page_data["document_date"]
            if not final_result["issuing_organization"] and page_data.get("issuing_organization"):
                final_result["issuing_organization"] = page_data["issuing_organization"]

        if not isinstance(final_result["patient_information"], dict):
            final_result["patient_information"] = {}

        document_id = await save_document(
            document_type=final_result["document_type"],
            raw_text=final_result["raw_text"],
            products=final_result["products"],
            file_name=file.filename,
            request_id=request.request_id,
            total_pages=total_pages_processed,
            current_page=total_pages_processed,
            patient_information=final_result.get("patient_information"),
            document_date=final_result.get("document_date"),
            issuing_organization=final_result.get("issuing_organization"),
            medical_code=final_result.get("medical_code"),
            invoice_id=final_result.get("invoice_id"),
            prescription_id=final_result.get("prescription_id"),
            prescribing_doctor=final_result.get("prescribing_doctor")
        )

        return DocumentExtractionResponse(
            document_id=document_id,
            document_type=final_result["document_type"],
            raw_text=final_result["raw_text"],
            products=final_result["products"],
            total_pages=total_pages_processed,
            current_page=total_pages_processed,
            patient_information=final_result.get("patient_information"),
            document_date=final_result.get("document_date"),
            issuing_organization=final_result.get("issuing_organization"),
            medical_code=final_result.get("medical_code"),
            invoice_id=final_result.get("invoice_id"),
            prescription_id=final_result.get("prescription_id"),
            prescribing_doctor=final_result.get("prescribing_doctor")
        )

    except HTTPException as he:
        logger.error(f"HTTP Exception trong quá trình xử lý tài liệu: {str(he.detail)}",
                     exc_info=False)
        raise he
    except Exception as e:
        logger.error(f"Lỗi xử lý tài liệu không mong muốn: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý tài liệu nghiêm trọng: {str(e)}")
    finally:
        if temp_file_orig_path and os.path.exists(temp_file_orig_path):
            try:
                os.unlink(temp_file_orig_path)
                logger.info(f"Đã xóa file gốc tạm thời cuối cùng: {temp_file_orig_path}")
            except Exception as e_unlink:
                logger.error(f"Không thể xóa file gốc tạm thời {temp_file_orig_path}: {e_unlink}")
        if temp_image_page_path and os.path.exists(temp_image_page_path):
            try:
                os.unlink(temp_image_page_path)
                logger.warn(f"Đã xóa file ảnh trang tạm thời còn sót lại: {temp_image_page_path}")
            except Exception as e_unlink_page:
                logger.error(f"Không thể xóa file ảnh trang tạm thời {temp_image_page_path}: {e_unlink_page}")


async def extract_drug_information(
        files: List[UploadFile],
        extraction_method: str = "hybrid"
) -> Dict[str, Any]:
    if len(files) > 2:
        raise HTTPException(status_code=400, detail="Maximum 2 images allowed")

    all_drugs = []
    combined_raw_text = []

    for file in files:
        temp_file_path = None
        try:
            file_content = await file.read()
            await file.seek(0)

            file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
            supported_image_exts = ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif']

            if file_ext not in supported_image_exts:
                raise HTTPException(status_code=400,
                                    detail=f"Unsupported file format: {file_ext}. Only images are supported.")

            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as temp_file:
                temp_file.write(file_content)
                temp_file_path = Path(temp_file.name)

            ocr_text = None
            ocr_available = is_tesseract_available()
            if extraction_method in ["ocr", "hybrid"] and ocr_available:
                ocr_text = extract_text_from_image(temp_file_path)
                if ocr_text:
                    combined_raw_text.append(ocr_text)

            if extraction_method in ["llm", "hybrid"]:
                system_prompt = """
                Bạn là trợ lý trích xuất thông tin về thuốc. Hãy phân tích hình ảnh thuốc được cung cấp và trích xuất các thông tin sau:

                1. name: Tên thuốc
                2. brand: Nhãn hiệu thuốc
                3. origin: Xuất xứ (quốc gia sản xuất)
                4. serial_number: Số hiệu/mã thuốc
                5. dosage_form: Dạng bào chế (viên, siro, ống tiêm, v.v.)
                6. active_ingredients: Hoạt chất chính (phải là danh sách các chuỗi)
                7. composition: Thành phần
                8. manufacturer: Nhà sản xuất
                9. expiration_date: Hạn sử dụng
                10. batch_number: Số lô
                11. registration_number: Số đăng ký
                12. additional_info: Thông tin bổ sung (phải là một đối tượng JSON)

                Trả về kết quả dưới dạng JSON với các trường trên. Nếu không thể xác định thông tin nào đó, để giá trị là null.
                Chú ý rằng thuốc có thể là thuốc sản xuất tại Việt Nam hoặc thuốc nhập khẩu.
                """

                base64_content = encode_image_to_base64(temp_file_path)
                data_url = f"data:image/{file_ext};base64,{base64_content}"

                user_content_parts = [{"type": "image_url", "image_url": {"url": data_url}}]

                if ocr_text:
                    user_content_parts.append(
                        {"type": "text", "text": f"OCR text tham khảo (nếu hình ảnh không rõ):\n{ocr_text}"}
                    )

                user_content_parts.append({"type": "text", "text": "Hãy trích xuất thông tin thuốc từ hình ảnh này."})
                messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_content_parts)]

                try:
                    response = await llm.ainvoke(messages)
                    content = response.content if hasattr(response, 'content') else str(response)

                    drug_info = {}
                    try:
                        drug_info = json.loads(content)
                    except json.JSONDecodeError:
                        json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
                        match = re.search(json_pattern, content)
                        if match:
                            try:
                                drug_info = json.loads(match.group(1))
                            except json.JSONDecodeError:
                                logger.warn("Failed to parse JSON from markdown code block in LLM response.")

                    additional_info = drug_info.get("additional_info", {})
                    if not isinstance(additional_info, dict):
                        if isinstance(additional_info, str):
                            additional_info = {"description": additional_info}
                        else:
                            additional_info = {}

                    drug_data = {
                        "name": drug_info.get("name"),
                        "brand": drug_info.get("brand"),
                        "origin": drug_info.get("origin"),
                        "serial_number": drug_info.get("serial_number"),
                        "dosage_form": drug_info.get("dosage_form"),
                        "active_ingredients": drug_info.get("active_ingredients"),
                        "composition": drug_info.get("composition"),
                        "manufacturer": drug_info.get("manufacturer"),
                        "expiration_date": drug_info.get("expiration_date"),
                        "batch_number": drug_info.get("batch_number"),
                        "registration_number": drug_info.get("registration_number"),
                        "additional_info": additional_info
                    }
                    all_drugs.append(drug_data)

                except Exception as e:
                    logger.error(f"LLM extraction error: {str(e)}", exc_info=True)

            if extraction_method == "ocr" and ocr_available and not all_drugs:
                all_drugs.append({
                    "name": None,
                    "description": "OCR extraction only - structured data not available",
                    "additional_info": {"ocr_text": ocr_text or ""}
                })

        except Exception as e:
            logger.error(f"Error processing drug image: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.unlink(temp_file_path)
                except Exception as e_unlink:
                    logger.error(f"Could not delete temp file {temp_file_path}: {e_unlink}")

    return {
        "drugs": all_drugs,
        "raw_text": "\n".join(combined_raw_text),
        "extraction_method": extraction_method
    }