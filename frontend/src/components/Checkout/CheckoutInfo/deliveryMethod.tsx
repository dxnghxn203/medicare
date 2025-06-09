"use client";
import React from "react";

interface DeliveryMethodProps {
  selectedMethod: "delivery" | "pickup";
  onMethodChange: (method: "delivery" | "pickup") => void;
}

export const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <div className="flex flex-wrap justify-between text-sm font-medium">
      <h2 className="my-auto text-black">Chọn hình thức nhận hàng</h2>
      <div className="flex rounded-lg bg-[#F5F7F9]">
        {/* <button
          onClick={() => onMethodChange("delivery")}
          className={`px-4 py-2 rounded-lg ${
            selectedMethod === "delivery"
              ? "text-blue-700 bg-indigo-50"
              : "text-black"
          }`}
        >
          Giao hàng tận nơi
        </button>
        <button
          onClick={() => onMethodChange("pickup")}
          className={`px-4 py-2 rounded-lg ${
            selectedMethod === "pickup"
              ? "text-blue-700 bg-indigo-50"
              : "text-black"
          }`}
        >
          Nhận tại nhà thuốc
        </button> */}
      </div>
    </div>
  );
};
