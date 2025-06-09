import os
import tempfile
from typing import Union, List, Optional
from pathlib import Path
import subprocess

# Sử dụng logger đã cấu hình
from core import logger

TESSERACT_AVAILABLE = False
try:
    import cv2
    import pytesseract
    from PIL import Image
    import numpy as np

    subprocess.check_output(['tesseract', '--version'])
    TESSERACT_AVAILABLE = True
except (ImportError, subprocess.SubprocessError, FileNotFoundError):
    pass


def is_tesseract_available() -> bool:
    return TESSERACT_AVAILABLE


def preprocess_image(image_path: Union[str, Path]) -> np.ndarray:
    if not TESSERACT_AVAILABLE:
        return None

    img = cv2.imread(str(image_path))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    kernel = np.ones((1, 1), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)

    eroded = cv2.erode(dilated, kernel, iterations=1)

    return eroded


def extract_text_from_image(image_path: Union[str, Path], preprocess: bool = True) -> str:
    if not TESSERACT_AVAILABLE:
        logger.warn("Tesseract OCR không khả dụng. Bỏ qua bước OCR.")
        return ""

    try:
        config = r'--oem 3 --psm 6 -l vie'

        if preprocess:
            processed_img = preprocess_image(image_path)

            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp:
                cv2.imwrite(temp.name, processed_img)
                temp_path = temp.name

            text = pytesseract.image_to_string(Image.open(temp_path), config=config)
            os.unlink(temp_path)
        else:
            text = pytesseract.image_to_string(Image.open(image_path), config=config)

        return text

    except Exception as e:
        logger.error(f"OCR error for {image_path}: {str(e)}")
        return ""


def detect_layout_type(text: str) -> str:
    if not text:
        logger.info("Không có text OCR để phân loại. Mặc định là đơn thuốc.")
        return "prescription"

    prescription_keywords = [
        "đơn thuốc", "kê đơn", "chẩn đoán", "liều dùng", "ngày uống",
        "bác sĩ", "điều trị", "cách dùng", "bệnh nhân", "khám bệnh"
    ]

    invoice_keywords = [
        "hóa đơn", "thanh toán", "tổng tiền", "thành tiền", "đơn giá",
        "số lượng", "chiết khấu", "vat", "thuế", "nhà thuốc", "khách hàng"
    ]

    prescription_matches = sum(1 for kw in prescription_keywords if kw.lower() in text.lower())
    invoice_matches = sum(1 for kw in invoice_keywords if kw.lower() in text.lower())

    if prescription_matches > invoice_matches:
        return "prescription"
    elif invoice_matches > prescription_matches:
        return "invoice"
    else:
        return "prescription"