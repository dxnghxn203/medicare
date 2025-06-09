"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { IoFilter, IoImage } from "react-icons/io5";
import FilterBar from "./filterBar";
import { useProduct } from "@/hooks/useProduct";
import {
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import ApproveProductDialog from "../Dialog/approveProductDialog";
import { FiEye } from "react-icons/fi";
import { LuBadgeCheck } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useCategory } from "@/hooks/useCategory";

const MedicineCensorshipList = () => {
  const { productApproved, totalProductApproved, fetchProductApproved } = useProduct();
  const { fetchAllCategory, allCategory } = useCategory();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filters, setFilters] = useState({
    searchTerm: "",
    categoryFilter: "",
    prescriptionFilter: "",
    statusFilter: "",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const totalPages = Math.ceil(totalProductApproved / pagination.pageSize);
  const currentPageData = (pagination.page - 1) * pagination.pageSize;
  const firstIndex = currentPageData + 1;
  const lastIndex = Math.min(currentPageData + pagination.pageSize, totalProductApproved);

  const [selectedProductApproved, setSelectedProductApproved] =
    useState<any>(null);
  const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAllCategory();
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleFetchProductApproved = (data: any) => {
    fetchProductApproved(data);
  };

  useEffect(() => {
    console.log("filters", filters);
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.searchTerm,
      mainCategory: filters.categoryFilter,
      prescriptionRequired: filters.prescriptionFilter === "" ? null : filters.prescriptionFilter === "true",
      status: filters.statusFilter
    };
    handleFetchProductApproved(data);
  }, [pagination, filters]);

  useEffect(() => {
    const updatedFilters: string[] = [];

    if (filters.searchTerm) {
      updatedFilters.push(`Tìm kiếm: "${filters.searchTerm}"`);
    }

    if (filters.categoryFilter) {
      const categoryName = allCategory.find(
        (cat: any) => cat.main_category_id === filters.categoryFilter
      )?.main_category_name;
      if (categoryName) {
        updatedFilters.push(`Danh mục: ${categoryName}`);
      }
    }

    if (filters.prescriptionFilter) {
      updatedFilters.push(
        `Thuốc kê toa: ${filters.prescriptionFilter === "true" ? "Có" : "Không"}`
      );
    }

    if (filters.statusFilter) {
      filters.statusFilter === "approved" ? updatedFilters.push(`Trang thái: Đã duyệt`) : updatedFilters.push(`Trang thái: Đang chờ`);
      
    }

    setActiveFilters(updatedFilters);
  }, [filters]);


  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPagination({ page: 1, pageSize: newSize });
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = () => {
    handleFilterChange({ searchTerm: searchInput });
  };

  const clearFilter = (filterLabel: string) => {
    if (filterLabel.startsWith("Tìm kiếm:")) {
      handleFilterChange({ searchTerm: "" });
      setSearchInput("");
    }
    if (filterLabel.startsWith("Danh mục:")) {
      handleFilterChange({ categoryFilter: "" });
    } else if (filterLabel.startsWith("Thuốc kê toa:")) {
      handleFilterChange({ prescriptionFilter: "" });
    } else if (filterLabel.startsWith("Trang thái:")) {
      handleFilterChange({ statusFilter: "" });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: "",
      categoryFilter: "",
      prescriptionFilter: "",
      statusFilter: "",
    });
    setSearchInput("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">
          Danh sách kiểm duyệt thuốc
        </h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/kiem-duyet-thuoc" className="text-gray-800">
            Danh sách kiểm duyệt thuốc
          </Link>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <button
              className="justify-start border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
              onClick={() => setShowFilter(!showFilter)}
            >
              <IoFilter className="text-lg" />
              Bộ lọc
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo tên sản phẩm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-full md:w-60 pr-10"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1E4DB7]"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-lg py-1 px-2 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(activeFilters.length > 0 || filters.searchTerm) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>

            {activeFilters.map((filter, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <span>{filter}</span>
                <button
                  onClick={() => clearFilter(filter)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {showFilter &&
          <FilterBar 
            onFilterChange={handleFilterChange} 
            allCategory={allCategory}
          />
        }

        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
                <tr className="uppercase text-sm">
                  <th className="py-3 px-2 text-center w-[130px]">Hình ảnh</th>
                  <th className="py-3 px-2 ">Tên sản phẩm</th>
                  <th className="py-3 px-2 text-center">
                    Mã sản phẩm/ danh mục
                  </th>
                  <th className="py-3 px-4 text-center">Thuốc kê toa</th>
                  <th className="py-3 px-6 text-center">Trạng thái</th>
                  <th className="py-3 px-2 text-center"></th>
                </tr>
              </thead>

              <tbody>
                {productApproved && totalProductApproved > 0 ? (
                  productApproved.map((product: any, index: number) => (
                    <tr
                      key={product.product_id}
                      className={`text-sm hover:bg-gray-50 transition ${
                        index !== totalProductApproved - 1
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
                      <td className="py-4 px-2 text-center">
                        <span className="">
                          {product?.prescription_required ? "Có" : "Không"}
                        </span>
                      </td>

                      <td className="py-4 px-2 text-center w-fit">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            product.verified_by === ""
                              ? "bg-yellow-100 text-yellow-700"
                              : product.is_approved === true
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.verified_by === ""
                            ? "Đang chờ"
                            : product.is_approved === true
                            ? "Đã duyệt"
                            : "Từ chối"}
                        </span>
                      </td>

                      <td className="py-4 px-2 text-center relative w-[120px]">
                        {product.verified_by !== "" ? (
                          <button
                            className="px-3 py-2 font-medium flex items-center gap-1 text-sm text-gray-500"
                            onClick={() => {
                              setDialogOpen(true);
                              setSelectedProductApproved(product);
                            }}
                          >
                            <FiEye className="text-gray-500 text-lg" />
                            Chi tiết
                          </button>
                        ) : (
                          <button
                            className="underline px-3 py-2 text-blue-600 font-medium rounded-lg  flex items-center gap-2 text-sm"
                            onClick={() => {
                              setDialogOpen(true);
                              setSelectedProductApproved(product);
                            }}
                          >
                            <LuBadgeCheck className="text-blue-600 text-lg" />
                            Duyệt
                          </button>
                        )}
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

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          <div className="text-sm text-gray-600">
            Hiển thị {firstIndex}{" "}
            - {lastIndex} trong tổng
            số {totalProductApproved} sản phẩm
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
            >
              <MdNavigateBefore className="text-xl" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= pagination.page - 1 &&
                  pageNumber <= pagination.page + 1) ||
                (pagination.page <= 3 && pageNumber <= 5) ||
                (pagination.page >= totalPages - 2 && pageNumber >= totalPages - 4)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                      pagination.page === pageNumber
                        ? "bg-blue-700 text-white"
                        : "text-black hover:bg-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }

              if (
                (pageNumber === pagination.page - 2 && pagination.page > 4) ||
                (pageNumber === pagination.page + 2 && pagination.page < totalPages - 3)
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
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
            >
              <MdNavigateNext className="text-xl" />
            </button>
          </div>
        </div>
      </div>
      {isDialogOpen && selectedProductApproved && (
        <ApproveProductDialog
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          productSelected={selectedProductApproved}
          pagination={pagination}
          filters={filters}
          handleFetchProductApproved={handleFetchProductApproved}
        />
      )}
    </div>
  );
};

export default MedicineCensorshipList;
