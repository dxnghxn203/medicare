import { useState, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import { LuTrash2 } from "react-icons/lu";

const UnitAndPrice = () => {
  const unitOptions: string[] = ["Gói", "Hộp", "Viên"];

  interface Item {
    id: number;
    unit: string;
  }

  const [items, setItems] = useState<Item[]>([{ id: 1, unit: "" }]);

  // Thêm item mới với ID duy nhất
  const addItem = useCallback(() => {
    if (items.length < unitOptions.length) {
      const newId = Math.max(...items.map((i) => i.id), 0) + 1;
      setItems([...items, { id: newId, unit: "" }]);
    }
  }, [items]);

  // Cập nhật đơn vị cho item
  const handleUnitChange = useCallback((id: number, value: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, unit: value } : item
      )
    );
  }, []);

  // Xóa item và reset đơn vị
  const removeItem = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-2xl p-5 h-full">
      <span className="block mb-3 font-medium">Unit and price</span>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <select
              value={item.unit || ""}
              onChange={(e) => handleUnitChange(item.id, e.target.value)}
              className="w-auto w-32 px-4 py-2 border border-black/10 rounded-lg focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none"
            >
              <option value="" disabled>
                Choose unit
              </option>
              {unitOptions.map((unit) =>
                !items.some((i) => i.unit === unit) || item.unit === unit ? (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ) : null
              )}
            </select>

            <input
              type="number"
              placeholder="Enter price"
              className="w-full px-4 py-2 border border-black/10 rounded-xl focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none"
            />

            {items.length > 1 && (
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                <LuTrash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        {items.length < unitOptions.length && (
          <button
            onClick={addItem}
            className="flex items-center text-[#1E4DB7] font-medium mt-2"
          >
            <PlusCircle className="w-5 h-5 mr-1" /> Add
          </button>
        )}
      </div>
    </div>
  );
};

export default UnitAndPrice;
