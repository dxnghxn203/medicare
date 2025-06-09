"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Images
import categories1 from "@/images/ct.jpg";
import categories2 from "@/images/2.jpg";
import categories3 from "@/images/3.jpg";
import categories4 from "@/images/4.jpg";
import categories5 from "@/images/5.jpg";
import categories6 from "@/images/category6.jpg";
import categories7 from "@/images/7.jpg";
import categories8 from "@/images/categories8.png";
import slider3 from "@/images/slider3.webp";
import tracuuthuoc from "@/images/tracuuthuoc.png";
import duocmypham from "@/images/duocmypham.png";
import bannerVoucher from "@/images/bannerVoucher.png";
import bannerCovid from "@/images/banner.png";
import bannerhe from "@/images/bannerhe.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const images = [slider3, bannerVoucher, duocmypham, bannerhe];

const ProductCatalog: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const categories = [
    {
      title: "Mẹ và bé",
      description: "Sữa cho mẹ, tinh dầu bé...",
      imageSrc: categories1,
      bgColor: "bg-red-100",
      path: "/me-va-be",
    },
    {
      title: "Thiết bị y tế",
      description: "Gạc, Bông gòn, Cồn...",
      imageSrc: categories2,
      bgColor: "bg-cyan-100",
      path: "/trang-thiet-bi-y-te",
    },
    {
      title: "Dược mỹ phẩm",
      description: "Serum, Dưỡng trắng...",
      imageSrc: categories3,
      bgColor: "bg-orange-100",
      path: "/duoc-my-pham",
    },
    {
      title: "Thuốc",
      description: "Thuốc kê đơn, không kê đơn...",
      imageSrc: categories4,
      bgColor: "bg-lime-100",
      path: "/thuoc",
    },
    {
      title: "Thực phẩm chức năng",
      description: "Hỗ trợ tăng cường...",
      imageSrc: categories5,
      bgColor: "bg-violet-200",
      path: "/thuc-pham-chuc-nang",
    },
    {
      title: "Chăm sóc cá nhân",
      description: "Xịt thơm miệng...",
      imageSrc: categories6,
      bgColor: "bg-blue-100",
      path: "/cham-soc-ca-nhan",
    },
    {
      title: "Hỗ trợ giấc ngủ",
      description: "An thần, Ngủ ngon...",
      imageSrc: categories7,
      bgColor: "bg-amber-100",
      path: "/thuc-pham-chuc-nang/than-kinh-nao/ho-tro-giac-ngu-ngon",
    },
    {
      title: "Phong độ bền lâu",
      description: "Hỗ trợ sinh lý...",
      imageSrc: categories8,
      bgColor: "bg-orange-200",
      path: "/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to",
    },
  ];
  const canGoNext = currentIndex < images.length - 1;
  const canGoPrev = currentIndex > 0;

  return (
    <div className="pt-20">
      {/* Slider */}
      <div className="flex flex-col lg:flex-row gap-4 max-w-full">
        {/* Carousel chính */}
        <div className="relative w-full overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="min-w-full">
                <Image
                  src={image}
                  alt={`Slide ${index}`}
                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-xl"
                />
              </div>
            ))}
          </div>

          {/* Nút điều hướng bên trái */}
          {canGoPrev && (
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md bg-black/30 text-white hover:scale-110 transition"
            >
              <FaChevronLeft size={16} />
            </button>
          )}

          {/* Nút điều hướng bên phải */}
          {canGoNext && (
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md bg-black/30 text-white hover:scale-110 transition"
            >
              <FaChevronRight size={16} />
            </button>
          )}

          {/* Chấm trượt */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === idx ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hình ảnh nhỏ chỉ hiện trên desktop */}
        <div className="hidden lg:flex flex-col w-[450px] gap-4">
          <Image
            src={tracuuthuoc}
            alt="Tra cứu thuốc"
            className="w-full h-1/2 object-cover rounded-xl"
          />
          <Image
            src={bannerCovid}
            alt="Dược mỹ phẩm"
            className="w-full h-1/2 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Product Categories */}
      <div className="mt-4 text-2xl font-extrabold text-black">
        Danh mục sản phẩm
      </div>
      <div className="w-full max-md:max-w-full">
        <div className="self-center w-full mt-0 md:mt-5">
          <div className="grid grid-cols-4 md:gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {categories.map((category, index) => (
              <Link key={index} href={category.path} passHref>
                <div
                  className={`flex grow gap-5 justify-between items-start pt-4 pl-3.5 w-full text-black ${category.bgColor} rounded-xl max-md:mt-8 hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex flex-col self-start">
                    <div className="text-base font-semibold">
                      {category.title}
                    </div>
                    <div className="self-start mt-3 text-sm">
                      {category.description}
                    </div>
                  </div>
                  <Image
                    src={category.imageSrc}
                    alt={category.title}
                    width={88}
                    height={88}
                    className="object-contain shrink-0 self-end mt-6 aspect-square rounded-br-xl"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
