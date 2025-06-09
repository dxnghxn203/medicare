"use client";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {
    validatePassword,
    validateEmail,
    validateEmptyFields,
} from "@/utils/validation";
import {useDispatch} from "react-redux";
import {useUser} from "@/hooks/useUser";
import {useToast} from "@/providers/toastProvider";

const RegisterForm: React.FC = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({
        username: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {fetchInsertUser} = useUser();
    const dispatch = useDispatch();
    const router = useRouter();

    // Hàm xử lý khi thay đổi input
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {id, value} = e.target;
        setFormData((prev) => ({...prev, [id]: value}));
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        const validationErrors = validateEmptyFields(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                fetchInsertUser({
                    param: formData,
                    onSuccess: (message: string) => {
                        console.log(message);
                        toast.showToast(message, "success");
                        router.push(`/dang-ky/${formData.email}`);
                    },
                    onFailure: (message: string) => {
                        console.log(message);
                        toast.showToast(message, "error");
                    },
                });
            } catch (error) {
                console.error("Error during registration:", error);
            }
        }
    };

    return (
        <div className="flex justify-center items-center mt-8">
            <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                {/* Tên đăng nhập */}
                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                        Tên đăng nhập
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
                    />
                    {isSubmitted && errors.username && (
                        <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium">
                        Số điện thoại
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
                    />
                    {isSubmitted && errors.phoneNumber && (
                        <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                    )}
                </div>

                {/* Giới tính */}
                <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                        Giới tính
                    </label>
                    <select
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    {isSubmitted && errors.gender && (
                        <p className="text-red-500 text-sm">{errors.gender}</p>
                    )}
                </div>

                {/* Ngày sinh */}
                <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium">
                        Ngày sinh
                    </label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
                    />
                    {isSubmitted && errors.dateOfBirth && (
                        <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
                    />
                    {isSubmitted && errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                {/* Mật khẩu */}
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
                    />
                    {isSubmitted && errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                </div>

                {/* Nhập lại mật khẩu */}
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Nhập lại mật khẩu
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
                    />
                    {isSubmitted && errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Nút chuyển trang */}
                <div className="pt-4">
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full text-base font-bold text-white rounded-3xl py-4 bg-blue-700"
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default RegisterForm;
