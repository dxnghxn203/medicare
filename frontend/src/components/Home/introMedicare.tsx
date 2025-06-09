import React from "react";
import { Clock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Family from "@/images/Family.png";
import { LuTicketPercent } from "react-icons/lu";
import { BsChatHeart } from "react-icons/bs";
import Link from "next/link";

const IntroMedicare: React.FC = () => {
  return (
    <div className="bg-blue-50 flex justify-between items-center rounded-xl p-6 w-full my-10 h-[220px] max-md:flex-col max-md:items-start max-md:h-auto">
      {/* Left content */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="text-blue-600" />
          </div>

          <div>
            <h3 className="text-blue-700 font-bold">CAM KẾT 100%</h3>
            <p className="text-sm text-gray-700">thuốc chính hãng</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="text-blue-600 w-6 h-6 " />
          </div>
          <div>
            <h3 className="text-blue-700 font-bold">GIAO HÀNG ĐÚNG HẸN</h3>
            <p className="text-sm text-gray-700">với ngày dự định</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <LuTicketPercent className="text-blue-600 w-6 h-6 " />
          </div>
          <div>
            <h3 className="text-blue-700 font-bold">VOUCHER HẤP DẪN</h3>
            <Link href="/gio-hang">
              <div className="text-sm text-blue-600 underline cursor-pointer">
                Mua hàng ngay
              </div>
            </Link>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <BsChatHeart className="text-blue-600 w-6 h-6 " />
          </div>
          <div>
            <h3 className="text-blue-700 font-bold">TƯ VẤN MIỄN PHÍ</h3>
            <a className="text-sm">với dược sĩ chuyên môn</a>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex flex-col items-start justify-center ml-10">
        <p className="text-blue-700 font-bold text-lg leading-tight">
          TÌM KIẾM
          <br />
          SẢN PHẨM BẰNG HÌNH ẢNH
        </p>
        <Link
          href="/tim-kiem-hinh-anh"
          className="text-sm text-blue-600 underline mt-2"
        >
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700">
            Tìm kiếm ngay
          </button>
        </Link>
      </div>

      <div className="hidden md:block relative w-[340px] h-[180px]">
        <div className="absolute bottom-[-20px] left-0 ">
          <img
            src={Family.src}
            alt="Gia đình và robot"
            className="w-[340px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default IntroMedicare;
