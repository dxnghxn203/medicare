"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import EditProfileDialog from "@/components/Dialog/editProfileDialog";
import { HiOutlineUserCircle } from "react-icons/hi";

const formatDateDisplay = (isoString: string | undefined): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateInput = (isoString: string | undefined): string => {
  if (!isoString) return "";
  return isoString.split("T")[0];
};

const PersonalInfomation = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const userInfo = [
    { label: "Họ và tên", value: user?.user_name },
    { label: "Email", value: user?.email },
    { label: "Số điện thoại", value: user?.phone_number },
    { label: "Giới tính", value: user?.gender },
    {
      label: "Ngày sinh",
      value: formatDateInput(user?.birthday),
      displayValue: formatDateDisplay(user?.birthday),
    },
  ];

  return (
    <div className="bg-[#F5F7F9] rounded-lg p-4">
      <h2 className="font-semibold text-lg">Thông tin cá nhân</h2>
      <div className="bg-[#F5F7F9] h-40 p-4 md:p-6 rounded-lg flex items-center justify-center">
        {user?.image ? (
          <img
            src={user?.image}
            alt={user.name || "User"}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <HiOutlineUserCircle className="w-20 h-20 text-[#0053E2]" />
        )}
      </div>

      <div className="space-y-6 px-2 md:px-[200px]">
        {userInfo.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <h2 className="text-black/50 text-sm md:text-base">{item.label}</h2>
            <p
              className={`text-sm md:text-base ${
                !item.value || item.value === "Thêm thông tin"
                  ? "text-[#0053E2] cursor-pointer"
                  : "text-black"
              }`}
              onClick={() => setIsOpen(true)}
            >
              {item.displayValue || item.value || "Thêm thông tin"}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center pt-10">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0053E2] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#003da5] transition text-sm md:text-base"
        >
          Chỉnh sửa thông tin
        </button>
      </div>

      <EditProfileDialog
        role_type={"user"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userInfo={userInfo}
      />
    </div>
  );
};

export default PersonalInfomation;
