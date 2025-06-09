import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import bin from "@/images/delete.png";

interface DeleteDialogProps {
  productId: string | null;
  priceId: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteProductDialog: React.FC<DeleteDialogProps> = ({
  productId,
  priceId,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center relative w-[350px]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <Image src={bin} alt="" width={300} height={300} />
        <p className="text-center mt-2 font-semibold text-black">Thông báo</p>
        <p className="text-center mt-2 font-sm text-black">
          Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="mt-10 bg-[#EAEFFA] text-[#0053E2] font-semibold w-[120px] py-3 rounded-full hover:bg-[#002E99]"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="mt-10 bg-[#0053E2] text-white font-semibold w-[120px] py-3 rounded-full hover:bg-[#002E99]"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductDialog;
