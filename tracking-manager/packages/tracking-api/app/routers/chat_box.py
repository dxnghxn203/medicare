from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Body, Query, Path, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field
from starlette import status

from app.core import logger, response
from app.middleware import middleware
from app.models import user, pharmacist
from app.models.chat_box import (
    create_guest_conversation,
    create_user_conversation,
    get_waiting_conversations,
    accept_conversation,
    get_conversation,
    handle_websocket_connection
)

router = APIRouter()


class GuestConversationRequest(BaseModel):
    guest_name: str
    guest_email: Optional[EmailStr] = None
    guest_phone: Optional[str] = None


class UserConversationRequest(BaseModel):
    guest_name: str
    guest_email: Optional[EmailStr] = None
    guest_phone: Optional[str] = None



@router.post("/conversations/guest", response_model=response.BaseResponse)
async def create_guest_chat(request: GuestConversationRequest = Body(...)):
    try:
        conversation = await create_guest_conversation(
            guest_name=request.guest_name,
            guest_email=request.guest_email,
            guest_phone=request.guest_phone
        )

        if "_id" in conversation:
            conversation["_id"] = str(conversation["_id"])

        return response.BaseResponse(
            message="Tạo thành công!",
            data=conversation
        )
    except Exception as e:
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.post("/conversations/user", response_model=response.BaseResponse)
async def create_user_chat(
        token: str = Depends(middleware.verify_token)
):
    try:
        user_cur = await user.get_current(token)
        if not user_cur:
            return response.BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                status="error",
                message="User not found",
                data=None
            )
        conversation = await create_user_conversation(
            user_id=user_cur.id,
            guest_name=user_cur.user_name,
            guest_email=user_cur.email,
            guest_phone=user_cur.phone_number
        )

        if "_id" in conversation:
            conversation["_id"] = str(conversation["_id"])

        return response.BaseResponse(
            message="Tạo thành công!",
            data=conversation
        )
    except Exception as e:
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.get("/conversations/waiting", response_model=response.BaseResponse)
async def get_waiting_chats(
        page: int = 1,
        page_size: int = 10,
):
    try:
        conversations = await get_waiting_conversations(page, page_size)

        return response.BaseResponse(
            message="Lấy thành công!",
            data=conversations
        )

    except Exception as e:
        logger.error(f"Error fetching waiting conversations: {e}")
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.patch("/conversations/{conversation_id}/accept", response_model=response.BaseResponse)
async def accept_chat(
        conversation_id: str = Path(...),
        token: str = Depends(middleware.verify_token_pharmacist)
):
    try:
        pharmacist_info = await pharmacist.get_current(token)
        conversation = await accept_conversation(conversation_id, pharmacist_info.id)
        if not conversation:
            return response.BaseResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy hội thoại hoặc hội thoại không ở trạng thái chờ"
            )

        if "_id" in conversation:
            conversation["_id"] = str(conversation["_id"])

        return  response.BaseResponse(
            message="Tham gia thành công!",
            data=conversation
        )

    except Exception as e:
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.get("/conversations/{conversation_id}", response_model=Dict[str, Any])
async def get_chat_details(conversation_id: str = Path(...)):
    """Lấy thông tin chi tiết của hội thoại"""
    conversation = await get_conversation(conversation_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Không tìm thấy hội thoại")

    if "_id" in conversation:
        conversation["_id"] = str(conversation["_id"])

    return conversation


@router.websocket("/ws/{conversation_id}/{client_type}")
async def websocket_chat(
        websocket: WebSocket,
        conversation_id: str,
        client_type: str,
        user_id: Optional[str] = None
):
    try:
        await handle_websocket_connection(websocket, conversation_id, client_type, user_id)
    except Exception as e:
        logger.info(e)