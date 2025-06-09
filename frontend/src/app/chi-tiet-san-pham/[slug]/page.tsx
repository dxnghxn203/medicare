"use client";
import ProductDetail from "@/components/Product/detailProduct";
import ProductsRelatedList from "@/components/Product/productsRelatedList";
import { useProduct } from "@/hooks/useProduct";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/app/loading";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { fetchProductBySlug, productBySlug } = useProduct();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(
      slug,
      () => setLoading(false),
      () => setLoading(false)
    );
  }, [slug]);

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      {loading ? (
        <Loading />
      ) : (
        <main className="flex flex-col px-4 sm:px-6 md:px-10 pt-14 w-full max-w-screen-xl">
          {productBySlug && (
            <div className="text-xs sm:text-sm text-[#0053E2] pb-5 flex flex-wrap gap-1">
              <Link href="/" className="hover:underline text-blue-600">
                Trang chủ
              </Link>
              <span>/</span>
              <Link
                href={`/${productBySlug.category.main_category_slug}`}
                className="hover:underline text-blue-600"
              >
                {productBySlug.category.main_category_name}
              </Link>
              <span>/</span>
              <Link
                href={`/${productBySlug.category.main_category_slug}/${productBySlug.category.sub_category_slug}`}
                className="hover:underline text-blue-600"
              >
                {productBySlug.category.sub_category_name}
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">
                {productBySlug.category.child_category_name}
              </span>
            </div>
          )}

          {/* Product Detail */}
          {productBySlug ? (
            <div className="w-full">
              <ProductDetail product={productBySlug} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-red-500">
                Không tìm thấy sản phẩm
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mt-2">
                Xin lỗi, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm
                kiếm.
              </p>
            </div>
          )}
        </main>
      )}

      {/* Related Products */}
      {productBySlug && (
        <div className="w-full mt-10 px-4 sm:px-6 md:px-10 max-w-screen-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">
            Những sản phẩm liên quan
          </h3>
          <ProductsRelatedList product={productBySlug} />
        </div>
      )}
    </div>
  );
}
