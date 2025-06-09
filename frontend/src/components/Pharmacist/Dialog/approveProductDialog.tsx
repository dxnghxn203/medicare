import React, { useState } from "react";
import { X } from "lucide-react";
import DOMPurify from "dompurify";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/providers/toastProvider";
import { validateEmptyFields } from "@/utils/validation";

const SafeHtmlDisplay = ({ htmlContent }: { htmlContent: string }) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent); // Lọc HTML an toàn

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanHtml }} // Render nội dung HTML an toàn
    />
  );
};
interface ApproveProductDialogProps {
  productSelected: any;
  isOpen: boolean;
  onClose: () => void;
  pagination: any;
  filters: any;
  handleFetchProductApproved: (data: any) => void;
}

const ApproveProductDialog: React.FC<ApproveProductDialogProps> = ({
  productSelected,
  isOpen,
  onClose,
  pagination,
  filters,
  handleFetchProductApproved,
}) => {
  if (!isOpen) return null;
  //   console.log("productSelected", productSelected);
  const { fetchApproveProductByPharmacist } =
    useProduct();
  const [rejectedNote, setRejectedNote] = useState("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const toast = useToast();

  const buildFetchPayload = () => ({
    page: pagination.page,
    pageSize: pagination.pageSize,
    keyword: filters.searchTerm,
    mainCategory: filters.categoryFilter,
    prescriptionRequired: filters.prescriptionFilter === "" ? null : filters.prescriptionFilter === "true",
    status: filters.statusFilter,
  });


  const handleReject = () => {
    const emptyFieldErrors = validateEmptyFields({
      rejected_note: rejectedNote,
    });

    const formErrors: { [key: string]: string } = { ...emptyFieldErrors };
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      product_id: productSelected.product_id,
      rejected_note: rejectedNote,
      is_approved: false,
    };


    fetchApproveProductByPharmacist(
      payload,
      (message) => {
        toast.showToast(message, "success");
        handleFetchProductApproved(buildFetchPayload());
        setRejectedNote("");
        setErrors({});
        onClose();
      },
      (message) => {
        toast.showToast(message, "error");
        onClose();
      }
    );
  };

  const handleApprove = () => {
    fetchApproveProductByPharmacist(
      {
        product_id: productSelected.product_id,
        rejected_note: "",
        is_approved: true,
      },
      (message) => {
        toast.showToast(message, "success");
        handleFetchProductApproved(buildFetchPayload());
        setRejectedNote("");
        onClose();
      },
      (message) => {
        toast.showToast(message, "error");
        onClose();
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen overflow-y-auto">
      <div className="bg-white rounded-lg w-[80%] mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {productSelected?.verified_by === ""
              ? "Duyệt sản phẩm"
              : "Thông tin sản phẩm"}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[450px] overflow-y-auto">
          <div className="flex gap-10 p-8 bg-white rounded-xl ">
            {/* Left Section: Product Info */}
            <div className="w-2/3 text-sm text-gray-700 space-y-2">
              {[
                ["Product ID:", productSelected?.product_id],

                ["Tên sản phẩm:", productSelected?.name_primary],
                ["Slug:", productSelected?.slug],

                ["Kho:", productSelected?.inventory],
                ["Thương hiệu:", productSelected?.brand],
                ["Dạng bào chế:", productSelected?.dosage_form],
                ["Nguồn gốc:", productSelected?.origin],
                [
                  "Nhà sản xuất :",
                  productSelected?.manufacturer?.manufacture_name,
                ],
                [
                  "Địa chỉ sản xuất:",
                  productSelected?.manufacturer?.manufacture_address,
                ],
              ].map(([label, value], index) => (
                <div key={index} className="grid grid-cols-[150px_1fr]">
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
              <div className="grid grid-cols-[150px_1fr]">
                <strong>Thuốc kê toa:</strong>
                <span
                  className={
                    productSelected?.prescription
                      ? "text-red-600 font-medium"
                      : "text-gray-700"
                  }
                >
                  {productSelected?.prescription ? "Có" : "Không"}
                </span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <strong>Trạng thái:</strong>
                <span
                  className={`px-3 py-1 rounded-full w-fit ${
                    productSelected.verified_by === ""
                      ? "bg-yellow-100 text-yellow-700"
                      : productSelected.is_approved === true
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {productSelected.verified_by === ""
                    ? "Đang chờ"
                    : productSelected.is_approved === true
                    ? "Đã duyệt"
                    : "Từ chối"}
                </span>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start gap-y-2">
                <strong>Giá:</strong>
                <div className="flex flex-col gap-2">
                  {productSelected?.prices?.map((item: any) => (
                    <div
                      key={item.price_id}
                      className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex justify-between items-center"
                    >
                      <div className="space-x-2">
                        <span>
                          <strong>{item.unit}</strong> –{" "}
                          {item.price.toLocaleString()}₫
                        </span>
                        <span>Giảm giá:{item.discount}%</span>
                      </div>

                      <span className="text-xs text-gray-500">
                        {item.weight} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-start gap-y-2">
                <strong>Danh mục:</strong>
                <div className="flex flex-wrap gap-2 items-center">
                  {productSelected?.category?.main_category_name && (
                    <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
                      {productSelected.category.main_category_name}
                    </span>
                  )}
                  {productSelected?.category?.sub_category_name && (
                    <span className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                      {productSelected.category.sub_category_name}
                    </span>
                  )}
                  {productSelected?.category?.child_category_name && (
                    <span className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm font-medium">
                      {productSelected.category.child_category_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-start">
                <strong>Mô tả ngắn:</strong>
                <p className="text-gray-600">{productSelected?.description}</p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start">
                <strong>Mô tả đầy đủ:</strong>
                <p className="text-gray-600">
                  <SafeHtmlDisplay
                    htmlContent={productSelected?.full_descriptions}
                  />
                </p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start">
                <strong>Liều lượng:</strong>
                <p className="text-gray-600">
                  <SafeHtmlDisplay htmlContent={productSelected?.dosage} />
                </p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start">
                <strong>Công dụng:</strong>
                <p className="text-gray-600">
                  <SafeHtmlDisplay htmlContent={productSelected?.uses} />
                </p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start">
                <strong>Tác dụng phụ:</strong>
                <p className="text-gray-600">
                  <SafeHtmlDisplay
                    htmlContent={productSelected?.side_effects}
                  />
                </p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start">
                <strong>Lưu ý:</strong>
                <p className="text-gray-600">
                  <SafeHtmlDisplay htmlContent={productSelected?.precautions} />
                </p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start">
                <strong>Bảo quản:</strong>

                <p className="text-gray-600">
                  {" "}
                  <SafeHtmlDisplay htmlContent={productSelected?.storage} />
                </p>
              </div>
              {productSelected?.verified_by === "" ? (
                <div>
                  <strong>Lý do:</strong>
                  <textarea
                    rows={5}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-4"
                    placeholder="Ghi lý do nếu từ chối duyệt"
                    value={rejectedNote}
                    onChange={(e: any) => setRejectedNote(e.target.value)}
                  ></textarea>
                  {errors.rejected_note && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.rejected_note}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <strong>Lý do:</strong>
                  <textarea
                    rows={5}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-4 bg-gray-100 text-gray-700"
                    value={rejectedNote}
                    readOnly
                  ></textarea>
                </div>
              )}
            </div>

            {/* Right Section: Upload Image */}
            <div className="w-1/3 flex flex-col items-center">
              <h3 className="text-sm font-semibold mb-2 self-start">
                Hình ảnh
              </h3>

              <div className="border p-2 rounded-lg w-full flex justify-center">
                <img
                  src={productSelected?.images_primary}
                  alt="Main"
                  className="h-56 object-contain rounded-md"
                />
              </div>

              <div className="flex flex-wrap mt-2 gap-3 w-full">
                {Array.isArray(productSelected?.images) &&
                  productSelected.images.map((img: any, idx: number) => (
                    <img
                      key={idx}
                      src={img.images_url}
                      alt={`img-${idx}`}
                      className="object-contain rounded-lg border p-1 h-[84x] w-[84px]"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {productSelected?.verified_by === "" && (
          <div className="px-6 py-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:scale-105 transition text-sm"
            >
              Duyệt
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 bg-red-100 text-red-800 font-medium rounded-lg hover:bg-red-500 hover:scale-105 transition text-sm"
            >
              Từ chối
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveProductDialog;
