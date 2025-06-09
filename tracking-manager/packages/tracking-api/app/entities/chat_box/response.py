from pydantic import BaseModel
from datetime import datetime

class WaitingConversationInfo(BaseModel):
    conversation_id: str
    user_type: str
    waiting_since: datetime