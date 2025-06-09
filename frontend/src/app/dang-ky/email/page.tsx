"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import RegisterForm from "@/components/Register/registerForm";

export default function RegisterWithPhoneNumer() {
  const router = useRouter(); // Khởi tạo router

  return (
    <div className="flex flex-col items-center bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col items-center w-full pt-14 mb-10">
        <div className="w-full px-6">
          <Link
            href="/dang-ky"
            className="inline-flex items-center text-blue-700 hover:text-[#002E99] transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </Link>
        </div>
        <div className="text-3xl font-extrabold text-black">Đăng ký</div>
        <RegisterForm />
      </main>
    </div>
  );
}
