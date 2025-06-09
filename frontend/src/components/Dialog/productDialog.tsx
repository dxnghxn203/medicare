"use client";
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { getPriceFromProduct } from "@/utils/price";
import { useToast } from "@/providers/toastProvider";
import { useRouter } from "next/navigation";

const ProductDialog = ({ product, onClose }: any) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(
    product?.prices[0]?.price_id
  );
  const selectedPrice: any = useMemo(() => {
    return getPriceFromProduct(product, selectedUnit);
  }, [selectedUnit]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const { addProductTocart, getProductFromCart } = useCart();

  const toast = useToast();
  const router = useRouter();
  const handleAddToCart = (goCart: any) => {
    addProductTocart(
      product?.product_id,
      selectedUnit,
      quantity,
      () => {
        toast.showToast("Thêm vào giỏ hàng thành công", "success");
        if (goCart) {
          router.push("/gio-hang");
        } else {
          getProductFromCart(
            () => {},
            () => {}
          );
        }
      },
      () => {
        toast.showToast("Thêm vào giỏ hàng thất bại", "error");
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <div className="text-left text-xl font-semibold">Chọn sản phẩm</div>

        <div className="flex flex-col md:flex-row gap-6 py-4">
          <div className="w-full md:w-1/2 flex justify-center items-center bg-[#F1F5F9] p-4 rounded-lg">
            <img
              src={product?.images_primary}
              alt="Product"
              className="object-contain w-60 h-60 md:w-full md:max-w-[250px]"
            />
          </div>

          <div className="w-full md:w-1/2 text-left">
            <h1 className="text-lg md:text-2xl font-semibold text-black">
              {product?.name_primary}
            </h1>

            <div className="flex-col space-y-4 gap-2 mt-3 items-center">
              {selectedPrice?.discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-2 text-sm font-medium bg-amber-300 rounded-lg flex items-center justify-center">
                    Giảm {selectedPrice.discount}%
                  </span>
                  {selectedPrice?.original_price && (
                    <span className="text-xl font-bold text-zinc-400 line-through flex items-center">
                      {selectedPrice.original_price.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
              )}
              {selectedPrice?.price && (
                <p className="text-[#0053E2] text-3xl font-bold">
                  {selectedPrice.price.toLocaleString("vi-VN")}đ/{" "}
                  {selectedPrice.unit}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {product?.prices.map((price: any) => (
                <button
                  key={price.id}
                  onClick={() => setSelectedUnit(price?.price_id)}
                  className={`text-sm flex items-center justify-center px-4 py-2 rounded-full border font-normal my-3
        ${
          selectedUnit === price?.price_id
            ? "border-blue-500 text-black font-semibold"
            : "border-gray-300 text-gray-500"
        }`}
                >
                  {price.unit}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">Số lượng:</span>

              <div className="flex items-center gap-2 border p-1 rounded-lg">
                <button
                  className={`px-3 py-1  rounded-md ${
                    quantity === 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  −
                </button>

                <span className="text-lg font-medium">{quantity}</span>

                <button
                  className="px-3 py-1  rounded-md hover:bg-gray-300"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
            <a
              onClick={() => handleAddToCart(true)}
              className="block mt-4 bg-[#0053E2] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#002E99] w-full text-center cursor-pointer"
            >
              Mua ngay
            </a>

            <button
              onClick={() => handleAddToCart(false)}
              className="mt-3 text-[#0053E2] font-semibold px-6 py-3 rounded-xl w-full border border-[#0053E2] hover:border-opacity-50 hover:text-opacity-50"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDialog;
