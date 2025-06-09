"use client";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/providers/toastProvider";
import { validateEmptyFields, validatePassword } from "@/utils/validation";
import React from "react";

const ChangePasswordComponent = () => {
  const { changePasswordPharmacist } = useUser();
  const toast = useToast();
  const [formData, setFormData] = React.useState({
    old_password: "",
    new_password: "",
  });
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyFieldErrors = validateEmptyFields(formData);
    const formErrors: { [key: string]: string } = { ...emptyFieldErrors };
    const oldPasswordError = validatePassword(formData.old_password);
    const newPasswordError = validatePassword(formData.new_password);

    if (oldPasswordError) {
      setErrors((prev) => ({ ...prev, old_password: oldPasswordError }));
      return;
    }

    if (newPasswordError) {
      setErrors((prev) => ({ ...prev, new_password: newPasswordError }));
      return;
    }
    // Check if new password matches confirm password
    if (formData.new_password !== confirmPassword) {
      formErrors.confirmPassword = "Mật khẩu không khớp!";
    }

    // Check if new password is the same as old password
    if (formData.new_password === formData.old_password) {
      formErrors.new_password = "Mật khẩu mới không được giống mật khẩu cũ!";
    }

    // If there are any errors, set them and return early
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);

      return;
    }

    // Call the changePasswordAdmin function with success and error handling
    changePasswordPharmacist(
      formData,
      (message) => {
        toast.showToast(message, "success");
        setFormData({ old_password: "", new_password: "" });
        setConfirmPassword("");
        setErrors({});
      },
      (message: any) => {
        if (typeof message === "object" && message?.message) {
          toast.showToast(message.message, "error");
        } else {
          toast.showToast(message, "error");
        }
      }
    );
  };

  return (
    <div className="p-6 rounded-lg w-full">
      <h2 className="font-bold text-2xl justify-center w-full flex items-center">
        Đổi mật khẩu
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mt-4 px-64">
          <div className="space-y-2">
            <label htmlFor="old_password" className="text-sm font-medium">
              Mật khẩu cũ
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <input
                id="old_password"
                type="password"
                value={formData.old_password}
                onChange={handleChange}
                className="w-full h-[50px] rounded-xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
              />
            </div>
            {errors.old_password && (
              <p className="text-red-500 text-sm">{errors.old_password}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="new_password" className="text-sm font-medium">
              Mật khẩu mới
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full h-[50px] rounded-xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
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
                className="w-full h-[50px] rounded-xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
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
