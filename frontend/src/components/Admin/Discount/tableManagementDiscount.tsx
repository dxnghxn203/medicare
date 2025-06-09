"use client";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { IoImage } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MdModeEdit,
  MdMoreHoriz,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineModeEdit,
} from "react-icons/md";
import { useToast } from "@/providers/toastProvider";
import UpdateDiscountDialog from "../Dialog/updateDiscountDialog";

interface TableManagementDiscountProps {
  allProductDiscountAdmin: any[];
  totalProductDiscountAdmin: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isApproved: boolean;
  setIsApproved: (isApproved: boolean) => void;
}

const TableManagementDiscount = ({
  allProductDiscountAdmin,
  totalProductDiscountAdmin,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isApproved,
  setIsApproved,
}: TableManagementDiscountProps) => {
  const [isOpenUpdateProduct, setIsOpenUpdateProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const totalPages = Math.ceil(totalProductDiscountAdmin / pageSize);
  const currentPageData = (currentPage - 1) * pageSize;
  const firstIndex = currentPageData + 1;
  const lastIndex = Math.min(currentPageData + pageSize, totalProductDiscountAdmin);

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-2">
        <button
          onClick={() => {
            setIsApproved(true);
            onPageChange(1);
          }}
          className={`pb-2 px-3 text-sm font-medium border-b-2 transition flex items-center ${
            isApproved
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          Sản phẩm giảm giá
        </button>
        <button
          onClick={() => {
            setIsApproved(false);
            onPageChange(1);
          }}
          className={`pb-2 px-3 text-sm font-medium border-b-2 transition flex items-center ${
            !isApproved
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          Chờ duyệt
        </button>
      </div>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm space-x-2">
                <th className="py-4 text-center px-4">Hình ảnh</th>
                <th className="py-4">Tên sản phẩm</th>
                <th className="py-4 text-center">Mã sản phẩm/ danh mục</th>
                <th className="py-4 text-center">Kho</th>
                <th className="py-4 text-center">Bán</th>

                <th className="py-4 text-center">Giảm giá</th>
                <th className="py-4 px-4 text-center"></th>
              </tr>
            </thead>

            <tbody className="space-x-2">
              {allProductDiscountAdmin && totalProductDiscountAdmin > 0 ? (
                allProductDiscountAdmin.map((product: any, index: number) => (
                  <tr
                    key={product.product_id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== totalProductDiscountAdmin - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="py-4 px-2 text-center ">
                      {product.images_primary ? (
                        <div className="relative h-16 w-16 mx-auto">
                          <Image
                            src={product.images_primary}
                            alt={product.product_name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded mx-auto">
                          <IoImage className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-left leading-5">
                      <div className="line-clamp-2 font-medium">
                        {product.product_name}
                      </div>
                      <div className="line-clamp-2 text-xs text-gray-500 mt-1 w-[180px]">
                        {product.name_primary}
                      </div>
                    </td>
                    <td className="py-4 text-center text-xs flex flex-col gap-2 items-center justify-center">
                      <span className="font-semibold">
                        {product.product_id}
                      </span>
                      <span className="py-1 px-2 bg-blue-100 text-blue-700 rounded-full w-fit">
                        {product.category?.main_category_id}
                      </span>
                      <span className="py-1 px-2 bg-green-100 text-green-700 rounded-full w-fit">
                        {product.category?.sub_category_id}
                      </span>
                      <span className="py-1 px-2 bg-red-100 text-red-700 rounded-full w-fit">
                        {product.category?.child_category_id}
                      </span>
                    </td>
                    <td className="py-4 text-center font-medium">
                      <span className="font-normal">
                        {(() => {
                          const inventoryByUnit: { [unit: string]: number } =
                            {};

                          product?.prices.forEach((p: any) => {
                            if (!inventoryByUnit[p.unit]) {
                              inventoryByUnit[p.unit] = 0;
                            }
                            inventoryByUnit[p.unit] += p.inventory;
                          });

                          return Object.entries(inventoryByUnit)
                            .map(([unit, qty]) => `${qty} ${unit}`)
                            .join(", ");
                        })()}
                      </span>
                      <br />
                      {(() => {
                        const totalInventory = product.prices.reduce(
                          (sum: number, p: any) => sum + p.inventory,
                          0
                        );
                        if (totalInventory === 0) {
                          return <span className="text-red-500">Hết hàng</span>;
                        } else if (totalInventory < 60) {
                          return (
                            <span className="text-yellow-500">Sắp hết</span>
                          );
                        } else {
                          return (
                            <span className="text-green-500">Còn hàng</span>
                          );
                        }
                      })()}
                    </td>

                    <td className="py-4 text-center">
                      <span className="text-sm">
                        {Object.entries(
                          product.prices.reduce(
                            (acc: { [unit: string]: number }, p: any) => {
                              acc[p.unit] = (acc[p.unit] || 0) + p.sell;
                              return acc;
                            },
                            {}
                          )
                        )
                          .map(([unit, qty]) => `${qty} ${unit}`)
                          .join(", ")}
                      </span>
                    </td>

                    <td className="py-4 text-center relative">
                      {product.prices && product.prices.length > 0 ? (
                        product.prices.map((p: any, index: number) => (
                          <div key={index} className="mb-1">
                            {p.discount ? (
                              <div>
                                {p.discount ? `${p.discount}% / ${p.unit}` : ""}
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="text-xs text-gray-500">
                              {p.expired_date && p.discount
                                ? new Date(p.expired_date).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : ""}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          className="text-blue-800 font-medium flex items-center space-x-2 "
                          onClick={() => {
                            setIsOpenUpdateProduct(true);
                            setSelectedProduct(product);
                          }}
                        >
                          <MdModeEdit className="text-blue-800 mr-1" />
                          Sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-700">
          Hiện có {totalProductDiscountAdmin} sản phẩm
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Hiển thị {firstIndex} đến{" "}
            {lastIndex} trong số{" "}
            {totalProductDiscountAdmin} sản phẩm
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        {/* Nút previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
        >
          <MdNavigateBefore className="text-xl" />
        </button>

        {/* Các nút số trang */}
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;

          // Quy tắc ẩn bớt số
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1) ||
            (currentPage <= 3 && pageNumber <= 5) ||
            (currentPage >= totalPages - 2 && pageNumber >= totalPages - 4)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                  currentPage === pageNumber
                    ? "bg-blue-700 text-white"
                    : "text-black hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            );
          }

          // Hiển thị dấu ...
          if (
            (pageNumber === currentPage - 2 && currentPage > 4) ||
            (pageNumber === currentPage + 2 && currentPage < totalPages - 3)
          ) {
            return (
              <span key={pageNumber} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          return null;
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
        >
          <MdNavigateNext className="text-xl" />
        </button>
      </div>
      <UpdateDiscountDialog
        isOpen={isOpenUpdateProduct}
        onClose={() => setIsOpenUpdateProduct(false)}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default TableManagementDiscount;
