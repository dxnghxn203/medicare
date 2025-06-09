
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse

from app.core.response import BaseResponse
from app.core.sepay import logger
from app.entities.payment import GeneratePaymentQr, ItemCallBackReq
from app.middleware import middleware
from app.models.payment import PaymentModel
from app.models.transaction import create_transaction

router = APIRouter()

@router.post("/payment/qr")
async def generate_sepay_qr(request: GeneratePaymentQr):
    try:
        qr_data = await PaymentModel.generate_sepay_qr(**request.dict())
        if not qr_data:
            return BaseResponse(status_code=404, message="not found bank")

        return StreamingResponse(
            status_code=200,
            content=iter([qr_data]),
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename=sepay_qr_{request.order_id}.png'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payment/callback")
async def payment_callback(request: ItemCallBackReq):
    try:
        logger.info(f"request: {request}")
        created = await create_transaction(request.dict())
        result = await PaymentModel.call_add_order_api(request.code)
        logger.info(f"result: {result}")
        return BaseResponse(status_code=200, message="success")
    except Exception as e:
        logger.error(f"Error payment callback: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

