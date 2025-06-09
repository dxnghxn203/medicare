"use client";
import React, { use, useEffect } from "react";
import Link from "next/link";
import { StaticImageData } from "next/image";
import { useBrand } from "@/hooks/useBrand";
interface BrandProps {
  name: string;
  logo: string;
}

const BrandItem: React.FC<BrandProps> = ({ name, logo }) => (
  <Link
    href={`/thuong-hieu/${encodeURIComponent(name)}`}
    className="flex flex-col"
  >
    <div className="flex flex-col justify-center items-center px-7 rounded-full bg-neutral-100 h-[170px] w-[170px] max-md:px-5">
      <img
        loading="lazy"
        src={logo}
        alt={`${name} logo`}
        className="object-contain w-28 aspect-[1.12]"
      />
    </div>
    <div className="self-center mt-1.5 text-lg font-semibold text-black">
      {name}
    </div>
  </Link>
);

const BrandList: React.FC = () => {
  const { getAllBrandsUser, fetchGetAllBrandUser } = useBrand();
  useEffect(() => {
    fetchGetAllBrandUser(
      () => {},
      () => {}
    );
  }, []);
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14 mb-10">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/BrandList/products-selling" className="text-gray-800">
            Thương hiệu
          </Link>
          <div className="self-start text-2xl font-extrabold text-black py-4">
            Thương hiệu
          </div>

          <div className="grid grid-cols-6 gap-5 justify-items-center py-0.5 w-full max-md:grid-cols-3 max-sm:grid-cols-2">
            {getAllBrandsUser.map((brand: any, index: any) => (
              <BrandItem key={index} {...brand} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandList;
