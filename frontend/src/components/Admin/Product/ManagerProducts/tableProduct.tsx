"use client";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { IoImage } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MdMoreHoriz,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import DeleteProductDialog from "../../Dialog/confirmDeleteProductDialog";
import { useToast } from "@/providers/toastProvider";
import { FiEye } from "react-icons/fi";

interface TableProductProps {
  allProductAdmin: any;
  currentPage: number;
  pageSize: number;
  totalProductAdmin: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const TableProduct = ({
    allProductAdmin,
    currentPage,
    pageSize,
    totalProductAdmin,
    onPageChange,
    onPageSizeChange
}: TableProductProps) => {
  const {
    deleteProduct,
    getAllProductsAdmin,  
  } = useProduct();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const router = useRouter();

  const toast = useToast();

  const toggleMenu = (productId: string) => {
    setMenuOpen(menuOpen === productId ? null : productId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(totalProductAdmin / pageSize);
  const currentPageData = (currentPage - 1) * pageSize;
  const firstIndex = currentPageData + 1;
  const lastIndex = Math.min(currentPageData + pageSize, totalProductAdmin);
  return (
    <>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm">
                <th className="py-4 px-2 text-center w-[130px]">Hình ảnh</th>
                <th className="py-4 px-2 ">Tên sản phẩm</th>
                <th className="py-4 px-2 text-center">Mã sản phẩm/ danh mục</th>
                <th className="py-4 px-8 text-center">Kho</th>
                <th className="py-4 px-2 text-center">Bán</th>
                <th className="py-4 px-2 text-center">Giá</th>
                <th className="py-4 px-2 text-center">Trạng thái</th>
                <th className="py-4 px-2 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {allProductAdmin && allProductAdmin.length > 0 ? (
                allProductAdmin.map((product: any, index: number) => (
                  <tr
                    key={product.product_id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== allProductAdmin.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-center">
                      {product.images_primary ? (
                        <div className="relative h-16 w-16 mx-auto">
                          <Image
                            src={product.images_primary}
                            alt={product.product_name}
                            fill
                            sizes="64px"
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded mx-auto">
                          <IoImage className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-2 text-left leading-5">
                      <div className="line-clamp-2 font-medium">
                        {product.product_name}
                      </div>
                      <div className="line-clamp-2 text-xs text-gray-500 mt-1">
                        {product.name_primary}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center text-xs flex flex-col gap-2 items-center justify-center">
                      <span className="font-semibold">
                        {product.product_id}
                      </span>
                      <span
                        className="
                      px-2 py-1 bg-blue-100 text-blue-700 rounded-full w-fit"
                      >
                        {product.category?.main_category_id}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full w-fit">
                        {product.category?.sub_category_id}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full w-fit">
                        {product.category?.child_category_id}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center font-medium">
                      <span className="font-normal">
                        {(() => {
                          const inventoryByUnit: { [unit: string]: number } =
                            {};

                          // Tính tổng inventory theo đơn vị
                          product.prices.forEach((p: any) => {
                            if (!inventoryByUnit[p.unit]) {
                              inventoryByUnit[p.unit] = 0;
                            }
                            inventoryByUnit[p.unit] += p.inventory;
                          });

                          // Trả về chuỗi hiển thị
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

                    <td className="py-4 px-2 w-[100px] text-center">
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
                    <td className="py-4 px-2 w-[100px] text-center">
                      <span className="text-sm">
                        {Object.entries(
                          product.prices.reduce(
                            (acc: { [unit: string]: number }, p: any) => {
                              acc[p.unit] = (acc[p.unit] || 0) + p.price;
                              return acc;
                            },
                            {}
                          )
                        )
                          .map(
                            ([unit, qty]) =>
                              `${new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(Number(qty))} / ${unit}`
                          )
                          .join(", ")}
                      </span>
                    </td>

                    <td className="py-4 px-2 text-center">
                      {product.verified_by === "" ? (
                        <span className="text-yellow-500 font-semibold">
                          Đang chờ duyệt
                        </span>
                      ) : product.is_approved === true &&
                        product.rejected_note === "" ? (
                        <span className="text-green-500 font-semibold">
                          Đã duyệt bởi{" "}
                          <span className="text-xs text-gray-500 font-normal">
                            {product.verified_by}
                          </span>
                        </span>
                      ) : (
                        product.rejected_note !== "" && (
                          <span className="text-red-500 font-semibold">
                            Từ chối bởi{" "}
                            <span className="text-xs text-gray-500 font-normal">
                              {product.verified_by}
                            </span>
                          </span>
                        )
                      )}
                    </td>

                    <td className="py-4 px-2 text-center relative">
                      <div className="menu-container">
                        <div
                          className="p-2 rounded-full hover:text-[#1E4DB7] hover:bg-[#E7ECF7] cursor-pointer inline-flex items-center justify-center"
                          onClick={() => toggleMenu(product.product_id)}
                        >
                          <MdMoreHoriz className="text-xl" />
                        </div>

                        {menuOpen === product.product_id && (
                          <div className="absolute right-0 bg-white border rounded-lg shadow-lg z-10 w-32 items-center">
                            <button
                              className="flex items-center gap-1 w-full px-4 py-2 text-sm hover:bg-gray-100 space-x-1"
                              onClick={() => {
                                router.push(
                                  `/san-pham/them-san-pham-don?chi-tiet=${product.product_id}`
                                );
                              }}
                            >
                              <FiEye className="text-base" />
                              <span>Chi tiết</span>
                            </button>

                            <button
                              className="flex items-center gap-1 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-500 space-x-1"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsOpenDialog(true);
                              }}
                            >
                              <ImBin className="text-sm" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}
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
      <div className="flex items-center justify-between ">
        <span className="text-sm text-gray-700">
          Hiện có {totalProductAdmin} sản phẩm
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Hiển thị {firstIndex} đến{" "}
            {lastIndex} trong số{" "}
            {totalProductAdmin} sản phẩm
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
          disabled={currentPage === totalPages}
          className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
        >
          <MdNavigateNext className="text-xl" />
        </button>
      </div>
      <div>
        <DeleteProductDialog
          onClose={() => setIsOpenDialog(false)}
          onDelete={() => {
            deleteProduct(
              selectedProduct.product_id,
              (message) => {
                toast.showToast(message, "success");
                getAllProductsAdmin(() => {}, () => {});
                setIsOpenDialog(false);
                setSelectedProduct(null);
              },
              (message) => {
                toast.showToast(message, "error");
              }
            );
          }}
          isOpen={isOpenDialog}
        />
      </div>
    </>
  );
};

export default TableProduct;
