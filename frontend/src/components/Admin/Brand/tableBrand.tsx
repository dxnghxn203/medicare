"use client";

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
import DeleteProductDialog from "../Dialog/confirmDeleteProductDialog";
import { useBrand } from "@/hooks/useBrand";
import { FaRegTrashAlt } from "react-icons/fa";
import AddBrandDialog from "../Dialog/addBrandDialog";
interface TableBrandProps {
  allBrandAdmin: any[];
}

const TableBrand = ({ allBrandAdmin }: TableBrandProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenUpdateBrand, setIsOpenUpdateBrand] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const router = useRouter();
  const { getAllBrandsAdmin, fetchAllBrandsAdmin, fetchDeleteBrandAdmin } =
    useBrand();

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toast = useToast();
  const productsPerPage = 10;

  useEffect(() => {
    fetchAllBrandsAdmin(
      () => {},
      () => {}
    );
  }, []);
  const onDelete = () => {
    fetchDeleteBrandAdmin(
      selectedBrand.brand_id,
      () => {
        toast.showToast("Xóa thương hiệu thành công", "success");
        fetchAllBrandsAdmin(
          () => {},
          () => {}
        );
        setIsOpenDialog(false);
      },
      () => {
        toast.showToast("Xóa thương hiệu thất bại", "error");
      }
    );
  };
  // const handleToggleStatus = (voucher: any) => {
  //   const newStatus = !voucher.active;
  //   fetchUpdateStatusBrand(
  //     { voucher_id: voucher.voucher_id, status_voucher: newStatus },
  //     () => {
  //       toast.showToast("Cập nhật trạng thái thành công", "success");
  //       fetchAllBrands(
  //         1,
  //         100,
  //         () => {},
  //         () => {}
  //       );
  //     },
  //     () => {
  //       toast.showToast("Cập nhật trạng thái tphcm", "error");
  //     }
  //   );
  // };

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

  // Phân trang
  const totalBrands = allBrandAdmin ? allBrandAdmin.length : 0;
  const indexOfLastBrand = currentPage * productsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - productsPerPage;
  const currentBrands = allBrandAdmin?.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );
  const totalPages = Math.ceil(totalBrands / productsPerPage);

  return (
    <>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
              <tr className="uppercase text-sm">
                <th className="py-4 text-center">Mã thương hiệu</th>
                <th className="py-4 text-center">Logo</th>
                <th className="py-4 text-center">Tên thương hiệu</th>
                <th className="py-4 text-center">Mô tả</th>

                <th className="py-4 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {currentBrands && currentBrands.length > 0 ? (
                currentBrands.map((brand: any, index: number) => (
                  <tr
                    key={brand.product_id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== currentBrands.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="py-4 text-center">{brand.brand_id}</td>
                    <td className="py-4 text-center leading-5">
                      <div className="flex items-center justify-center p-2">
                        <Image
                          src={brand.logo}
                          alt="Logo"
                          width={100}
                          height={100}
                          className="rounded-full object-cover p-4"
                        />
                      </div>
                    </td>
                    <td className="py-4 text-center items-center justify-center">
                      <div className="mt-1">{brand.name}</div>
                    </td>
                    <td className="py-4 text-left items-center justify-center climb-1 w-[200px]">
                      <div
                        className="mt-1 line-clamp-2 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                        dangerouslySetInnerHTML={{ __html: brand.description }}
                      />
                    </td>

                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          className="text-blue-800 font-medium flex items-center space-x-2 "
                          onClick={() => {
                            setIsOpenUpdateBrand(true);
                            setSelectedBrand(brand);
                          }}
                        >
                          <MdModeEdit className="text-blue-800 mr-1" />
                          Sửa
                        </button>
                        <button
                          className="text-red-600 font-medium flex items-center space-x-2 "
                          onClick={() => {
                            setIsOpenDialog(true);
                            setSelectedBrand(brand);
                          }}
                        >
                          <FaRegTrashAlt className="text-red-600 mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    Không có thương hiệu nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <span className="text-sm text-gray-700">
          Hiện có {totalBrands} thương hiệu
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Hiển thị {indexOfFirstBrand + 1} đến{" "}
            {Math.min(indexOfLastBrand, totalBrands)} trong số {totalBrands}{" "}
            thương hiệu
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
        <DeleteProductDialog
          isOpen={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
          onDelete={onDelete}
        />
        <AddBrandDialog
          isOpen={isOpenUpdateBrand}
          setIsOpen={setIsOpenUpdateBrand}
          allBrandAdmin={getAllBrandsAdmin}
          selectedBrand={selectedBrand}
          mode="edit"
        />
      </div>
    </>
  );
};

export default TableBrand;
