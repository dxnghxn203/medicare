"use client";
import { ToastType } from "@/components/Toast/toast";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import imgLoginAdmin from "@/images/loginAdmin.png";
import { useToast } from "@/providers/toastProvider";
import { validateEmail, validateEmptyFields } from "@/utils/validation";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { MdLock, MdLockOutline, MdOutlineEmail, MdPhone } from "react-icons/md";
export default function LoginPage() {
  const { fetchRegisterAdmin, fetchVerifyEmail, fetchSendOTPAdmin } = useUser();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user_name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");

  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const emailPath = searchParams.get("xac-thuc-email");
  console.log(emailPath);

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || name.length < 3) return email; // Tránh lỗi với tên quá ngắn

    const visibleStart = name[0];
    const visibleEnd = name.slice(-2);
    const maskedMiddle = "*".repeat(name.length - 3);

    return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
  };

  console.log("mark", maskEmail("lethithuyduyen230803@gmail.com"));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      user_name,
      phone_number,
      email,
      gender,
      birthday,
      password,
    };

    const emptyFieldErrors = validateEmptyFields(dataToValidate);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };

    if (!errors.email) {
      const emailError = validateEmail(dataToValidate.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setIsLoading(true);
    fetchRegisterAdmin(
      { user_name, phone_number, email, gender, birthday, password },
      (message) => {
        toast.showToast(message, "success");
        setIsLoading(false);
        setName("");
        setPhoneNumber("");
        setEmail("");
        setGender("");
        setBirthday("");
        setPassword("");
        setErrors({});
        router.push(`/dang-ky-admin?xac-thuc-email=${email}`);
      },
      (error) => {
        toast.showToast(error, "error");
        setIsLoading(false);
      }
    );
  };

  const handleResendOtp = () => {
    fetchSendOTPAdmin(
      {
        email: emailPath,
      },
      (message: string) => {
        toast.showToast(message, "success");
      },
      (message: string) => {
        toast.showToast(message, "error");
      }
    );
  };

  const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = e.currentTarget.otp.value;
    if (!otp) {
      toast.showToast("Vui lòng nhập OTP", "warning");
      return;
    }
    const param = {
      email: emailPath,
      otp: otp,
    };
    fetchVerifyEmail(
      param,
      (message: string) => {
        toast.showToast(message, "success");
        router.push("/dang-nhap-admin");
      },
      (message: string) => {
        toast.showToast(message, "error");
      }
    );
  };

  return (
    <>
      {!emailPath ? (
        <div className="flex h-screen items-center justify-center bg-[#C3E3F3]">
          <div className="flex w-[70%] h-[85%] rounded-xl shadow-lg overflow-hidden bg-white">
            <div className="w-1/2 flex flex-col items-center justify-center text-white p-8 bg-[#EAF3FC]">
              <div className="">
                <Image src={imgLoginAdmin} alt="Illustration" />
              </div>
            </div>

            <div className="w-1/2 flex flex-col items-center justify-center p-12">
              <h2 className="text-3xl font-bold text-[#0053E2] mb-6">
                Đăng ký Admin
              </h2>
              <div className=" overflow-y-auto max-h-[90vh] w-full p-1">
                <div className="mb-4">
                  <label
                    htmlFor="user_name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Tên đăng nhập
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="user_name"
                      type="text"
                      placeholder="Nhập tên đăng nhập của bạn"
                      className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={user_name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                      <MdOutlineEmail />
                    </span>
                  </div>
                  {errors.user_name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.user_name}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Số điện thoại
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="phone_number"
                      type="text"
                      placeholder="Nhập số điện thoại của bạn"
                      className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={phone_number}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                      <MdPhone />
                    </span>
                  </div>
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
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
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                      <MdOutlineEmail />
                    </span>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Giới tính
                  </label>
                  <div className="relative mt-2">
                    <select
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>

                    <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                      <MdOutlineEmail />
                    </span>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-2">{errors.gender}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="birthday"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Ngày sinh
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="birthday"
                      type="date"
                      onChange={(e) => setBirthday(e.target.value)}
                      placeholder="Nhập ngày sinh của bạn"
                      className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={birthday}
                    />
                    <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                      <MdOutlineEmail />
                    </span>
                  </div>
                  {errors.birthday && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.birthday}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                      <MdLock />
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  disabled={isLoading}
                  className={`w-full text-white text-sm font-semibold py-3 px-4 rounded-lg transition duration-300 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0053E2] hover:bg-blue-600"
                  }`}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
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
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center bg-gray-50 pb-10 w-full h-full pt-24">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4">
              Xác nhận mã OTP
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Vui lòng nhập mã OTP đã được gửi đến{" "}
              <span className="tracking-widest">{maskEmail(emailPath)}</span>
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
      )}
    </>
  );
}
