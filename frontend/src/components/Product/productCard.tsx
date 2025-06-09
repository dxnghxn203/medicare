"use client";
import React, { useState } from "react";
import ProductDialog from "@/components/Dialog/productDialog";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

const ProductCard = ({ product }: { product: any }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const slug = product?.slug;

  return (
    <>
      {product && (
        <div className="flex text-xs font-bold whitespace-normal ">
          <div className="flex flex-col rounded-3xl border border-neutral-100 bg-slate-100 min-w-[100px] w-full hover:border-blue-600 hover:shadow-md transition-all duration-300">
            <Link href={`/chi-tiet-san-pham/${product?.slug}`} legacyBehavior>
              <div className="py-6 flex flex-col items-center">
                <div className="flex justify-end w-full">
                  {product?.prices[0]?.discount !== 0 ? (
                    <div className="bg-amber-300 text-black text-sm font-medium px-3 py-1 rounded-l-lg rounded-bl-lg shadow-md transition-opacity">
                      {product?.prices[0]?.discount}%
                    </div>
                  ) : (
                    <div className="bg-amber-300 text-black text-sm font-medium px-3 py-1 rounded-l-lg rounded-bl-lg shadow-md opacity-0">
                      Ưu đãi
                    </div>
                  )}
                </div>
                <Image
                  src={product?.images_primary}
                  alt={product?.product_id}
                  width={170}
                  height={170}
                  className="object-contain cursor-pointer"
                  priority
                />
              </div>
            </Link>

            <div className="px-3 py-4 bg-white rounded-3xl border border-neutral-100">
              <div className="flex justify-between items-center mb-5">
                <span className="font-normal text-[#A7A8B0] ">
                  {product?.category?.main_category_name}
                </span>
                <div className="flex items-center space-x-1">
                  <span>
                    <FaStar className="text-[#FFD700] text-base" />
                  </span>
                  <span className="font-normal text-[#A7A8B0]">
                    {product?.rating?.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[16px] font-semibold text-black line-clamp-2 break-words leading-[1.5] h-[48px]">
                {product?.name_primary}
              </div>
              {product?.prescription_required ? (
                <div className="mt-2 ">
                  <div
                    className={`text-sm text-zinc-400 line-through opacity-0 select-none${
                      product?.prices[0]?.original_price &&
                      product?.prices[0]?.original_price !==
                        product?.prices[0]?.price
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    {product?.prices[0]?.original_price?.toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </div>
                  <p className="text-[#A7A8B0] text-sm font-medium">
                    Cần tư vấn từ dược sĩ
                  </p>
                </div>
              ) : (
                <div className="mt-2">
                  <div
                    className={`text-sm text-zinc-400 line-through ${
                      product?.prices[0]?.original_price &&
                      product?.prices[0]?.original_price !==
                        product?.prices[0]?.price
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    {product?.prices[0]?.original_price?.toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </div>
                  <div className="text-lg font-bold text-[#0053E2]">
                    {product?.prices[0]?.price.toLocaleString("vi-VN")}đ/
                    {product?.prices[0]?.unit}
                  </div>
                </div>
              )}

              {/* Nút chọn sản phẩm */}
              <div className="mt-2 flex justify-center w-full">
                {product?.prescription_required ? (
                  <div className="flex flex-col justify-start w-full">
                    <button
                      className="mt-2 w-full py-3.5 text-sm text-[#0053E2] bg-[#EAEFFA] rounded-3xl font-bold"
                      onClick={() =>
                        (window.location.href = `/chi-tiet-san-pham/${slug}`)
                      }
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full py-3.5 text-sm text-white bg-blue-700 hover:bg-blue-800 rounded-3xl font-bold"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    + Chọn sản phẩm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isDialogOpen && (
        <ProductDialog
          product={product}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
