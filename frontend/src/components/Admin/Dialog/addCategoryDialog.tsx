import { useState } from "react";
import { X } from "lucide-react";
import { ImBin } from "react-icons/im";
import { useCategory } from "@/hooks/useCategory";
import { validateEmptyFields } from "@/utils/validation";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";

interface AddNewCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newCategory: string) => void;
}

const AddNewCategoryDialog: React.FC<AddNewCategoryDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { fetchAddCategory, fetchGetAllCategoryForAdmin } = useCategory();
  const [mainCategory, setMainCategory] = useState({
    main_category_name: "",
    main_category_slug: "",
  });
  const [subCategories, setSubCategories] = useState([
    {
      sub_category_name: "",
      sub_category_slug: "",
      child_category: [{ child_category_name: "", child_category_slug: "" }],
    },
  ]);

  const addSubCategory = () => {
    setSubCategories([
      ...subCategories,
      {
        sub_category_name: "",
        sub_category_slug: "",
        child_category: [{ child_category_name: "", child_category_slug: "" }],
      },
    ]);
  };

  const removeSubCategory = (index: number) => {
    const newList = [...subCategories];
    newList.splice(index, 1);
    setSubCategories(newList);
  };

  const addChildCategory = (subCategoryIndex: number) => {
    const newSubCategories = [...subCategories];
    newSubCategories[subCategoryIndex].child_category.push({
      child_category_name: "",
      child_category_slug: "",
    });
    setSubCategories(newSubCategories);
  };

  const removeChildCategory = (
    subCategoryIndex: number,
    child_categoryIndex: number
  ) => {
    const newSubCategories = [...subCategories];
    newSubCategories[subCategoryIndex].child_category.splice(
      child_categoryIndex,
      1
    );
    setSubCategories(newSubCategories);
  };

  const handleSubmit = () => {
    const dataToValidate = {
      main_category_name: mainCategory.main_category_name,
      main_category_slug: mainCategory.main_category_slug,
    };
    const emptyFieldErrors = validateEmptyFields(dataToValidate);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    const data = {
      main_category_name: mainCategory.main_category_name,
      main_category_slug: mainCategory.main_category_slug,
      sub_category: subCategories,
    };
    console.log("data", data);
    fetchAddCategory(
      data,
      () => {
        toast.showToast("Thêm danh mục thành công!", ToastType.SUCCESS);
        onClose();
        // onConfirm(newCategory);
        fetchGetAllCategoryForAdmin();
        setMainCategory({
          main_category_name: "",
          main_category_slug: "",
        });
        setSubCategories([
          {
            sub_category_name: "",
            sub_category_slug: "",
            child_category: [
              { child_category_name: "", child_category_slug: "" },
            ],
          },
        ]);
      },
      (message) => {
        toast.showToast(message, ToastType.ERROR);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
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

        {/* Danh mục chính */}
        <label className="block text-sm font-semibold mt-2 mb-1 text-gray-700">
          Danh mục chính
        </label>
        <div className="flex gap-4">
          <div className="w-full">
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
              placeholder="Tên danh mục chính"
              value={mainCategory.main_category_name}
              onChange={(e) =>
                setMainCategory({
                  ...mainCategory,
                  main_category_name: e.target.value,
                })
              }
            />
            {errors.main_category_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.main_category_name}
              </p>
            )}
          </div>
          <div className="w-full">
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal placeholder:text-sm"
              placeholder="Slug danh mục chính"
              value={mainCategory.main_category_slug}
              onChange={(e) =>
                setMainCategory({
                  ...mainCategory,
                  main_category_slug: e.target.value,
                })
              }
            />
            {errors.main_category_slug && (
              <p className="text-red-500 text-sm mt-1">
                {errors.main_category_slug}
              </p>
            )}
          </div>
        </div>

        {/* Danh mục cấp 1 */}
        
        {subCategories.map((subCategory, subCategoryIndex) => (
          <div key={subCategoryIndex}>
            <label className="block text-sm font-semibold mt-6 mb-1 text-gray-700">
              Danh mục cấp 1
            </label>
            <div className="relative mt-4">
              <button
                type="button"
                onClick={() => removeSubCategory(subCategoryIndex)}
                className="absolute -top-3 right-0 text-red-500 bg-[#FDF3F5] rounded-full p-2"
              >
                <ImBin className="w-4 h-4 text-[#D4380D] hover:text-red-700" />
              </button>
              <div className="flex gap-4">
                <input
                  type="text"
                  className="w-full mt-2 p-3 border rounded-lg border-black/10 
                focus:ring-1 focus:ring-[#0053E2] 
                outline-none placeholder:font-normal placeholder:text-sm"
                  placeholder="Tên danh mục cấp 1"
                  value={subCategory.sub_category_name}
                  onChange={(e) =>
                    setSubCategories((prevState) => {
                      const updatedSubCategories = [...prevState];
                      updatedSubCategories[subCategoryIndex].sub_category_name =
                        e.target.value;
                      return updatedSubCategories;
                    })
                  }
                />
                <input
                  type="text"
                  className="w-full mt-2 p-3 border rounded-lg border-black/10 
                focus:ring-1 focus:ring-[#0053E2] 
                outline-none placeholder:font-normal placeholder:text-sm"
                  placeholder="Slug danh mục cấp 1"
                  value={subCategory.sub_category_slug}
                  onChange={(e) =>
                    setSubCategories((prevState) => {
                      const updatedSubCategories = [...prevState];
                      updatedSubCategories[subCategoryIndex].sub_category_slug =
                        e.target.value;
                      return updatedSubCategories;
                    })
                  }
                />
              </div>
        
              {/* Danh mục cấp 2 */}
{subCategory.child_category.map(
  (child_category, child_categoryIndex) => (
    <>
      <label className="block text-sm font-medium mt-2 mb-1 text-gray-600">
        Danh mục cấp 2
      </label>
      <div key={child_categoryIndex} className="relative mt-4">
        <button
          type="button"
          onClick={() =>
            removeChildCategory(subCategoryIndex, child_categoryIndex)
          }
          className="absolute -top-3 right-0 text-red-500 bg-[#FDF3F5] rounded-full p-2"
        >
          <ImBin className="w-4 h-4 text-[#D4380D] hover:text-red-700" />
        </button>
        <div className="flex gap-4">
          <input
            type="text"
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
                    focus:ring-1 focus:ring-[#0053E2] 
                    outline-none placeholder:font-normal placeholder:text-sm"
            placeholder="Tên danh mục cấp 2"
            value={child_category.child_category_name}
            onChange={(e) =>
              setSubCategories((prevState) => {
                const updatedSubCategories = [...prevState];
                updatedSubCategories[subCategoryIndex].child_category[
                  child_categoryIndex
                ].child_category_name = e.target.value;
                return updatedSubCategories;
              })
            }
          />
          <input
            type="text"
            className="w-full mt-2 p-3 border rounded-lg border-black/10 
                    focus:ring-1 focus:ring-[#0053E2] 
                    outline-none placeholder:font-normal placeholder:text-sm"
            placeholder="Slug danh mục cấp 2"
            value={child_category.child_category_slug}
            onChange={(e) =>
              setSubCategories((prevState) => {
                const updatedSubCategories = [...prevState];
                updatedSubCategories[subCategoryIndex].child_category[
                  child_categoryIndex
                ].child_category_slug = e.target.value;
                return updatedSubCategories;
              })
            }
          />
        </div>
      </div>
    </>
  )
)}
        
              <button
                type="button"
                onClick={() => addChildCategory(subCategoryIndex)}
                className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Thêm danh mục cấp 2
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubCategory}
          className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Thêm danh mục cấp 1
        </button>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-medium py-2 px-6 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm bg-[#1E4DB7] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#002E99]"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCategoryDialog;
