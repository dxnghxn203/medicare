from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class GeneratePaymentQr(BaseModel):
    bank_id: str = Field(..., description="Bank ID")
    order_id: str = Field(..., description="Order ID for payment")
    amount: float = Field(..., description="Payment amount")

class ItemCallBackReq(BaseModel):
    gateway: str = None
    transactionDate: str = None
    accountNumber: str = None
    subAccount: Optional[str] = None
    code: Optional[str] = None
    content: str = None
    transferType: str = None
    description: str = None
    transferAmount: int = None
    referenceCode: str = None
    accumulated: int = None
    id: int = None
    created_at: datetime = datetime.now()



