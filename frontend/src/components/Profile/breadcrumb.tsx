import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/ca-nhan":
      case "/ca-nhan/thong-tin-ca-nhan":
        return "Thông tin cá nhân";
      case "/ca-nhan/lich-su-don-hang":
        return "Lịch sử đơn hàng";
      case "/ca-nhan/don-thuoc-cua-toi":
        return "Đơn thuốc của tôi";
      case "/ca-nhan/doi-mat-khau":
        return "Đổi mật khẩu";
      default:
        return "Trang cá nhân";
    }
  };

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-blue-700 hover:text-blue-600 transition-colors"
          >
            Trang chủ
          </Link>
        </li>

        <li className="flex items-center">
          <span className="text-gray-500 mx-2">/</span>
          <Link
            href="/ca-nhan"
            className="text-blue-700 hover:text-blue-600 transition-colors"
          >
            Cá nhân
          </Link>
        </li>

        {pathname !== "/ca-nhan" && (
          <li className="flex items-center">
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-gray-600">{getPageTitle()}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
