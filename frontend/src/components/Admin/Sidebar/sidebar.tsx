import { FiPieChart, FiShoppingBag } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import {
  TbBrandBooking,
  TbCategory,
  TbShoppingBagDiscount,
} from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { memo } from "react";
import { usePathname } from "next/navigation";

import logo from "@/images/MM.png";
import textlogo from "@/images/medicare2.png";
import textAdmin from "@/images/textAdmin.jpg";
import logoAdmin from "@/images/8.jpg";
import { IoMdSettings } from "react-icons/io";
import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import { LuLockKeyhole } from "react-icons/lu";
import { SlInfo } from "react-icons/sl";
import { ImInfo } from "react-icons/im";
import { RiDiscountPercentLine } from "react-icons/ri";
import { GrArticle } from "react-icons/gr";
import { te } from "date-fns/locale";

interface SidebarProps {
  isOpen: boolean;
}

const menuHomeItems = [
  {
    id: "Dashboard",
    icon: <FiPieChart />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    id: "User",
    icon: <FaRegUser />,
    label: "Người dùng",
    path: "/quan-ly-nguoi-dung",
  },
  {
    id: "Order",
    icon: <FiShoppingBag />,
    label: "Đơn hàng",
    path: "/quan-ly-don-hang",
  },
  {
    id: "Product",
    icon: <BsBox />,
    label: "Sản phẩm",
    path: "/san-pham",
  },
  {
    id: "Category",
    icon: <TbCategory />,
    label: "Danh mục",
    path: "/quan-ly-danh-muc",
  },
  {
    id: "Discount",
    icon: <TbShoppingBagDiscount />,
    label: "Chiến dịch giảm giá",
    path: "/quan-ly-giam-gia",
  },
  {
    id: "Voucher",
    icon: <RiDiscountPercentLine />,
    label: "Voucher",
    path: "/quan-ly-voucher",
  },
  {
    id: "Brand",
    icon: <TbBrandBooking />,
    label: "Thương hiệu",
    path: "/quan-ly-thuong-hieu",
  },
  {
    id: "Article",
    icon: <GrArticle />,
    label: "Bài viết",
    path: "/quan-ly-bai-viet",
  },
];
const menuSettingsItems = [
  {
    id: "Settings",
    icon: <ImInfo />,
    label: "Thông tin tài khoản",
    path: "/thong-tin-tai-khoan",
  },
  {
    id: "Settings",
    icon: <LuLockKeyhole />,
    label: "Đổi mật khẩu",
    path: "/doi-mat-khau-admin",
  },
];

const Sidebar = memo(({ isOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "flex flex-col border-r border-gray-200 transition-all duration-500 bg-[#FAFBFB]",
        isOpen ? "w-[250px] p-2 " : "w-[80px] p-4 "
      )}
    >
      {/* Logo */}
      <div className="flex items-center mb-6 ml-2">
        <Image
          src={textAdmin}
          width={50}
          height={50}
          alt="Text Logo"
          priority
        />
        <Image
          src={logoAdmin}
          alt="Logo"
          width={70}
          height={70}
          priority
          className={clsx(
            "transition-opacity duration-1000 mt-2",
            isOpen ? "opacity-100" : "opacity-0 hidden"
          )}
        />
      </div>
      {/* Menu */}
      <div className="px-2 flex flex-col w-full overflow-y-auto h-full scrollbar-hide">
        <p
          className={clsx(
            "text-xs font-bold text-black mb-2",
            isOpen ? "opacity-100" : "opacity-100 text-center"
          )}
        >
          {isOpen ? "HOME" : "..."}
        </p>
        <nav className="space-y-1 w-full flex flex-col">
          {menuHomeItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link key={item.id} href={item.path}>
                <div
                  className={clsx(
                    "flex p-3 rounded-lg transition-all duration-500 cursor-pointer",
                    isOpen
                      ? "justify-start items-center"
                      : "justify-center items-center",
                    isActive
                      ? "bg-[#1E4DB7] text-white"
                      : "text-black hover:bg-[#E7ECF7] hover:text-[#1E4DB7]"
                  )}
                >
                  <div className="text-lg">{item.icon}</div>
                  <span
                    className={clsx(
                      "ml-3",
                      isOpen ? "opacity-100" : "opacity-0 hidden"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
        <p
          className={clsx(
            "text-xs font-bold text-black my-2",
            isOpen ? "opacity-100" : "opacity-100 text-center"
          )}
        >
          {isOpen ? "SETTINGS" : "..."}
        </p>
        <nav className="space-y-1 w-full flex flex-col">
          {menuSettingsItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link key={item.id} href={item.path}>
                <div
                  className={clsx(
                    "flex px-2 py-3 rounded-lg transition-all duration-500 cursor-pointer",
                    isOpen
                      ? "justify-start items-center"
                      : "justify-center items-center",
                    isActive
                      ? "bg-[#1E4DB7] text-white"
                      : "text-black hover:bg-[#E7ECF7] hover:text-[#1E4DB7]"
                  )}
                >
                  <div className="text-lg">{item.icon}</div>
                  <span
                    className={clsx(
                      "ml-3",
                      isOpen ? "opacity-100" : "opacity-0 hidden"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
});

export default Sidebar;
