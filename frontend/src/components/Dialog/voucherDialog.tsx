"use client";

import React, {useEffect, useState} from "react";
import {X} from "lucide-react";
import Image from "next/image";
import voucher from "@/images/gift.png";
import {useAuth} from "@/hooks/useAuth";

interface VoucherDialogProps {
    onClose: () => void;
    allVoucherUser: any;
    setVouchers?: (vouchers: any) => void;
    vouchers?: any;
    orderCheck: boolean;
    totalAmount?: any;
    voucherErrors?: Array<{ voucher_id: string, message: string }>;
}

const VoucherDialog: React.FC<VoucherDialogProps> = ({
                                                         onClose,
                                                         allVoucherUser,
                                                         setVouchers,
                                                         vouchers,
                                                         orderCheck,
                                                         totalAmount,
                                                         voucherErrors = []
                                                     }) => {
    const {user} = useAuth();
    const [voucherCode, setVoucherCode] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [selectedVoucherOrder, setSelectedVoucherOrder] = useState<any>(null);
    const [showAll, setShowAll] = useState(false);
    const [showAllOrder, setShowAllOrder] = useState(false);
    const deliveryVouchers = allVoucherUser.filter(
        (voucher: any) => voucher.voucher_type === "delivery"
    );

    const isVoucherEligible = (voucher: any) => {
        if (!totalAmount || !orderCheck) return false;
        return voucher.min_order_value <= totalAmount;
    };

    const hasUserUsedVoucher = (voucher: any) => {
        if (!user || !voucher.used_by) return false;
        return voucher.used_by.includes(user._id);
    };

    const isVoucherError = (voucherId: string) => {
        return voucherErrors.some(error => error.voucher_id === voucherId);
    };

    const getVoucherErrorMessage = (voucherId: string) => {
        const error = voucherErrors.find(error => error.voucher_id === voucherId);
        return error ? error.message : "";
    };

    const isSingleUseVoucher = (voucher: any) => {
        return voucher.inventory === 1;
    };

    const vouchersToShow = showAll
        ? deliveryVouchers
        : deliveryVouchers.slice(0, 3);
    const orderVouchers = allVoucherUser.filter(
        (voucher: any) => voucher.voucher_type === "order"
    );

    const orderVouchersToShow = showAllOrder
        ? orderVouchers
        : orderVouchers.slice(0, 3);

    useEffect(() => {
        if (vouchers) {
            setSelectedVoucher(vouchers.selectedVoucher);
            setSelectedVoucherOrder(vouchers.selectedVoucherOrder);
        }
    }, [totalAmount]);

    useEffect(() => {
        if (totalAmount && setVouchers) {
            let newSelectedVoucher = selectedVoucher;
            let newSelectedVoucherOrder = selectedVoucherOrder;
            let needsUpdate = false;

            if (selectedVoucher && selectedVoucher.min_order_value > totalAmount) {
                newSelectedVoucher = null;
                needsUpdate = true;
            }

            if (selectedVoucherOrder && selectedVoucherOrder.min_order_value > totalAmount) {
                newSelectedVoucherOrder = null;
                needsUpdate = true;
            }

            if (needsUpdate) {
                setSelectedVoucher(newSelectedVoucher);
                setSelectedVoucherOrder(newSelectedVoucherOrder);

                setVouchers({
                    selectedVoucher: newSelectedVoucher,
                    selectedVoucherOrder: newSelectedVoucherOrder
                });
            }
        }
    }, [totalAmount, selectedVoucher, selectedVoucherOrder, setVouchers]);

    useEffect(() => {
        if (voucherErrors.length > 0 && setVouchers) {
            let newSelectedVoucher = selectedVoucher;
            let newSelectedVoucherOrder = selectedVoucherOrder;

            if (selectedVoucher && voucherErrors.some(error => error.voucher_id === selectedVoucher.voucher_id)) {
                newSelectedVoucher = null;
            }

            if (selectedVoucherOrder && voucherErrors.some(error => error.voucher_id === selectedVoucherOrder.voucher_id)) {
                newSelectedVoucherOrder = null;
            }

            if (newSelectedVoucher !== selectedVoucher || newSelectedVoucherOrder !== selectedVoucherOrder) {
                setSelectedVoucher(newSelectedVoucher);
                setSelectedVoucherOrder(newSelectedVoucherOrder);

                setVouchers({
                    selectedVoucher: newSelectedVoucher,
                    selectedVoucherOrder: newSelectedVoucherOrder
                });
            }
        }
    }, [voucherErrors, selectedVoucher, selectedVoucherOrder, setVouchers]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVoucherCode(e.target.value);
    };

    const truncateText = (text: string, maxLength: number = 60) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const highlightPercentage = (text: string) => {
        if (!text) return "";
        const parts = text.split(/(\d+\s*%)/g);
        return parts.map((part, index) => {
            if (part.match(/\d+\s*%/)) {
                return <span key={index} className="font-semibold text-red-600">{part}</span>;
            }
            return part;
        });
    };

    const getVoucherStatusMessage = (voucher: any) => {
        if (!orderCheck) return null;

        if (!isVoucherEligible(voucher)) {
            return (
                <p className="text-[10px] text-red-500">
                    Đơn hàng chưa đủ giá trị tối thiểu
                </p>
            );
        }

        if (hasUserUsedVoucher(voucher)) {
            return (
                <p className="text-[10px] text-red-500">
                    Voucher chỉ được sử dụng 1 lần
                </p>
            );
        }

        if (isVoucherError(voucher.voucher_id)) {
            return (
                <p className="text-[10px] text-red-500 font-medium">
                    {getVoucherErrorMessage(voucher.voucher_id)}
                </p>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="bg-white w-full max-w-lg max-h-[100vh] rounded-lg flex flex-col items-center relative overflow-hidden px-6 py-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <X size={24}/>
                </button>

                <div className="text-2xl font-bold text-black text-center mb-4">
                    Ưu đãi dành cho bạn
                </div>

                {!orderCheck && (
                    <div
                        className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4">
                        <p className="text-center font-medium text-sm">Bạn hãy chọn sản phẩm để tiếp tục</p>
                    </div>
                )}

                <div
                    className="flex w-full max-w-3xl mt-2 text-black border border-zinc-400 border-opacity-40 rounded-full">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 bg-transparent border-none outline-none text-sm px-4 py-3"
                        value={voucherCode}
                        onChange={handleInputChange}
                        disabled={!orderCheck}
                    />
                    <button
                        type="submit"
                        className={`px-4 py-3 font-semibold rounded-full text-white text-sm transition ${
                            voucherCode && orderCheck
                                ? "bg-[#0053E2] hover:bg-[#002E99]"
                                : "bg-zinc-400 cursor-not-allowed"
                        }`}
                        disabled={!voucherCode || !orderCheck}
                    >
                        Xác nhận
                    </button>
                </div>

                <div className="w-full max-w-lg overflow-y-auto scrollbar-hide mt-3 px-1 space-y-6 flex flex-col">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">
                            Mã Giảm giá Vận Chuyển
                        </h2>
                        <p className="text-xs text-gray-500 mb-3">Có thể chọn 1 Voucher</p>

                        {vouchersToShow.map(
                            (voucher: any, index: number) =>
                                voucher.voucher_type === "delivery" && (
                                    <label
                                        key={voucher.voucher_id}
                                        className={`flex justify-between items-center border rounded-lg mb-2 ${
                                            isVoucherError(voucher.voucher_id) || hasUserUsedVoucher(voucher) ? "border-red-300 bg-red-50" : ""
                                        } ${
                                            orderCheck && isVoucherEligible(voucher) && !hasUserUsedVoucher(voucher)
                                                ? "cursor-pointer hover:bg-gray-50"
                                                : "cursor-default opacity-80"
                                        }`}
                                    >
                                        <div className="flex">
                                            <div
                                                className="relative rang-cua-left w-24 bg-[#26A999] text-white text-center font-bold p-2 rounded-l-lg">
                                                FREE
                                                <br/>
                                                SHIP
                                                <p className="text-[10px] mt-1">Toàn Ngành Hàng</p>
                                                {isSingleUseVoucher(voucher) && (
                                                    <div
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-full">
                                                        Dùng 1 lần
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col px-3 py-1 justify-center">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Giảm tối đa{" "}
                                                        {voucher.max_discount_value.toLocaleString("vi-VN")}đ
                                                    </p>
                                                    {isSingleUseVoucher(voucher) && (
                                                        <span
                                                            className="ml-2 text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                                                            Chỉ dùng 1 lần
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-gray-600">
                                                    {highlightPercentage(truncateText(voucher.description, 50))}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Đơn tối thiểu{" "}
                                                    {voucher.min_order_value.toLocaleString("vi-VN")}đ
                                                </p>
                                                <div className="w-full h-1.5 bg-red-200 rounded mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                        style={{
                                                            width: `${
                                                                (voucher.used / voucher.inventory) * 100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                                    <span>
                                                        Đã dùng {(voucher.used / voucher.inventory) * 100}%
                                                    </span>
                                                    <span>
                                                        HSD: {new Date(voucher.expired_date).toLocaleDateString("vi-VN")}
                                                    </span>
                                                </div>
                                                {getVoucherStatusMessage(voucher)}
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => {
                                                // Only allow interaction if voucher is eligible
                                                if (orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)) {
                                                    if (selectedVoucher?.voucher_id === voucher.voucher_id) {
                                                        // Deselect if already selected
                                                        setSelectedVoucher(null);
                                                        if (setVouchers) {
                                                            setVouchers({
                                                                selectedVoucher: null,
                                                                selectedVoucherOrder: selectedVoucherOrder,
                                                            });
                                                        }
                                                    } else {
                                                        // Select if not already selected
                                                        setSelectedVoucher(voucher);
                                                        if (setVouchers) {
                                                            setVouchers({
                                                                selectedVoucher: voucher,
                                                                selectedVoucherOrder: selectedVoucherOrder,
                                                            });
                                                        }
                                                    }
                                                }
                                            }}
                                            className={`mr-3 w-5 h-5 rounded-full border flex items-center justify-center ${
                                                orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)
                                                    ? "cursor-pointer border-blue-600"
                                                    : "cursor-not-allowed border-gray-300 opacity-50"
                                            }`}
                                        >
                                            {selectedVoucher?.voucher_id === voucher.voucher_id && (
                                                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                            )}
                                        </div>
                                        {/*<input*/}
                                        {/*    type="radio"*/}
                                        {/*    name="selectedVoucher"*/}
                                        {/*    value={voucher.voucher_id}*/}
                                        {/*    checked={selectedVoucher?.voucher_id === voucher.voucher_id}*/}
                                        {/*    onChange={() => {*/}
                                        {/*        if (orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)) {*/}
                                        {/*            if (selectedVoucher?.voucher_id === voucher.voucher_id) {*/}
                                        {/*                setSelectedVoucher(null);*/}
                                        {/*                if (setVouchers) {*/}
                                        {/*                    setVouchers({*/}
                                        {/*                        selectedVoucher: null,*/}
                                        {/*                        selectedVoucherOrder: selectedVoucherOrder,*/}
                                        {/*                    });*/}
                                        {/*                }*/}
                                        {/*            } else {*/}
                                        {/*                setSelectedVoucher(voucher);*/}
                                        {/*                if (setVouchers) {*/}
                                        {/*                    setVouchers({*/}
                                        {/*                        selectedVoucher: voucher,*/}
                                        {/*                        selectedVoucherOrder: selectedVoucherOrder,*/}
                                        {/*                    });*/}
                                        {/*                }*/}
                                        {/*            }*/}
                                        {/*        }*/}
                                        {/*    }}*/}
                                        {/*    className={`mr-3 flex items-center ${*/}
                                        {/*        orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)*/}
                                        {/*            ? "cursor-pointer"*/}
                                        {/*            : "cursor-not-allowed"*/}
                                        {/*    }`}*/}
                                        {/*    disabled={!orderCheck || !isVoucherEligible(voucher) || isVoucherError(voucher.voucher_id) || hasUserUsedVoucher(voucher)}*/}
                                        {/*/>*/}
                                    </label>
                                )
                        )}
                        <div className="flex justify-center items-center">
                            {deliveryVouchers.length > 3 && (
                                <button
                                    className="text-blue-600 text-sm underline ml-2 mt-2 "
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll ? "Ẩn bớt" : "Xem thêm"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-gray-800">Giảm Giá</h2>
                        <p className="text-xs text-gray-500 mb-3">Có thể chọn 1 Voucher</p>
                        {orderVouchersToShow.map(
                            (voucher: any, index: number) =>
                                voucher.voucher_type === "order" && (
                                    <label
                                        key={voucher.voucher_id}
                                        className={`flex justify-between items-center border rounded-lg mb-2 ${
                                            isVoucherError(voucher.voucher_id) || hasUserUsedVoucher(voucher) ? "border-red-300 bg-red-50" : ""
                                        } ${
                                            orderCheck && isVoucherEligible(voucher) && !hasUserUsedVoucher(voucher)
                                                ? "cursor-pointer hover:bg-gray-50"
                                                : "cursor-default opacity-80"
                                        }`}
                                    >
                                        <div className="flex">
                                            <div
                                                className="relative rang-cua-left w-24 bg-[#EA4B2A] text-white text-center font-bold p-2 rounded-l-lg rang-cua-left">
                                                ĐƠN
                                                <br/>
                                                HÀNG
                                                <p className="text-[10px] mt-1">Toàn Ngành Hàng</p>
                                                {isSingleUseVoucher(voucher) && (
                                                    <div
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-full">
                                                        Dùng 1 lần
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col px-3 py-1 justify-center">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Giảm tối đa{" "}
                                                        {voucher.max_discount_value.toLocaleString("vi-VN")}đ
                                                    </p>
                                                    {isSingleUseVoucher(voucher) && (
                                                        <span
                                                            className="ml-2 text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                                                            Chỉ dùng 1 lần
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-gray-600">
                                                    {highlightPercentage(truncateText(voucher.description, 50))}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Đơn tối thiểu{" "}
                                                    {voucher.min_order_value.toLocaleString("vi-VN")}đ
                                                </p>
                                                <div className="w-full h-1.5 bg-red-200 rounded mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                        style={{
                                                            width: `${
                                                                (voucher.used / voucher.inventory) * 100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>

                                                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                                    <span>
                                                        Đã dùng {(voucher.used / voucher.inventory) * 100}%
                                                    </span>
                                                    <span>
                                                        HSD: {new Date(voucher.expired_date).toLocaleDateString("vi-VN")}
                                                    </span>
                                                </div>

                                                {getVoucherStatusMessage(voucher)}
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => {
                                                if (orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)) {
                                                    if (selectedVoucherOrder?.voucher_id === voucher.voucher_id) {
                                                        setSelectedVoucherOrder(null);
                                                        if (setVouchers) {
                                                            setVouchers({
                                                                selectedVoucher: selectedVoucher,
                                                                selectedVoucherOrder: null,
                                                            });
                                                        }
                                                    } else {
                                                        setSelectedVoucherOrder(voucher);
                                                        if (setVouchers) {
                                                            setVouchers({
                                                                selectedVoucher: selectedVoucher,
                                                                selectedVoucherOrder: voucher,
                                                            });
                                                        }
                                                    }
                                                }
                                            }}
                                            className={`mr-3 w-5 h-5 rounded-full border flex items-center justify-center ${
                                                orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)
                                                    ? "cursor-pointer border-blue-600"
                                                    : "cursor-not-allowed border-gray-300 opacity-50"
                                            }`}
                                        >
                                            {selectedVoucherOrder?.voucher_id === voucher.voucher_id && (
                                                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                            )}
                                        </div>
                                        {/*<input*/}
                                        {/*    type="radio"*/}
                                        {/*    name="selectedVoucherOrder"*/}
                                        {/*    value={voucher.voucher_id}*/}
                                        {/*    checked={selectedVoucherOrder?.voucher_id === voucher.voucher_id}*/}
                                        {/*    onChange={() => {*/}
                                        {/*        if (orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)) {*/}
                                        {/*            if (selectedVoucherOrder?.voucher_id === voucher.voucher_id) {*/}
                                        {/*                setSelectedVoucherOrder(null);*/}
                                        {/*                if (setVouchers) {*/}
                                        {/*                    setVouchers({*/}
                                        {/*                        selectedVoucher: selectedVoucher,*/}
                                        {/*                        selectedVoucherOrder: null,*/}
                                        {/*                    });*/}
                                        {/*                }*/}
                                        {/*            } else {*/}
                                        {/*                setSelectedVoucherOrder(voucher);*/}
                                        {/*                if (setVouchers) {*/}
                                        {/*                    setVouchers({*/}
                                        {/*                        selectedVoucher: selectedVoucher,*/}
                                        {/*                        selectedVoucherOrder: voucher,*/}
                                        {/*                    });*/}
                                        {/*                }*/}
                                        {/*            }*/}
                                        {/*        }*/}
                                        {/*    }}*/}
                                        {/*    className={`mr-3 flex items-center ${*/}
                                        {/*        orderCheck && isVoucherEligible(voucher) && !isVoucherError(voucher.voucher_id) && !hasUserUsedVoucher(voucher)*/}
                                        {/*            ? "cursor-pointer"*/}
                                        {/*            : "cursor-not-allowed"*/}
                                        {/*    }`}*/}
                                        {/*    disabled={!orderCheck || !isVoucherEligible(voucher) || isVoucherError(voucher.voucher_id) || hasUserUsedVoucher(voucher)}*/}
                                        {/*/>*/}
                                    </label>
                                )
                        )}
                        <div className="flex justify-center items-center">
                            {orderVouchers.length > 3 && (
                                <button
                                    className="text-blue-600 text-sm underline ml-2 mt-2"
                                    onClick={() => setShowAllOrder(!showAllOrder)}
                                >
                                    {showAllOrder ? "Ẩn bớt" : "Xem thêm"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6 w-full">
                    <button
                        onClick={onClose}
                        className={`font-semibold w-full max-w-3xl py-3 rounded-full ${
                            orderCheck
                                ? "bg-[#0053E2] text-white hover:bg-[#002E99]"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!orderCheck}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoucherDialog;

