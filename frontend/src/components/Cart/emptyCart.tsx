import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import cartempty from "@/images/empty-cart.png";

const CartEmpty: React.FC = () => {
  return (
    <div>
      <div className="flex justify-center pt-20">
        <Image
          src={cartempty}
          alt="Giỏ hàng trống"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      <div className="text-semibold text-center text-black mt-4">
        Chưa có sản phẩm nào trong giỏ hàng
      </div>
      <div className="mt-2 text-sm text-center text-black/50">
        Cùng khám phá hàng ngàn sản phẩm
        <br />
        tại Nhà thuốc Medicare nhé!
      </div>

      <Link href="/" className="flex justify-center mt-7">
        <button className="px-5 py-4  text-[16px] font-semibold text-white bg-[#0053E2] rounded-[40px] max-md:px-5 hover:bg-[#002E99] transition-colors">
          Khám phá ngay
        </button>
      </Link>
    </div>
  );
};

export default CartEmpty;
