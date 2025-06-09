import VoucherDialog from "@/components/Dialog/voucherDialog";
import {useVoucher} from "@/hooks/useVoucher";
import React, {useEffect, useMemo, useState} from "react";

interface OrderSummaryProps {
    totalAmount: number;
    totalOriginPrice: number;
    totalDiscount: number;
    totalSave: number;
    shippingFee?: any;
    checkout: () => void;
    vouchers?: any;
    setVouchers?: (vouchers: any) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
                                                       totalAmount,
                                                       totalOriginPrice,
                                                       totalDiscount,
                                                       totalSave,
                                                       shippingFee,
                                                       checkout,
                                                       vouchers,
                                                       setVouchers
                                                   }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {fetchGetAllVoucherUser, allVoucherUser} = useVoucher();
    useEffect(() => {
        fetchGetAllVoucherUser(
            () => {
            },
            () => {
            }
        );
    }, []);

    const [shippingFeeCart, setShippingFeeCart] = useState(shippingFee);
    useEffect(() => {
        if (totalOriginPrice <= 0) {
            setShippingFeeCart(null)
        } else {
            setShippingFeeCart(shippingFee);
        }
    }, [totalOriginPrice, shippingFee]);
    return (
        <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
            <div
                className="flex flex-col items-start pt-4 pr-7 pb-8 pl-3.5 mx-auto w-full font-medium rounded-xl bg-[#F5F7F9] max-md:pr-5 max-md:mt-8">
                <div
                    className="flex gap-5 justify-between self-stretch px-4 py-3.5 text-sm text-[#0053E2] bg-indigo-50 rounded-xl max-md:mr-0.5 max-md:ml-2 cursor-pointer"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <div className="self-start">Áp dụng ưu đãi để được giảm giá</div>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/ea114104ad3ef0791d002897f7f4483b6477a0c967df6d8b11926796e1b46cf7?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
                        className="object-contain shrink-0 w-5 aspect-square"
                        alt=""
                    />
                </div>

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
                                ? `-${shippingFeeCart?.voucher_order_discount.toLocaleString("vi-VN")}đ`
                                : "0đ"}
                        </div>
                    </div>
                    <div className="flex justify-between text-black mt-5">
                        <div>Tiết kiệm được</div>
                        <div className="text-amber-500">
                            {(totalSave + (shippingFeeCart?.voucher_order_discount || 0)).toLocaleString("vi-VN")}đ
                        </div>
                    </div>
                </div>

                <div className="shrink-0 mt-5 ml-2.5 max-w-full h-px border border-black border-opacity-10 w-[337px]"/>
                <div className="flex justify-between items-center mt-3 ml-2.5 max-w-full text-sm text-black w-[337px]">
                    <div>Phí vận chuyển</div>
                    <div className="flex flex-col items-end">
                        {shippingFeeCart?.voucher_delivery_discount > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                                {(shippingFeeCart?.shipping_fee || 0)?.toLocaleString("vi-VN")}đ
                            </div>
                        )}
                        <div className="text-amber-500">
                            {(shippingFeeCart?.shipping_fee - (shippingFeeCart?.voucher_delivery_discount || 0))?.toLocaleString("vi-VN")}đ
                            {shippingFeeCart?.voucher_delivery_discount > 0 && (
                                <span className="text-xs text-green-600 ml-1">
                                    (-{shippingFeeCart.voucher_delivery_discount.toLocaleString("vi-VN")}đ)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="shrink-0 mt-5 ml-2.5 max-w-full h-px border border-black border-opacity-10 w-[337px]"/>
                <div className="flex justify-between items-center mt-3 ml-2.5 max-w-full text-sm text-black w-[337px]">
                    <div>Thời gian giao hàng dự kiến</div>
                    {shippingFeeCart?.delivery_time ? (
                        <div className="flex items-center gap-2">
                            <div className="flex px-3 py-1.5 rounded-full bg-green-50 shadow-sm items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-green-500 mr-1.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                    />
                                </svg>

                                <span className="text-xs font-medium text-green-600">
                  {new Date(shippingFeeCart.delivery_time).toLocaleDateString(
                      "vi-VN",
                      {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                      }
                  )}
                </span>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className="flex gap-5 justify-between items-center mt-3 ml-2.5 max-w-full w-[337px]">
                    <div className="text-xl text-black">Thành tiền</div>
                    <div className="flex gap-2 whitespace-nowrap items-center">
                        {totalDiscount > 0 && (
                            <div className="text-lg text-gray-500 line-through mt-0.5">
                                {totalOriginPrice.toLocaleString("vi-VN")}đ
                            </div>
                        )}
                        <div className="text-xl font-semibold text-blue-700">
                            {(shippingFee?.estimated_total_fee || 0).toLocaleString(
                                "vi-VN"
                            )}
                            đ
                        </div>
                    </div>
                </div>

                <button
                    onClick={checkout}
                    className="px-16 py-4 mt-7 ml-2.5 max-w-full text-base font-bold text-white bg-blue-700 rounded-3xl w-[337px] max-md:px-5 hover:bg-[#002E99]"
                >
                    Thanh toán
                </button>

                <div className="mt-7 text-sm text-center font-normal">
                    Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
                    <strong>Điều khoản dịch vụ</strong> và{" "}
                    <strong>Chính sách xử lý dữ liệu cá nhân </strong> của Nhà thuốc
                    Medicare
                </div>
            </div>
            {isDialogOpen && (
                <VoucherDialog
                    onClose={() => setIsDialogOpen(false)}
                    allVoucherUser={allVoucherUser}
                    setVouchers={setVouchers}
                    totalAmount={shippingFee?.product_fee || 0}
                    vouchers={vouchers}
                    orderCheck={!!(totalOriginPrice && totalOriginPrice != 0)}
                />
            )}
        </div>
    );
};

export default OrderSummary;

