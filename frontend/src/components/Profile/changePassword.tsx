"use client";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/providers/toastProvider";
import { validateEmptyFields, validatePassword } from "@/utils/validation";
import React from "react";

const ChangePasswordComponent = () => {
  const { changePasswordUser } = useUser();
  const toast = useToast();
  const [formData, setFormData] = React.useState({
    old_password: "",
    new_password: "",
  });
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
  };
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("formData", formData);
    e.preventDefault();

    const emptyFieldErrors = validateEmptyFields(formData);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };
    const oldPasswordError = validatePassword(formData.old_password);
    if (oldPasswordError) {
      errors.old_password = oldPasswordError;
    }

    // Validate mật khẩu mới
    const newPasswordError = validatePassword(formData.new_password);
    if (newPasswordError) {
      errors.new_password = newPasswordError;
    }

    // Check mật khẩu mới và nhập lại mật khẩu có khớp không
    if (formData.new_password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu mới và nhập lại mật khẩu không khớp!";
    }

    // Check mật khẩu mới không được giống mật khẩu cũ
    if (formData.new_password === formData.old_password) {
      errors.new_password = "Mật khẩu mới không được trùng mật khẩu cũ!";
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    changePasswordUser(
      formData,
      (message) => {
        toast.showToast(message, "success");
        setFormData({ old_password: "", new_password: "" });
        setConfirmPassword("");
      },
      (message) => {
        toast.showToast(message, "error");
      }
    );
  };

  return (
    <div className="mb-8 bg-[#F5F7F9] p-4 sm:p-6 rounded-lg w-full max-w-md mx-auto">
      <h2 className="font-bold text-2xl text-center">Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu cũ
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <input
                id="old_password"
                type="password"
                value={formData.old_password}
                onChange={handleChange}
                className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
              />
            </div>
            {errors.old_password && (
              <p className="text-red-500 text-sm">{errors.old_password}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              Mật khẩu mới
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
              />
            </div>
            {errors.new_password && (
              <p className="text-red-500 text-sm">{errors.new_password}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Nhập lại mật khẩu mới
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmChange}
                className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-6 text-sm">
          <button className="bg-[#0053E2] text-white font-semibold w-[100px] py-3 rounded-xl hover:bg-blue-700">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordComponent;
