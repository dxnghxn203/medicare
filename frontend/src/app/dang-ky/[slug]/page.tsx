"use client";
import React, { useState } from "react";
import { useToast } from "@/providers/toastProvider";
import { useUser } from "@/hooks/useUser";
import { useParams, useRouter } from "next/navigation";

const OtpVerificationPage: React.FC = () => {
  const params = useParams() as {
    slug: string | string[];
  };
  const email = params.slug as string;
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();
  const { verifyOtp, sendOtp } = useUser();
  const router = useRouter();

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || name.length < 3) return email;

    const visibleStart = name[0];
    const visibleEnd = name.slice(-2);
    const maskedMiddle = "*".repeat(name.length - 3);

    return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
  };
  const getEmail = (email: string) => {
    const [name, domain] = email.split("%40");
    return `${name}@${domain}`;
  };

  const handleResendOtp = () => {
    sendOtp({
      param: { email: getEmail(email) },
      onSuccess: (message: string) => {
        toast.showToast(message, "success");
        setIsResending(false);
      },
      onFailure: (message: string) => {
        toast.showToast(message, "error");
        setIsResending(false);
      },
    });
  };

  const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = e.currentTarget.otp.value;
    if (!otp) {
      toast.showToast("Vui lòng nhập OTP", "warning");
      return;
    }
    const param = {
      email: getEmail(email),
      otp: otp,
    };
    verifyOtp({
      param: param,
      onSuccess: (message: string) => {
        toast.showToast(message, "success");
        router.push(`/dang-nhap`);
      },
      onFailure: (message: string) => {
        toast.showToast(message, "error");
      },
    });
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 pb-10 pt-[150px]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Xác nhận mã OTP</h2>
        <p className="text-gray-600 text-center mb-4">
          Vui lòng nhập mã OTP đã được gửi đến{" "}
          <span className="tracking-widest">{maskEmail(email)}</span>.
        </p>

        <form className="space-y-4" onSubmit={submitData}>
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Mã OTP
            </label>
            <input
              id="otp"
              type="text"
              className="w-full h-[55px] rounded-3xl px-4 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="Nhập mã OTP"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-500 hover:underline focus:outline-none"
              disabled={isResending}
            >
              {isResending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
            </button>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl h-[55px] hover:bg-blue-700 transition-colors"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
