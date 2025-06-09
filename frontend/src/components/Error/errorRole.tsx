import React from 'react';
import Link from 'next/link';
import { FiShield, FiHome, FiLogIn } from 'react-icons/fi';

interface ErrorRoleProps {
  message?: string;
}

const ErrorRole: React.FC<ErrorRoleProps> = ({ 
  message = "Bạn không có quyền truy cập vào trang này" 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 sm:p-8">
          <div className="flex justify-center">
            <div className="inline-flex p-4 bg-red-100 rounded-full">
              <FiShield size={40} className="text-red-500" />
            </div>
          </div>
          
          <h1 className="mt-5 text-2xl font-bold text-gray-800">Truy cập bị từ chối</h1>
          
          <p className="mt-3 text-gray-600">
            {message}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiHome className="mr-2" />
              Trang chủ
            </Link>
            <Link href="/dang-nhap-admin" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiLogIn className="mr-2" />
              Đăng nhập
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-gray-500">
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorRole;
