"use client";
import React, { useState } from "react";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdDirections } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { IoTimeOutline } from "react-icons/io5";

export const PharmaInfo: React.FC = () => {
  const pharmacies = [
    {
      id: 1,
      name: "Nhà thuốc Trung Sơn",
      inStock: true,
      address:
        "580-582 Nguyễn Duy Trinh, P. Bình Trưng Đông, TP. Thủ Đức, TP. Hồ Chí Minh",
      hours: "Đóng cửa lúc 22 giờ",
      statusTime: "Đang mở",
    },
    {
      id: 2,
      name: "Nhà thuốc Pharmacity",
      inStock: false,
      address: "456 Đường B, Thủ Đức",
      hours: "Đóng cửa lúc 22 giờ",
      statusTime: "Đang mở",
    },
    {
      id: 3,
      name: "Nhà thuốc Long Châu",
      inStock: true,
      address: "789 Đường C, Thủ Đức",
      hours: "Đóng cửa lúc 22 giờ",
      statusTime: "Đã đóng",
    },
    {
      id: 4,
      name: "Nhà thuốc An Khang",
      inStock: true,
      address: "321 Đường D, Thủ Đức",
      hours: "Đóng cửa lúc 22 giờ",
      statusTime: "Đang mở",
    },
  ];

  const [selectedPharmacy, setSelectedPharmacy] = useState<number | null>(null);

  const handleSelectPharmacy = (id: number) => {
    setSelectedPharmacy((prev) => (prev === id ? null : id));
  };

  const handleNavigate = (pharmacyName: string) => {
    const encodedName = encodeURIComponent(pharmacyName);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedName}`,
      "_blank"
    );
  };

  return (
    <section className="flex flex-col gap-4 mt-6">
      <header className="flex gap-2 self-start text-sm text-black">
        <IoStorefrontOutline className="text-2xl text-[#0053E2] mt-[-2px]" />
        <h3>Chọn nhà thuốc lấy hàng</h3>
      </header>

      <span className="text-[14px] font-medium text-black">
        Có {pharmacies.length} nhà thuốc tại Thủ Đức, TP. Hồ Chí Minh
      </span>

      <div className="flex flex-col gap-2 py-2 rounded-3xl border border-black/10 focus:border-[#0053E2] bg-white cursor-pointer">
        {pharmacies.map((pharmacy, index) => (
          <div key={pharmacy.id} className="w-full">
            <div
              className="flex flex-col w-full py-2 cursor-pointer px-6"
              onClick={() => handleSelectPharmacy(pharmacy.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`select-pharmacy-${pharmacy.id}`}
                    className="peer hidden"
                    checked={selectedPharmacy === pharmacy.id}
                    onChange={() => handleSelectPharmacy(pharmacy.id)}
                  />
                  <label
                    htmlFor={`select-pharmacy-${pharmacy.id}`}
                    className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2]"
                  >
                    &#10003;
                  </label>
                  {pharmacy.inStock ? (
                    <span className="ml-2 py-1 text-xs font-medium text-[#039855] rounded-full">
                      Có hàng
                    </span>
                  ) : (
                    <span className="ml-2 py-1 text-xs font-medium text-red-600 rounded-full">
                      Hết hàng
                    </span>
                  )}
                  <div className="w-[1px] h-4 bg-gray-300 mx-2"></div>
                  <span className="text-[14px] font-medium text-black">
                    {pharmacy.name}
                  </span>
                </div>
                <button
                  className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-sm transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(pharmacy.name);
                  }}
                >
                  <MdDirections className="mr-1 text-[#0053E2] text-lg" />
                  Chỉ đường
                </button>
              </div>

              {/* Giờ mở cửa + Trạng thái */}
              <div className="flex items-center text-xs text-black/50 mt-1 ml-6 py-2">
                <IoTimeOutline className="text-base text-black/50 mr-1" />
                <span
                  className={`mr-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                    pharmacy.statusTime === "Đang mở"
                      ? "text-[#0053E2] bg-[#EAEFFA]"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {pharmacy.statusTime}
                </span>

                <span>{pharmacy.hours}</span>
              </div>

              {/* Địa chỉ */}
              <div className="flex items-center text-xs text-black/50 ml-6 pt-2">
                <SlLocationPin className="text-base text-black/50 mr-1" />
                <span>{pharmacy.address}</span>
              </div>
            </div>
            {index < pharmacies.length - 1 && (
              <hr className="border-t my-2 border-gray-300" />
            )}
          </div>
        ))}
      </div>
      <div className="bg-white flex flex-col items-start pt-5 pr-20 pb-12 pl-5 rounded-3xl border border-black/10">
        <label className="text-xs">Ghi chú (không bắt buộc)</label>
        <textarea
          placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao hàng"
          className="w-full mt-3.5 text-sm bg-transparent outline-none resize-none placeholder:text-[14px] placeholder:font-normal"
        />
      </div>
    </section>
  );
};
