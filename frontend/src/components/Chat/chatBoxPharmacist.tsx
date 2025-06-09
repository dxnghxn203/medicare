import React, { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { GuestChat } from "@/components/Chat/guestChat";
import { ConfirmCloseModal } from "./confirmCloseModal";
import { useAuth } from "@/hooks/useAuth";
import { UserChat } from "@/components/Chat/userChat";
import pharmacistIcon from "@/images/pharmacist_female.png";

type Props = {
  setShowChatbotPharmacist: (show: boolean) => void;
};

const ChatBoxPharmacist: React.FC<Props> = ({ setShowChatbotPharmacist }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClose = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirmClose = useCallback(() => {
    setShowConfirmModal(false);
    setShowChatbotPharmacist(false);
  }, []);

  const handleCancelClose = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white border border-blue-200 rounded-2xl shadow-2xl z-50 flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-5 py-3 rounded-t-2xl flex justify-between items-center shadow">
            <span className="font-semibold flex items-center">
              <img
                src={pharmacistIcon.src}
                alt="Dược sĩ"
                className="w-6 h-6 mr-2"
              />
              Chat với Dược sĩ
            </span>
            <button
              onClick={handleClose}
              className="text-white text-2xl hover:text-red-200 transition"
            >
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {isAuthenticated ? <UserChat /> : <GuestChat />}
          </div>
        </div>
      </div>
      <ConfirmCloseModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
};

export default ChatBoxPharmacist;
