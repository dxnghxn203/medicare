import React, { use } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import bin from "@/images/delete.png";
import { useCategory } from "@/hooks/useCategory";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";
import { on } from "events";

interface DeleteDialogProps {
  //   selectedChildId: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteCategoryDialog: React.FC<DeleteDialogProps> = ({
  //   selectedChildId,
  isOpen,
  onClose,
  onDelete,
}) => {
  const { fetchDeleteChildCategory, fetchGetAllCategoryForAdmin } =
    useCategory();
  const toast = useToast();
  if (!isOpen) return null;
  //   const handleDeleteChildCategory = () => {
  //     fetchDeleteChildCategory(
  //       selectedChildId,
  //       () => {
  //         toast.showToast("Xóa danh mục thành công!", ToastType.SUCCESS);
  //         fetchGetAllCategoryForAdmin();
  //         onClose();
  //       },
  //       (message) => {
  //         toast.showToast(message, ToastType.ERROR);
  //       }
  //     );

  // console.log("Delete category with ID:", selectedC hildId);
  //   };
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
          Bạn chắc chắn muốn xóa danh mục?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="mt-10 bg-[#EAEFFA] text-[#0053E2] font-semibold w-[120px] py-3 rounded-full hover:bg-[#002E99]"
          >
            Hủy
          </button>
          <button
            onClick={onDelete}
            className="mt-10 bg-[#0053E2] text-white font-semibold w-[120px] py-3 rounded-full hover:bg-[#002E99]"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryDialog;
