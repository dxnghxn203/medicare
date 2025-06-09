"use client";

import { FiUser, FiLogOut } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuFileClock } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdLockOutline, MdNavigateBefore } from "react-icons/md";
import { useToast } from "@/providers/toastProvider";
import { FaRegFileAlt, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Profile/breadcrumb";

const Sidebar = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      logout(
        "user",
        () => {
          router.replace("/");
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

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  const handleBackToMenu = () => {
    router.push("/ca-nhan");
  };

  const isRootProfilePage = pathname === "/ca-nhan";

  const shouldShowSidebarOnly = isMobile && isRootProfilePage;
  const shouldShowChildrenOnly = isMobile && !isRootProfilePage;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <Breadcrumb />
      </div>

      <div className="flex flex-col md:flex-row w-full mt-2">
        {(!isMobile || shouldShowSidebarOnly) && (
          <div className="md:w-1/4 w-full md:mb-8">
            <div className="bg-[#F5F7F9] w-full h-40 rounded-lg flex flex-col items-center justify-center">
              {user?.image ? (
                <img
                  src={user?.image}
                  alt={user.name || "User"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <HiOutlineUserCircle className="w-8 h-8 text-[#0053E2]" />
              )}
              <h2 className="text-lg text-black font-semibold mt-2">
                {user?.user_name}
              </h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>

            <div className="bg-[#F5F7F9] w-full mt-2 rounded-lg">
              <div>
                <button
                  onClick={() => handleMenuClick("/ca-nhan/thong-tin-ca-nhan")}
                  className={`font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer 
                    ${
                      pathname === "/ca-nhan" ||
                      pathname === "/ca-nhan/thong-tin-ca-nhan"
                        ? "bg-[#F0F5FF] text-[#0053E2]"
                        : "text-gray-800 hover:bg-[#EBEBEB]"
                    }`}
                >
                  <FaRegCircleUser className="mr-2 text-xl" />
                  Thông tin cá nhân
                </button>

                <button
                  onClick={() => handleMenuClick("/ca-nhan/lich-su-don-hang")}
                  className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                    ${
                      pathname === "/ca-nhan/lich-su-don-hang"
                        ? "bg-[#F0F5FF] text-[#0053E2]"
                        : "text-gray-800 hover:bg-[#EBEBEB]"
                    }`}
                >
                  <LuFileClock className="mr-2 text-xl" />
                  Lịch sử đơn hàng
                </button>

                <button
                  onClick={() => handleMenuClick("/ca-nhan/don-thuoc-cua-toi")}
                  className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                    ${
                      pathname === "/ca-nhan/don-thuoc-cua-toi"
                        ? "bg-[#F0F5FF] text-[#0053E2]"
                        : "text-gray-800 hover:bg-[#EBEBEB]"
                    }`}
                >
                  <FaRegFileAlt className="mr-2 text-xl" />
                  Đơn thuốc của tôi
                </button>

                <button
                  onClick={() => handleMenuClick("/ca-nhan/doi-mat-khau")}
                  className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                    ${
                      pathname === "/ca-nhan/doi-mat-khau"
                        ? "bg-[#F0F5FF] text-[#0053E2]"
                        : "text-gray-800 hover:bg-[#EBEBEB]"
                    }`}
                >
                  <MdLockOutline className="mr-2 text-xl" />
                  Đổi mật khẩu
                </button>

                <button
                  className="font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer text-gray-800 hover:bg-[#EBEBEB]"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mr-2 text-xl" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Children (nội dung bên phải) */}
        {(!isMobile || shouldShowChildrenOnly) && (
          <div className="md:w-3/4 w-full md:px-5">{children}</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
