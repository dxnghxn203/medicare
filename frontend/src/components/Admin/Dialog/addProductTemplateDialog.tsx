import { useState } from "react";
import { X } from "lucide-react";
interface AddProductTemplateDialogProps {
  onClose: () => void;
  onConfirm: (newCategory: string) => void;
}

const AddProductTemplateDialog: React.FC<AddProductTemplateDialogProps> = ({
  onClose,
  onConfirm,
}) => {
  const [categoryName, setCategoryName] = useState("");

  const handleAdd = () => {
    if (categoryName.trim() !== "") {
      onConfirm(categoryName); // Gửi category mới lên component cha
      setCategoryName("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold">Add New Product Template</h2>
        <input
          type="text"
          className="w-full mt-2 p-2 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none basis-0 placeholder:font-normal"
          placeholder="Enter product template"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-xl hover:bg-[#002E99]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddProductTemplateDialog;
