"use client";

import { ProductFormProps, ErrorMessage } from "./types";
import DynamicReactQuill from "./dynamicReactQuill";

export const ProductDetailsForm = ({
  formData,
  updateFormData,
  errors,
  hasError,
  isViewOnly,
  productId,
}: ProductFormProps) => {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-5">
      <h3 className="text-lg font-semibold mb-3">Chi tiết sản phẩm</h3>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Dạng bào chế</label>
        <input
          type="text"
          name="dosage_form"
          className="border rounded-lg p-2 w-full"
          onChange={(e) => updateFormData({ dosage_form: e.target.value })}
          value={formData.dosage_form}
          disabled={isViewOnly}
        />
      </div>
      <div data-error={hasError("uses")} className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Công dụng <span className="text-red-500">*</span>
        </label>
        {typeof window !== "undefined" && (
          <DynamicReactQuill
            value={formData.uses}
            onChange={(value) => updateFormData({ uses: value })}
            readOnly={isViewOnly}
          />
        )}
        {hasError("uses") && <ErrorMessage message={errors.uses} />}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Liều lượng</label>
        {typeof window !== "undefined" && (
          <DynamicReactQuill
            value={formData.dosage}
            onChange={(value: any) => updateFormData({ dosage: value })}
            readOnly={isViewOnly}
          />
        )}
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Tác dụng phụ</label>
        {typeof window !== "undefined" && (
          <DynamicReactQuill
            value={formData.side_effects}
            onChange={(value: any) => updateFormData({ side_effects: value })}
            readOnly={isViewOnly}
          />
        )}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Lưu ý</label>
        {typeof window !== "undefined" && (
          <DynamicReactQuill
            value={formData.precautions}
            onChange={(value: any) => updateFormData({ precautions: value })}
            readOnly={isViewOnly}
          />
        )}
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Hướng dẫn bảo quản
        </label>
        {typeof window !== "undefined" && (
          <DynamicReactQuill
            value={formData.storage}
            onChange={(value) => updateFormData({ storage: value })}
            readOnly={isViewOnly}
          />
        )}
      </div>
    </div>
  );
};
