import logo from "@/images/sandeal-Photoroom.jpg";
import Image from "next/image";
import ProductDiscountList from "./productDiscountList";
import { useProduct } from "@/hooks/useProduct";
import { useEffect } from "react";
import CountdownTimer from "./countDownTimer";

// components/SanDealHeader.tsx
export default function SanDealHeader() {
  const { allProductDiscount, fetchGetProductDiscount } = useProduct();
  useEffect(() => {
    fetchGetProductDiscount();
  }, []);

  const firstProduct = allProductDiscount?.[0];
  const expiredDate = firstProduct?.prices?.[0]?.expired_date;
  console.log("expiredDate", expiredDate);
  return (
    allProductDiscount?.length > 0 && (
      <>
        <div className="bg-gradient-to-r from-[#0099e6] to-[#00cc99] text-white py-4 flex justify-between items-center flex-col rounded-xl px-4 space-y-4">
          <div className="flex items-center space-x-4 justify-between w-full">
            <div className="flex items-center space-x-4">
              <Image src={logo} alt="Săn Deal" className="w-32" />
              {expiredDate ? (
                <CountdownTimer expiredDate={expiredDate} />
              ) : (
                <div className="text-sm font-semibold">Đang tải...</div>
              )}
            </div>

            {/* Xem thêm */}
            <a
              href="/bo-suu-tap/san-uu-dai-xin"
              className="text-white hover:underline font-medium text-sm"
            >
              Xem thêm
            </a>
          </div>
          <ProductDiscountList />
        </div>
      </>
    )
  );
}
