"use client";
import React, { useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import returnbox from "@/images/return-box.png";
import free from "@/images/free.png";
import fastdelivery from "@/images/fast-delivery.png";
import { useRouter } from "next/navigation";
import {
  Category,
  Price,
  ProductImage,
  Manufacturer,
  Ingredient,
  FullDescription,
} from "@/types/product";
import DescribeProduct from "./describeProduct";
import Guide from "./guide";
import FeedBack from "./feedBack";
import ImageDialog from "../Dialog/imageDialog";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";
import { getPriceFromProduct } from "@/utils/price";
import Link from "next/link";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaStar, FaUserDoctor } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";
import { RiEBikeFill } from "react-icons/ri";

interface DetailProductProps {
  product: {
    product_id: string;
    product_name: string;
    name_primary: string;
    prices: Price[];
    slug: string;
    description: string;
    images_primary: string;
    images: ProductImage[];
    category: Category;
    dosage_form: string;
    origin: string;
    manufacturer: Manufacturer;
    ingredients: Ingredient[];
    brand: string;
    discount: number;
    full_descriptions: FullDescription[];
    rating: number;
    count_review: number;
    count_comment: number;
  };
}

const DetailProduct = ({ product }: any) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(
    product?.prices[0]?.price_id
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [isOpenDialog, setIsDialogOpen] = useState(false);
  const [selectedImageDialog, setSelectedImageDialog] = useState(0);
  const { addProductTocart, getProductFromCart } = useCart();
  const toast = useToast();

  const [loadingToAddToCart, setLoadingToAddToCart] = useState(false);

  const handleAddToCart = (goCart: any) => {
    addProductTocart(
      product?.product_id,
      selectedUnit,
      quantity,
      () => {
        toast.showToast("Thêm vào giỏ hàng thành công", "success");
        if (goCart) {
          router.push("/gio-hang");
        } else {
          getProductFromCart(
            () => {},
            () => {}
          );
        }
      },
      () => {
        toast.showToast("Thêm vào giỏ hàng thất bại", "error");
      }
    );
  };

  const selectedPrice: any = useMemo(() => {
    return getPriceFromProduct(product, selectedUnit);
  }, [selectedUnit]);
  const sortedPrices = [...(product?.prices || [])].sort(
    (a, b) => b.amount - a.amount
  );
  const router = useRouter();
  const handleSendPrescription = () => {
    const selectedPrice = product?.prices?.find(
      (p: Price) => p.unit === selectedUnit
    );
    const selectedProduct = {
      price_id: selectedPrice?.price_id,
      product_id: product?.product_id,
      name: product?.name_primary,
      unit: selectedUnit,
      quantity: quantity,
      price: selectedPrice?.price,
      product_price: product?.prices,
      image: product?.images_primary,
      product: product,
    };
    // console.log("price", product?.prices);
    sessionStorage.setItem("cameFromChiTietSanPham", "true");
    localStorage.setItem("selectedMedicine", JSON.stringify(selectedProduct));
    router.push("/don-thuoc");
  };

  return (
    <div className="w-full">
      <div className="bg-[#F5F7F9] px-5 rounded-lg w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-[40%] flex flex-col items-center mt-12">
            <div className="relative w-full h-[400px] flex items-center justify-center">
              <div className="">
                <Image
                  src={
                    selectedImage === 0
                      ? product?.images_primary
                      : product?.images[selectedImage - 1]?.images_url
                  }
                  alt={""}
                  width={390}
                  height={390}
                  className="object-contain cursor-pointer overflow-hidden w-96 h-96 "
                  priority
                />
              </div>
              {selectedImage > 0 && (
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
                  onClick={() =>
                    setSelectedImage(
                      (selectedImage - 1 + product?.images.length + 1) %
                        (product?.images.length + 1)
                    )
                  }
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
              {selectedImage < product?.images.length && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-75 hover:opacity-100"
                  onClick={() =>
                    setSelectedImage(
                      (selectedImage + 1) % (product?.images.length + 1)
                    )
                  }
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

            <div className="flex w-full justify-between mt-8 gap-2">
              <div
                className={`w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center ${
                  selectedImage === 0 ? "border-[#002E99]" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(0)}
              >
                <Image
                  src={product?.images_primary}
                  alt={`Ảnh chính`}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover px-2 py-2"
                />
              </div>

              {product?.images &&
                product?.images.slice(0, 2).map((img: any, index: any) => (
                  <div
                    key={img?.images_id}
                    className={`w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center ${
                      selectedImage === index + 1
                        ? "border-[#002E99]"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(index + 1)}
                  >
                    <Image
                      src={img?.images_url}
                      alt={`Ảnh ${index + 1}`}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover px-2 py-2"
                    />
                  </div>
                ))}

              {/* More images indicator */}
              {product?.images.length > 3 && (
                <div
                  className="w-28 h-28 rounded-lg overflow-hidden border flex items-center justify-center relative cursor-pointer"
                  onClick={() => setSelectedImage(3)}
                >
                  <Image
                    src={product?.images[2]?.images_url}
                    alt="Ảnh cuối"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover px-2 py-2 opacity-40"
                  />
                  {product?.images.length > 3 && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center text-white text-sm font-medium px-4 cursor-pointer"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Xem thêm {product?.images.length - 2} ảnh
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Product details */}
          <div className="space-y-4 w-full lg:ml-4 lg:w-[60%]">
            <h2 className="text-lg font-normal text-[#4A4F63] mt-4">
              Thương hiệu:{" "}
              <span className="text-[#0053E2] font-semibold">
                {product?.brand}
              </span>
            </h2>
            <h1 className="text-3xl font-bold">{product?.name_primary}</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2 space-y-1 sm:space-y-0 text-gray-600 text-sm">
              <span>{product?.product_id}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center ">
                {Number(product?.rating).toFixed(1)}
                <span>
                  <FaStar className="text-[#FFD700] text-lg ml-2" />
                </span>
              </span>

              <span className="hidden sm:inline">•</span>
              <a className="text-[#0053E2] hover:underline">
                {product?.count_review} đánh giá
              </a>
              <span className="hidden sm:inline">•</span>
              <a className="text-[#0053E2] hover:underline">
                {product?.count_comment} bình luận
              </a>
            </div>

            {product?.prescription_required !== true && (
              <div className="flex-col space-y-4 gap-2 mt-3 items-center">
                {selectedPrice?.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-2 text-sm font-medium text-black bg-amber-300 rounded-lg flex items-center justify-center">
                      Giảm {selectedPrice.discount}%
                    </span>
                    {selectedPrice?.original_price && (
                      <span className="text-2xl font-bold text-zinc-400 line-through flex items-center">
                        {selectedPrice.original_price.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                )}
                {selectedPrice?.price && (
                  <p className="text-[#0053E2] text-4xl font-bold">
                    {selectedPrice.price.toLocaleString("vi-VN")}đ/{" "}
                    {selectedPrice.unit}
                  </p>
                )}
              </div>
            )}

            {product?.prescription_required !== true && (
              <div className="flex items-center space-x-24">
                <p className="text-[#4A4F63] font-normal">Chọn đơn vị tính</p>
                <div className="flex space-x-2">
                  {product?.prices.map((price: any) => (
                    <button
                      key={price?.price_id}
                      onClick={() => {
                        setSelectedUnit(price?.price_id);
                      }}
                      className={`flex items-center justify-center px-6 py-2 rounded-full border text-lg font-normal
          ${
            selectedUnit === price?.price_id
              ? "border-blue-500 text-black font-semibold"
              : "border-gray-300 text-gray-500"
          }`}
                    >
                      {price?.unit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <tbody>
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">Danh mục</td>
                    <td className="pl-0 py-3 w-2/3 text-blue-600 font-medium">
                      {product?.category?.child_category_name}
                    </td>
                  </tr>
                  {product?.registration_number ? (
                    <tr>
                      <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                        Số đăng ký
                      </td>
                      <td className="pl-0 py-3 w-2/3 font-medium">
                        {product?.registration_number}
                      </td>
                    </tr>
                  ) : null}

                  <td colSpan={2} className="whitespace-nowrap">
                    <a
                      className="flex items-center gap-2 text-blue-600 cursor-pointer"
                      href={product?.certificate_file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Xem giấy công bố sản phẩm</span>
                      <BsPatchCheckFill className="text-blue-600" />
                    </a>
                  </td>

                  {product?.dosage_form && (
                    <tr>
                      <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                        Dạng bào chế
                      </td>
                      <td className="pl-0 py-3 w-2/3">{product.dosage_form}</td>
                    </tr>
                  )}

                  {product?.prices?.length > 0 && (
                    <tr>
                      <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                        Quy cách
                      </td>
                      <td className="pl-0 py-3 w-2/3">
                        {(() => {
                          const sortedPrices = [...product.prices].sort(
                            (a, b) => b.amount - a.amount
                          ); // Lớn đến bé

                          if (sortedPrices.length === 1) {
                            return sortedPrices[0].unit;
                          }

                          if (sortedPrices.length === 2) {
                            const [larger, smaller] = sortedPrices;
                            const ratio = larger.amount / smaller.amount;
                            return `${larger.unit} ${ratio} ${smaller.unit}`;
                          }

                          if (sortedPrices.length >= 3) {
                            const [largest, middle, smallest] = sortedPrices;
                            const ratio1 = largest.amount / middle.amount;
                            const ratio2 = middle.amount / smallest.amount;
                            return `${largest.unit} ${ratio1} ${middle.unit} x ${ratio2} ${smallest.unit}`;
                          }

                          return null;
                        })()}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Xuất xứ thương hiệu
                    </td>
                    <td className="pl-0 py-3 w-2/3">{product?.origin}</td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Nhà sản xuất
                    </td>
                    <td className="pl-0 py-3 w-2/3">
                      {product?.manufacturer?.manufacture_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Nước sản xuất
                    </td>
                    <td className="pl-0 py-3 w-2/3">
                      {product?.manufacturer?.manufacture_address}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-3 w-1/3 text-[#4A4F63]">
                      Thành phần
                    </td>
                    <td className="pl-0 py-3 w-2/3">
                      {product?.ingredients?.map(
                        (ingredient: any, index: number) => (
                          <span key={index}>
                            {ingredient.ingredient_name.match(
                              /Vitamin\s\w+/i
                            ) ? (
                              <span className="text-blue-600">
                                {ingredient.ingredient_name}
                              </span>
                            ) : (
                              ingredient.ingredient_name
                            )}
                            {index < product.ingredients.length - 1 && ", "}
                          </span>
                        )
                      )}
                    </td>
                  </tr>
                  {product?.prescription_required === true && (
                    <tr>
                      <td className="pr-4 pt-4 pb-6 w-1/3 text-[#4A4F63]">
                        Thuốc cần kê toa
                      </td>
                      <td>Có</td>
                    </tr>
                  )}

                  <tr>
                    <td className="pr-4 pt-4 pb-6 w-1/3 text-[#4A4F63]">
                      Mô tả ngắn
                    </td>
                    <td className="pt-4 mb-6">{product?.description}</td>
                  </tr>
                  {product?.prescription_required !== true && (
                    <tr>
                      <td className="pr-4 py-4 w-1/3 text-[#4A4F63]">
                        Chọn số lượng
                      </td>
                      <td className="pl-0 py-4 w-2/3">
                        <div className="flex items-center">
                          <div className="flex items-center border rounded-lg">
                            <button
                              className="px-3 py-2"
                              onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                              className="px-3 py-2"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {product?.prescription_required ? (
              <div className="mt-6">
                <p className="text-[#0053E2] text-sm font-semibold mb-2">
                  Sản phẩm cần tư vấn từ dược sĩ.
                </p>
                <div className="flex space-x-4">
                  <button
                    className="bg-[#0053E2] hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-full w-full"
                    // onClick={}
                  >
                    Tư vấn ngay
                  </button>

                  <button
                    className="bg-[#EAEFFA] text-[#0053E2] font-semibold py-4 px-6 rounded-full w-full"
                    onClick={handleSendPrescription}
                  >
                    Gửi đơn thuốc
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-6">
                <button
                  className="w-1/2 bg-blue-700 text-white py-4 rounded-full font-semibold hover:bg-blue-800"
                  onClick={() => handleAddToCart(true)}
                  disabled={loadingToAddToCart}
                >
                  Mua ngay
                </button>
                <button
                  className="w-1/2 bg-[#EAEFFA] text-[#0053E2] py-4 rounded-full font-semibold"
                  onClick={() => handleAddToCart(false)}
                  disabled={loadingToAddToCart}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            )}

            <div className="mt-6 flex pb-4 items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-[14px] flex">
                  <p>
                    <div className="bg-blue-100 p-1 rounded-full inline-block mr-1 items-center">
                      <IoShieldCheckmark className="inline-block text-lg text-blue-600 " />
                    </div>
                    <strong>Cam kết 100% </strong>hàng chính hãng
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-[14px] flex">
                  <p>
                    <div className="bg-blue-100 p-1 rounded-full inline-block mr-1 items-center">
                      <RiEBikeFill className="inline-block text-lg text-blue-600 " />
                    </div>
                    <strong>Giao Hàng</strong> đúng hẹn
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-[14px] flex">
                  <p>
                    <div className="bg-blue-100 p-1 rounded-full inline-block mr-1 items-center">
                      <FaUserDoctor className="inline-block text-lg text-blue-600 " />
                    </div>
                    <strong>Miễn phí</strong> tư vấn dược sĩ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto rounded-lg mt-12">
        <div className="flex">
          {[
            { id: "details", label: "Chi tiết sản phẩm" },
            { id: "guide", label: "Hướng dẫn mua hàng" },
            { id: "reviews", label: "Đánh giá và Hỏi đáp" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`py-3 px-6 text-white text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-blue-800" : "bg-[#313B41]"
              } ${tab.id !== "reviews" ? "border-r border-gray-600" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="">
          {activeTab === "details" && <DescribeProduct product={product} />}
          {activeTab === "guide" && <Guide />}
          {activeTab === "reviews" && (
            <FeedBack product={product} productId={product?.product_id} />
          )}
        </div>
      </div>
      <ImageDialog
        isOpen={isOpenDialog}
        onClose={() => setIsDialogOpen(false)}
        images={product?.images}
        images_primary={product?.images_primary}
        selectedImage={selectedImageDialog}
        setSelectedImage={setSelectedImageDialog}
      />
    </div>
  );
};

export default DetailProduct;
