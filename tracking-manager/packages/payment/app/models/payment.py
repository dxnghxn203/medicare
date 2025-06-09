import os
from typing import Optional

import httpx

from app.core import response
from app.core.bank_utils import get_bank_by_code
from app.core.sepay import SepayQR, logger


class PaymentModel:
    @staticmethod
    async def generate_sepay_qr(
        bank_id: str,
        order_id: str,
        amount: float 
    ) -> Optional[bytes]:
        bank = get_bank_by_code(bank_id)
        if not bank:
            logger.error(f"Bank not found: {bank_id}")
            return None
        return await SepayQR.generate_qr(
            account=bank['account_number'],
            bank=bank_id,
            amount=amount,
            description=order_id,
            template="template",
            download=False
        )

    @staticmethod
    async def call_add_order_api(order_id: str):
        qr_payload = {
            "order_id": order_id,
        }
        TRACKING_API_URL = os.getenv("TRACKING_API_URL")

        async with httpx.AsyncClient() as client:
            result = await client.post(
                f"{TRACKING_API_URL}/v1/order/add",
                headers={"accept": "application/json", "Content-Type": "application/json"},
                json=qr_payload
            )

        response_json = result.json()
        logger.info(response_json)

        message = response_json.get("message", "No message returned")

        if result.status_code != 200:
            logger.error(f"Failed to callback: {message}")
            return response.BaseResponse(status_code=500, message=message)

        return response.BaseResponse(status_code=200, message=message)