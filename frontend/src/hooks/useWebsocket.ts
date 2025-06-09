import {useEffect, useRef, useState, useCallback} from 'react';
import {WebSocketMessage, Message, SystemMessage, ChatMessage} from "@/types/chat";

interface UseWebSocketProps {
    conversationId: string | null;
    guest_id: string | null;
    pharmacist_id: string | null;
    type: 'guest' | 'pharmacist' | 'user';
}

export const useWebSocket = ({conversationId, guest_id, pharmacist_id, type}: UseWebSocketProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [pharmacistInfo, setPharmacistInfo] = useState<WebSocketMessage['pharmacist_info'] | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;


    const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
        switch (data.type) {
            case 'new_message':
                if (data.message?.content && data.message.sender_type) {
                    const newMessage: ChatMessage = {
                        type: 'chat',
                        content: data.message.content,
                        sender_type: data.message.sender_type,
                        timestamp: new Date().toISOString()
                    };
                    setMessages(prev => [...prev, newMessage]);
                }
                break;

            case 'message':
                if (data.content && data.sender_type) {
                    const newMessage: ChatMessage = {
                        type: 'chat',
                        content: data.content,
                        sender_type: data.sender_type,
                        timestamp: new Date().toISOString()
                    };
                    setMessages(prev => [...prev, newMessage]);
                }
                break;

            case 'partner_connected':
                if (data.pharmacist_info) {
                    setPharmacistInfo(data.pharmacist_info);
                    const systemMessage: SystemMessage = {
                        type: 'system',
                        content: `${data.pharmacist_info.name || 'Dược sĩ'} đã tham gia cuộc hội thoại`,
                        timestamp: new Date().toISOString()
                    };
                    setMessages(prev => [...prev, systemMessage]);
                }
                break;


        }
    }, []);

    const sendMessage = useCallback((content: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const newMessage: ChatMessage = {
                type: 'chat',
                content,
                sender_type: type,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, newMessage]);

            const messageToSend = {
                type: 'message',
                content,
                sender_type: type
            };
            wsRef.current.send(JSON.stringify(messageToSend));
        } else {
            console.warn('WebSocket is not connected. Message not sent.');
        }
    }, [type]);

    const connect = useCallback(() => {
        if (!conversationId) {
            return;
        }

        if (wsRef.current) {
            wsRef.current.close();
        }

        let wsUrl =
            `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/v1/ws/${conversationId}/${type}`;

        if (type === 'pharmacist') {
            wsUrl += `?user_id=${pharmacist_id}`;
        }
        if (type === 'user') {
            wsUrl += `?user_id=${guest_id}`;
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
            reconnectAttempts.current = 0;
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('Error parsing message:', error, event.data);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);

            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current += 1;
                setTimeout(() => {
                    connect();
                }, 1000 * Math.min(reconnectAttempts.current, 30));
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        wsRef.current = ws;

        return () => {
            ws.close();
            wsRef.current = null;
        };
    }, [conversationId, type, handleWebSocketMessage]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
        setMessages([]);
        setPharmacistInfo(null);
    }, []);

    useEffect(() => {
        if (conversationId) {
            const cleanup = connect();
            return () => {
                cleanup?.();
            };
        }
    }, [connect, conversationId]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        messages,
        isConnected,
        sendMessage,
        pharmacistInfo,
        disconnect
    };
};