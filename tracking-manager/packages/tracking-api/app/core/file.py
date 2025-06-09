import base64
from fastapi import UploadFile
from app.core import logger

async def create_image_json_payload(file) -> dict:
    try:
        if not file:
            return {}

        file_name = file.filename
        file_type = file.content_type

        contents = await file.read()

        file_data = base64.b64encode(contents).decode("utf-8")

        return {
            "file_name": file_name,
            "file_data": file_data,
            "file_type": file_type
        }
    except Exception as e:
        logger.error(f"Error creating image JSON payload: {str(e)}")
        return {}