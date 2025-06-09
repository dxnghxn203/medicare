import React, { useMemo, useState } from "react";
import ProductDialog from "@/components/Dialog/productDialog";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

interface ProductFeaturedCardProps {
  products: any;
  mainCategoryName: string;
}

const ProductFeaturedCard: React.FC<ProductFeaturedCardProps> = ({
  products,
  mainCategoryName,
}) => {
  const slug = products?.slug;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // console.log("hvjnsdv", products?.rating);

  return (
    <>
      <div className="flex text-xs font-bold whitespace-normal">
        <div className="flex flex-col rounded-3xl border border-neutral-100 bg-slate-100 min-w-[130px] hover:border-blue-600 hover:shadow-md transition-all duration-300 ">
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
          <div className="px-3 py-4 bg-white rounded-3xl border border-neutral-100">
            {/* Category + Rating */}
            <div className="flex justify-between mb-2 items-center">
              <span className="font-normal text-[#A7A8B0] text-xs">
                {products?.category?.main_category_name}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-base">
                  <FaStar className="text-[#FFD700]" />
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

            {/* Giá sản phẩm */}
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
                {products?.prices[0]?.original_price?.toLocaleString("vi-VN")}đ
              </div>
              <div className="text-lg font-bold text-[#0053E2]">
                {products?.prices[0]?.price.toLocaleString("vi-VN")}đ/
                {products?.prices[0]?.unit}
              </div>
            </div>

            {/* Nút chọn sản phẩm */}
            <div className="mt-2 flex justify-center">
              <button
                className="w-full py-3.5 text-sm text-white bg-blue-700 rounded-3xl"
                onClick={() => setIsDialogOpen(true)} // Mở dialog khi nhấn
              >
                + Chọn sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog hiển thị khi isDialogOpen = true */}
      {isDialogOpen && (
        <ProductDialog
          name={products?.name_primary}
          price={products?.prices[0]?.price}
          discount={products?.prices[0]?.discount}
          originPrice={products?.prices[0]?.original_price}
          imageSrc={products?.images_primary}
          unit={products?.prices[0]?.unit}
          id={products?.product_id}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ProductFeaturedCard;
