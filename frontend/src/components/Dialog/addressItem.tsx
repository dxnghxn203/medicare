import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import iconHistory from "@/images/history.png";
import Image from "next/image";

interface AddressItemProps {
  address: string;
  onClose: () => void; // Thêm prop để xử lý sự kiện đóng
}

const AddressItem: React.FC<AddressItemProps> = ({ address, onClose }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-between mt-4 max-w-full text-base text-black w-[581px]">
      <div className="flex gap-3 self-start">
        <Image
          src={iconHistory}
          alt=""
          className="object-contain shrink-0 self-start aspect-square
          w-[15px] mt-0.5"
        />
        <div className="flex-auto">{address}</div>
      </div>
      <button
        className="text-gray-500 hover:text-red-600 transition"
        onClick={onClose} // Gọi hàm khi bấm nút
      >
        <AiOutlineClose className="text-s" />
      </button>
    </div>
  );
};

export default AddressItem;
