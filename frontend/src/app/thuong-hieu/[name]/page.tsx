"use client";
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBrand } from "@/hooks/useBrand";
import DOMPurify from "dompurify";
const BrandDetail = () => {
  const {
    fetchGetAllBrandUser,
    getAllBrandsUser,
    getBrandById,
    fetchGetBrandById,
  } = useBrand();
  const params = useParams();
  const name = params.name;
  console.log("name", name);
  console.log("params", params);
  console.log("name", params?.name);
  useEffect(() => {
    fetchGetAllBrandUser(
      () => {},
      () => {}
    );
  }, []);
  console.log("getAllBrandsUser", getAllBrandsUser);
  console.log("getBrandById", getBrandById);

  useEffect(() => {
    if (name && getAllBrandsUser.length > 0) {
      const found = getAllBrandsUser.find((item: any) => item.name === name);
      if (found?.brand_id) {
        console.log("found", found);
        fetchGetBrandById(
          found.brand_id,
          () => {},
          () => {}
        );
      } else {
        console.log("Không tìm thấy thương hiệu");
      }
    }
  }, []);

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14 mb-10">
        <div className="px-5 text-sm text-[#0053E2]">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/thuong-hieu" className="hover:underline text-blue-600">
            Thương hiệu
          </Link>
          <span className="text-gray-800"> / </span>
          <Link href="/thuong-hieu" className="text-gray-800">
            {getBrandById.name}
          </Link>
        </div>
        <div className="px-5 py-4">
          <div className="col-span-5 space-y-6">
            <div className="flex bg-white p-5 rounded-xl shadow-xs border border-gray-200 items-center">
              <div className="w-[400px] flex justify-center">
                <img
                  src={getBrandById.logo}
                  alt=""
                  className="object-cover h-auto max-w-full"
                />
              </div>
              <div className="ml-10 space-y-2">
                <h3 className="text-xl font-bold">{getBrandById.name}</h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(getBrandById.description || ""),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandDetail;
