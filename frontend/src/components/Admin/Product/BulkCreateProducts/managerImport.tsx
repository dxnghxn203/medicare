import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";
import { ImBin } from "react-icons/im";
import DeleteProductDialog from "../../Dialog/confirmDeleteProductDialog";

interface ManagerImportProps {
  allFileImport: any;
  currentPage: number;
  pageSize: number;
  totalFileImport: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const ManagerImport = ({
    allFileImport,
    currentPage,
    pageSize,
    totalFileImport,
    onPageChange,
    onPageSizeChange
}: ManagerImportProps) => {
  const {
    fetchGetImportFileAddProduct,
    fetchDeleteImportFileProduct,

  } = useProduct();
  const toast = useToast();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const totalPages = Math.ceil(totalFileImport / pageSize);

  return (
    <>
      {allFileImport && totalFileImport > 0 ? (
        <>
        <div className="mt-4 bg-white shadow-sm rounded-2xl overflow-hidden">
          <table className="divide-y divide-gray-200 w-full">
            {/* Header */}
            <thead className="text-[#1E4DB7] text-sm font-bold bg-[#F0F3FD]">
              <tr className="">
                <th className="px-4 py-4  uppercase tracking-wider text-center">
                  STT
                </th>

                <th className="px-4 py-4  uppercase tracking-wider text-center">
                  Mã Import
                </th>

                <th className="px-4 py-4  uppercase tracking-wider text-center">
                  File URL
                </th>

                <th className="px-4 py-4 uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-4 py-4 uppercase tracking-wider text-center"></th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {allFileImport.map((file: any, indexa: any) => (
                <tr
                  key={file.import_id} // Thêm key tránh lỗi React
                  className={`text-sm text-left hover:bg-gray-50 transition ${
                    file !== allFileImport.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <td className="px-4 py-4">{indexa + 1}</td>
                  <td className="px-4 py-4">{file.import_id}</td>
                  <td className="px-2 py-4">{file.file_url}</td>
                  <td className="px-2 py-4">
                    <td className="px-4">
                      {Array.isArray(file.error_message) ? (
                        file.error_message.map((msg: string, i: number) =>
                          msg.split("\n").map((line, j) => (
                            <div
                              key={`${i}-${j}`}
                              className="text-red-600 font-semibold"
                            >
                              {line}
                            </div>
                          ))
                        )
                      ) : (
                        <div className="text-green-700 bg-green-100 py-1 px-2 rounded-full">
                          Thành công
                        </div>
                      )}
                    </td>
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => {
                        setSelectedProduct(file);
                        setIsOpenDialog(true);
                      }}
                      className=" text-red-700 py-1 px-4 rounded-full"
                    >
                      <ImBin className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-center space-x-2 py-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
            >
              <MdNavigateBefore className="text-xl" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => {
              const page = idx + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      currentPage === page
                        ? "bg-blue-700 text-white"
                        : "text-black hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <span key={page} className="px-2 text-gray-500">
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
          <DeleteProductDialog
            onClose={() => setIsOpenDialog(false)}
            onDelete={() => {
              fetchDeleteImportFileProduct(
                selectedProduct.import_id,
                (message: any) => {
                  toast.showToast(message, "success");
                  setIsOpenDialog(false);
                  fetchGetImportFileAddProduct(
                    () => {},
                    () => {}
                  );
                },
                (message: any) => {
                  toast.showToast(message, "error");
                }
              );
            }}
            isOpen={isOpenDialog}
          />
        </div>
        </>
     ): (
        <div className="flex justify-center items-center py-10 text-gray-500">
          Không tìm thấy đơn hàng nào
        </div>
      )}
    </>
  );
};

export default ManagerImport;
