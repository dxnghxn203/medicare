from fastapi import WebSocket
from typing import Dict, Tuple, Optional
# from app.core import logger as app_logger # Assuming your logger
import logging # Using standard logging if app_logger is not set up here

# If app_logger is not available here, use standard logging
logger = logging.getLogger(__name__)
# logger.setLevel(logging.INFO) # Configure as needed


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[Tuple[str, str], WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str, client_type: str):
        await websocket.accept()
        key = (session_id, client_type)
        self.active_connections[key] = websocket
        logger.info(f"WebSocket connected: session_id={session_id}, client_type={client_type}")

    def disconnect(self, websocket: WebSocket, session_id: str, client_type: str) -> bool:
        key = (session_id, client_type)
        if key in self.active_connections and self.active_connections[key] == websocket:
            del self.active_connections[key]
            logger.info(f"WebSocket disconnected: session_id={session_id}, client_type={client_type}")
            return True
        logger.warn(f"WebSocket for session_id={session_id}, client_type={client_type} not found or mismatched for disconnect.")
        return False

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message via WebSocket: {e}")

    async def send_to_client(self, data: dict, session_id: str, client_type: str):
        key = (session_id, client_type)
        websocket = self.active_connections.get(key)
        if websocket:
            try:
                await websocket.send_json(data)
                logger.info(f"Sent message to session_id={session_id}, client_type={client_type}")
            except Exception as e:
                logger.error(f"Error sending message to session_id={session_id}, client_type={client_type}: {e}")
        else:
            logger.warn(f"No active WebSocket for session_id={session_id}, client_type={client_type} to send message.")

    def is_client_connected(self, session_id: str, client_type: str) -> bool:
        key = (session_id, client_type)
        return key in self.active_connections

# Global instance of the manager
manager = ConnectionManager()