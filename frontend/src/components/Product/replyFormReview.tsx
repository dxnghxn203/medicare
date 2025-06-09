import { useAuth } from "@/hooks/useAuth";
import { useReview } from "@/hooks/useReview";
import { useToast } from "@/providers/toastProvider";
import { useState } from "react";

const ReplyFormReview = ({
  review_id,
  user_name,
  product_id,
}: {
  review_id: string;
  user_name: string;
  product_id: any;
}) => {
  const { user } = useAuth();
  const { fetchInsertAnswerReview, fetchGetAllReview } = useReview();
  const toast = useToast();
  const [selected, setSelected] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReplyForm, setShowReplyForm] = useState(true);

  const hasError = (fieldName: string): boolean => {
    return formSubmitted && !!errors[fieldName];
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.includes("image")
      );

      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages);

      // Generate preview URLs
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreviewUrls((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages); // Cập nhật state images

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreviewUrls((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviewUrls];
    newPreviews.splice(index, 1);
    setImagePreviewUrls(newPreviews);
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const [formData, setFormData] = useState({
    review_id: review_id,
    comment: "",
    images: [],
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      setErrors({ comment: "Vui lòng nhập nội dung trả lời." });
      return;
    }

    try {
      const form = new FormData();
      form.append("review_id", formData.review_id);
      form.append("comment", formData.comment);
      images.forEach((file) => form.append("images", file)); // Gửi nhiều ảnh

      try {
        await fetchInsertAnswerReview({
          param: {
            ...formData,
            images: images,
          },
          onSuccess: (message: string) => {
            toast.showToast(message, "success");
            setFormData({
              review_id: review_id,
              comment: "",
              images: [],
            });
            setShowReplyForm(false);
            fetchGetAllReview(
              product_id,
              pageSize,
              selected,
              () => {},
              () => {}
            );
          },
          onFailure: (message: string) => {
            toast.showToast(message, "error");
          },
        });
      } catch (error) {
        console.error("Error during submission:", error);
      }
    } catch (error) {
      toast.showToast("Trả lời không thành công!", "error");
    }
  };

  return (
    <>
      {showReplyForm && (
        <div className="mt-3 flex items-start space-x-4 mx-12">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold mt-2">
            {getInitials(user?.user_name)}
          </div>
          <div className="flex-1 flex items-start space-x-6">
            <form
              onSubmit={onSubmit}
              className="flex-1 flex flex-col space-y-2"
            >
              <div className="flex-1 flex flex-col">
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      Đang trả lời:{" "}
                      <span className="font-semibold">{user_name}</span>
                    </p>
                    <input
                      type="text"
                      placeholder="Nhập nội dung trả lời..."
                      className="w-full px-3 py-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          comment: e.target.value,
                        });
                      }}
                      value={formData.comment}
                    />
                    {errors.comment && (
                      <div className="text-red-500 text-sm pt-1">
                        {errors.comment}
                      </div>
                    )}
                  </div>

                  {/* Button bên phải */}
                  <button
                    className="bg-[#0053E2] text-white px-6 py-4 rounded-full font-semibold hover:bg-blue-700 mt-6"
                    type="submit"
                  >
                    Gửi bình luận
                  </button>
                </div>
              </div>

              <div data-error={hasError("images")} className="w-[300px]">
                <label className="block text-sm font-medium mb-1 mt-4">
                  Thêm ảnh
                  <span className="text-blue-500">
                    (Được phép thêm nhiều ảnh)
                  </span>
                </label>

                <div
                  className={`mt-4 border-2 border-dashed rounded-lg p-2 transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="text-center py-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="flex flex-col items-center text-sm text-gray-600">
                      <p className="font-medium">
                        Kéo và thả hình ảnh ở đây, hoặc
                      </p>
                      <label className="mt-2 cursor-pointer text-blue-600 hover:text-blue-800">
                        <span>Bấm để chọn tệp</span>
                        <input
                          type="file"
                          name="images"
                          multiple
                          onChange={handleImagesChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Mỗi PNG, JPG, GIF lên đến 10mb
                    </p>
                  </div>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">
                        {images.length} image{images.length !== 1 ? "s" : ""}{" "}
                        selected
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setImages([]);
                          setImagePreviewUrls([]);
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="h-20 w-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReplyFormReview;
