import React from "react";
import { X } from "lucide-react";

interface User {
  _id: string;
  phone_number: string;
  user_name: string;
  email: string;
  gender: string;
  auth_provider: string;
  birthday: string;
  role_id: string;
  active: boolean;
  verified_email_at: string;
  created_at: string;
  updated_at: string;
  login_history: string[];
}

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

// Format dates
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Không có dữ liệu";
  }
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-fit mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Chi tiết người dùng
          </h3>
          <button
            onClick={onClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 pb-2">
                Thông tin cá nhân
              </h4>
              <div className="space-y-4">
                {[
                  { label: "ID người dùng", value: user._id },
                  { label: "Họ và tên", value: user.user_name },
                  { label: "Giới tính", value: user.gender },
                  { label: "Ngày sinh", value: formatDate(user.birthday) },
                  { label: "Số điện thoại", value: user.phone_number },
                ].map((item, idx) => (
                  <div key={idx} className="flex text-sm items-center">
                    <p className="text-gray-500 min-w-[120px]">{item.label}:</p>
                    <p className=" break-words">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 pb-2">
                Thông tin tài khoản
              </h4>
              <div className="space-y-4">
                <div className="flex text-sm items-center">
                  <p className="text-gray-500 min-w-[150px]">Email:</p>
                  <p className="break-words">{user.email}</p>
                </div>

                <div className="flex text-sm items-center">
                  <p className="text-gray-500 min-w-[150px]">
                    Phương thức đăng ký:
                  </p>
                  <p className="flex justify-start">
                    <span
                      className={`px-2  inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.auth_provider === "email"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.auth_provider === "email" ? "Email" : "Google"}
                    </span>
                  </p>
                </div>

                <div className="flex text-sm items-center">
                  <p className="text-gray-500 min-w-[150px]">Vai trò:</p>
                  <p className="text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role_id === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role_id === "user"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.role_id === "admin"
                        ? "Quản trị viên"
                        : user.role_id === "user"
                        ? "Người dùng"
                        : "Dược sĩ"}
                    </span>
                  </p>
                </div>

                <div className="flex text-sm items-center">
                  <p className="text-gray-500 min-w-[150px]">Trạng thái:</p>
                  <p className="text-sm">
                    <span
                      className={`px-2  inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                    </span>
                  </p>
                </div>

                <div className="flex text-sm items-center">
                  <p className="text-gray-500 min-w-[150px]">Xác thực email:</p>
                  <p>{formatDate(user.verified_email_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Info */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Thời gian</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                <p className="text-sm font-medium">
                  {formatDate(user.created_at)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                <p className="text-sm font-medium">
                  {formatDate(user.updated_at)}
                </p>
              </div>
              {user.login_history?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Đăng nhập lần cuối</p>
                  <p className="text-sm font-medium">
                    {formatDate(user.login_history[user.login_history.length - 1])}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 hover:scale-105 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
