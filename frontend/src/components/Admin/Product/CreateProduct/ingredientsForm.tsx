"use client";

import { IngredientItem, ErrorMessage } from "./types";

interface IngredientsFormProps {
  ingredients: IngredientItem[];
  updateIngredients: (ingredients: IngredientItem[]) => void;
  errors: Record<string, string>;
  hasError: (fieldName: string) => boolean;
  isViewOnly: boolean;
}

export const IngredientsForm = ({
  ingredients,
  updateIngredients,
  errors,
  hasError,
  isViewOnly,
}: IngredientsFormProps) => {
  const addIngredientItem = () => {
    updateIngredients([
      ...ingredients,
      { ingredient_name: "", ingredient_amount: "" },
    ]);
  };

  const removeIngredientItem = (index: number) => {
    updateIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredientItem = (
    index: number,
    field: keyof IngredientItem,
    value: string
  ) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    updateIngredients(updatedIngredients);
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-5">
      <h3 className="text-lg font-semibold mb-3">Thành phần</h3>

      {ingredients.map((ingredient, index) => (
        <div key={index} className="mb-3 p-3 border rounded-lg">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Thành phần {index + 1}</h4>
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredientItem(index)}
                className="text-red-500 text-sm"
                disabled={isViewOnly}
              >
                Xóa
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên thành phần
              </label>
              <input
                type="text"
                value={ingredient.ingredient_name}
                onChange={(e) =>
                  updateIngredientItem(index, "ingredient_name", e.target.value)
                }
                className="border rounded-lg p-2 w-full"
                disabled={isViewOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Số lượng thành phần
              </label>
              <input
                type="text"
                value={ingredient.ingredient_amount}
                onChange={(e) =>
                  updateIngredientItem(
                    index,
                    "ingredient_amount",
                    e.target.value
                  )
                }
                className="border rounded-lg p-2 w-full"
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
      ))}

      {hasError("ingredients") && <ErrorMessage message={errors.ingredients} />}

      <button
        type="button"
        onClick={addIngredientItem}
        className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
        disabled={isViewOnly}
      >
        + Thêm thành phần mới
      </button>
    </div>
  );
};
