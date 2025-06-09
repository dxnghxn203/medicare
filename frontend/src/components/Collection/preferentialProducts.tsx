"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/Product/productCard";
import { useProduct } from "@/hooks/useProduct";
import ProductDiscountCard from "../Product/productDiscountCard";

const PreferentialProduct: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState<"asc" | "desc" | null>(null);
  const { fetchGetProductDiscount, allProductDiscount } = useProduct();
  const productData = allProductDiscount;

  let sortedProducts = [...productData];
  if (sortOption === "asc") {
    sortedProducts.sort(
      (a, b) => (a.prices?.[0]?.price || 0) - (b.prices?.[0]?.price || 0)
    );
  } else if (sortOption === "desc") {
    sortedProducts.sort(
      (a, b) => (b.prices?.[0]?.price || 0) - (a.prices?.[0]?.price || 0)
    );
  }

  const displayedProducts = showAll
    ? sortedProducts
    : sortedProducts.slice(0, 12);

  useEffect(() => {
    fetchGetProductDiscount();
  }, []);

  return (
    <div className="text-sm text-[#0053E2] px-5">
      <Link href="/" className="hover:underline text-blue-600">
        Trang chủ
      </Link>
      <span> / </span>
      <Link href="/bo-suu-tap/san-uu-dai-xin" className="text-gray-800">
        Săn ưu đãi xịn
      </Link>

      <div className="self-start text-2xl font-extrabold text-black py-4">
        Săn ưu đãi xịn
      </div>

      <div className="col-span-5 mr-5 space-y-6">
        <div className="flex space-x-4 items-center">
          <span className="text-black/50">Sắp xếp theo</span>
          <button
            className={`px-6 py-2 border ${
              sortOption === "asc"
                ? "border-[#0053E2] text-[#0053E2]"
                : "border-gray-300 text-black/50"
            } rounded-lg text-semibold`}
            onClick={() => setSortOption("asc")}
          >
            Giá tăng dần
          </button>
          <button
            className={`px-6 py-2 border ${
              sortOption === "desc"
                ? "border-[#0053E2] text-[#0053E2]"
                : "border-gray-300 text-black/50"
            } rounded-lg text-semibold`}
            onClick={() => setSortOption("desc")}
          >
            Giá giảm dần
          </button>
        </div>
      </div>

      <div className="self-center mt-5 w-full max-md:max-w-full">
        <div className="grid grid-cols-5 gap-6 max-md:grid-cols-1">
          {displayedProducts.map((product: any, index: any) => (
            <ProductDiscountCard key={index} product={product} />
          ))}
        </div>
      </div>

      {displayedProducts.length < productData.length && (
        <div className="text-center mt-6">
          <button
            className="px-12 py-2 border border-[#0053E2] text-[#0053E2] text-lg rounded-lg transition"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PreferentialProduct;
