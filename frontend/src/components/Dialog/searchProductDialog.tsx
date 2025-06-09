"use client";
import { X } from "lucide-react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelectProduct: (product: any) => void;
}

export default function SearchProductDialog({
  isOpen,
  setIsOpen,
  onSelectProduct,
}: Props) {
  const { fetchSearchProduct, searchResult, fetchClearSearch } = useProduct();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Thêm state để kiểm tra trạng thái loading
  const toast = useToast();

  if (!isOpen) return null;

  const isProductAdded = (productId: any) => {
    return selectedProduct.includes(productId);
  };

  const handleAddProduct = (product: any) => {
    onSelectProduct(product);
    if (isProductAdded(product.product_id)) {
      return;
    }
    setSelectedProduct((prevSelectedProduct) => [
      ...prevSelectedProduct,
      product.product_id,
    ]);
  };

  function handleSearch() {
    setIsLoading(true);
    fetchSearchProduct(
      {
        query: search,
      },
      () => {
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }

  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={() => {
            setIsOpen(false);
            fetchClearSearch();
            setSearch("");
          }}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">
          Tìm thuốc/sản phẩm cần tư vấn
        </h2>

        {/* Search input */}
        <div className="flex items-center border rounded-full px-3 py-2 mb-4 bg-gray-100">
          <input
            type="text"
            placeholder="Nhập tên thuốc cần tìm"
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
            <button className="text-blue-600 text-xl" onClick={handleSearch}>
              <FiSearch />
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin border-2 border-blue-600 border-t-transparent w-6 h-6 rounded-full"></div>
          </div>
        )}

        {/* Search Results */}
        {searchResult !== null && !isLoading && (
          <div className="space-y-4">
            {searchResult && searchResult.length > 0 ? (
              searchResult.map((product: any, index: any) => (
                <div
                  key={product.id}
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
                        handleAddProduct(product);
                        setSelectedProduct(product.product_id);
                      }}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex w-full justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            onClick={() => {
              setIsOpen(false);
              fetchClearSearch();
              setSearch("");
            }}
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}
