import React, {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FiHome, FiLogOut, FiUser} from "react-icons/fi";
import {IoHome} from "react-icons/io5";
import {FaCircleUser} from "react-icons/fa6";
import {useAuth} from "@/hooks/useAuth";
import {useToast} from "@/providers/toastProvider";

const AlreadyLoggedIn = () => {
    const {user, logout} = useAuth();
    const router = useRouter();
    const [countdown, setCountdown] = useState(30);
    const toast = useToast();

    const handleLogout = async () => {
        try {
            logout(
                "user",
                () => {
                    router.push("/");
                    // toast.showToast("Đăng xuất thành công", "success");
                },
                (error) => {
                    toast.showToast(error, "error");
                }
            );

            toast.showToast("Đăng xuất thành công", "success");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            router.replace("/");
        }
    }, [countdown, router]);

    return (
        <div className="w-[393px] mx-auto p-6 bg-white rounded-xl shadow-md">
            <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    {user?.image ? (
                        <img
                            src={user?.image}
                            alt={"null"}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <FiUser className="w-8 h-8 text-[#0053E2]"/>
                    )}
                </div>

                <h2 className="text-xl font-semibold mb-1">
                    {user?.name || user?.user_name}
                </h2>

                <p className="text-gray-500 text-sm mb-4">{user?.email || "null"}</p>

                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 space-y-4">
                    <p>Bạn đã đăng nhập thành công!</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <p className="text-sm">Bạn sẽ được chuyển hướng trong</p>
                        <span className="text-sm font-bold bg-green-200 px-2 py-0.5 rounded-full">
              {countdown}s
            </span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <Link href="/">
                    <div
                        className="flex items-center justify-center gap-2 w-full h-[55px] rounded-3xl bg-[#0053E2] text-white font-medium hover:bg-[#0042b4] transition-colors">
                        <IoHome className="text-xl"/>
                        <span>Đi đến trang chủ</span>
                    </div>
                </Link>

                <Link href="/ca-nhan">
                    <div
                        className="mt-4 flex items-center justify-center gap-2 w-full h-[55px] rounded-3xl border border-[#0053E2] text-[#0053E2] font-medium hover:bg-blue-50 transition-colors">
                        <FaCircleUser className="text-xl"/>
                        <span>Xem thông tin cá nhân</span>
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full h-[55px] rounded-3xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    <FiLogOut className="text-lg"/>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default AlreadyLoggedIn;
