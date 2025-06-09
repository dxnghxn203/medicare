"use client";

import { ProductFormProps, ErrorMessage } from "./types";

interface CategoryFormProps extends Omit<ProductFormProps, "updateFormData"> {
  updateCategory: (categoryType: string, value: string) => void;
  categoryAdmin: any[] | null;
  availableSubCategories: any[];
  availableChildCategories: any[];
}

export const CategoryForm = ({
  formData,
  updateCategory,
  categoryAdmin,
  availableSubCategories,
  availableChildCategories,
  errors,
  hasError,
  isViewOnly,
  productId,
}: CategoryFormProps) => {
  console.log("selected child ID:", formData.selectedCategories.child);
  console.log("availableChildCategories:", availableChildCategories);
  console.log("fdvnjdf", formData.selectedCategories.sub);
  console.log("formData", formData);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-3">Thông tin danh mục</h3>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div data-error={hasError("main_category")}>
          <label className="block text-sm font-medium mb-1">
            Danh mục chính <span className="text-red-500">*</span>
          </label>
          <select
            className={`border rounded-lg p-2 w-full ${
              hasError("main_category") ? "border-red-500" : ""
            }`}
            value={formData.selectedCategories.main}
            onChange={(e) => updateCategory("main", e.target.value)}
            disabled={isViewOnly}
          >
            <option value="">Chọn danh mục chính</option>
            {categoryAdmin &&
              categoryAdmin.map((mainCat: any) => (
                <option
                  key={mainCat.main_category_id}
                  value={mainCat.main_category_id}
                >
                  {mainCat.main_category_name}
                </option>
              ))}
          </select>
          {hasError("main_category") && (
            <ErrorMessage message={errors.main_category} />
          )}
        </div>

        {formData.selectedCategories.main && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Danh mục cấp 1
            </label>
            <select
              className="border rounded-lg p-2 w-full"
              value={formData.selectedCategories.sub}
              onChange={(e) => updateCategory("sub", e.target.value)}
              disabled={isViewOnly}
            >
              <option value="">Chọn danh mục cấp 1</option>
              {availableSubCategories.map((subCat: any) => (
                <option
                  key={subCat.sub_category_id}
                  value={subCat.sub_category_id}
                >
                  {subCat.sub_category_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.selectedCategories.sub && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Danh mục cấp 2
            </label>
            <select
              className="border rounded-lg p-2 w-full"
              value={formData.selectedCategories.child}
              onChange={(e) => updateCategory("child", e.target.value)}
              disabled={isViewOnly}
            >
              <option value="">Chọn danh mục cấp 2</option>
              {availableChildCategories.map((childCat: any) => (
                <option
                  key={childCat.child_category_id}
                  value={childCat.child_category_id}
                >
                  {childCat.child_category_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="text-sm font-medium mb-2">Danh mục đã chọn</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <span className="font-medium">Chính:</span>{" "}
            {formData.category.main_category_name || "Chưa có"}
          </div>
          <div>
            <span className="font-medium">Cấp 1:</span>{" "}
            {formData.category.sub_category_name || "Chưa có"}
          </div>
          <div>
            <span className="font-medium">Cấp 2:</span>{" "}
            {formData.category.child_category_name || "Chưa có"}
          </div>
        </div>
      </div>

      {/* Hidden inputs to store the category data */}
      <input
        type="hidden"
        name="main_category_id"
        value={formData.category.main_category_id}
      />
      <input
        type="hidden"
        name="main_category_name"
        value={formData.category.main_category_name}
      />
      <input
        type="hidden"
        name="main_category_slug"
        value={formData.category.main_category_slug}
      />
      <input
        type="hidden"
        name="sub_category_id"
        value={formData.category.sub_category_id}
      />
      <input
        type="hidden"
        name="sub_category_name"
        value={formData.category.sub_category_name}
      />
      <input
        type="hidden"
        name="sub_category_slug"
        value={formData.category.sub_category_slug}
      />
      <input
        type="hidden"
        name="child_category_id"
        value={formData.category.child_category_id}
      />
      <input
        type="hidden"
        name="child_category_name"
        value={formData.category.child_category_name}
      />
      <input
        type="hidden"
        name="child_category_slug"
        value={formData.category.child_category_slug}
      />
    </div>
  );
};
