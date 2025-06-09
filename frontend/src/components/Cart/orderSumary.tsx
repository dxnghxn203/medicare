import VoucherDialog from "@/components/Dialog/voucherDialog";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useVoucher } from "@/hooks/useVoucher";
import { useAuth } from "@/hooks/useAuth";

interface OrderSummaryProps {
  totalAmount: number;
  totalOriginPrice: number;
  totalDiscount: number;
  totalSave: number;
  checkout: () => void;
  setVouchers?: (vouchers: any) => void;
  vouchers?: any;
  shippingFee: any;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalOriginPrice,
  totalDiscount,
  totalSave,
  checkout,
  vouchers,
  setVouchers,
  shippingFee,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAuth();

  const { fetchGetAllVoucherUser, allVoucherUser } = useVoucher();
  useEffect(() => {
    fetchGetAllVoucherUser(
      () => {},
      () => {}
    );
  }, []);

  const [shippingFeeCart, setShippingFeeCart] = useState<any>(shippingFee);

  useEffect(() => {
    if (totalOriginPrice <= 0) {
      setShippingFeeCart(null);
    } else {
      setShippingFeeCart(shippingFee);
    }
  }, [totalOriginPrice, shippingFee]);

  return (
    <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col items-start pt-4 pr-7 pb-8 pl-3.5 mx-auto w-full font-medium rounded-xl bg-[#F5F7F9] max-md:pr-5 max-md:mt-8">
        <div
          className="flex gap-5 justify-between self-stretch px-4 py-3.5 text-sm text-[#0053E2] bg-indigo-50 rounded-xl max-md:mr-0.5 max-md:ml-2 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="self-start">Áp dụng voucher để được giảm giá</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/ea114104ad3ef0791d002897f7f4483b6477a0c967df6d8b11926796e1b46cf7?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            className="object-contain shrink-0 w-5 aspect-square"
            alt=""
          />
        </div>

        {shippingFeeCart?.voucher_error &&
          shippingFeeCart.voucher_error.length > 0 && (
            <div className="mt-2 ml-2.5 w-full">
              {shippingFeeCart.voucher_error.map(
                (error: any, index: number) => (
                  <div
                    key={index}
                    className="text-sm text-red-500 bg-red-50 p-2 rounded-md mb-1"
                  >
                    {error.message}
                  </div>
                )
              )}
            </div>
          )}

        <div className="flex flex-col mt-4 ml-2.5 max-w-full text-sm w-[337px]">
          <div className="flex justify-between text-black">
            <div>Tổng tiền</div>
            <div>{totalOriginPrice.toLocaleString("vi-VN")}đ</div>
          </div>
          <div className="flex justify-between text-black mt-5">
            <div>Giảm giá trực tiếp</div>
            <div className="text-amber-500">
              - {totalDiscount.toLocaleString("vi-VN")}đ
            </div>
          </div>
          <div className="flex justify-between text-black mt-5">
            <div>Giảm giá voucher</div>
            <div className="text-amber-500">
              {shippingFeeCart && shippingFeeCart?.voucher_order_discount > 0
                ? `-${shippingFeeCart?.voucher_order_discount.toLocaleString(
                    "vi-VN"
                  )}đ`
                : "0đ"}
            </div>
          </div>
          <div className="flex justify-between text-black mt-5">
            <div>Tiết kiệm được</div>
            <div className="text-amber-500">
              {(
                totalSave + (shippingFeeCart?.voucher_order_discount || 0)
              ).toLocaleString("vi-VN")}
              đ
            </div>
          </div>
        </div>

        <div className="shrink-0 mt-5 ml-2.5 max-w-full h-px border border-black border-opacity-10 w-[337px]" />

        <div className="flex gap-5 justify-between items-center mt-3 ml-2.5 max-w-full w-[337px]">
          <div className="text-xl text-black">Thành tiền</div>
          <div className="flex gap-2 whitespace-nowrap">
            {totalDiscount > 0 && (
              <div className="text-lg text-gray-500 line-through mt-0.5">
                {totalOriginPrice.toLocaleString("vi-VN")}đ
              </div>
            )}
            <div className="text-xl font-bold text-blue-700">
              {" "}
              {(
                totalAmount - (shippingFeeCart?.voucher_order_discount || 0)
              ).toLocaleString("vi-VN")}
              đ
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <button
            className={`w-full px-[120px] py-4 mt-7 mx-auto block text-base font-bold text-white rounded-3xl whitespace-nowrap ${
              totalAmount === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-[#002E99]"
            }`}
            onClick={checkout}
            disabled={totalAmount === 0}
          >
            Mua hàng
          </button>
        </div>
        {totalAmount === 0 && (
          <div className="mt-2 text-center text-red-500 text-sm">
            Vui lòng chọn sản phẩm để mua hàng!
          </div>
        )}

        <div className="mt-7 text-sm text-center font-normal">
          Bằng việc tiến hành đặt mua hàng, bạn đồng ý với Điều khoản dịch vụ và
          Chính sách xử lý dữ liệu cá nhân của Nhà thuốc Medicare
        </div>
      </div>
      {isDialogOpen && (
        <VoucherDialog
          onClose={() => setIsDialogOpen(false)}
          allVoucherUser={allVoucherUser}
          setVouchers={setVouchers}
          totalAmount={totalAmount}
          vouchers={vouchers}
          orderCheck={!!(totalOriginPrice && totalOriginPrice != 0)}
          voucherErrors={shippingFeeCart?.voucher_error || []}
        />
      )}
    </div>
  );
};

export default OrderSummary;
