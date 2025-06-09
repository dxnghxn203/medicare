"use client";
import EditProfileDialog from "@/components/Dialog/editProfileDialog";
import { useAuth } from "@/hooks/useAuth";
import { Edit } from "lucide-react";
import { useState } from "react";

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


export default function InfoPersonal() {
  const { admin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const adminInfo = [
    { label: "Họ và tên", value: admin?.user_name },
    { label: "Email", value: admin?.email },
    { label: "Số điện thoại", value: admin?.phone_number },
    { label: "Giới tính", value: admin?.gender },
    {
      label: "Ngày sinh",
      value: formatDateInput(admin?.birthday),
      displayValue: formatDateDisplay(admin?.birthday),
    },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">Thông tin của tôi</h2>

      <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-6">
        <div>
          <h3 className="text-lg font-semibold text-blue-700">
            {admin?.user_name}
          </h3>
          <p className="text-sm text-gray-500">Admin</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Thông tin cá nhân
          </h3>
          <button 
            className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition"
            onClick={() => setIsOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm">Chỉnh sửa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Tên</p>
            <p className="font-medium">{admin?.user_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Ngày sinh</p>
            <p className="font-medium">
              {admin?.birthday &&
                new Date(admin.birthday)
                  .toLocaleDateString("en-GB")
                  .split("/")
                  .join("-")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{admin?.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Số điện thoại</p>
            <p className="font-medium">{admin?.phone_number}</p>
          </div>
        </div>
      </div>
      <EditProfileDialog
        role_type={"admin"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userInfo={adminInfo}
      />
    </div>
  );
}
