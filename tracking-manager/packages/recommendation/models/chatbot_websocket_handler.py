import json
import traceback
from datetime import datetime
from typing import Optional
from fastapi import WebSocket

from core import logger
from models.chatbot import add_chatbot_message, create_or_update_chatbot_session, get_chatbot_messages_by_session


async def handle_chatbot_websocket_connection(
        websocket: WebSocket,
        session_id: str,
        user_id: Optional[str] = None,
        manager=None
) -> None:
    if manager is None:
        from core.websocket import manager as ws_manager
        manager = ws_manager

    logger.info(
        f"User (ID: {user_id if user_id else 'anonymous'}) connecting to chatbot session {session_id} at {datetime.utcnow().isoformat()}")

    current_session = await create_or_update_chatbot_session(session_id, user_id)
    if not current_session:
        logger.error(f"Failed to create or update session {session_id} for WebSocket.")
        await websocket.close(code=1008, reason="Không thể khởi tạo session chat")
        return

    try:
        await manager.connect(websocket, session_id, "user")
        logger.info(f"User (ID: {user_id}) connected to chatbot session {session_id}")

        await websocket.send_json({
            "type": "connection_established",
            "session_id": session_id,
            "session_info": {
                "user_id": current_session.get("user_id"),
                "created_at": current_session.get("created_at").isoformat() if current_session.get(
                    "created_at") else None,
                "last_activity_at": current_session.get("last_activity_at").isoformat() if current_session.get(
                    "last_activity_at") else None,
            }
        })

        messages_history = await get_chatbot_messages_by_session(session_id, limit=100)

        formatted_history = []
        for msg in messages_history:
            if "created_at" in msg and isinstance(msg["created_at"], datetime):
                msg["created_at"] = msg["created_at"].isoformat()
            formatted_history.append(msg)

        await websocket.send_json({
            "type": "message_history",
            "messages": formatted_history
        })

        while True:
            try:
                raw_data = await websocket.receive()

                if raw_data["type"] == "websocket.disconnect":
                    logger.info(f"User (ID: {user_id}) initiated disconnect for session {session_id}")
                    break

                if raw_data["type"] != "websocket.receive":
                    logger.debug(f"Ignoring non-receive WebSocket message: {raw_data['type']}")
                    continue

                data_text = raw_data.get("text")
                if not data_text:
                    logger.warn(f"Received WebSocket message without text data in session {session_id}")
                    continue

                try:
                    data = json.loads(data_text)
                except json.JSONDecodeError as e:
                    logger.warn(
                        f"Invalid JSON from user (ID: {user_id}) in session {session_id}: {data_text[:100]}... - Error: {str(e)}")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid JSON format. Please send properly formatted JSON data.",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                    continue

                message_event_type = data.get("type")

                if message_event_type == "user_message":
                    content = data.get("content")
                    if not content or not content.strip():
                        await websocket.send_json({
                            "type": "error",
                            "message": "Message content is required for user_message",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                        continue

                    new_user_message = await add_chatbot_message(
                        session_id=session_id,
                        content=content,
                        sender_type="user",
                        sender_id=user_id,
                        message_type=data.get("message_type", "text")
                    )

                    if "_id" not in new_user_message:
                        await websocket.send_json({
                            "type": "error",
                            "message": "Failed to save user message to database.",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                        continue

                    await websocket.send_json({
                        "type": "user_message_received_by_server",
                        "message_id": new_user_message["_id"],
                        "session_id": session_id,
                        "timestamp": new_user_message.get("created_at").isoformat() if new_user_message.get(
                            "created_at") else datetime.utcnow().isoformat()
                    })

                elif message_event_type == "ping":
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat()
                    })

                else:
                    logger.warn(
                        f"Unsupported message type from user (ID: {user_id}) in session {session_id}: {message_event_type}")
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Unsupported message type: {message_event_type}",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            except Exception as e:
                logger.error(f"Error processing message in session {session_id} for user (ID: {user_id}): {str(e)}")
                logger.error(traceback.format_exc())
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Server error processing your message",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                except Exception:
                    break

    except Exception as e:
        error_msg = f"Error in chatbot WebSocket connection for session {session_id}, user (ID: {user_id}): {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        try:
            await websocket.close(code=1011, reason="Server error in WebSocket handling")
        except Exception:
            pass

    finally:
        disconnected_info = manager.disconnect(websocket, session_id, "user")
        if disconnected_info:
            logger.info(f"User (ID: {user_id}) disconnected from chatbot session {session_id}")
