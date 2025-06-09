import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";
import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";

interface UpdateChildCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryChildInfo: { label: string; value: string; type?: string }[];
  selectedChildId: string;
  main_slug: string;
  sub_slug: string;
  mode: "add" | "update";
  selectImageChild: string;
}

const UpdateChildCategoryDialog: React.FC<UpdateChildCategoryDialogProps> = ({
  isOpen,
  onClose,
  categoryChildInfo,
  selectedChildId,
  main_slug,
  sub_slug,
  mode,
  selectImageChild,
}) => {
  const {
    fetchUpdateChildCategory,
    fetchGetAllCategoryForAdmin,
    fetchAddChildCategory,
    fetchUpdateImageChildCategory,
  } = useCategory();
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (mode === "add") {
      return {
        "Tên danh mục cấp 2": "",
        "Slug danh mục cấp 2": "",
      };
    } else {
      return categoryChildInfo.reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {} as Record<string, string>);
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "add") {
        setFormData({
          "Tên danh mục cấp 2": "",
          "Slug danh mục cấp 2": "",
        });
      } else {
        const updatedData = Object.fromEntries(
          categoryChildInfo.map((item) => [item.label, item.value || ""])
        );
        setFormData(updatedData);
      }
    }
  }, [isOpen, categoryChildInfo, mode]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };
  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
      if (!validExtensions.includes(file.type)) {
        toast.showToast("Vui lòng chọn file ảnh hợp lệ!", ToastType.ERROR);
        return;
      }

      setSelectedFile(file);

      console.log("image", file);
    }
  };

  const handleUpdateChildCategory = () => {
    const updatedCategory = {
      child_category_id: selectedChildId,
      child_category_name: formData["Tên danh mục cấp 2"],
      child_category_slug: formData["Slug danh mục cấp 2"],
    };
    const data = {
      child_category_id: selectedChildId,
      image: selectedFile,
    };
    console.log("ff", data);
    const isCategoryUpdated =
      updatedCategory.child_category_name !==
        categoryChildInfo.find((item) => item.label === "Tên danh mục cấp 2")
          ?.value ||
      updatedCategory.child_category_slug !==
        categoryChildInfo.find((item) => item.label === "Slug danh mục cấp 2")
          ?.value;

    if (isCategoryUpdated) {
      fetchUpdateChildCategory(
        updatedCategory,
        () => {
          if (selectedFile) {
            fetchUpdateImageChildCategory(
              data,
              () => {
                toast.showToast("Cập nhật ảnh thành công!", ToastType.SUCCESS);
                fetchGetAllCategoryForAdmin();
                onClose();
              },
              (message) => {
                toast.showToast(message, ToastType.ERROR);
              }
            );
          } else {
            fetchGetAllCategoryForAdmin();
            onClose();
          }
          toast.showToast("Cập nhật danh mục thành công!", ToastType.SUCCESS);
        },
        (message) => {
          toast.showToast(message, ToastType.ERROR);
        }
      );
    } else {
      if (selectedFile) {
        fetchUpdateImageChildCategory(
          data,
          () => {
            toast.showToast("Cập nhật ảnh thành công!", ToastType.SUCCESS);
            fetchGetAllCategoryForAdmin();
            onClose();
          },
          (message) => {
            toast.showToast(message, ToastType.ERROR);
          }
        );
        console.log("update image", data);
      } else {
        fetchGetAllCategoryForAdmin();
        onClose();
      }
    }
  };
  const handleAddChildCategory = () => {
    const newCategory = {
      main_slug: main_slug,
      sub_slug: sub_slug,
      child_category_name: formData["Tên danh mục cấp 2"],
      child_category_slug: formData["Slug danh mục cấp 2"],
    };
    // console.log("newCategory", newCategory);

    fetchAddChildCategory(
      newCategory,
      () => {
        toast.showToast("Thêm thành công!", ToastType.SUCCESS);
        fetchGetAllCategoryForAdmin();
        onClose();
      },
      (message) => {
        toast.showToast(message, ToastType.ERROR);
      }
    );
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {mode === "add" ? "Thêm danh mục" : "Cập nhật danh mục cấp 2"}
        </h2>

        <div className="space-y-4">
          {categoryChildInfo.map((item) => (
            <input
              key={item.label}
              type={item.type || "text"}
              className={`w-full p-2 border rounded-lg border-black/10 
                focus:ring-1 focus:ring-[#0053E2] 
                outline-none placeholder:text-sm
                ${
                  item.label === "ID danh mục cấp 2"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }
              `}
              placeholder={`Nhập ${item.label}`}
              value={formData[item.label] || ""}
              onChange={(e) => handleChange(item.label, e.target.value)}
              disabled={item.label === "ID danh mục cấp 2"}
            />
          ))}
          <div className="relative w-[120px] h-[120px]">
            <Image
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : selectImageChild
              }
              alt="icon"
              width={120}
              height={120}
              className="object-contain rounded-md"
              priority
            />
            <button
              onClick={handleEditImage}
              className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
              title="Chỉnh sửa ảnh"
            >
              <MdOutlineEdit className="w-4 h-4 text-gray-600" />
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-medium py-2 px-6 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (mode === "add") {
                handleAddChildCategory();
              } else if (mode === "update") {
                handleUpdateChildCategory();
              }
            }}
            className="text-sm bg-[#1E4DB7] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#002E99]"
          >
            {mode === "add" ? "Thêm" : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateChildCategoryDialog;
