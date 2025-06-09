import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";
interface UpdateMainCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryMainInfo: { label: string; value: string; type?: string }[];
  selectedMainId: string;
}

const UpdateMainCategoryDialog: React.FC<UpdateMainCategoryDialogProps> = ({
  isOpen,
  onClose,
  categoryMainInfo,
  selectedMainId,
}) => {
  const { fetchUpdateMainCategory, fetchGetAllCategoryForAdmin } =
    useCategory();
  const toast = useToast();

  const [formData, setFormData] = useState(() => {
    return categoryMainInfo.reduce((acc, item) => {
      acc[item.label] = item.value;
      return acc;
    }, {} as Record<string, string>);
  });

  // Chỉ cập nhật lại formData khi dialog mở
  useEffect(() => {
    if (isOpen) {
      const updatedData = Object.fromEntries(
        categoryMainInfo.map((item) => [item.label, item.value || ""])
      );
      setFormData(updatedData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleUpdateMainCategory = () => {
    const updatedCategory = {
      main_category_id: selectedMainId,
      main_category_name: formData["Tên danh mục chính"],
      main_category_slug: formData["Slug danh mục chính"],
    };
    fetchUpdateMainCategory(
      updatedCategory,
      () => {
        toast.showToast("Cập nhật thành công!", ToastType.SUCCESS);
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
        <h2 className="text-lg font-semibold mb-4">Cập nhật danh mục chính</h2>

        <div className="space-y-4">
          {categoryMainInfo.map((item) => (
            <input
              key={item.label}
              type={item.type || "text"}
              className={`w-full p-2 border rounded-lg border-black/10 
                 focus:ring-1 focus:ring-[#0053E2] 
                outline-none placeholder:text-sm
                ${
                  item.label === "ID danh mục chính"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }
              `}
              placeholder={`Enter ${item.label}`}
              value={formData[item.label] || ""}
              onChange={(e) => handleChange(item.label, e.target.value)}
              disabled={item.label === "ID danh mục chính"}
            />
          ))}
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-medium py-2 px-6 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleUpdateMainCategory}
            className="text-sm bg-[#1E4DB7] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#002E99]"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMainCategoryDialog;
