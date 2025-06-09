import { useEffect, useRef, useState } from "react";
import { IoMdArrowDown } from "react-icons/io";
import Link from "next/link";
import ManagerImport from "./managerImport";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";
import { X } from "lucide-react";
import { RiFileExcel2Fill } from "react-icons/ri";

const BulkCreateProduct = () => {
  const {
    fetchImportAddFileProduct,
    allFileImport,
    totalFileImport,
    fetchGetImportFileAddProduct,
    page,
    setPage,
    pageSize,
    setPageSize
  } = useProduct();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadFile = () => {
    if (!selectedFile) {
      toast.showToast("Vui lòng chọn file Excel trước khi upload!", "error");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetchImportAddFileProduct(
      formData,
      () => {
        setIsLoading(false);
        toast.showToast("Import file thành công", "success");
        handleCloseDialog();
        fetchGetImportFileAddProduct(
          () => {},
          () => {}
        );
      },
      (message: any) => {
        setIsLoading(false);
        toast.showToast(message, "error");
      }
    );
  };

  useEffect(() => {
    fetchGetImportFileAddProduct(() => {}, () => {});
  }, [page, pageSize]);

  return (
    <div className="">
      <h2 className="text-2xl font-extrabold text-black mb-4">
        Thêm danh sách sản phẩm
      </h2>

      <div className="mb-6 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/san-pham" className="text-gray-800">
          Sản phẩm
        </Link>
         <span> / </span>
        <Link href="/san-pham/them-san-pham-hang-loat" className="text-gray-800">
          Thêm danh sách sản phẩm
        </Link>
      </div>

      <div className="flex justify-between items-center gap-4 mb-6">
        {/* Dòng chữ bên trái */}
        <p className="text-sm text-gray-600">
          Tổng số sản phẩm đã import: <span className="font-semibold">{totalFileImport}</span>
        </p>

        {/* Nhóm nút bên phải */}
        <div className="flex gap-4">
          {/* Nút chọn file mẫu */}
          <button
            className="text-sm flex items-center gap-1 px-2 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
            onClick={handleOpenDialog}
          >
            <RiFileExcel2Fill className="text-lg" /> Chọn file Excel
          </button>

          {/* Nút tải mẫu */}
          <a
            href="/templates/template_import_products.xlsx"
            download
            className="flex items-center gap-2 px-2 py-2 border border-[#1E4DB7] text-[#1E4DB7] rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            <IoMdArrowDown /> Tải mẫu Excel
          </a>

        </div>

        {/* Input file ẩn */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>


      {/* Quản lý file import */}
      <ManagerImport
        allFileImport={allFileImport}
        currentPage={page}
        pageSize={pageSize}
        totalFileImport={totalFileImport}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Dialog Upload */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
              onClick={handleCloseDialog}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Upload file</h3>

            {/* Drag and Drop Area */}
            <div
              onDrop={handleDropFile}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-400 transition mb-6"
              onClick={handleChooseFile}
            >
              <div className="text-4xl mb-2">📄</div>
              <div>
                Kéo và thả tập tin ở đây hoặc{" "}
                <span className="text-blue-600 underline">Chọn file</span>
              </div>
              <div className="text-xs mt-2">
                Định dạng được hỗ trợ: .XLS, .XLSX (Tối đa 25MB)
              </div>
            </div>

            {/* Hiển thị file đã chọn */}
            {selectedFile && (
              <div className="text-sm text-gray-700 mb-4 flex items-center">
                <RiFileExcel2Fill className="mr-1" />{" "}
                <div className="mr-1">Đã chọn:</div> {selectedFile.name}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 text-sm">
              <button
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                onClick={handleCloseDialog}
              >
                Hủy
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  selectedFile && !isLoading
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-white cursor-not-allowed"
                } transition`}
                onClick={handleUploadFile}
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Đang tải...
                  </>
                ) : (
                  "Tiếp tục"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkCreateProduct;
