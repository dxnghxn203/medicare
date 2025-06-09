"use client";
import { useEffect, useState } from "react";
import { FiCamera, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useToast } from "@/providers/toastProvider";
import { ImBin } from "react-icons/im";
import Image from "next/image";
import { FaFilePrescription } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import DeleteProductDialog from "../Dialog/deleteProductDialog";
import LocationCheckout from "../Checkout/locationCheckout";
import SearchProductDialog from "../Dialog/searchProductDialog";
import { useOrder } from "@/hooks/useOrder";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PrescriptionForm = () => {
  const { fetchRequestPrescription } = useOrder();
  const [showUploadBox, setShowUploadBox] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  const [medicine, setMedicine] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [dataLocation, setDataLocation] = useState<any | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [isFromChiTietSanPham, setIsFromChiTietSanPham] = useState(false);

  useEffect(() => {
    const cameFrom =
      sessionStorage.getItem("cameFromChiTietSanPham") === "true";
    setIsFromChiTietSanPham(cameFrom);
    sessionStorage.removeItem("cameFromChiTietSanPham"); // optional: xóa sau khi dùng
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("selectedMedicine");
    if (stored) {
      setMedicine(JSON.parse(stored));
    }
  }, []);
  //   console.log("medicine", medicine);
  //   console.log("isFromChiTietSanPham", isFromChiTietSanPham);

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value;
    // setUnit(selectedUnit);
    const selectedPrice = medicine?.product_price?.find(
      (item: any) => item.unit === selectedUnit
    );
    // if (selectedPrice) {
    //   setPriceId(selectedPrice.price_id);
    // }
    setMedicine((prev: any) => {
      const updated = {
        ...prev,
        unit: selectedPrice.price_id,
        // price_id: selectedPrice.price_id,
      };
      return updated;
    });
  };

  const handleDeleteProduct = () => {
    setMedicine(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (images.length + validImages.length > 5) {
      toast.showToast("Chỉ được chọn tối đa 5 ảnh", "warning");
      return;
    }

    const newImages = validImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      // console.log("updated images", updated); // Đúng hơn
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const updateQuantity = (productId: string, delta: number) => {
    setSelectedProduct((prev) =>
      prev.map((product) =>
        product.product_id === productId
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };
  const handleRemove = (productId: string) => {
    setSelectedProduct((prev) =>
      prev.filter((product) => product.product_id !== productId)
    );
  };
  const updateUnit = (productId: string, newUnit: string) => {
    setSelectedProduct((prev) =>
      prev.map((product) =>
        product.product_id === productId
          ? { ...product, unit: newUnit }
          : product
      )
    );
  };

  const handleSendRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    const allProducts =
      selectedProduct.length > 0 ? [medicine, ...selectedProduct] : [medicine];

    const productData = medicine
      ? {
          product: allProducts.map((item) => ({
            product_id: item.product_id,
            price_id: item.unit,
            quantity: item.quantity,
          })),
        }
      : null;
    console.log("productData:", productData);
    if (!productData && (!images || images.length === 0)) {
      toast.showToast(
        "Vui lòng chọn thuốc hoặc nhập toa thuốc để tư vấn! ",
        "warning"
      );
      return;
    }

    // console.log("productData:", productData);
    const pickToData = {
      name: user?.user_name,
      phone_number: user?.phone_number,
      email: user?.email,
      address: {
        address: dataLocation?.address || "",
        ward: dataLocation?.ward || "",
        district: dataLocation?.district || "",
        province: dataLocation?.province || "",
      },
    };

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    if (productData) {
      formData.append("product", JSON.stringify(productData));
    }
    formData.append("pick_to", JSON.stringify(pickToData));
    formData.append(
      "receiver_province_code",
      dataLocation?.province_code || ""
    );
    formData.append(
      "receiver_district_code",
      dataLocation?.district_code || ""
    );
    formData.append("receiver_commune_code", dataLocation?.ward_code || "");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    await fetchRequestPrescription(
      formData,
      (message: any) => {
        toast.showToast("Gửi yêu cầu tư vấn thành công", "success");
        setShowUploadBox(false);
        setImages([]);
      },
      (message: any) => {
        toast.showToast(message, "error");
      }
    );
  };

  return (
    <div className="pt-14 mx-4">
      <h2 className="font-semibold mb-4 text-lg">Cần mua thuốc</h2>
      {/* Grid 2 cột */}
      <div>
        {/* Cột trái (chiếm 2/3) */}
        <form
          onSubmit={handleSendRequest}
          className="grid grid-cols-3 gap-4 max-md:grid-cols-1"
        >
          <div className="col-span-2 space-y-4">
            <div className="bg-[#F5F7F9] p-4 rounded-xl space-y-4">
              <div className="font-medium">Thông tin liên hệ</div>
              <div className="flex space-x-4 ">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="name"
                    className={`peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl outline-none transition-all 
                    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2]`}
                    placeholder=" "
                    defaultValue={user?.user_name}
                    readOnly
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-xs text-gray-500 left-4 top-2 transition-all peer-placeholder-shown:top-4
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm 
                    peer-focus:text-gray-500"
                  >
                    Họ và tên
                  </label>
                </div>

                <div className="relative w-full">
                  <input
                    type="tel"
                    id="phone"
                    className={`peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl outline-none transition-all 
                    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2]`}
                    defaultValue={user?.phone_number}
                    readOnly
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-xs text-gray-500 left-4 top-2 transition-all peer-placeholder-shown:top-4
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm 
                    peer-focus:text-gray-500"
                  >
                    Số điện thoại
                  </label>
                </div>
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="note"
                  className="absolute text-xs text-gray-500 left-4 top-2"
                >
                  Ghi chú (không bắt buộc)
                </label>
                <textarea
                  id="note"
                  className="pt-6 w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl outline-none transition-all
                  focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] placeholder:font-normal placeholder:text-[14px]"
                  placeholder="Ví dụ: Tôi cần tư vấn về thuốc đau đầu"
                  rows={4}
                />
              </div>
            </div>
            <div className="bg-[#F5F7F9] p-4 rounded-xl space-y-4">
              <div className="font-medium">Chọn địa chỉ nhận hàng</div>
              <LocationCheckout
                setDataLocation={setDataLocation}
                setNote={setNote}
              />
            </div>
            {!showUploadBox && (
              <div
                className="relative bg-[#F5F7F9] py-4 px-4 rounded-xl space-y-1"
                onClick={() => setShowUploadBox(true)}
              >
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-blue-700 font-bold"
                  aria-label="Thêm ảnh"
                >
                  <FiPlus />
                </button>

                <div className="w-full text-blue-700 font-semibold rounded-xl">
                  Thêm ảnh nếu có đơn thuốc (không bắt buộc)
                </div>
                <div className="text-sm">
                  Giúp dược sĩ tư vấn chính xác nhất
                </div>
              </div>
            )}

            {showUploadBox && (
              <div className="bg-[#F5F7F9] py-4 px-4 rounded-xl space-y-2">
                <div className="w-full text-blue-700 font-semibold rounded-lg">
                  Ảnh chụp đơn thuốc
                </div>
                <div className="border border-dashed border-[#0053E2] bg-[#F0F9FF] rounded-xl px-4 py-6 space-y-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <FiCamera className="text-xl text-gray-600" />
                    <span className="text-gray-700 text-sm">
                      Thêm tối đa 5 ảnh, mỗi ảnh dưới 5MB (định dạng jpg, jpeg,
                      png)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, image/jpg"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 rounded overflow-hidden border border-gray-300"
                      >
                        <img
                          src={img.url}
                          alt={`image-${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                        >
                          <FiX className="text-red-500 text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="relative bg-[#F5F7F9] py-4 px-4 rounded-xl space-y-1">
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-blue-700 font-bold"
                aria-label="Thêm ảnh"
              >
                <FiPlus />
              </button>
              <div className="w-full text-blue-700 font-semibold rounded-lg">
                Thêm thuốc cần tư vấn (không bắt buộc)
              </div>
              <div className="text-sm">Nhập theo tên thuốc hoặc sản phẩm</div>
            </div>

            <div className="bg-[#F5F7F9] py-4 px-4 rounded-xl">
              <div className="w-full text-blue-700 font-semibold mb-3">
                Danh sách sản phẩm cần tư vấn
              </div>
              <button
                className="text-sm text-blue-700 bg-[#EAEFFA] w-full py-3.5 rounded-full flex items-center justify-center space-x-2 font-semibold mb-4"
                type="button"
                onClick={() => setIsOpenDialog(true)}
              >
                + Thêm sản phẩm/thuốc
              </button>
              {/* nếu như là isFromChiTietSanPham thì hiển thị thông tin thuốc từ chi tiết sản phẩm */}

              {isFromChiTietSanPham && (
                <div
                  className={`flex items-center justify-between pb-2 text-sm ${
                    selectedProduct.length > 0 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center w-2/3">
                    <Image
                      src={medicine?.image}
                      alt=""
                      width={70}
                      height={70}
                      className="rounded-lg border border-stone-300 p-1"
                    />
                    <span className="ml-4 line-clamp-2 overflow-hidden text-ellipsis">
                      {medicine?.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 w-1/3 justify-end">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          setMedicine((prev: any) => {
                            const updated = {
                              ...prev,
                              quantity: Math.max(1, prev.quantity - 1),
                            };
                            setQuantity(updated.quantity);
                            return updated;
                          })
                        }
                        className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        <FiMinus />
                      </button>
                      <input
                        value={quantity}
                        readOnly
                        className="text-center w-8 bg-[#F5F7F9]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMedicine((prev: any) => {
                            const updated = {
                              ...prev,
                              quantity: prev.quantity + 1,
                            };
                            setQuantity(updated.quantity);
                            return updated;
                          })
                        }
                        className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <select
                      onChange={handleUnitChange}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {medicine?.product_price?.map((item: any) => (
                        <option key={item.price_id} value={item.unit}>
                          {item.unit}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct()}
                      className="text-black/50 hover:text-black transition-colors"
                    >
                      <ImBin size={18} />
                    </button>
                  </div>
                </div>
              )}
              {selectedProduct.length > 0 && (
                <div className="pt-1 space-y-2">
                  {selectedProduct.map((product: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between gap-3 pb-2 text-sm ${
                        index === selectedProduct.length - 1 ? "" : "border-b"
                      }`}
                    >
                      <div className="flex items-center space-x-4 w-2/3">
                        <Image
                          src={product.images_primary}
                          alt={product.product_name}
                          width={70}
                          height={70}
                          className="rounded-lg object-cover border p-2"
                        />
                        <span className="text-sm line-clamp-2 overflow-hidden text-ellipsis">
                          {product?.name_primary}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 w-1/3 justify-end">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product.product_id, -1)
                            }
                            className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                          >
                            <FiMinus />
                          </button>
                          <input
                            value={product.quantity}
                            readOnly
                            className="text-center w-8 bg-[#F5F7F9]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product.product_id, 1)
                            }
                            className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                          >
                            <FiPlus />
                          </button>
                        </div>

                        <select
                          onChange={(e) =>
                            updateUnit(product.product_id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {product?.prices.map((item: any) => (
                            <option key={item.price_id} value={item.unit}>
                              {item.unit}
                            </option>
                          ))}
                        </select>

                        {/* Nút xóa */}
                        <button
                          type="button"
                          onClick={() => handleRemove(product.product_id)}
                          className="text-black/50 hover:text-black transition-colors"
                        >
                          <ImBin size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cột phải (chiếm 1/3) */}
          <div className="flex w-full flex-col space-y-4">
            <div className="bg-[#F5F7F9] p-4 rounded-xl w-full">
              <button
                className="bg-blue-700 text-white font-medium py-4 px-4 rounded-full hover:bg-[#002E99] w-full"
                type="submit"
              >
                Gửi yêu cầu tư vấn
              </button>
            </div>
            <div className="bg-[#F5F7F9] p-4 rounded-xl w-full text-sm">
              <h2 className=" font-semibold mb-4">
                Quy trình tư vấn tại Medicare
              </h2>
              <div className="relative pl-10">
                {/* Đường timeline kéo từ 1 đến 2 */}
                <div className="absolute left-[10px] top-0 bottom-[26px] w-[2px] bg-[#D6E3F3]"></div>

                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[40px] top-0 w-6 h-6 bg-[#9BB8E3] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <p>
                      Quý khách vui lòng điền thông tin liên hệ, cung cấp ảnh
                      đơn thuốc hoặc tên sản phẩm cần tư vấn (nếu có).
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[40px] top-0 w-6 h-6 bg-[#9BB8E3] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <p>
                      Dược sĩ chuyên môn của nhà thuốc sẽ gọi lại tư vấn miễn
                      phí cho quý khách.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[40px] top-0 w-6 h-6 bg-[#9BB8E3] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <p>
                      Quý khách có thể tới các Nhà thuốc Medicare gần nhất để
                      được hỗ trợ mua hàng trực tiếp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#F5F7F9] p-4 rounded-xl w-full text-sm items-center flex justify-center space-x-2">
              <Link
                href="/ca-nhan/don-thuoc-cua-toi"
                className="flex items-center justify-center w-full"
              >
                <button
                  className="text-blue-700 font-medium flex"
                  type="button"
                >
                  <FaFilePrescription className="text-xl mr-2" />
                  Xem lại đơn thuốc của tôi
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>

      <SearchProductDialog
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
        onSelectProduct={(product) => {
          if (
            selectedProduct.some((p) => p.product_id === product.product_id)
          ) {
            toast.showToast("Sản phẩm đã được thêm", "error");
            return;
          }
          const defaultPrice = product.prices?.[0];
          const defaultUnit = defaultPrice?.price_id;
          setSelectedProduct((prev) => [
            ...prev,
            {
              ...product,
              quantity: 1,
              unit: defaultUnit,
            },
          ]);
        }}
      />
    </div>
  );
};
export default PrescriptionForm;
