"use client";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import google from "@/images/google.png";
import {useToast} from "@/providers/toastProvider";
import {ToastType} from "@/components/Toast/toast";
import {useAuth} from "@/hooks/useAuth";
import {validateEmail, validateEmptyFields} from "@/utils/validation";
import {useRouter} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";
import {signIn} from "next-auth/react";

const LoginForm = () => {
    const {signInWithGoogle, login} = useAuth();
    const [localLoading, setLocalLoading] = useState(false);
    const [localLoadingGG, setLocalLoadingGG] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleGoogleSignIn = async (e: React.MouseEvent) => {
        setLocalLoadingGG(true);
        e.preventDefault();

        try {
            // Use Next-Auth's signIn directly for better integration
            await signIn("google", {callbackUrl: window.location.origin});
            // Note: Don't need to call your custom signInWithGoogle as NextAuth will handle it
            setLocalLoadingGG(false);
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.showToast("Đăng nhập thất bại", ToastType.ERROR);
            setLocalLoadingGG(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {id, value} = e.target;
        setFormData((prev) => ({...prev, [id]: value}));
        setErrors((prev) => ({...prev, [id]: ""}));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        const emptyFieldErrors = validateEmptyFields(formData);
        const errors: { [key: string]: string } = {...emptyFieldErrors};
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
        setLocalLoading(true);
        login(
            formData,
            () => {
                toast.showToast("Đăng nhập thành công", ToastType.SUCCESS);
                setLocalLoading(false);
                setIsLoading(false);
            },
            (message: any) => {
                toast.showToast(message, ToastType.ERROR);
                setLocalLoading(false);
                setIsLoading(false);
            }
        );
    };

    const loadingGG = () => {
        return (
            <>
                <span>Đang xử lý...</span>
                <div className="w-5 h-5 border border-t-[3px] border-[#0053E2] rounded-full animate-spin"/>
            </>
        );
    };

    return (
        <div className="w-[393px] mx-auto">
            <div
                className="flex justify-center items-center rounded-3xl border border-solid border-black border-opacity-10 h-[55px] w-full text-sm font-semibold text-black">
                <button
                    className="flex items-center gap-2"
                    onClick={handleGoogleSignIn}
                    disabled={localLoadingGG}
                >
                    <Image src={google} alt="" width={30} className="object-cover"/>
                    {localLoadingGG ? loadingGG() : <span>Đăng nhập với Google</span>}
                </button>
            </div>

            <div className="flex gap-2 items-center mt-4 text-sm text-black">
                <div className="flex-1 border-t-[0.5px] border-black border-opacity-10"/>
                <div className="text-black/40">hoặc đăng nhập với email</div>
                <div className="flex-1 border-t-[0.5px] border-black border-opacity-10"/>
            </div>

            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email đăng nhập
                    </label>
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                        <input
                            id="email"
                            placeholder=""
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Mật khẩu
                    </label>
                    <div className="relative w-full">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-[55px] rounded-3xl px-4 pr-12 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <a
                        href="/quen-mat-khau"
                        className="text-sm font-bold text-[#0053E2] hover:text-[#002E99] transition-colors"
                    >
                        Quên mật khẩu?
                    </a>
                </div>

                <button
                    type="submit"
                    className={`w-full h-[55px] rounded-3xl bg-[#0053E2] text-white font-bold hover:bg-[#0042b4] transition-colors ${
                        isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#0053E2] hover:bg-blue-600"
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
            </form>

            <div className="flex gap-2 text-sm justify-center mt-4">
                <span className="font-medium">Bạn chưa có tài khoản?</span>
                <Link href="/dang-ky" legacyBehavior>
                    <a className="font-bold text-[#0053E2] hover:text-[#002E99] transition-colors">
                        Đăng ký ngay
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
