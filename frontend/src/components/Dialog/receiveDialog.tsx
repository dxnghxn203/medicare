import React, { useState } from "react";
import { X } from "lucide-react";

interface ReceiveDialogProps {
  onClose: () => void;
}

const ReceiveDialog: React.FC<ReceiveDialogProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState("Hôm nay, 19/02/2025");
  const [selectedTime, setSelectedTime] = useState("08:00 - 09:00");

  const dates = [
    "Hôm nay, 19/02/2025",
    "Thứ năm, 20/02/2025",
    "Thứ sáu, 21/02/2025",
    "Thứ bảy, 22/02/2025",
  ];

  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg flex flex-col items-center relative max-h-[90vh] overflow-y-auto w-[700px]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-black text-center py-4">
          Chọn thời gian giao hàng
        </h2>

        {/* Dấu gạch ngang */}
        <hr className="w-full border-t border-gray-300" />

        {/* Chọn ngày nhận */}
        <p className="text-sm font-normal text-black/50 self-start px-4 py-4">
          Chọn ngày nhận
        </p>
        <div className="grid grid-cols-2 gap-2 w-full px-4">
          {dates.map((date) => (
            <button
              key={date}
              className={`px-3 py-2 rounded-full border ${
                selectedDate === date
                  ? "bg-[#0053E2] text-white"
                  : "text-black border-gray-300"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Chọn giờ nhận */}
        <p className="text-sm font-normal text-black/50 self-start mt-3 px-4 py-4">
          Chọn giờ nhận
        </p>
        <div className="grid grid-cols-4 gap-2 w-full px-4">
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`px-3 py-2 rounded-full border ${
                selectedTime === time
                  ? "bg-[#0053E2] text-white"
                  : "text-black border-gray-300"
              }`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>

        <div className="text-sm font-normal text-black/50 self-start mt-3 w-full px-4 py-4">
          Thời gian nhận hàng dự kiến:
          <div className="bg-[#F5F7F9] px-4 py-4 rounded-lg w-full text-sm text-black mt-2">
            <span className="font-medium">
              Từ {selectedTime} {selectedDate}
            </span>
          </div>
        </div>

        {/* Dấu gạch ngang và nút xác nhận */}
        <div className="sticky bottom-0 bg-white w-full flex flex-col items-center pt-4">
          <hr className="w-full border-t border-gray-300" />
          <button className="mt-6 mb-6 px-4 bg-[#0053E2] text-white font-semibold w-[90%] py-3 rounded-[20px] hover:bg-[#002E99]">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveDialog;
