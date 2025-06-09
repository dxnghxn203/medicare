"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiUpload,
  FiCamera,
  FiSearch,
  FiX,
  FiPlus,
  FiMessageCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import { useToast } from "@/providers/toastProvider";
import { useProduct } from "@/hooks/useProduct";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_IMAGES = 1;

const Page = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPriceIds, setSelectedPriceIds] = useState<{
    [key: string]: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();
  const toast = useToast();
  const { imageToProduct, fetchImageToProduct } = useProduct();

  const { addProductTocart, getProductFromCart } = useCart();

  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">(
    "environment"
  ); // 'environment' is back camera, 'user' is front camera

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.showToast(`Kích thước file quá lớn. Tối đa 2MB`, "error");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setSelectedImages([]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!validateFileSize(file)) continue;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImages([e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
      break;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsUsingCamera(false);
  };

  const [showResults, setShowResults] = useState(false);

  const backToImageInput = () => {
    setShowResults(false);
  };

  const searchMedication = () => {
    if (selectedImages.length === 0) return;

    setIsLoading(true);

    const imageFiles = selectedImages.map((base64, index) => {
      const byteString = atob(base64.split(",")[1]);
      const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new File([ab], `image-${index}.jpg`, { type: mimeString });
    });

    fetchImageToProduct(
      imageFiles,
      () => {
        setIsLoading(false);
        setShowResults(true);
      },
      () => {
        setIsLoading(false);
        toast.showToast("Không thể tìm kiếm với hình ảnh này", "error");
      }
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length === 0) return;

    setSelectedImages([]);
    const file = files[0];
    if (!file.type.match("image.*")) return;
    if (!validateFileSize(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImages([e.target.result as string]);
      }
    };
    reader.readAsDataURL(file);

    setIsUsingCamera(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const startCamera = async () => {
    try {
      setIsCameraInitializing(true);
      setCameraError(null);
      setIsUsingCamera(true);

      const constraints = {
        video: {
          facingMode: cameraMode,
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (stream.getVideoTracks().length > 0) {
        const videoTrack = stream.getVideoTracks()[0];
      } else {
        throw new Error("No video tracks found in camera stream");
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = "block";

        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
          } catch (playError) {
            console.error("Error playing video:", playError);
            setCameraError(
              "Không thể hiển thị camera, vui lòng cấp quyền và thử lại"
            );
            stopCamera();
          }
        };
      } else {
        setCameraError(
          "Không thể khởi tạo camera - không tìm thấy element video"
        );
        stopCamera();
        return;
      }

      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);

      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setCameraError(
              "Bạn đã từ chối quyền truy cập camera. Vui lòng cấp quyền trong cài đặt trình duyệt."
            );
            break;
          case "NotFoundError":
            setCameraError(
              "Không tìm thấy thiết bị camera trên thiết bị của bạn."
            );
            break;
          case "NotReadableError":
            setCameraError(
              "Camera đang được sử dụng bởi ứng dụng khác. Vui lòng đóng các ứng dụng khác và thử lại."
            );
            break;
          case "OverconstrainedError":
            setCameraError(
              "Thiết bị camera không đáp ứng được yêu cầu kỹ thuật. Vui lòng thử lại."
            );
            break;
          case "AbortError":
            setCameraError("Kết nối camera bị gián đoạn.");
            break;
          default:
            setCameraError("Không thể truy cập camera: " + err.name);
        }
      } else {
        setCameraError(
          "Không thể truy cập camera: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
      stopCamera();
    } finally {
      setIsCameraInitializing(false);
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }

    setIsUsingCamera(false);
  };

  const tryAlternateCamera = async () => {
    try {
      setCameraError("Đang thử với camera khác...");

      const alternateConstraints = {
        video: { facingMode: "user" },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        alternateConstraints
      );

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      streamRef.current = stream;
      setCameraError(null);
      console.log("Alternate camera activated successfully");
    } catch (err) {
      console.error("Error accessing alternate camera:", err);
      setCameraError(
        "Không thể truy cập bất kỳ camera nào. Vui lòng thử lại sau."
      );
    } finally {
      setIsCameraInitializing(false);
    }
  };

  const toggleCameraMode = async () => {
    // Stop the current camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Toggle camera mode
    setCameraMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );

    // Short delay to ensure the previous stream is fully stopped
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  const capturePhoto = () => {
    console.log("Attempting to capture photo");
    if (!videoRef.current || !streamRef.current) {
      console.error("Video reference or stream is null");
      toast.showToast("Không thể chụp ảnh: Camera chưa được khởi tạo", "error");
      return;
    }

    const video = videoRef.current;

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0 ||
      video.paused ||
      video.ended
    ) {
      console.error("Video is not ready for capture", {
        width: video.videoWidth,
        height: video.videoHeight,
        paused: video.paused,
        ended: video.ended,
      });
      toast.showToast("Không thể chụp ảnh: Camera chưa sẵn sàng", "error");
      return;
    }

    try {
      console.log("Creating canvas for capture");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log("Canvas dimensions:", canvas.width, canvas.height);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Could not get canvas context");
        toast.showToast("Không thể chụp ảnh: Lỗi canvas", "error");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

      if (imageDataUrl === "data:,") {
        console.error("Empty image data URL");
        toast.showToast("Không thể chụp ảnh: Dữ liệu trống", "error");
        return;
      }

      setSelectedImages([imageDataUrl]);
      stopCamera();
    } catch (error) {
      console.error("Error during photo capture:", error);
      toast.showToast(
        "Không thể chụp ảnh: " +
          (error instanceof Error ? error.message : "Lỗi không xác định"),
        "error"
      );
    }
  };

  const removeImage = () => {
    setSelectedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectPrice = (productId: string, priceId: string) => {
    setSelectedPriceIds((prev) => ({
      ...prev,
      [productId]: priceId,
    }));
  };

  const handleAddToCart = (productId: string, productIndex: number) => {
    const priceId = selectedPriceIds[productId];

    if (!priceId) {
      toast.showToast(
        "Vui lòng chọn đơn vị trước khi thêm vào giỏ hàng",
        "warning"
      );
      return;
    }

    addProductTocart(
      productId,
      priceId,
      1,
      () => {
        toast.showToast("Thêm vào giỏ hàng thành công", "success");
        getProductFromCart(
          () => {},
          () => {}
        );
      },
      () => {
        toast.showToast("Thêm vào giỏ hàng thất bại", "error");
      }
    );
  };

  return (
    <div className="container mx-auto px-4 pt-[120px] pb-20">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          Tìm kiếm thuốc bằng hình ảnh
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Chụp hình hoặc tải lên hình ảnh thuốc để tìm kiếm thông tin chi tiết
        </p>

        {!showResults ? (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 ${
                  !isUsingCamera
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } transition-colors`}
              >
                <FiUpload className="text-xl" />
                <span>Tải ảnh lên</span>
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <button
                onClick={isUsingCamera ? stopCamera : startCamera}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 ${
                  isUsingCamera
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } transition-colors`}
              >
                <FiCamera className="text-xl" />
                <span>{isUsingCamera ? "Dừng camera" : "Chụp ảnh"}</span>
              </button>
            </div>

            {isUsingCamera && (
              <div className="relative mb-6 bg-black rounded-lg overflow-hidden">
                {isCameraInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
                    <div className="text-white text-center">
                      <BiLoaderAlt className="animate-spin text-4xl mx-auto mb-2" />
                      <p>Đang kết nối camera...</p>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-10">
                    <div className="text-white text-center p-6 max-w-sm">
                      <FiX className="text-4xl mx-auto mb-2" />
                      <p className="font-medium mb-3 text-lg">Lỗi camera</p>
                      <p className="text-sm mb-4">{cameraError}</p>
                      <div className="flex gap-3 justify-center">
                        {cameraError.includes("camera khác") ? (
                          <button
                            onClick={stopCamera}
                            className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Đóng
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={tryAlternateCamera}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                              Thử camera khác
                            </button>
                            <button
                              onClick={stopCamera}
                              className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                            >
                              Đóng
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs mt-4 text-gray-300">
                        Một số thiết bị yêu cầu cấp quyền camera trong cài đặt
                        trình duyệt
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className={`camera-debug-info absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded z-10 ${
                    streamRef.current ? "block" : "hidden"
                  }`}
                >
                  Camera đang hoạt động:{" "}
                  {streamRef.current && videoRef.current ? "Có" : "Không"}
                </div>

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[300px] md:h-[400px] object-cover"
                  style={{ display: "block" }} // Ensure video is visible
                />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    disabled={isCameraInitializing || !!cameraError}
                    className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full border-4 border-blue-500"></div>
                  </button>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleCameraMode}
                    className="bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                    title={
                      cameraMode === "environment"
                        ? "Chuyển sang camera trước"
                        : "Chuyển sang camera sau"
                    }
                  >
                    <FiRefreshCw size={20} />
                  </button>

                  <button
                    onClick={stopCamera}
                    className="bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            )}

            {!isUsingCamera && selectedImages.length === 0 && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center flex flex-col items-center justify-center gap-4 h-[300px] md:h-[400px] bg-gray-50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <BsImage className="text-5xl text-gray-400" />
                <div>
                  <p className="text-gray-600 mb-2">
                    Kéo và thả hình ảnh vào đây hoặc{" "}
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      chọn từ thiết bị
                    </button>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Hỗ trợ: JPG, PNG, GIF (tối đa 2MB)
                  </p>
                </div>
              </div>
            )}

            {selectedImages.length > 0 && !isUsingCamera && (
              <div className="mb-6">
                <div className="relative rounded-lg overflow-hidden h-[300px] bg-gray-100">
                  <Image
                    src={selectedImages[0]}
                    alt="Hình ảnh thuốc"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            )}

            {selectedImages.length > 0 && !isUsingCamera && (
              <button
                onClick={searchMedication}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isLoading ? (
                  <>
                    <BiLoaderAlt className="text-xl animate-spin" />
                    <span>Đang tìm kiếm...</span>
                  </>
                ) : (
                  <>
                    <FiSearch className="text-xl" />
                    <span>Tìm kiếm thông tin thuốc</span>
                  </>
                )}
              </button>
            )}

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Lưu ý khi chụp ảnh
              </h3>
              <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                <li>Đảm bảo ảnh rõ nét và không bị mờ</li>
                <li>Chụp cận cảnh bao bì hoặc vỉ thuốc để dễ nhận diện</li>
                <li>Ánh sáng đầy đủ để thấy rõ màu sắc và thông tin</li>
                <li>Nếu có thể, chụp cả mặt trước của hộp thuốc</li>
                <li>Ảnh không vượt quá 2MB</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="search-results animate-fadeIn relative">
            <div className="search-results animate-fadeIn">
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                  <div className="flex justify-center mb-4">
                    <BiLoaderAlt className="animate-spin text-4xl text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Đang tìm kiếm thuốc
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm px-4 text-center">
                    Hệ thống đang nhận diện thông tin thuốc từ hình ảnh của bạn
                  </p>
                  <div className="w-48 bg-gray-200 rounded-full h-1.5 mb-3">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full animate-pulse"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Kết quả tìm kiếm
                </h2>
                <button
                  onClick={backToImageInput}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                >
                  <FiX className="w-4 h-4" /> Tìm kiếm mới
                </button>
              </div>

              {imageToProduct && imageToProduct.length > 0 ? (
                <div className="space-y-6">
                  {imageToProduct.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Images section */}
                        <div className="p-4 md:w-1/3 border-r border-gray-100">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Hình ảnh của bạn
                              </h3>
                              <div className="h-48 rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                                <Image
                                  src={selectedImages[0]}
                                  alt="Hình ảnh người dùng tải lên"
                                  width={200}
                                  height={200}
                                  className="object-contain h-full w-full"
                                />
                              </div>
                            </div>

                            {item.product && (
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">
                                  Hình ảnh sản phẩm
                                </h3>
                                <div className="h-48 rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                                  <Image
                                    src={item.product.images_primary}
                                    alt={item.product.product_name}
                                    width={200}
                                    height={200}
                                    className="object-contain h-full w-full"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product information section */}
                        <div className="w-full md:w-2/3 p-5">
                          {item.product ? (
                            <div className="h-full flex flex-col">
                              <div className="flex justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                  {item.product.product_name}
                                </h3>
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                  Có sẵn tại cửa hàng
                                </span>
                              </div>

                              <p className="text-sm text-gray-500 mb-3">
                                {item.product.product_id}
                              </p>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {item.product.description}
                              </p>

                              {/* Pricing options */}
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Lựa chọn đơn vị
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {item.product.prices.map(
                                    (price: any, idx: any) => (
                                      <div
                                        key={idx}
                                        onClick={() =>
                                          handleSelectPrice(
                                            item.product.product_id,
                                            price.price_id
                                          )
                                        }
                                        className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                                          selectedPriceIds[
                                            item.product.product_id
                                          ] === price.price_id
                                            ? "border-blue-500 bg-blue-50"
                                            : "hover:border-blue-500"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium text-sm">
                                            {price.unit}
                                          </span>
                                          {price.discount > 0 && (
                                            <span className="bg-red-50 text-red-600 text-xs px-1.5 py-0.5 rounded">
                                              -{price.discount}%
                                            </span>
                                          )}
                                        </div>
                                        <div className="mt-1">
                                          {price.original_price !==
                                            price.price && (
                                            <span className="text-gray-400 line-through text-xs mr-1">
                                              {price.original_price.toLocaleString(
                                                "vi-VN"
                                              )}
                                              đ
                                            </span>
                                          )}
                                          <span className="text-blue-600 font-semibold">
                                            {price.price.toLocaleString(
                                              "vi-VN"
                                            )}
                                            đ
                                          </span>
                                        </div>
                                        {price.inventory < 10 && (
                                          <div className="text-xs text-orange-500 mt-1">
                                            Còn {price.inventory} sản phẩm
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              <div className="mt-auto flex gap-3">
                                {item.product.prescription_required === true ? (
                                  <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                    <FiMessageCircle size={16} />
                                    Thuốc này cần tư vấn
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleAddToCart(
                                        item.product.product_id,
                                        index
                                      )
                                    }
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                  >
                                    <FiPlus size={16} />
                                    Thêm vào giỏ hàng
                                  </button>
                                )}
                                <Link
                                  href={`/chi-tiet-san-pham/${item.product.slug}`}
                                >
                                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors">
                                    Xem chi tiết
                                  </button>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col">
                              <div className="flex justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {item.raw_text.name}
                                </h3>
                                <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full flex items-center">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                                  Không có sẵn
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                                {item.raw_text.brand && (
                                  <div className="flex items-start">
                                    <span className="text-gray-500 min-w-24">
                                      Thương hiệu:
                                    </span>
                                    <span className="font-medium">
                                      {item.raw_text.brand}
                                    </span>
                                  </div>
                                )}
                                {item.raw_text.origin && (
                                  <div className="flex items-start">
                                    <span className="text-gray-500 min-w-24">
                                      Xuất xứ:
                                    </span>
                                    <span className="font-medium">
                                      {item.raw_text.origin}
                                    </span>
                                  </div>
                                )}
                                {item.raw_text.dosage_form && (
                                  <div className="flex items-start">
                                    <span className="text-gray-500 min-w-24">
                                      Dạng bào chế:
                                    </span>
                                    <span className="font-medium">
                                      {item.raw_text.dosage_form}
                                    </span>
                                  </div>
                                )}
                                {item.raw_text.active_ingredients &&
                                  item.raw_text.active_ingredients.length >
                                    0 && (
                                    <div className="flex items-start col-span-2">
                                      <span className="text-gray-500 min-w-24">
                                        Hoạt chất:
                                      </span>
                                      <span className="font-medium">
                                        {item.raw_text.active_ingredients.join(
                                          ", "
                                        )}
                                      </span>
                                    </div>
                                  )}
                                {item.raw_text.additional_info
                                  ?.package_quantity && (
                                  <div className="flex items-start col-span-2">
                                    <span className="text-gray-500 min-w-24">
                                      Quy cách:
                                    </span>
                                    <span className="font-medium">
                                      {
                                        item.raw_text.additional_info
                                          .package_quantity
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="mt-auto">
                                <Link href={`/don-thuoc`}>
                                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                    Yêu cầu tư vấn sản phẩm
                                  </button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-gray-400 mb-4">
                    <BsImage className="text-5xl mx-auto mb-2" />
                    <p>Không tìm thấy kết quả</p>
                  </div>
                  <p className="text-gray-600">
                    Vui lòng thử lại với ảnh khác hoặc điều chỉnh góc chụp để
                    nhận dạng rõ hơn.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
