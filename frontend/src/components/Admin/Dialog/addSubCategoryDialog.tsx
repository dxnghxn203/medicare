import { useState } from "react";
import { X } from "lucide-react";
import { ImBin } from "react-icons/im";
import { useCategory } from "@/hooks/useCategory";
import { validateEmptyFields } from "@/utils/validation";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";

interface AddSubCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  main_slug: string;
}

const AddSubCategoryDialog: React.FC<AddSubCategoryDialogProps> = ({
  isOpen,
  onClose,
  main_slug,
}) => {
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { fetchAddSubCategory, fetchGetAllCategoryForAdmin } = useCategory();
  const [childCategory, setChildCategory] = useState([
    { child_category_name: "", child_category_slug: "" },
  ]);
  const [subCategory, setSubCategory] = useState({
    sub_category_name: "",
    sub_category_slug: "",
  });
  const addSubCategory = () => {
    setChildCategory([
      ...childCategory,
      { child_category_name: "", child_category_slug: "" },
    ]);
  };

  const removeChildCategory = (index: number) => {
    const updated = [...childCategory];
    updated.splice(index, 1);
    setChildCategory(updated);
  };

  const handleSubmit = () => {
    const dataToValidate = {
      sub_category_name: subCategory.sub_category_name,
      sub_category_slug: subCategory.sub_category_slug,
    };
    const emptyFieldErrors = validateEmptyFields(dataToValidate);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    const data = {
      main_slug: main_slug,
      sub_category_name: subCategory.sub_category_name,
      sub_category_slug: subCategory.sub_category_slug,
      child_category: childCategory,
    };
    console.log("data", data);
    fetchAddSubCategory(
      data,
      () => {
        toast.showToast("Thêm danh mục thành công!", ToastType.SUCCESS);
        onClose();
        fetchGetAllCategoryForAdmin();
        setSubCategory({
          sub_category_name: "",
          sub_category_slug: "",
        });
        setChildCategory([
          { child_category_name: "", child_category_slug: "" },
        ]);
      },
      (message) => {
        toast.showToast(message, ToastType.ERROR);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg text-center font-semibold mb-4">
          Thêm danh mục
        </h2>

        <div className="flex gap-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="Tên danh mục cấp 1"
              className="w-full mt-2 p-3 border rounded-lg text-sm focus:ring-[#0053E2] outline-none focus:ring-1"
              value={subCategory.sub_category_name}
              onChange={(e) => {
                setSubCategory({
                  ...subCategory,
                  sub_category_name: e.target.value,
                });
              }}
            />
            {errors.sub_category_name && (
              <span className="text-red-500 text-sm">
                {errors.sub_category_name}
              </span>
            )}
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Slug danh mục cấp 1"
              className="w-full mt-2 p-3 border rounded-lg text-sm focus:ring-[#0053E2] outline-none focus:ring-1"
              value={subCategory.sub_category_slug}
              onChange={(e) => {
                setSubCategory({
                  ...subCategory,
                  sub_category_slug: e.target.value,
                });
              }}
            />
            {errors.sub_category_slug && (
              <span className="text-red-500 text-sm">
                {errors.sub_category_slug}
              </span>
            )}
          </div>
        </div>

        {childCategory.map((sub, index) => (
          <div key={index} className="relative mt-4">
            <button
              onClick={() => removeChildCategory(index)}
              className="absolute -top-3 right-0 text-red-500 bg-[#FDF3F5] rounded-full p-2"
            >
              <ImBin className="w-4 h-4" />
            </button>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Tên danh mục cấp 2"
                className="w-full mt-2 p-3 border rounded-lg text-sm focus:ring-[#0053E2] outline-none focus:ring-1"
                onChange={(e) => {
                  const updated = [...childCategory];
                  updated[index].child_category_name = e.target.value;
                  setChildCategory(updated);
                }}
              />
              <input
                type="text"
                placeholder="Slug danh mục cấp 2"
                className="w-full mt-2 p-3 border rounded-lg text-sm focus:ring-[#0053E2] outline-none focus:ring-1"
                onChange={(e) => {
                  const updated = [...childCategory];
                  updated[index].child_category_slug = e.target.value;
                  setChildCategory(updated);
                }}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubCategory}
          className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm"
        >
          + Thêm danh mục cấp 2
        </button>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] py-2 px-6 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm bg-[#1E4DB7] text-white py-2 px-6 rounded-lg hover:bg-[#002E99]"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryDialog;
