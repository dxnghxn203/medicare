from datetime import datetime, timezone
from typing import Optional, Dict

from core.mongo import db
from core import  logger

chatbot_messages_collection = db["chatbot_messages"]


async def add_chatbot_message(
        session_id: str,
        sender_type: str,
        content: str,
        sender_id: Optional[str] = None,
        message_type: str = "text",
        metadata: Optional[dict] = None
) -> Optional[Dict]:
    try:
        if chatbot_messages_collection is None:
            logger.error("chatbot_messages_collection is not initialized (is None) in add_chatbot_message.")
            return None

        message_data = {
            "session_id": session_id,
            "sender_type": sender_type,
            "sender_id": sender_id,
            "content": content,
            "message_type": message_type,
            "created_at": datetime.now(timezone.utc),
            "metadata": metadata or {}
        }

        insert_result =  chatbot_messages_collection.insert_one(message_data)

        if insert_result.inserted_id:
            new_message_doc =  chatbot_messages_collection.find_one({"_id": insert_result.inserted_id})

            if new_message_doc:
                new_message_doc["_id"] = str(new_message_doc["_id"])
                if isinstance(new_message_doc.get("created_at"), datetime):
                    new_message_doc["created_at"] = new_message_doc["created_at"].isoformat()
                if isinstance(new_message_doc.get("updated_at"), datetime):  # Kiểm tra và chuyển đổi updated_at nếu có
                    new_message_doc["updated_at"] = new_message_doc["updated_at"].isoformat()
                return new_message_doc
            else:
                logger.error(
                    f"Failed to retrieve message after insertion for session {session_id}, id {insert_result.inserted_id}.")
                return None
        else:
            logger.error(f"Failed to insert message for session {session_id}. No inserted_id returned.")
            return None
    except Exception as e:
        logger.error(f"Error in add_chatbot_message for session {session_id}: {e}", exc_info=True)
        return None
chatbot_sessions_collection = db["chatbot_sessions"]


async def create_or_update_chatbot_session(
        session_id: str,
        user_id: Optional[str] = None,
        metadata: Optional[dict] = None
) -> Optional[Dict]:
    try:
        if chatbot_sessions_collection is None:
            logger.error(
                "chatbot_sessions_collection is not initialized (is None) in create_or_update_chatbot_session.")
            return None

        now = datetime.now(timezone.utc)

        set_on_insert_data = {
            "session_id": session_id,
            "created_at": now,
            "metadata": metadata or {}
        }

        set_data = {
            "updated_at": now,
            "active": True
        }
        if user_id is not None:
            set_data["user_id"] = user_id

        update_result =  chatbot_sessions_collection.update_one(
            {"session_id": session_id},
            {
                "$set": set_data,
                "$setOnInsert": set_on_insert_data
            },
            upsert=True
        )

        if update_result.acknowledged:
            session_doc =  chatbot_sessions_collection.find_one({"session_id": session_id})
            if session_doc:
                session_doc["_id"] = str(session_doc["_id"])
                if isinstance(session_doc.get("created_at"), datetime):
                    session_doc["created_at"] = session_doc["created_at"].isoformat()
                if isinstance(session_doc.get("updated_at"), datetime):
                    session_doc["updated_at"] = session_doc["updated_at"].isoformat()
                return session_doc
            else:
                logger.error(f"Failed to retrieve session after upsert for session_id: {session_id}")
                return None
        else:
            logger.error(f"Database upsert not acknowledged for session_id: {session_id}")
            return None

    except Exception as e:
        logger.error(f"Error in create_or_update_chatbot_session for session_id {session_id}: {e}", exc_info=True)
        return None
async def get_chatbot_messages_by_session(session_id: str, limit: int = 50) -> list[Dict]:
    try:
        if not chatbot_messages_collection:
            logger.error("chatbot_messages_collection is not initialized.")
            return []
        messages_cursor = chatbot_messages_collection.find({"session_id": session_id}).sort("created_at", -1).limit(limit)
        messages =  messages_cursor.to_list(length=limit)
        # Sắp xếp lại theo thứ tự cũ nhất trước nếu cần (hiện tại là mới nhất trước)
        # messages.reverse()
        for msg in messages:
            msg["_id"] = str(msg["_id"])
            if isinstance(msg.get("created_at"), datetime):
                msg["created_at"] = msg["created_at"].isoformat()
        return messages
    except Exception as e:
        logger.error(f"Error fetching messages for session {session_id}: {e}", exc_info=True)
        return []
