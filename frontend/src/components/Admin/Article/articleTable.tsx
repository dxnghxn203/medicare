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
import { useArticle } from "@/hooks/useArticle";
interface TableBrandProps {
  allArticleAdmin: any[];
}

const TableArticle = ({ allArticleAdmin }: TableBrandProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenUpdateBrand, setIsOpenUpdateBrand] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const router = useRouter();
  const {
    getAllArticlesAdmin,
    fetchDeleteArticleAdmin,
    fetchAllArticlesAdmin,
  } = useArticle();

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toast = useToast();
  const productsPerPage = 10;

  useEffect(() => {
    fetchAllArticlesAdmin(
      () => {},
      () => {}
    );
  }, []);
  const onDelete = () => {
    fetchDeleteArticleAdmin(
      selectedBrand.article_id,
      () => {
        toast.showToast("Xóa bài viết thành công", "success");
        fetchAllArticlesAdmin(
          () => {},
          () => {}
        );
        setIsOpenDialog(false);
      },
      () => {
        toast.showToast("Xóa bài viết thất bại", "error");
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
  const totalBrands = allArticleAdmin ? allArticleAdmin.length : 0;
  const indexOfLastBrand = currentPage * productsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - productsPerPage;
  const currentArticle = allArticleAdmin?.slice(
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
                <th className="py-4 text-center whitespace-nowrap">
                  Mã bài viết
                </th>
                <th className="py-4 text-center whitespace-nowrap">Tiêu đề</th>
                <th className="py-4 text-center whitespace-nowrap">
                  Tên danh mục
                </th>
                <th className="py-4 text-center whitespace-nowrap">Tag</th>
                <th className="py-4 text-center whitespace-nowrap"></th>
              </tr>
            </thead>

            <tbody>
              {currentArticle && currentArticle.length > 0 ? (
                currentArticle.map((article: any, index: number) => (
                  <tr
                    key={article.article_id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== currentArticle.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="p-4 text-center">{article.article_id}</td>

                    <td className="py-4 text-center items-center justify-center">
                      <div className="mt-1">
                        <div
                          className="mt-1 line-clamp-2 overflow-hidden"
                          dangerouslySetInnerHTML={{
                            __html: article.title,
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-4 text-center items-center justify-center">
                      <div className="mt-1">{article.category}</div>
                    </td>

                    <td className="py-4 text-center items-center justify-center">
                      <div className="mt-1 flex flex-wrap justify-center gap-1 max-w-[200px] mx-auto">
                        {article.tags.length > 0 &&
                          (() => {
                            try {
                              const parsedTags = JSON.parse(article.tags[0]);

                              if (Array.isArray(parsedTags)) {
                                return parsedTags.map(
                                  (tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full truncate max-w-[120px] inline-block"
                                      title={tag.trim()}
                                    >
                                      {tag.trim()}
                                    </span>
                                  )
                                );
                              } else {
                                return <span>{article.tags[0]}</span>;
                              }
                            } catch (e) {
                              // Nếu không phải JSON, hiển thị thô
                              return (
                                <span
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full truncate max-w-[120px] inline-block"
                                  title={article.tags[0]}
                                >
                                  {article.tags[0]}
                                </span>
                              );
                            }
                          })()}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          className="text-blue-800 font-medium flex items-center space-x-2 "
                          onClick={() => {
                            router.push(
                              `/quan-ly-bai-viet/cap-nhat-bai-viet?id=${article.article_id}`
                            );
                          }}
                        >
                          <MdModeEdit className="text-blue-800 mr-1" />
                          Sửa
                        </button>
                        <button
                          className="text-red-600 font-medium flex items-center space-x-2 "
                          onClick={() => {
                            setIsOpenDialog(true);
                            setSelectedBrand(article);
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
                    Không có bài viết nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <span className="text-sm text-gray-700">
          Hiện có {totalBrands} bài viết
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Hiển thị {indexOfFirstBrand + 1} đến{" "}
            {Math.min(indexOfLastBrand, totalBrands)} trong số {totalBrands} bài
            viết
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
        {/* <AddBrandDialog
          isOpen={isOpenUpdateBrand}
          setIsOpen={setIsOpenUpdateBrand}
          allArticleAdmin={getAllBrandsAdmin}
          selectedBrand={selectedBrand}
          mode="edit"
        /> */}
      </div>
    </>
  );
};

export default TableArticle;
