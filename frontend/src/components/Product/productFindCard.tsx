import React, { useMemo, useState } from "react";
import ProductDialog from "@/components/Dialog/productDialog";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

interface ProductFindCardProps {
  products: any;
}

const ProductFindCard: React.FC<ProductFindCardProps> = ({ products }) => {
  const slug = products?.slug;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // console.log("hvjnsdv", products?.category?.main_category_name);

  return (
    <>
      <div className="flex text-xs font-bold whitespace-normal">
        <div className="flex flex-col rounded-3xl border border-neutral-100 bg-slate-100 min-w-[100px] w-full hover:border-blue-600 hover:shadow-md transition-all duration-300 ">
          <Link href={`/chi-tiet-san-pham/${slug}`} legacyBehavior>
            <div className="py-4 flex flex-col items-center">
              <div className="flex justify-end w-full">
                {products?.prices[0]?.discount !== 0 ? (
                  <div className="bg-amber-300 text-black text-sm font-medium px-3 py-1 rounded-l-lg rounded-bl-lg shadow-md transition-opacity">
                    {products?.prices[0]?.discount}%
                  </div>
                ) : (
                  <div className="bg-amber-300 text-black text-sm font-medium px-3 py-1 rounded-l-lg rounded-bl-lg shadow-md opacity-0">
                    Ưu đãi
                  </div>
                )}
              </div>
              <Image
                src={products?.images_primary}
                alt={""}
                width={170}
                height={170}
                className="object-contain cursor-pointer"
                priority
              />
            </div>
          </Link>
          {/* Thông tin sản phẩm */}
          <div className="px-3 py-4 bg-white rounded-3xl border border-neutral-100 h-full">
            {/* Category + Rating */}
            <div className="flex justify-between mb-2 items-center">
              <span className="font-normal text-[#A7A8B0] text-xs ">
                {products?.category?.main_category_name}
              </span>
              <div className="flex items-center space-x-1">
                <span>
                  <FaStar className="text-[#FFD700] text-base" />
                </span>
                <span className="font-normal text-[#A7A8B0]">
                  {products?.rating?.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Tên sản phẩm */}
            <div className="mt-2 text-[16px] font-semibold text-black line-clamp-2 break-words leading-[1.5] cursor-pointer">
              {products?.name_primary}
            </div>

            {products?.prescription_required ? (
              <div className="mt-2 ">
                <div
                  className={`text-sm text-zinc-400 line-through opacity-0 select-none${
                    products?.prices[0]?.original_price &&
                    products?.prices[0]?.original_price !==
                      products?.prices[0]?.price
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  {products?.prices[0]?.original_price?.toLocaleString("vi-VN")}
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
                    products?.prices[0]?.original_price &&
                    products?.prices[0]?.original_price !==
                      products?.prices[0]?.price
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  {products?.prices[0]?.original_price?.toLocaleString("vi-VN")}
                  đ
                </div>
                <div className="text-lg font-bold text-[#0053E2]">
                  {products?.prices[0]?.price.toLocaleString("vi-VN")}đ/
                  {products?.prices[0]?.unit}
                </div>
              </div>
            )}

            {/* Nút chọn sản phẩm */}
            <div className="mt-2 flex justify-center w-full">
              {products?.prescription_required ? (
                <div className="flex flex-col justify-start w-full">
                  <button
                    className="mt-2 w-full py-2.5 text-sm text-[#0053E2] bg-[#EAEFFA] rounded-3xl font-bold"
                    onClick={() =>
                      (window.location.href = `/chi-tiet-san-pham/${slug}`)
                    }
                  >
                    Xem chi tiết
                  </button>
                </div>
              ) : (
                <button
                  className="w-full py-2.5 text-sm text-white bg-blue-700 hover:bg-blue-800 rounded-3xl font-semibold"
                  onClick={() => setIsDialogOpen(true)}
                >
                  + Chọn sản phẩm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog hiển thị khi isDialogOpen = true */}
      {isDialogOpen && (
        <ProductDialog
          product={products}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ProductFindCard;
