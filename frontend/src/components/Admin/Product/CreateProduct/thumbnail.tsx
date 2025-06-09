import { useState, useCallback } from "react";
import Link from "next/link";
import TipTapEditor from "../../TextEditer.tsx/textEditer";
import { PlusCircle, Trash2, Plus } from "lucide-react";
import { LuTrash2 } from "react-icons/lu";
import { useDropzone } from "react-dropzone";

const Thumbnail = () => {
  interface Item {
    id: number;
    unit: string;
  }

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbnailImages, setThumbnailImages] = useState<File[]>([]); // Mảng chứa nhiều ảnh nhỏ

  const onDropMainImage = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setMainImage(acceptedFiles[0]);
    }
  }, []);

  const onDropThumbnailImages = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setThumbnailImages((prev) => [...prev, ...acceptedFiles]); // Thêm ảnh vào danh sách
    }
  }, []);

  const handleRemoveMainImage = () => setMainImage(null);
  const handleRemoveThumbnailImage = (index: number) => {
    setThumbnailImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps: getMainImageProps, getInputProps: getMainInputProps } =
    useDropzone({
      onDrop: onDropMainImage,
      accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
      multiple: false,
    });

  const {
    getRootProps: getThumbnailProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    onDrop: onDropThumbnailImages,
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
    multiple: true, // Cho phép chọn nhiều ảnh
  });

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 h-full space-y-2">
      <span>Thumbnail</span>
      {/* Upload ảnh lớn */}
      <div
        {...getMainImageProps()}
        className="bg-[#E7ECF7] w-full h-40 flex items-center justify-center rounded-xl border border-dashed border-[#1E4DB7] cursor-pointer overflow-hidden"
      >
        <input {...getMainInputProps()} accept="image/*" />
        {mainImage ? (
          <div className="relative w-full h-full">
            <img
              src={URL.createObjectURL(mainImage)}
              alt="Main Image"
              className="w-full h-full object-contain rounded-xl"
            />
            <button
              onClick={handleRemoveMainImage}
              type="button"
              className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            Click or drag & drop to download large photos
          </p>
        )}
      </div>

      {/* Upload ảnh nhỏ */}
      {/* Danh sách ảnh nhỏ */}
      <div className="grid grid-cols-4 gap-2">
        {thumbnailImages.map((image, index) => (
          <div
            key={index}
            className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#1E4DB7]"
          >
            <img
              src={URL.createObjectURL(image)}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemoveThumbnailImage(index)}
              type="button"
              className="absolute top-1 right-1 bg-red-500 p-1 rounded-full text-white"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {/* Thêm ảnh mới */}
        <div
          {...getThumbnailProps()}
          className="w-16 h-16 flex items-center justify-center bg-gray-200 border border-dashed border-[#1E4DB7] rounded-xl cursor-pointer"
        >
          <input {...getThumbnailInputProps()} accept="image/*" />
          <Plus size={24} className="text-gray-600" />
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image
        files are accepted.
      </p>
    </div>
  );
};

export default Thumbnail;
