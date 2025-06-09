"use client";
import React from "react";
import { OrdererInfo as OrdererInfoType } from "../ProductInfo/types";
import { HiOutlineUserCircle } from "react-icons/hi2";

interface OrdererInfoProps {
  info: OrdererInfoType;
  onChange: (info: OrdererInfoType) => void;
}

export const OrdererInfo: React.FC<OrdererInfoProps> = ({ info, onChange }) => {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex gap-2 self-start text-sm text-black">
        <HiOutlineUserCircle className="text-2xl text-[#0053E2]" />
        <h2 className="my-auto">Địa chỉ nhận hàng</h2>
      </header>
      <div className="flex flex-wrap gap-5 text-sm max-md:max-w-full">
        <input
          type="text"
          value={info.fullName}
          onChange={(e) => onChange({ ...info, fullName: e.target.value })}
          placeholder="Họ và tên người đặt"
          className="grow shrink-0 px-5 py-4 rounded-xl border border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none basis-0 w-fit placeholder:text-[14px] placeholder:font-normal"
        />
        <div className="grow shrink-0 basis-0 w-fit">
          <input
            type="tel"
            value={info.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              onChange({ ...info, phone: value });
            }}
            placeholder="Số điện thoại"
            className={`w-full px-5 py-4 rounded-xl border ${
              info.phone && !/^\d{10}$/.test(info.phone)
                ? "border-red-500"
                : "border-black/10"
            } focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
        outline-none placeholder:text-[14px] placeholder:font-normal`}
          />
          {info.phone && !/^\d{10}$/.test(info.phone) && (
            <p className="text-xs text-red-500 mt-1 ml-3">
              Số điện thoại không hợp lệ, vui lòng nhập lại
            </p>
          )}
        </div>
      </div>
      <input
        type="email"
        value={info.email}
        onChange={(e) => onChange({ ...info, email: e.target.value })}
        placeholder="Email (không bắt buộc)"
        className="text-sm px-5 py-4 rounded-xl border border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none basis-0 placeholder:text-[14px] placeholder:font-normal"
      />
    </section>
  );
};
