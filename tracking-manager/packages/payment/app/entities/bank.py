from pydantic import BaseModel, Field

class BankQRRequest(BaseModel):
    order_id: str = Field(..., description="Order ID")
    bank_id: str = Field(..., description="Bank code")
    amount: float = Field(default=0, description="Payment amount")

