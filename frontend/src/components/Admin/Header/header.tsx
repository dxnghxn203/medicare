import { IoMenuOutline, IoChevronDownOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { IoMdLogOut } from "react-icons/io";
import { useToast } from "@/providers/toastProvider";
import { useRouter } from "next/navigation";
import avataAdmin from "@/images/admin.png";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  // const [search, setSearch] = useState("");
  const { admin, logout } = useAuth();

  const toast = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log("logout is clicked");
      logout(
        "admin",
        () => {
          router.replace("/dang-nhap-admin");
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

  return (
    <header className="w-full bg-[#FAFBFB] p-3 flex items-center justify-between border-b border-gray-200">
      <button
        className="text-gray-600 hover:text-gray-900"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <IoMenuOutline size={24} />
      </button>

      {/* <div className="relative flex-1 max-w-md mx-4">
        <CiSearch className="text-xl absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div> */}

      {/* Profile Dropdown */}
      <div
        className="relative"
        // ref={dropdownRef}
      >
        <div
          className="flex items-center cursor-pointer px-2 py-1 rounded-full hover:bg-gray-100 transition"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Image
            src={avataAdmin}
            alt=""
            height={30}
            width={30}
            className="rounded-full"
          />
          <div className="flex flex-col ml-2">
            <span className="ml-2 text-sm">
              Hi, <strong>{admin?.user_name}</strong>
            </span>
            <span className="ml-2 text-xs text-gray-500">{admin?.email}</span>
          </div>

          <IoChevronDownOutline className="ml-1 items-center" />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-4 mt-2 bg-white rounded-lg shadow-lg min-w-max z-50 overflow-hidden">
            <div className="py-2">
              <span className="px-4 py-2 font-semibold">Thông tin của bạn</span>
              <div className="flex px-4 py-2 items-center">
                <Image
                  src={avataAdmin}
                  alt=""
                  height={80}
                  width={80}
                  className="rounded-full"
                />
                <div className="flex flex-col ml-4">
                  <span className="font-medium">{admin?.user_name}</span>
                  <span className="text-gray-500 text-sm">Admin</span>
                  <div className="flex items-center text-gray-600 text-sm break-all">
                    <HiOutlineMail className="mr-1" />
                    <span className="whitespace-nowrap">{admin?.email}</span>
                  </div>
                </div>
              </div>

              <Link href="/thong-tin-tai-khoan">
                <div className="flex px-4 py-2 items-center hover:bg-gray-100 cursor-pointer space-x-1">
                  <MdOutlineAccountCircle className="text-lg text-gray-800" />
                  <div className="text-gray-800 text-sm">
                    Thông tin tài khoản
                  </div>
                </div>
              </Link>
              <div
                className="flex px-4 py-2 items-center hover:bg-gray-100 cursor-pointer space-x-1"
                onClick={handleLogout}
              >
                <IoMdLogOut className="text-lg text-red-600 " />
                <div className="text-red-600 text-sm">Đăng xuất</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
