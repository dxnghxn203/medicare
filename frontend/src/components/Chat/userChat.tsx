import React, {useState, useEffect, useRef} from 'react';
import {Conversation} from "@/types/chat";
import {useWebSocket} from "@/hooks/useWebsocket";
import {useChat} from "@/hooks/useChat";

export const UserChat = () => {
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {messages, sendMessage, isConnected, pharmacistInfo} = useWebSocket({
        conversationId: conversation?._id || null,
        guest_id: conversation?.guest_id || null,
        pharmacist_id: conversation?.pharmacist_id || null,
        type: "user"
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const {initChatBox} = useChat()

    useEffect(() => {
        const initializeChat = async () => {
            try {
                setIsLoading(true)
                initChatBox(
                    {},
                    (data: any) => {
                        console.log('New message received:', data);
                        setConversation(data);
                        console.log('Connected')
                        setIsLoading(false)
                    },
                    () => {
                        console.log('Disconnected')
                        setError('Failed to start chat. Please try again.');
                        setIsLoading(false)
                    }
                )
            } catch (error) {
                setError('Failed to initialize chat. Please try again.');
                console.error('Error initializing chat:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const messageInput = form.message as HTMLInputElement;

        if (messageInput.value.trim()) {
            sendMessage(messageInput.value);
            messageInput.value = '';
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-gray-500">Đang kết nối với dược sĩ...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {pharmacistInfo && (
                <div className="px-4 py-2 bg-blue-50 border-b">
                    <div className="flex items-center space-x-3">
                        {pharmacistInfo.avatar && (
                            <img
                                src={pharmacistInfo.avatar}
                                alt={pharmacistInfo.name || 'Dược sĩ'}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">
                                {pharmacistInfo.name || 'Dược sĩ'}
                            </p>
                            {pharmacistInfo.qualification && (
                                <p className="text-gray-600 text-xs">
                                    {pharmacistInfo.qualification}
                                </p>
                            )}
                        </div>
                        <div
                            className={`w-2 h-2 rounded-full ${
                                isConnected ? 'bg-green-400' : 'bg-red-400'
                            }`}
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((message, index) => {
                    if (message.type === 'system') {
                        return (
                            <div key={index} className="text-center">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {message.content}
                </span>
                            </div>
                        );
                    }

                    const isUser = message.sender_type === 'user';
                    return (
                        <div
                            key={index}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-2 rounded-lg max-w-[80%] ${
                                    isUser
                                        ? 'bg-blue-100'
                                        : 'bg-gray-100'
                                }`}
                            >
                                <div className="text-sm break-words">
                                    {message.content}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef}/>
            </div>

            <div className="p-3 border-t bg-white mt-auto">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        name="message"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Nhập tin nhắn của bạn..."
                        disabled={!isConnected}
                    />
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                            isConnected
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isConnected}
                    >
                        Gửi
                    </button>
                </form>
                {!isConnected && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Đang kết nối lại...
                    </p>
                )}
            </div>
        </div>
    );
};