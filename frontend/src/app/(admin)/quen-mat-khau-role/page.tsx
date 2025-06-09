"use client";
import { ToastType } from "@/components/Toast/toast";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import imgLoginAdmin from "@/images/loginAdmin.png";
import { useToast } from "@/providers/toastProvider";
import { validateEmail, validateEmptyFields } from "@/utils/validation";
import { message } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { forgotPasswordAdmin, forgotPasswordPharmacist } = useUser();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "admin"; // Mặc định là admin
  const { admin } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const emptyFieldErrors = validateEmptyFields(formData);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };

    if (!errors.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setIsLoading(false);
      return;
    }

    if (role === "pharmacist") {
      forgotPasswordPharmacist(
        formData,
        (message) => {
          showToast(message, "success");
          setIsLoading(false);
          setFormData({ email: "" });
          setErrors({});
        },
        (error) => {
          showToast(error, "error");
          setIsLoading(false);
        }
      );
    } else {
      forgotPasswordAdmin(
        formData,
        (message) => {
          showToast(message, "success");
          setIsLoading(false);
          setFormData({ email: "" });
          setErrors({});
        },
        (error) => {
          showToast(error, "error");
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#C3E3F3]">
      <div className="flex w-[70%] h-[85%] rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="w-1/2 flex flex-col items-center justify-center text-white p-8 bg-[#EAF3FC]">
          <div className="">
            <Image src={imgLoginAdmin} alt="Illustration" />
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <h2 className="text-3xl font-bold text-[#0053E2] mb-6">
            Quên mật khẩu
          </h2>
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <div className="relative mt-2">
                <input
                  id="email"
                  placeholder="Nhập email của bạn"
                  className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />

                <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                  <MdOutlineEmail />
                </span>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            <button
              disabled={isLoading}
              className={`w-full text-white text-sm font-semibold py-3 px-4 rounded-lg transition duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0053E2] hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
            </button>
            <div className="mt-4 text-center text-sm text-gray-600">
              Bạn đã có tài khoản?{" "}
              <a
                href="/dang-nhap-admin"
                className="text-[#0053E2] hover:underline font-medium"
              >
                Đăng nhập
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
