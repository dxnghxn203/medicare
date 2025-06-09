import json
import traceback

from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import WebSocket
from pydantic import EmailStr

from app.core import logger
from app.core.database import db
from app.models.pharmacist import get_pharmacist_by_user_id

conversations = db['conversations']
messages = db['messages']


async def create_guest_conversation(guest_name: str, guest_email: Optional[str] = None,
                                    guest_phone: Optional[str] = None) -> Dict[str, Any]:
    conversation_data = {
        "guest_name": guest_name,
        "guest_email": guest_email,
        "guest_phone": guest_phone,
        "guest_id": None,
        "type":"guest",
        "pharmacist_id": None,
        "status": "waiting",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = conversations.insert_one(conversation_data)
    conversation_data["_id"] = result.inserted_id
    return conversation_data


async def create_user_conversation(user_id: str, guest_name: str, guest_email: Optional[EmailStr] = None,
                                   guest_phone: Optional[str] = None) -> Dict[str, Any]:
    conversation_data = {
        "guest_name": guest_name,
        "guest_email": guest_email,
        "guest_phone": guest_phone,
        "guest_id": user_id,
        "type": "user",
        "pharmacist_id": None,
        "status": "waiting",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = conversations.insert_one(conversation_data)
    conversation_data["_id"] = result.inserted_id
    return conversation_data


async def get_waiting_conversations(page, page_size):
    skip_count = (page - 1) * page_size
    cursor = conversations.find({"status": "waiting"}).sort("created_at", 1)

    conversations_list =  cursor.skip(skip_count).limit(page_size).to_list(length=page_size)

    return {
        "total":  conversations.count_documents({"status": "waiting"}),
        "conversations": [{
            "_id": str(conv["_id"]),
            **{key: value for key, value in conv.items() if key != "_id"}
        } for conv in conversations_list]
    }

async def get_conversation(conversation_id: str) -> Optional[Dict[str, Any]]:
    if not ObjectId.is_valid(conversation_id):
        return None

    return conversations.find_one({"_id": ObjectId(conversation_id)})


async def accept_conversation(conversation_id: str, pharmacist_id: str) -> Optional[Dict[str, Any]]:
    if not ObjectId.is_valid(conversation_id):
        return None

    result = conversations.find_one_and_update(
        {"_id": ObjectId(conversation_id), "status": "waiting"},
        {"$set": {
            "pharmacist_id": pharmacist_id,
            "status": "active",
            "updated_at": datetime.utcnow()
        }},
        return_document=True
    )

    return result


async def update_conversation_status(conversation_id: str, status: str) -> Optional[Dict[str, Any]]:
    if not ObjectId.is_valid(conversation_id):
        return None

    result = await conversations.find_one_and_update(
        {"_id": ObjectId(conversation_id)},
        {"$set": {
            "status": status,
            "updated_at": datetime.utcnow()
        }},
        return_document=True
    )

    return result



async def create_message(
        conversation_id: str,
        content: str,
        sender_type: str,
        sender_id: Optional[str] = None,
        message_type: str = "text"
) -> Dict[str, Any]:
    message_data = {
        "conversation_id": conversation_id,
        "content": content,
        "sender_type": sender_type,
        "sender_id": sender_id,
        "message_type": message_type,
        "is_read": False,
        "created_at": datetime.utcnow()
    }

    result = messages.insert_one(message_data)
    message_data["_id"] = result.inserted_id

    conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"updated_at": datetime.utcnow()}}
    )

    return message_data


async def get_conversation_messages(conversation_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    if not ObjectId.is_valid(conversation_id):
        return []

    cursor = messages.find({"conversation_id": conversation_id}).sort("created_at", 1).limit(limit)
    return cursor.to_list(length=limit)


async def mark_messages_as_read(conversation_id: str, reader_type: str) -> int:
    if not ObjectId.is_valid(conversation_id):
        return 0

    if reader_type == "pharmacist":
        sender_type = {"$in": ["guest", "user"]}
    else:
        sender_type = "pharmacist"

    result = messages.update_many(
        {"conversation_id": conversation_id, "sender_type": sender_type, "is_read": False},
        {"$set": {"is_read": True}}
    )

    return result.modified_count


async def handle_websocket_connection(
        websocket: WebSocket,
        conversation_id: str,
        client_type: str,
        user_id: Optional[str] = None,
        manager=None
) -> None:

    from app.core.websocket import manager as ws_manager

    logger.info(
        f"{client_type.capitalize()} connecting to conversation {conversation_id} at {datetime.utcnow().isoformat()}")

    if manager is None:
        manager = ws_manager

    if client_type not in ["guest", "pharmacist", "user"]:
        await websocket.close(code=1008, reason="Loại client không hợp lệ")
        return

    if not ObjectId.is_valid(conversation_id):
        await websocket.close(code=1008, reason="ID hội thoại không hợp lệ")
        return

    conv_id = ObjectId(conversation_id)

    conversation = await get_conversation(conversation_id)
    if not conversation:
        await websocket.close(code=1008, reason="Hội thoại không tồn tại")
        return

    if client_type == "pharmacist":
        if conversation.get("pharmacist_id") and conversation.get("pharmacist_id") != user_id:
            await websocket.close(code=1008, reason="Hội thoại này đã được dược sĩ khác tiếp nhận")
            return

        if not conversation.get("pharmacist_id") and user_id:
            await accept_conversation(conversation_id, user_id)
            conversation = await get_conversation(conversation_id)

            pharmacist = await get_pharmacist_by_user_id(user_id)

            if pharmacist:
                pharmacist_info = {
                    "id": str(pharmacist["_id"]),
                    "user_name": pharmacist.get("name", ""),
                    "status": "online"
                }
            else:
                logger.warn(f"No pharmacist record found for user_id: {user_id}, using default info")
                pharmacist_info = {
                    "id": user_id,
                    "name": "Dược sĩ tư vấn",
                    "avatar": "",
                    "qualification": "Dược sĩ",
                    "status": "online"
                }

            try:
                await manager.send_to_client(
                    {
                        "type": "pharmacist_joined",
                        "pharmacist": pharmacist_info,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    conv_id,
                    "guest"
                )
            except Exception as e:
                logger.error(f"Error sending pharmacist info to guest: {str(e)}")

    if client_type == "guest":
        if conversation.get("guest_id") and conversation.get("guest_id") != user_id:
            await websocket.close(code=1008, reason="Bạn không được phép tham gia hội thoại này")
            return

    if client_type == "user":
        if not user_id:
            await websocket.close(code=1008, reason="User ID là bắt buộc cho client type user")
            return

        if conversation.get("guest_id") and conversation.get("guest_id") != user_id:
            await websocket.close(code=1008, reason="Bạn không được phép tham gia hội thoại này")
            return
    try:
        await manager.connect(websocket, conv_id, client_type)
        logger.info(f"{client_type.capitalize()} connected to conversation {conversation_id}")

        pharmacist_info = None
        if conversation.get("pharmacist_id"):
            pharmacist = await get_pharmacist_by_user_id(conversation["pharmacist_id"])
            if pharmacist:
                pharmacist_info = {
                    "id": str(pharmacist["_id"]),
                    "name": pharmacist.get("user_name", ""),
                    "avatar": pharmacist.get("avatar", ""),
                    "qualification": pharmacist.get("qualification", ""),
                    "experience": pharmacist.get("experience", ""),
                    "specialization": pharmacist.get("specialization", ""),
                    "rating": pharmacist.get("rating", 0),
                    "status": pharmacist.get("status", "offline")
                }
            else:
                logger.warn(
                    f"No pharmacist record found for ID: {conversation['pharmacist_id']}, using default info")
                pharmacist_info = {
                    "id": conversation["pharmacist_id"],
                    "name": "Dược sĩ tư vấn",
                    "avatar": "",
                    "qualification": "Dược sĩ",
                    "status": "online"
                }

        await websocket.send_json({
            "type": "connection_established",
            "conversation_id": str(conv_id),
            "conversation_info": {
                "guest_name": conversation.get("guest_name", ""),
                "status": conversation.get("status", "waiting"),
                "created_at": conversation.get("created_at").isoformat() if conversation.get("created_at") else None,
                "updated_at": conversation.get("updated_at").isoformat() if conversation.get("updated_at") else None,
                "pharmacist": pharmacist_info
            }
        })

        if client_type == "pharmacist":
            partner_type = conversation.get("type", "guest")
        else:
            partner_type = "pharmacist"

        if client_type == "pharmacist" and conversation.get("pharmacist_id") == user_id:
            pharmacist = await get_pharmacist_by_user_id(user_id)

            if pharmacist:
                pharmacist_info = {
                    "id": str(pharmacist["_id"]),
                    "name": pharmacist.get("user_name", ""),
                    "avatar": pharmacist.get("avatar", ""),
                    "qualification": pharmacist.get("qualification", ""),
                    "experience": pharmacist.get("experience", ""),
                    "specialization": pharmacist.get("specialization", ""),
                    "rating": pharmacist.get("rating", 0),
                    "status": "online"
                }
            else:
                logger.warn(f"No pharmacist record found for user_id: {user_id}, using default info")
                pharmacist_info = {
                    "id": user_id,
                    "name": "Dược sĩ tư vấn",
                    "avatar": "",
                    "qualification": "Dược sĩ",
                    "status": "online"
                }

            await manager.send_to_client(
                {
                    "type": "partner_connected",
                    "client_type": client_type,
                    "pharmacist_info": pharmacist_info,
                    "timestamp": datetime.utcnow().isoformat()
                },
                conv_id,
                partner_type
            )
        else:
            await manager.send_to_client(
                {
                    "type": "partner_connected",
                    "client_type": client_type,
                    "timestamp": datetime.utcnow().isoformat()
                },
                conv_id,
                partner_type
            )

        messages_history = await get_conversation_messages(conversation_id)

        for msg in messages_history:
            if "_id" in msg:
                msg["_id"] = str(msg["_id"])
            if "created_at" in msg and isinstance(msg["created_at"], datetime):
                msg["created_at"] = msg["created_at"].isoformat()

        await websocket.send_json({
            "type": "message_history",
            "messages": messages_history
        })

        count = await mark_messages_as_read(conversation_id, client_type)

        if count > 0:
            await manager.send_to_client(
                {
                    "type": "messages_read",
                    "by": client_type,
                    "count": count,
                    "timestamp": datetime.utcnow().isoformat()
                },
                conv_id,
                partner_type
            )

        while True:
            try:
                raw_data = await websocket.receive()

                if raw_data["type"] == "websocket.disconnect":
                    logger.info(f"{client_type.capitalize()} client initiated disconnect")
                    break

                if raw_data["type"] != "websocket.receive":
                    logger.debug(f"Ignoring non-receive message: {raw_data['type']}")
                    continue

                if "text" in raw_data:
                    try:
                        data = json.loads(raw_data["text"])
                    except json.JSONDecodeError as e:
                        logger.warn(
                            f"Invalid JSON from {client_type}: {raw_data['text'][:100]}... - Error: {str(e)}")
                        await websocket.send_json({
                            "type": "error",
                            "message": "Invalid JSON format. Please send properly formatted JSON data.",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                        continue
                elif "bytes" in raw_data:
                    logger.warn(f"Binary data received but not supported")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Binary data not supported. Please send JSON text data.",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                    continue
                else:
                    logger.warn(f"Received WebSocket message without data")
                    continue

                if "type" not in data:
                    logger.warn(f"Received message without type field: {data}")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Message type is required",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                    continue

                if data["type"] == "message":
                    if "content" not in data or not data["content"].strip():
                        await websocket.send_json({
                            "type": "error",
                            "message": "Message content is required",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                        continue

                    new_message = await create_message(
                        conversation_id=conversation_id,
                        content=data["content"],
                        sender_type=client_type,
                        sender_id=user_id,
                        message_type=data.get("message_type", "text")
                    )

                    if "_id" in new_message:
                        new_message["_id"] = str(new_message["_id"])
                    if "created_at" in new_message and isinstance(new_message["created_at"], datetime):
                        new_message["created_at"] = new_message["created_at"].isoformat()

                    await websocket.send_json({
                        "type": "message_sent",
                        "message_id": new_message["_id"],
                        "timestamp": datetime.utcnow().isoformat()
                    })

                    await manager.send_to_client(
                        {"type": "new_message", "message": new_message},
                        conv_id,
                        partner_type
                    )

                elif data["type"] == "typing":
                    if "is_typing" not in data:
                        continue

                    await manager.send_to_client(
                        {
                            "type": "typing_status",
                            "is_typing": data["is_typing"],
                            "client_type": client_type,
                            "timestamp": datetime.utcnow().isoformat()
                        },
                        conv_id,
                        partner_type
                    )

                elif data["type"] == "read_receipt":
                    count = await mark_messages_as_read(conversation_id, client_type)

                    if count > 0:
                        await manager.send_to_client(
                            {
                                "type": "messages_read",
                                "by": client_type,
                                "count": count,
                                "timestamp": datetime.utcnow().isoformat()
                            },
                            conv_id,
                            partner_type
                        )

                elif data["type"] == "accept_conversation" and client_type == "pharmacist":
                    updated_conv = await accept_conversation(conversation_id, user_id)

                    pharmacist = await get_pharmacist_by_user_id(user_id)

                    if pharmacist:
                        pharmacist_info = {
                            "id": str(pharmacist["_id"]),
                            "name": pharmacist.get("user_name", ""),
                            "avatar": pharmacist.get("avatar", ""),
                            "qualification": pharmacist.get("qualification", ""),
                            "experience": pharmacist.get("experience", ""),
                            "specialization": pharmacist.get("specialization", ""),
                            "rating": pharmacist.get("rating", 0),
                            "status": "online"
                        }
                    else:
                        logger.warn(f"No pharmacist record found for user_id: {user_id}, using default info")
                        pharmacist_info = {
                            "id": user_id,
                            "name": "Dược sĩ tư vấn",
                            "avatar": "",
                            "qualification": "Dược sĩ",
                            "status": "online"
                        }

                    await manager.send_to_client(
                        {
                            "type": "pharmacist_joined",
                            "pharmacist": pharmacist_info,
                            "timestamp": datetime.utcnow().isoformat()
                        },
                        conv_id,
                        client_type
                    )

                    await websocket.send_json({
                        "type": "conversation_accepted",
                        "conversation": {
                            "id": str(updated_conv["_id"]) if updated_conv else str(conv_id),
                            "status": updated_conv.get("status", "active") if updated_conv else "active",
                            "guest_name": updated_conv.get("guest_name", "") if updated_conv else conversation.get(
                                "guest_name", "")
                        },
                        "timestamp": datetime.utcnow().isoformat()
                    })

                elif data["type"] == "close_conversation":
                    await update_conversation_status(conversation_id, "closed")

                    close_message = {
                        "type": "conversation_closed",
                        "closed_by": client_type,
                        "timestamp": datetime.utcnow().isoformat()
                    }

                    await websocket.send_json(close_message)

                    await manager.send_to_client(close_message, conv_id, partner_type)

                    await websocket.close(code=1000, reason="Conversation closed")
                    break

                elif data["type"] == "ping":
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat()
                    })

                else:
                    logger.warn(f"Unsupported message type: {data['type']}")
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Unsupported message type: {data['type']}",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            except Exception as e:
                logger.error(f"Error processing message: {str(e)}")
                logger.error(traceback.format_exc())

                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Server error processing your message",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                except Exception as e:
                    logger.error("Cannot send error message - connection might be closed")
                    break

    except Exception as e:
        error_msg = f"Error in websocket: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())

        try:
            await websocket.close(code=1011, reason="Server error")
        except Exception as e:
            pass

    finally:
        disconnected_type = manager.disconnect(websocket, conv_id)

        if disconnected_type:
            logger.info(f"{disconnected_type.capitalize()} disconnected from conversation {conversation_id}")

            if disconnected_type == "pharmacist":
                partner_type = conversation.get("type", "guest")
            else:
                partner_type = "pharmacist"

            try:
                await manager.send_to_client(
                    {
                        "type": "partner_disconnected",
                        "client_type": disconnected_type,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    conv_id,
                    partner_type
                )
            except Exception as e:
                logger.error(f"Error sending disconnect notification: {str(e)}")