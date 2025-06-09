import React, { useState } from "react";
import AddressItem from "@/components/Dialog/addressItem";

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationDialog: React.FC<LocationDialogProps> = ({ isOpen, onClose }) => {
  const [addresses, setAddresses] = useState([
    "Binh Tho, Thủ Đức District, Ho Chi Minh City, Vietnam",
    "Nguyễn Văn Cừ, Quận 5, Ho Chi Minh City, Vietnam",
  ]);

  if (!isOpen) return null;

  const handleRemoveAddress = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form đã được submit!");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] text-right relative">
        <div className="self-end text-sm text-black/50">
          * Hãy chọn 1 trong các địa chỉ được gợi ý nhé
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-start pt-2 pr-16 pb-3 pl-4 mt-1.5 w-full rounded-2xl border border-solid border-stone-300 border-opacity-80 text-black/50 max-md:pr-5 max-md:max-w-full">
            <label htmlFor="addressSearch" className="text-sm">
              Nhận hàng tại
            </label>
            <div className="flex gap-2 mt-1 text-base">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/27e1e00858368ec7b15b55172c0ce0f07795c1b15107472c6b6fb714891a5aad?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
                alt=""
                className="object-contain shrink-0 aspect-[0.94] w-[17px]"
              />
              <input
                type="text"
                id="addressSearch"
                placeholder="Tìm kiếm"
                className="bg-transparent border-none outline-none text-black"
              />
            </div>
          </div>
          <div className="flex gap-3 self-start mt-4 text-base font-regular max-md:ml-0.5">
            <div className="text-black">Ghi chú: </div>
            <input
              type="text"
              placeholder="Ví dụ tên tòa nhà, khu vực..."
              className="bg-transparent border-none outline-none text-black"
            />
          </div>

          <div className="self-start mt-5 text-lg font-medium text-black text-left">
            Địa chỉ được sử dụng gần đây
          </div>

          {addresses.map((address, index) => (
            <AddressItem
              key={index}
              address={address}
              onClose={() => handleRemoveAddress(index)}
            />
          ))}

          <div className="grid grid-cols-2 gap-6 mt-8 text-base font-semibold">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-blue-700 border border-blue-700 rounded-[30px] flex items-center justify-center"
            >
              HỦY
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-700 border border-blue-700 rounded-[30px] flex items-center justify-center"
            >
              XONG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationDialog;
