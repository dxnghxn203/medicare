"use client";
import React from "react";
import { OrdererInfoPickup as OrdererInfoType } from "../ProductInfo/types";
import { HiOutlineUserCircle } from "react-icons/hi2";

interface OrdererInfoProps {
  info: OrdererInfoType;
  onChange: (info: OrdererInfoType) => void;
}

export const OrdererInfoPickup: React.FC<OrdererInfoProps> = ({
  info,
  onChange,
}) => {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex gap-2 self-start text-sm text-black">
        <HiOutlineUserCircle className="text-2xl text-[#0053E2]" />
        <h3 className="my-auto">Thông tin người đặt hàng</h3>
      </header>
      <div className="flex flex-wrap gap-5 text-sm max-md:max-w-full">
        <input
          type="text"
          value={info.fullName}
          onChange={(e) => onChange({ ...info, fullName: e.target.value })}
          placeholder="Họ và tên người đặt"
          className="grow shrink-0 px-5 py-5 rounded-3xl border border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none basis-0 w-fit placeholder:text-[14px] placeholder:font-normal"
        />
        <input
          type="tel"
          value={info.phone}
          onChange={(e) => onChange({ ...info, phone: e.target.value })}
          placeholder="Số điện thoại"
          className="grow shrink-0 px-5 py-5 rounded-3xl border border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none basis-0 w-fit placeholder:text-[14px] placeholder:font-normal"
        />
      </div>
      <input
        type="email"
        value={info.email}
        onChange={(e) => onChange({ ...info, email: e.target.value })}
        placeholder="Email (không bắt buộc)"
        className="px-6 py-5 text-sm rounded-3xl border border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none basis-0 placeholder:text-[14px] placeholder:font-normal"
      />
    </section>
  );
};
