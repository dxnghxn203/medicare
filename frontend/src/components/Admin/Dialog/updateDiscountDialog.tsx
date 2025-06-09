"use client";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";
import { X } from "lucide-react";
import React from "react";

interface UpdateDiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: any;
}
const UpdateDiscountDialog = ({
  isOpen,
  onClose,
  selectedProduct,
}: UpdateDiscountDialogProps) => {
  if (!isOpen) return null;
  const [selectedProductData, setSelectedProductData] =
    React.useState<any>(selectedProduct);
  const {
    fetchUpdateProduct,
    fetchGetProductDiscountAdmin
  } = useProduct();
  const toast = useToast();
  const handleUpdateProduct = async (product: any) => {
    const dataToSend = {
      product_id: product.product_id,
      product_name: product.product_name,
      slug: product.slug,
      name_primary: product.name_primary,
      origin: product.origin,
      description: product.description,
      brand: product.brand,
      uses: product.uses,
      dosage_form: product.dosage_form,
      registration_number: product.registration_number,
      dosage: product.dosage,
      side_effects: product.side_effects,
      precautions: product.precautions,
      storage: product.storage,
      full_descriptions: product.full_descriptions,
      prescription_required: product.prescription_required,
      prices: product.prices.map((p: any) => ({
        price_id: p.price_id,
        original_price: p.original_price,
        discount: p.discount,
        unit: p.unit,
        amount: p.amount,
        weight: p.weight,
        inventory: p.inventory,
        expired_date: p.expired_date,
      })),

      ingredients: {
        ingredients: product.ingredients.map((i: any) => ({
          ingredient_name: i.ingredient_name,
          ingredient_amount: i.ingredient_amount,
        })),
      },
      manufacturer: product.manufacturer,
      category: {
        main_category_id: product.category.main_category_id,
        sub_category_id: product.category.sub_category_id,
        child_category_id: product.category.child_category_id,
      },
      images: product.images,
      images_primary: product.images_primary,
    };
    console.log("dataSendmmm99mm", dataToSend);
    fetchUpdateProduct(
      dataToSend,
      () => {
        toast.showToast("Cập nhật giảm giá thành công", "success");
        fetchGetProductDiscountAdmin(false);
        onClose();
      },
      (error: any) => {
        toast.showToast(error, "error");
      }
    );
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4 justify-center text-center">
          Cập nhật giảm giá
        </h2>
        <>
          <div className="mb-4 ">
            Sản phẩm:{" "}
            <span className="font-medium">{selectedProductData?.name_primary}</span>
          </div>
          {selectedProductData?.prices?.length > 0 && (
            <div
              className={`grid gap-6 ${
                selectedProductData.prices.length === 1
                  ? "grid-cols-1"
                  : selectedProductData.prices.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {selectedProductData.prices.map((price: any, index: number) => (
                <div
                  key={index}
                  className="space-y-3 border p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <h3 className="font-semibold text-sm text-gray-700">
                    % Giảm giá đơn giá {index + 1} ({price.unit})
                  </h3>

                  <input
                    type="number"
                    placeholder="Phần trăm giảm giá (%)"
                    className="border px-4 py-2 rounded-lg w-full"
                    defaultValue={price.discount}
                    onChange={(e) => {
                      const newPrices = [...selectedProductData.prices];
                      newPrices[index] = {
                        ...newPrices[index],
                        discount: Number(e.target.value),
                      };
                      setSelectedProductData({
                        ...selectedProductData,
                        prices: newPrices,
                      });
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Đơn vị"
                    className="border px-4 py-2 rounded w-full"
                    defaultValue={price.unit}
                    disabled
                  />

                  <input
                    type="date"
                    className="border px-4 py-2 rounded w-full"
                    value={
                      selectedProductData.prices[index].expired_date
                        ? selectedProductData.prices[index].expired_date.split(
                            "T"
                          )[0]
                        : ""
                    }
                    onChange={(e) => {
                      const newPrices = [...selectedProductData.prices];
                      newPrices[index] = {
                        ...newPrices[index],
                        expired_date: new Date(e.target.value).toISOString(),
                      };
                      setSelectedProductData({
                        ...selectedProductData,
                        prices: newPrices,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg"
              onClick={() => {
                console.log("Selected Product Data:", selectedProductData);
                handleUpdateProduct(selectedProductData);
              }}
            >
              Lưu
            </button>
          </div>
        </>
      </div>
    </div>
  );
};
export default UpdateDiscountDialog;
