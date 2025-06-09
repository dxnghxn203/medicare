"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CategoryCardProps {
  mainCategory: any;
  subCategories: any;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  mainCategory,
  subCategories,
}) => {
  const itemsPerPage = 5;
  const [page, setPage] = useState(0);

  const totalSubSubCategories = subCategories.child_category.length;
  const totalPages = Math.ceil(totalSubSubCategories / itemsPerPage);

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const visibleSubSubCategories = subCategories.child_category.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <div className="relative flex items-center shadow-sm rounded-lg bg-[#F6FBFF] border border-gray-200 group h-[160px]">
      <div className="flex flex-col items-center w-1/3 text-center p-2 transition duration-300 rounded-lg">
        <Link
          href={`/${mainCategory}/${subCategories.sub_category_slug}`}
          className="items-center"
        >
          <div className="flex justify-center items-center">
            <Image
              src={subCategories?.sub_image_url}
              alt="Category Icon"
              width={80}
              height={80}
              className="cursor-pointer"
            />
          </div>

          <h3 className="font-semibold text-gray-800 text-sm mt-2">
            {subCategories?.sub_category_name}
          </h3>
        </Link>
      </div>
      <div className="h-full w-[0.5px] bg-gray-200 mx-4"></div>

      <div className="flex-1 py-4 px-2">
        <div className="flex flex-col space-y-2">
          {visibleSubSubCategories &&
            visibleSubSubCategories.map((sub: any, index: any) => (
              <Link
                key={index}
                href={`/${mainCategory}/${subCategories?.sub_category_slug}/${sub.child_category_slug}`}
                className="block text-[#1D4ED8] hover:underline text-sm font-medium"
              >
                {sub?.child_category_name}
              </Link>
            ))}
        </div>
      </div>

      {totalSubSubCategories > itemsPerPage && (
        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-100 group-hover:opacity-0 transition-opacity duration-200">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                page === index ? "bg-gray-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      )}

      {totalSubSubCategories > itemsPerPage && (
        <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className={`bg-gray-300/70 hover:bg-gray-400 text-white p-1 rounded-full transition ${
              page === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextPage}
            disabled={page === totalPages - 1}
            className={`bg-gray-300/70 hover:bg-gray-400 text-white p-1 rounded-full transition ${
              page === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
