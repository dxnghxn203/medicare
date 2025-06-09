"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import {
  FaArrowRightLong,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import ProductDiscountCard from "./productDiscountCard";

const ProductDiscountList: React.FC = () => {
  const { allProductDiscount, fetchGetProductDiscount } = useProduct();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchGetProductDiscount();
  }, []);

  const handleNext = () => {
    if (startIndex + itemsPerPage < allProductDiscount.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const canGoNext =
    allProductDiscount && startIndex + itemsPerPage < allProductDiscount.length;
  const canGoPrev = startIndex > 0;

  return (
    <div className="w-full max-md:px-5 max-md:max-w-full">
      {/* Group để xử lý hover */}
      <div className="relative group">
        {/* Nút Prev */}
        {canGoPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-[-12px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 hidden group-hover:flex items-center justify-center rounded-full shadow-md bg-black/20 text-white hover:scale-110 transition"
          >
            <FaChevronLeft size={18} />
          </button>
        )}

        {/* Nút Next */}
        {canGoNext && (
          <button
            onClick={handleNext}
            className="absolute right-[-12px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 hidden group-hover:flex items-center justify-center rounded-full shadow-md bg-black/20 text-white hover:scale-110 transition"
          >
            <FaChevronRight size={18} />
          </button>
        )}

        {/* Danh sách sản phẩm */}
        <div className="self-center w-full">
          <div className="grid grid-cols-5 gap-6 max-md:grid-cols-1">
            {allProductDiscount &&
              allProductDiscount
                .slice(startIndex, startIndex + itemsPerPage)
                .map((product: any, index: number) => (
                  <ProductDiscountCard key={index} product={product} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDiscountList;
