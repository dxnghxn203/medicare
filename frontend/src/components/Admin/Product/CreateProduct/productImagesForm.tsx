"use client";

import {useState, useRef} from "react";
import {TbFileTypePdf} from "react-icons/tb";
import {BiSolidImageAdd} from "react-icons/bi";
import {ErrorMessage} from "./types";

interface ProductImagesFormProps {
    images: File[];
    primaryImage: File | null;
    imagePreviewUrls: string[];
    primaryImagePreview: string;
    certificateFile: File | null;
    certificatePreview: string;
    onImagesChange: (files: File[], previews: string[]) => void;
    onPrimaryImageChange: (file: File | null, preview: string) => void;
    onCertificateChange: (file: File | null, preview: string) => void;
    errors: Record<string, string>;
    hasError: (fieldName: string) => boolean;
    isViewOnly: boolean;
}

export const ProductImagesForm = ({
                                      images,
                                      primaryImage,
                                      imagePreviewUrls,
                                      primaryImagePreview,
                                      certificateFile,
                                      certificatePreview,
                                      onImagesChange,
                                      onPrimaryImageChange,
                                      onCertificateChange,
                                      errors,
                                      hasError,
                                      isViewOnly
                                  }: ProductImagesFormProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const primaryImageInputRef = useRef<HTMLInputElement | null>(null);
    const certificateInputRef = useRef<HTMLInputElement | null>(null);

    // Image handlers
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Add new files to existing images
            const fileArray = Array.from(e.target.files);
            const updatedImages = [...images, ...fileArray];

            // Generate preview URLs for new files
            const newPreviewPromises = fileArray.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === "string") {
                            resolve(reader.result);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newPreviewPromises).then(newPreviews => {
                const updatedPreviews = [...imagePreviewUrls, ...newPreviews];
                onImagesChange(updatedImages, updatedPreviews);
            });
        }
    };

    // Drag and drop handlers
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

            // Generate preview URLs
            const newPreviewPromises = fileArray.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === "string") {
                            resolve(reader.result);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newPreviewPromises).then(newPreviews => {
                const updatedPreviews = [...imagePreviewUrls, ...newPreviews];
                onImagesChange(updatedImages, updatedPreviews);
            });
        }
    };

    const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    onPrimaryImageChange(file, reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);

        const newPreviews = [...imagePreviewUrls];
        newPreviews.splice(index, 1);

        onImagesChange(newImages, newPreviews);
    };

    const removePrimaryImage = () => {
        onPrimaryImageChange(null, "");
        if (primaryImageInputRef.current) {
            primaryImageInputRef.current.value = "";
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            onCertificateChange(selectedFile, URL.createObjectURL(selectedFile));
        } else {
            alert("Vui lòng chọn tệp PDF");
        }
    };

    const removeFile = () => {
        onCertificateChange(null, "");
        if (certificateInputRef.current) {
            certificateInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-3">Hình ảnh</h3>
            <div>
                <label className="block text-sm font-medium mb-1">
                    File giấy công bố sản phẩm
                </label>

                <label
                    className="text-sm flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 w-fit">
                    <TbFileTypePdf className="mr-1"/>
                    Chọn file PDF
                    <input
                        type="file"
                        name="certificate_file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                        ref={certificateInputRef}
                        disabled={isViewOnly}
                    />
                </label>

                {certificateFile && (
                    <div className="relative py-3 rounded-md max-w-xs">
                        <button
                            onClick={removeFile}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-lg font-bold"
                            aria-label="Xóa file"
                            disabled={isViewOnly}
                        >
                            &times;
                        </button>

                        <p className="text-xs text-gray-800">
                            <span className="text-2xl">📄</span>
                            {typeof certificateFile === "string"
                                ? (certificateFile as string)
                                    .split("/")
                                    .slice(-2)
                                    .join("/")
                                : certificateFile?.name}{" "}
                        </p>
                    </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                    Chỉ chấp nhận tệp PDF
                </p>
            </div>

            {/* Product Images Section */}
            <div data-error={hasError("images")}>
                <label className="block text-sm font-medium mb-1 mt-4">
                    Hình ảnh sản phẩm <span className="text-red-500">*</span>{" "}
                    <span className="text-blue-500">
            (Cho phép nhiều hình ảnh)
          </span>
                </label>

                <div
                    className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                        isDragging
                            ? "border-blue-500 bg-blue-50"
                            : hasError("images")
                                ? "border-red-500"
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
                                Kéo và thả hình ảnh vào đây hoặc
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
                                    disabled={isViewOnly}
                                />
                            </label>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF tối đa 10MB mỗi tệp
                        </p>
                    </div>
                </div>

                {hasError("images") && <ErrorMessage message={errors.images}/>}

                {imagePreviewUrls.length > 0 && (
                    <div className="mt-3">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium">
                                {images.length} ảnh được chọn
                            </p>
                            <button
                                type="button"
                                onClick={() => onImagesChange([], [])}
                                className="text-xs text-red-500 hover:text-red-700"
                                disabled={isViewOnly}
                            >
                                Xóa hết
                            </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {imagePreviewUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Preview ${index}`}
                                        className="h-20 w-20 object-cover rounded border p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        title="Remove"
                                        disabled={isViewOnly}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Primary Image */}
            <div data-error={hasError("images_primary")}>
                <label className="block text-sm font-medium mb-1 mt-4">
                    Ảnh chính<span className="text-red-500">*</span>
                </label>
                <label
                    className="flex text-sm items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 w-fit">
                    <BiSolidImageAdd className="mr-1"/>
                    Chọn ảnh chính
                    <input
                        type="file"
                        name="images_primary"
                        ref={primaryImageInputRef}
                        onChange={handlePrimaryImageChange}
                        className="hidden"
                        accept="image/*"
                        disabled={isViewOnly}
                    />
                </label>

                {hasError("images_primary") && (
                    <ErrorMessage message={errors.images_primary}/>
                )}

                {primaryImagePreview && (
                    <div className="mt-2 relative inline-block">
                        <img
                            src={primaryImagePreview}
                            alt="Primary image preview"
                            className="h-24 w-24 object-cover rounded border p-2"
                        />
                        <button
                            type="button"
                            onClick={removePrimaryImage}
                            disabled={isViewOnly}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};