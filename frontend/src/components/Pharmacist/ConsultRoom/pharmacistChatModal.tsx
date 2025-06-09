import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Conversation } from "@/types/chat";
import { useWebSocket } from "@/hooks/useWebsocket";
import { ConfirmCloseModal } from "@/components/Chat/confirmCloseModal";

interface PharmacistChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

export const PharmacistChatModal = ({
  isOpen,
  onClose,
  conversation,
}: PharmacistChatModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isConnected } = useWebSocket({
    conversationId: conversation?._id || null,
    pharmacist_id: conversation?.pharmacist_id || null,
    guest_id: conversation?.guest_id || null,
    type: "pharmacist",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const messageInput = form.message as HTMLInputElement;

    if (messageInput.value.trim()) {
      sendMessage(messageInput.value);
      messageInput.value = "";
    }
  };

  const handlerClose = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmClose = useCallback(() => {
    setShowConfirmModal(false);
    onClose();
  }, []);

  const handleCancelClose = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {}}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen px-4 text-center">
          <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Dialog.Panel className="inline-block w-full max-w-2xl h-[550px] p-0 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {conversation?.guest_name
                    ? `Chat với ${conversation.guest_name}`
                    : "Phòng chat"}
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleString("vi-VN")}
                </p>
              </div>
              <button
                onClick={handlerClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col h-[calc(600px-80px)] overflow-hidden">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-gray-500">
                      Đang tiếp nhận cuộc hội thoại...
                    </p>
                  </div>
                </div>
              ) : error ? (
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
              ) : (
                <>
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

                      const isPharmacist = message.sender_type === "pharmacist";
                      return (
                        <div
                          key={index}
                          className={`flex ${
                            isPharmacist ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg max-w-[80%] ${
                              isPharmacist ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            <div className="text-sm break-words">
                              {message.content}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t bg-white rounded-b-2xl">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        name="message"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tin nhắn tư vấn..."
                        disabled={!isConnected}
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg transition-colors ${
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
                </>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <ConfirmCloseModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
};
