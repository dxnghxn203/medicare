import { Conversation } from "@/types/chat";
import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useChat } from "@/hooks/useChat";

interface GuestForm {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
}

export const GuestChat = () => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<GuestForm>({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { messages, sendMessage, isConnected, pharmacistInfo } = useWebSocket({
    conversationId: conversation?._id || null,
    guest_id: conversation?.guest_id || null,
    pharmacist_id: conversation?.pharmacist_id || null,
    type: "guest",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { initChatBox } = useChat();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      initChatBox(
        formData,
        (data: any) => {
          console.log("New message received:", data);
          setConversation(data);
          console.log("Connected");
          setIsLoading(false);
        },
        () => {
          console.log("Disconnected");
          setError("Failed to start chat. Please try again.");
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const messageInput = form.message as HTMLInputElement;

    if (messageInput.value.trim()) {
      sendMessage(messageInput.value);
      messageInput.value = "";
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md w-full mx-auto space-y-4">
          <div>
            <h2 className="text-center text-lg font-semibold text-gray-900">
              Bắt đầu trò chuyện với Dược sĩ
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Vui lòng điền thông tin của bạn để bắt đầu
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleFormSubmit}>
            <div className="space-y-2">
              <input
                name="guest_name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Họ và tên của bạn"
                value={formData.guest_name}
                onChange={handleInputChange}
              />
              <input
                name="guest_email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Email của bạn"
                value={formData.guest_email}
                onChange={handleInputChange}
              />
              <input
                name="guest_phone"
                type="tel"
                required
                pattern="[0-9]{10}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Số điện thoại của bạn"
                value={formData.guest_phone}
                onChange={handleInputChange}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang kết nối...
                </span>
              ) : (
                "Bắt đầu trò chuyện"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {pharmacistInfo && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {pharmacistInfo.name || "Dược sĩ"}
            </p>
            {pharmacistInfo.qualification && (
              <p className="text-gray-600 text-xs">
                {pharmacistInfo.qualification}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => {
          if (message.type === "system") {
            return (
              <div key={index} className="text-center">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {message.content}
                </span>
              </div>
            );
          }

          const isGuest = message.sender_type === "guest";
          return (
            <div
              key={index}
              className={`flex ${isGuest ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  isGuest ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <div className="text-sm break-words">{message.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t bg-white mt-auto rounded-b-2xl">
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
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
