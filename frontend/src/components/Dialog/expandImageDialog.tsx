import React, { useState } from "react";
import { X } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface ExpandImageDialogProps {
  // images: StaticImageData[]; // Danh sách ảnh
  onClose: () => void; // Hàm đóng dialog
}

const ExpandImageDialog: React.FC<ExpandImageDialogProps> = ({
  // images,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<StaticImageData>();
  // images[0] // Ảnh chính

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <X size={24} />
        </button>
        {/* Ảnh chính */}
        <div className="flex justify-center">
          {/* <Image
            // src={selectedImage}
            alt="Main image"
            className="w-full max-h-[400px] object-contain"
          /> */}
        </div>
        Danh sách ảnh nhỏ
        {/* <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className="focus:outline-none"
            >
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-md border-2 ${
                  selectedImage === img
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              />
            </button>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ExpandImageDialog;
