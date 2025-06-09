import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: { images_url: string }[];
  images_primary: string;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onClose,
  images,
  selectedImage,
  setSelectedImage,
  images_primary,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const allImages = [{ images_url: images_primary }, ...images];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
        {/* Nút đóng */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Ảnh chính */}
        <div className="relative flex justify-center items-center">
          {/* Nút Previous */}
          {selectedImage > 0 && (
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
              onClick={() => {
                setSelectedImage(
                  (selectedImage - 1 + allImages.length) % allImages.length
                );
                setZoomLevel(1); // Reset zoom khi đổi ảnh
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div className="relative flex justify-center items-center">
            <Image
              src={allImages[selectedImage]?.images_url}
              alt=""
              width={300}
              height={300}
              className="object-contain cursor-pointer transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                height: `${300 * zoomLevel}px`, // Cập nhật chiều cao theo mức zoom
              }}
              priority
            />
          </div>

          {/* Nút Next */}
          {selectedImage < allImages.length - 1 && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
              onClick={() => {
                setSelectedImage((selectedImage + 1) % allImages.length);
                setZoomLevel(1); // Reset zoom khi đổi ảnh
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="mb-8 absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          <button
            className="bg-black/30 p-2 rounded-full shadow-md text-white "
            onClick={() =>
              setZoomLevel((prev) => (prev > 1 ? prev - 0.5 : prev))
            }
          >
            <FiZoomOut size={20} />
          </button>
          <button
            className="bg-black/30 p-2 rounded-full shadow-md text-white"
            onClick={() =>
              setZoomLevel((prev) => (prev < 4 ? prev + 0.5 : prev))
            }
          >
            <FiZoomIn size={20} />
          </button>
        </div>

        {/* Danh sách ảnh phụ (Ẩn khi zoom > 1) */}
        {zoomLevel === 1 && (
          <div className="flex w-full justify-center mt-16 gap-2 flex-wrap">
            {allImages?.map((img, index) => (
              <div
                key={index}
                className={`w-24 h-24 p-2 rounded-lg overflow-hidden border flex items-center justify-center cursor-pointer ${
                  selectedImage === index
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={img.images_url}
                  alt={`Ảnh ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDialog;
