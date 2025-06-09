import React from "react";
import Image from "next/image";
import textlogo from "@/images/5.png";
import logoyellow from "@/images/6.png";

const InfoFooter: React.FC = () => {
  return (
    <div className="py-10 px-10">
      <div className="grid grid-cols-5 justify-between text-black max-md:grid-cols-2 max-sm:grid-cols-1 md:gap-10">
        {/* Cột 1: Logo và giới thiệu */}
        <div className="flex flex-col items-start col-span-2 mr-16">
          <h3 className="text-lg font-semibold">GIỚI THIỆU CHUNG</h3>

          <p className="text-sm mt-4">
            Cửa hàng thực phẩm chức năng <em className="italic">Medicare</em> là
            địa chỉ tin cậy hàng đầu, nơi bạn có thể tìm kiếm và lựa chọn những
            sản phẩm chất lượng nhất, được kiểm định kỹ lưỡng.
            <br />
            <br />
            Chúng tôi cam kết đảm bảo sức khỏe của bạn, giúp bạn duy trì một cơ
            thể khỏe mạnh và năng động trong suốt cuộc sống.
          </p>
        </div>

        {/* Cột 2: Về chúng tôi */}
        <div className="flex flex-col items-start max-md:mt-10">
          <h3 className="text-lg font-semibold">VỀ CHÚNG TÔI</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#">Trang chủ</a>
            </li>
            <li>
              <a href="#">Giới thiệu</a>
            </li>
            <li>
              <a href="#">Sản phẩm</a>
            </li>
            <li>
              <a href="#">Góc sức khỏe</a>
            </li>
            <li>
              <a href="#">Video</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
            <li>
              <a href="#">Đặt lịch tư vấn</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div className="flex flex-col items-start max-md:mt-10">
          <h3 className="text-lg font-semibold">CHÍNH SÁCH</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#">Chính sách giao hàng</a>
            </li>
            <li>
              <a href="#">Chính sách đổi trả</a>
            </li>
            <li>
              <a href="#">Chính sách bán hàng</a>
            </li>
            <li>
              <a href="#">Chính sách thành viên</a>
            </li>
            <li>
              <a href="#">Bảo mật thông tin cá nhân</a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Thông tin liên hệ */}
        <div className="flex flex-col items-start max-md:mt-10">
          <h3 className="text-lg font-semibold">THÔNG TIN LIÊN HỆ</h3>
          <p className="mt-4 text-sm">
            📍 Số 1 Võ Văn Ngân, phường Linh Chiểu, thành phố Thủ Đức
          </p>
          <p className="mt-2 text-sm">📞 0943640913</p>
          <p className="mt-2 text-sm">✉️ support@henduyentuan.vn</p>

          <p className="text-sm font-medium mt-4">
            Mua hàng: <span className="text-[#002E99]">19006750</span>
          </p>
          <p className="mt-2 text-sm font-medium">
            Khiếu nại: <span className="text-[#002E99]">19006750</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoFooter;
