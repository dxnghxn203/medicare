'use client';
import React from 'react';
import Link from 'next/link';
import { IoMdLock } from "react-icons/io";
import { HiArrowLeft } from "react-icons/hi";

export default function AuthError(){
    const handleGoLogin = async (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = '/dang-nhap';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#0053E2] px-6 py-8 text-center">
                    <div className="flex justify-center">
                        <div className="bg-white/20 rounded-full p-4">
                            <IoMdLock className="text-white text-5xl" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mt-4">Lỗi xác thực</h1>
                </div>
                
                <div className="px-6 py-8">
                    <div className="text-center mb-6">
                        <p className="text-gray-600 mb-4">
                            Bạn không có quyền truy cập vào trang này hoặc phiên đăng nhập đã hết hạn.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ của chúng tôi.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleGoLogin}
                            className="w-full h-[55px] rounded-3xl bg-[#0053E2] text-white font-medium hover:bg-[#0042b4] transition-colors flex items-center justify-center gap-2"
                        >
                            <span>Đăng nhập ngay</span>
                        </button>
                        
                        <Link href="/" legacyBehavior>
                            <a className="w-full h-[55px] rounded-3xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <HiArrowLeft className="text-lg" />
                                <span>Quay lại trang chủ</span>
                            </a>
                        </Link>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 text-center">
                    <p className="text-sm text-gray-500">
                        Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua <strong className="text-[#0053E2]">hotline: 1900 1234</strong>
                    </p>
                </div>
            </div>
            
            <div className="mt-8 text-center">
                <img 
                    src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/fc51114a36c58b35df723052a4789e3d3165c5e63dfdeb9c5ad43c09f3cb03e6?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&" 
                    alt="Logo" 
                    className="h-8 mx-auto mb-2"
                />
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Khoa Luận 2025. Tất cả các quyền được bảo lưu.
                </p>
            </div>
        </div>
    );
}
