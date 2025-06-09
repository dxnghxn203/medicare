"use client";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";
import { FaChevronLeft } from "react-icons/fa6";
import { updateProduct } from "@/services/productService";
import { da, is } from "date-fns/locale";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  allProductDiscountAdmin: any;
  isApproved: boolean;
}

export default function SearchProductDialog({
  isOpen,
  setIsOpen,
  allProductDiscountAdmin,
  isApproved,
}: Props) {
  const {
    fetchSearchProduct,
    searchResult,
    fetchClearSearch,
    fetchUpdateProduct,
    fetchGetProductDiscountAdmin,
  } = useProduct();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState<any>(null);
  const toast = useToast();

  if (!isOpen) return null;

  const handleAddProduct = (product: any) => {
    console.log("product", product);
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
        toast.showToast("Thêm giảm giá thành công", "success");
        fetchGetProductDiscountAdmin(
          isApproved,
        );
        setIsOpen(false);
      },
      (error: any) => {
        toast.showToast(error, "error");
      }
    );
  };

  function handleSearch() {
    if (!search) {
      toast.showToast("Vui lặng nhập tên sản phẩm", "error");
      return;
    }
    setIsLoading(true);
    fetchSearchProduct(
      {
        query: search,
      },
      () => setIsLoading(false),
      () => setIsLoading(false)
    );
  }

  const handleClear = () => setSearch("");

  const handleClose = () => {
    setIsOpen(false);
    fetchClearSearch();
    setSearch("");
    setShowDiscountForm(false);
    setSelectedProductData(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={handleClose}
        >
          <X size={24} />
        </button>

        {!showDiscountForm ? (
          <>
            <h2 className="text-xl font-bold mb-6 text-center">
              Tìm sản phẩm cần thêm giảm giá
            </h2>

            <div className="flex items-center border rounded-full px-3 py-2 mb-4 bg-gray-100">
              <input
                type="text"
                placeholder="Nhập tên sản phẩm cần tìm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="placeholder:bg-gray-100 flex-grow outline-none bg-transparent text-sm text-gray-700"
              />
              {search && (
                <button onClick={handleClear} className="text-gray-400 mr-2">
                  <X size={20} />
                </button>
              )}
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <button
                  className="text-blue-600 text-xl"
                  onClick={handleSearch}
                >
                  <FiSearch />
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin border-2 border-blue-600 border-t-transparent w-6 h-6 rounded-full"></div>
              </div>
            )}

            {searchResult !== null && !isLoading && (
              <div className="space-y-4">
                {searchResult
                  .filter((product: any) => {
                    // loại bỏ sản phẩm đã có giảm giá trong allProductAdmin

                    const isAlreadyDiscounted = allProductDiscountAdmin?.some(
                      (p: any) =>
                        p.product_id === product.product_id &&
                        p.prices.some((price: any) => price.discount !== 0)
                    );
                    return !isAlreadyDiscounted;
                  })
                  .map((product: any, index: any) => (
                    <div
                      key={product.product_id}
                      className={`flex gap-3 pb-4 items-center ${
                        index !== searchResult.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <Image
                        width={70}
                        height={70}
                        src={product.images_primary}
                        alt={product.name}
                        className="p-1 rounded-lg object-cover border"
                      />
                      <div className="flex-grow">
                        <div className="text-sm">{product.name_primary}</div>
                      </div>

                      <div className="flex items-center justify-center">
                        <button
                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                          onClick={() => {
                            setSelectedProductData(product);
                            setShowDiscountForm(true);
                            setSearch("");
                            fetchClearSearch();
                          }}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                  ))}
                {searchResult.filter((product: any) => {
                  const hasDiscount = product.prices.some(
                    (p: any) => p.discount !== 0
                  );
                  return !(product.is_approved === true && hasDiscount);
                }).length === 0 && (
                  <p className="text-center text-sm text-gray-500">
                    Không tìm thấy sản phẩm phù hợp.
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-6 text-center">
              Thêm giảm giá
            </h2>
            <div className="mb-4">
              <button
                className="flex items-center text-blue-600 hover:underline"
                onClick={() => {
                  setShowDiscountForm(false);
                  setSelectedProductData(null);
                }}
              >
                <FaChevronLeft className="mr-2" />
                Quay lại tìm sản phẩm
              </button>
            </div>
            <div className="mb-4 ">
              Sản phẩm:{" "}
              <span className="font-medium">
                {selectedProductData?.name_primary}
              </span>
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
                      Đơn giá {index + 1} ({price.unit})
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
                          ? selectedProductData.prices[
                              index
                            ].expired_date.split("T")[0]
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
                  handleAddProduct(selectedProductData);
                }}
              >
                Lưu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
