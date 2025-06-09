# from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
# from typing import Optional, Literal, Annotated
# from datetime import datetime
# from bson import ObjectId
#
# PyObjectId = Annotated[
#     ObjectId,
#     BeforeValidator(lambda v: ObjectId(v) if ObjectId.is_valid(v) else v)
# ]
#
# class ParticipantRef(BaseModel):
#     id: str = Field(..., description="session_id hoặc user_id")
#     type: Literal['guest', 'user'] = Field(..., description="Loại người tham gia")
#
# class PharmacistRef(BaseModel):
#     id: str = Field(..., description="ID của dược sĩ")
#     name: str = Field(..., description="Tên dược sĩ")
#
# class Conversation(BaseModel):
#     id: Optional[PyObjectId] = Field(default=None, alias="_id", description="ID duy nhất của cuộc trò chuyện (MongoDB ObjectId)")
#     participant_1_ref: ParticipantRef = Field(..., description="Người khởi tạo (Khách/User)")
#     pharmacist_ref: Optional[PharmacistRef] = Field(default=None, description="Dược sĩ tham gia")
#     status: Literal['waiting', 'active', 'closed'] = Field(default='waiting', description="Trạng thái cuộc trò chuyện")
#     created_at: datetime = Field(default_factory=datetime.utcnow, description="Thời điểm tạo")
#     pharmacist_joined_at: Optional[datetime] = Field(default=None, description="Thời điểm dược sĩ tham gia")
#     last_message_at: datetime = Field(default_factory=datetime.utcnow, description="Thời điểm tin nhắn cuối (cho TTL)")
#     closed_at: Optional[datetime] = Field(default=None, description="Thời điểm đóng cuộc trò chuyện")
#
#     model_config = ConfigDict(
#         populate_by_name=True,
#         arbitrary_types_allowed=True,
#         json_encoders={
#             PyObjectId: str
#         },
#         json_schema_extra={
#             "example": {
#                 "_id": "60c72b2f9b1e8a3f9c8b4567",
#                 "participant_1_ref": {
#                     "id": "sess_abc123",
#                     "type": "guest"
#                 },
#                 "pharmacist_ref": {
#                     "id": "pharm_xyz789",
#                     "name": "Dược sĩ An"
#                 },
#                 "status": "active",
#                 "created_at": "2025-05-03T09:15:00Z",
#                 "pharmacist_joined_at": "2025-05-03T09:16:10Z",
#                 "last_message_at": "2025-05-03T09:20:30Z",
#                 "closed_at": None
#             }
#         }
#     )
#
# class SenderInfo(BaseModel):
#     id: str = Field(..., description="session_id, user_id, hoặc pharmacist_id")
#     type: Literal['guest', 'user', 'pharmacist'] = Field(..., description="Loại người gửi")
#
# class MessageContent(BaseModel):
#     text: Optional[str] = Field(default=None, description="Nội dung dạng text")
#     image_url: Optional[str] = Field(default=None, description="URL của hình ảnh đính kèm")
#
# class Message(BaseModel):
#     id: Optional[PyObjectId] = Field(default=None, alias="_id", description="ID duy nhất của tin nhắn (MongoDB ObjectId)")
#     conversation_id: PyObjectId = Field(..., description="ID của cuộc trò chuyện mà tin nhắn này thuộc về")
#     sender: SenderInfo = Field(..., description="Thông tin người gửi")
#     content: MessageContent = Field(..., description="Nội dung tin nhắn")
#     timestamp: datetime = Field(default_factory=datetime.utcnow, description="Thời điểm gửi/ghi nhận tin nhắn")
#
#     model_config = ConfigDict(
#         populate_by_name=True,
#         arbitrary_types_allowed=True,
#         json_schema_extra={
#             "example": {
#                 "_id": "60c72b3a9b1e8a3f9c8b4568",
#                 "conversation_id": "60c72b2f9b1e8a3f9c8b4567",
#                 "sender": {
#                     "id": "pharm_xyz789",
#                     "type": "pharmacist"
#                 },
#                 "content": {
#                     "text": "Chào bạn, tôi có thể giúp gì?",
#                     "image_url": None
#                 },
#                 "timestamp": "2025-05-03T09:18:00Z"
#             }
#         }
#     )
#
#
#


from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, Field, EmailStr
from app.core.websocket import PyObjectId


class ConversationBase(BaseModel):
    guest_id: Optional[PyObjectId] = None  # None nếu là khách chưa đăng ký
    guest_name: str
    guest_email: Optional[EmailStr] = None
    guest_phone: Optional[str] = None
    pharmacist_id: Optional[PyObjectId] = None
    status: Literal["waiting", "active", "closed"] = "waiting"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ConversationCreate(ConversationBase):
    pass


class ConversationUpdate(BaseModel):
    pharmacist_id: Optional[PyObjectId] = None
    status: Optional[Literal["waiting", "active", "closed"]] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ConversationInDB(ConversationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str
        }


class MessageBase(BaseModel):
    conversation_id: PyObjectId
    content: str
    sender_type: Literal['guest', 'pharmacist']
    sender_id: Optional[PyObjectId] = None
    message_type: Literal['text', 'image', 'prescription', 'product'] = 'text'
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MessageCreate(MessageBase):
    pass


class MessageInDB(MessageBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str
        }