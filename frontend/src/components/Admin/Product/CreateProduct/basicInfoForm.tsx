"use client";

import { ProductFormProps, ErrorMessage } from "./types";

export const BasicInfoForm = ({
  formData,
  updateFormData,
  errors,
  hasError,
  isViewOnly,
  productId,
  verified_by,
  is_approved,
}: ProductFormProps) => {
  console.log("formData", formData);
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-3">Thông tin cơ bản</h3>
      <div className="grid grid-cols-2 gap-4 mb-2">
        {productId && (
          <>
            <div data-error={hasError("product_id")}>
              <label className="block text-sm font-medium mb-1">
                ID sản phẩm
              </label>
              <input
                type="text"
                name="product_id"
                value={formData?.product_id || ""}
                className={`border rounded-lg p-2 w-full ${
                  hasError("product_id") ? "border-red-500" : ""
                }`}
                disabled={true}
              />
              {hasError("product_id") && (
                <ErrorMessage message={errors.product_id} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Trạng thái
              </label>
              <input
                type="text"
                name="is_approved"
                className={`border rounded-lg p-2 w-full font-semibold
    ${hasError("is_approved") ? "border-red-500" : ""}
    ${
      is_approved
        ? "text-green-600"
        : verified_by
        ? "text-red-600"
        : "text-yellow-600"
    }
  `}
                value={
                  is_approved
                    ? "ĐÃ DUYỆT"
                    : verified_by
                    ? "TỪ CHỐI"
                    : "ĐANG CHỜ DUYỆT"
                }
                disabled={true}
              />
              {hasError("is_approved") && (
                <ErrorMessage message={errors.is_approved} />
              )}
            </div>
          </>
        )}
      </div>

      {formData.rejected_note && is_approved === false && (
        <div className="w-full">
          <label className="block text-sm font-medium mb-1 w-full">
            Lý do từ chối:
          </label>
          <textarea
            rows={4}
            name="note"
            value={formData.rejected_note}
            className={`border rounded-lg p-2 w-full ${
              hasError("slug") ? "border-red-500" : ""
            }`}
            disabled={true}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div data-error={hasError("product_name")}>
          <label className="block text-sm font-medium mb-1">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={(e) => updateFormData({ product_name: e.target.value })}
            className={`border rounded-lg p-2 w-full ${
              hasError("product_name") ? "border-red-500" : ""
            }`}
            disabled={isViewOnly}
          />
          {hasError("product_name") && (
            <ErrorMessage message={errors.product_name} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên sản phẩm chính <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name_primary"
            className={`border rounded-lg p-2 w-full ${
              hasError("name_primary") ? "border-red-500" : ""
            }`}
            value={formData.name_primary}
            onChange={(e) => updateFormData({ name_primary: e.target.value })}
            disabled={isViewOnly}
          />
          {hasError("name_primary") && (
            <ErrorMessage message={errors.name_primary} />
          )}
        </div>
        <div data-error={hasError("slug")}>
          <label className="block text-sm font-medium mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={(e) => updateFormData({ slug: e.target.value })}
            className={`border rounded-lg p-2 w-full ${
              hasError("slug") ? "border-red-500" : ""
            }`}
            disabled={isViewOnly}
          />
          {hasError("slug") && <ErrorMessage message={errors.slug} />}
          <p className="text-xs text-gray-500 mt-1">
            Tự động tạo từ tên sản phẩm. Bạn có thể chỉnh sửa nếu cần.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Nguồn gốc <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="origin"
            className={`border rounded-lg p-2 w-full ${
              hasError("origin") ? "border-red-500" : ""
            }`}
            onChange={(e) => updateFormData({ origin: e.target.value })}
            value={formData.origin}
            disabled={isViewOnly}
          />
          {hasError("origin") && <ErrorMessage message={errors.origin} />}
        </div>
      </div>

      <div className="flex grid-cols-2 gap-4 w-full mt-3">
        <div className="items-center gap-2 w-full flex">
          <input
            type="checkbox"
            id="prescription_required"
            name="prescription_required"
            checked={formData.prescription_required}
            onChange={(e) =>
              updateFormData({ prescription_required: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
            disabled={isViewOnly}
          />
          <label htmlFor="prescription_required" className="text-sm">
            Thuốc kê toa
          </label>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            Số đăng ký <span className="text-red-500"></span>
          </label>
          <input
            type="text"
            name="registration_number"
            className="border rounded-lg p-2 w-full"
            onChange={(e) =>
              updateFormData({ registration_number: e.target.value })
            }
            value={formData.registration_number}
            disabled={isViewOnly}
          />
        </div>
      </div>

      <div className="mt-3" data-error={hasError("description")}>
        <label className="block text-sm font-medium mb-1">
          Mô tả ngắn <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows={3}
          className={`border rounded-lg p-2 w-full ${
            hasError("description") ? "border-red-500" : ""
          }`}
          onChange={(e) => updateFormData({ description: e.target.value })}
          value={formData.description}
          disabled={isViewOnly}
        ></textarea>
        {hasError("description") && (
          <ErrorMessage message={errors.description} />
        )}
      </div>

      <div className="mt-3">
        <h3 className="block text-sm font-medium mb-1">Mô tả đầy đủ</h3>
        <div className="dynamic-quill-container">
          {typeof window !== "undefined" && (
            <DynamicReactQuill
              value={formData.full_descriptions}
              onChange={(value) => updateFormData({ full_descriptions: value })}
              readOnly={isViewOnly}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Import at the end to avoid circular dependency
import DynamicReactQuill from "./dynamicReactQuill";
