import uuid
from typing import Optional

from fastapi import APIRouter, Body, WebSocket
from starlette import status
from pydantic import BaseModel

from core import logger as app_logger
from core import response
from models.chatbot import create_or_update_chatbot_session, add_chatbot_message
from models.chatbot_websocket_handler import handle_chatbot_websocket_connection
from core.websocket import manager as ws_manager
from services import chatbot

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    session_id: str


class StartConversationResponseData(BaseModel):
    session_id: str

@router.post("/conversation/start", response_model=response.BaseResponse)
async def start_conversation_endpoint():
    try:
        new_session_id = str(uuid.uuid4())
        session_document = await create_or_update_chatbot_session(
            session_id=new_session_id,
            user_id=None
        )

        if not session_document or "_id" not in session_document:
            app_logger.error(f"Failed to create session in database for session_id: {new_session_id}")
            return response.BaseResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Failed to initialize conversation session in the database."
            )

        app_logger.info(f"New conversation session created successfully in database. Session ID: {new_session_id}")

        return response.BaseResponse(
            message="New conversation session started successfully.",
            data=StartConversationResponseData(session_id=new_session_id)
        )
    except Exception as e:
        app_logger.error(f"Error starting new conversation: {e}", exc_info=True)
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error while starting new conversation."
        )


@router.post("/message", response_model=response.BaseResponse)
async def chat_message_endpoint(chat_request: ChatRequest = Body(...)):
    try:
        app_logger.info(
            f"Received chat request for session_id: {chat_request.session_id}, question: '{chat_request.question}'")

        ai_answer_content = chatbot.generate_response(
            session_id=chat_request.session_id,
            user_input=chat_request.question
        )

        app_logger.info(f"AI response content for session_id {chat_request.session_id}: '{ai_answer_content}'")

        bot_sender_id = "chatbot_v1"

        saved_ai_message = await add_chatbot_message(
            session_id=chat_request.session_id,
            sender_type="ai",
            content=ai_answer_content,
            sender_id=bot_sender_id,
            message_type="text"
        )

        if not saved_ai_message or "_id" not in saved_ai_message:
            app_logger.error(
                f"Failed to save AI message to database for session {chat_request.session_id}. `add_chatbot_message` returned: {saved_ai_message}")

        return response.BaseResponse(
            message="AI response successfully generated and processed.",
            data={"ai_answer": ai_answer_content}
        )
    except Exception as e:
        app_logger.error(f"Error processing chat message for session_id {chat_request.session_id}: {e}", exc_info=True)
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error while processing chat message."
        )


@router.websocket("/ws/chatbot/{session_id}")
async def websocket_chatbot_endpoint(
        websocket: WebSocket,
        session_id: str,
):
    user_id_for_ws: Optional[str] = None

    await handle_chatbot_websocket_connection(
        websocket=websocket,
        session_id=session_id,
        user_id=user_id_for_ws,
        manager=ws_manager
    )