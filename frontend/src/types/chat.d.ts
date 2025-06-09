export interface Conversation {
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    guest_id: string | null;
    pharmacist_id: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    _id: string;
}


export interface BaseMessage {
    type: 'chat' | 'system';
    content: string;
    timestamp: string;
}

export interface ChatMessage extends BaseMessage {
    type: 'chat';
    sender_type: 'guest' | 'pharmacist' | 'user';
    sender_id?: string;
    message_type?: string;
    is_read?: boolean;
}

export interface SystemMessage extends BaseMessage {
    type: 'system';
}

export type Message = ChatMessage | SystemMessage;

export interface WebSocketMessage {
    type: 'new_message' | 'message_sent' | 'message' | 'messages_read' | 'partner_connected' | 'connection_established';
    message?: {
        conversation_id?: string;
        content: string;
        sender_type: 'guest' | 'pharmacist' | 'user';
        sender_id?: string;
        message_type?: string;
        is_read?: boolean;
    };
    content?: string;
    sender_type?: 'guest' | 'pharmacist' | 'user';
    message_id?: string;
    timestamp?: string;
    by?: string;
    count?: number;
    client_type?: string;
    pharmacist_info?: {
        id: string;
        name: string;
        avatar: string;
        qualification: string;
        experience: string;
        specialization: string;
        rating: number;
        status?: string;
    };
}