"use client";
import React from "react";
import Image from "next/image";

interface ProductListProps {
  products: any[];
}
// Tính số tiền tương ứng với số lượng sản phẩm
const calculateTotalPrice = (price: number, quantity: number) => {
  return price * quantity;
};
// tổng tiền giá gốc
const calculateTotalOriginalPrice = (
  original_price: number,
  quantity: number
) => {
  return original_price * quantity;
};
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  console.log("products", products);
  return (
    <div className="">
      <div className="flex-1 bg-[#F5F7F9] rounded-xl">
        {products.map((product: any, index: any) => (
          <div
            key={product.id}
            className={`flex items-center justify-between py-4 text-sm ${
              index !== products.length - 1 ? "border-b border-gray-300" : ""
            }`}
          >
            <div className="w-[40%] flex items-center px-2 py-2">
              <Image
                src={product.image}
                alt={product.product_name}
                width={55}
                height={55}
                className="ml-4 rounded-lg border border-stone-300 p-1"
              />
              <span className="ml-4 line-clamp-3 overflow-hidden text-ellipsis">
                {product.product_name}
              </span>
            </div>
            <div className="w-[15%] text-center flex flex-col items-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-500 line-through font-semibold text-base">
                  {calculateTotalOriginalPrice(
                    product?.original_price,
                    product?.quantity
                  ).toLocaleString("vi-VN")}
                  đ
                </span>

                <span className="text-lg font-semibold text-[#0053E2]">
                  {calculateTotalPrice(
                    product?.price,
                    product?.quantity
                  ).toLocaleString("vi-VN")}
                  đ
                </span>
              </div>
            </div>
            <div className="w-[15%] text-center px-2">
              x{product.quantity} {product.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
