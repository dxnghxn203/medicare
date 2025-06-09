"use client";

import {useEffect, useRef, useState} from "react";
import {Copy, Check} from "lucide-react";
import {useToast} from "@/providers/toastProvider";
import UserDetailModal from "./userDetailModal";
import {useUser} from "@/hooks/useUser";
import {
    MdNavigateBefore,
    MdNavigateNext,
    MdOutlineModeEdit,
    MdOutlineMoreHoriz,
} from "react-icons/md";
import {FiEye} from "react-icons/fi";

interface UserTableProps {
    users: any[];
    currentPage: number;
    pageSize: number;
    totalUsers: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const UserTable = ({
                       users,
                       currentPage,
                       pageSize,
                       totalUsers,
                       onPageChange,
                   }: UserTableProps) => {
    const toast = useToast();
    const {updateStatusUser, getAllUser} = useUser();

    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuUserId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleUserMenu = (userId: string) => {
        setOpenMenuUserId((prev) => (prev === userId ? null : userId));
    };

    const handleToggleStatus = (user: any) => {
        const newStatus = !user.active;
        updateStatusUser(
            {user_id: user._id, status_user: newStatus},
            () => {
                toast.showToast("Cập nhật trạng thái thành công", "success");
                getAllUser();
            },
            () => {
                toast.showToast("Cập nhật trạng thái thất bại", "error");
            }
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.showToast("Đã sao chép ID người dùng", "success");
                setCopiedId(text);
                setTimeout(() => setCopiedId(null), 2000);
            })
            .catch(() => {
                toast.showToast("Không thể sao chép", "error");
            });
    };

    const openUserDetail = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(totalUsers / pageSize);

    return (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="divide-y divide-gray-200 w-full">
                    <thead className="text-[#1E4DB7] text-sm font-bold bg-[#F0F3FD]">
                    <tr>
                        <th className="px-2 py-3 text-xs uppercase tracking-wider text-left">
                            ID người dùng
                        </th>
                        <th className="px-2 py-3 text-xs uppercase tracking-wider text-left">
                            Thông tin người dùng
                        </th>
                        <th className="px-2 py-3 text-xs uppercase tracking-wider text-left">
                            Liên hệ
                        </th>
                        <th className="px-2 py-3 text-xs uppercase tracking-wider text-left">
                            Phương thức đăng ký
                        </th>
                        <th className="px-2 py-3 text-xs uppercase tracking-wider text-center">
                            Trạng thái
                        </th>
                        <th className="px-2 py-3 text-xs uppercase tracking-wider text-center">
                            Thao tác
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users && users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 relative">
                            <td className="px-2 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                        {user._id}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(user._id)}
                                        className="ml-2 text-gray-400 hover:text-blue-500"
                                    >
                                        {copiedId === user._id ? (
                                            <Check size={16} className="text-green-500"/>
                                        ) : (
                                            <Copy size={16}/>
                                        )}
                                    </button>
                                </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {user.user_name}
                                </div>
                                <div className="text-sm text-gray-500">{user.gender}</div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{user.email}</div>
                                <div className="text-sm text-gray-500">
                                    {user.phone_number}
                                </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                  <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                          user.auth_provider === "email"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                      }`}
                  >
                    {user.auth_provider === "email" ? "Email" : "Google"}
                  </span>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-center">
                                <button
                                    onClick={() => handleToggleStatus(user)}
                                    className={`w-14 h-8 flex items-center p-1 rounded-full transition-colors duration-300 ${
                                        user.active
                                            ? "bg-blue-600 justify-end"
                                            : "bg-gray-400 justify-start"
                                    }`}
                                >
                                    <div
                                        className="w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300"/>
                                </button>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-center flex items-center">
                                <button
                                    onClick={() => openUserDetail(user)}
                                    className="text-blue-600 p-2 rounded-full flex items-center gap-2"
                                >
                                    <FiEye/>
                                    <p className="text-sm text-blue-600">Chi tiết</p>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex items-center justify-center space-x-2 py-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
                >
                    <MdNavigateBefore className="text-xl"/>
                </button>

                {Array.from({length: totalPages}, (_, idx) => {
                    const page = idx + 1;
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                    currentPage === page
                                        ? "bg-blue-700 text-white"
                                        : "text-black hover:bg-gray-200"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    }
                    if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                        return (
                            <span key={page} className="px-2 text-gray-500">
                ...
              </span>
                        );
                    }
                    return null;
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
                >
                    <MdNavigateNext className="text-xl"/>
                </button>
            </div>
            {/* Modal chi tiết người dùng */}
            {isModalOpen && selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UserTable;
