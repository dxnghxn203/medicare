"use client";
import { PAYMENT_COD, PAYMENT_TP_BANK_QR } from "@/utils/constants";
import React from "react";

type PaymentType = "cash" | "qr" | "bank";

interface PaymentMethodProps {
  selected: PaymentType;
  onSelect: (method: PaymentType) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selected,
  onSelect,
}) => {
  const methods = [
    {
      type: PAYMENT_COD,
      label: "Thanh toán tiền mặt khi nhận hàng",
      icon: "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/c45480d681035faa4f9b86501e16701cdb31af935aacbb052f6225c8ee6448b7?placeholderIfAbsent=true",
    },
    {
      type: PAYMENT_TP_BANK_QR,
      label: "Thanh toán bằng chuyển khoản (QR Code)",
      icon: "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/ef2a528bd3ff354fc1498a931df4f4010b4ef9f868879479a670ea309caca048?placeholderIfAbsent=true",
    },
  ];

  return (
    <section className="flex flex-col items-start rounded-xl bg-[#F5F7F9]">
      {methods.map((method, index) => (
        <React.Fragment key={method.type}>
          <label className="flex items-center gap-3 w-full p-6 hover:bg-[#F5F7F9] rounded transition cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="paymentMethod"
                value={method.type}
                checked={selected === method.type}
                onChange={() => onSelect(method.type as PaymentType)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  selected === method.type
                    ? "border-blue-600"
                    : "border-gray-300"
                } flex items-center justify-center`}
              >
                {selected === method.type && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex items-center justify-center" />
                )}
              </div>
            </div>
            <img
              src={method.icon}
              alt=""
              className="w-[35px] h-[35px] rounded-md"
            />
            <span className="text-sm text-black">{method.label}</span>
          </label>

          {index < methods.length - 1 && (
            <div className="self-stretch border border-gray-200" />
          )}
        </React.Fragment>
      ))}
    </section>
  );
};
