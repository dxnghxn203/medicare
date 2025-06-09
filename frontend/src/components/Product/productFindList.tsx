"use client";
import React, { useEffect, useState } from "react";
import Filter from "@/components/Category/filter";
import shopping from "@/images/shopping.png";
import Image from "next/image";
import { useProduct } from "@/hooks/useProduct";
import ProductFindCard from "./productFindCard";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

export default function ProductFindList() {
  const { fetchSearchProduct, searchResult } = useProduct();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);
  const searchParams = useSearchParams();
  const keyword = searchParams.get("search");
  const pathname = usePathname();
  useEffect(() => {
    const shouldFetch =
      typeof window !== "undefined" &&
      sessionStorage.getItem("searchTriggered") === "true";
    if (keyword && shouldFetch) {
      setLoading(true);
      fetchSearchProduct(
        {
          query: keyword,
        },
        () => {
          setProducts(searchResult);
          setLoading(false);
        },
        () => {
          setLoading(false);
          sessionStorage.removeItem("searchTriggered");
        }
      );
    }
  }, [keyword]);

  console.log("Product:", products);
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  let sortedProducts = [...products];

  let filteredProducts = products.filter((product: any) => {
    const price = product.prices?.[0]?.price || 0;
    const brand = product.brand || "";
    const withinPriceRange =
      price >= priceFilter.min && price <= priceFilter.max;
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(brand);
    return withinPriceRange && matchesBrand;
  });

  if (sortOrder === "asc") {
    filteredProducts.sort(
      (a: any, b: any) =>
        (a.prices?.[0]?.price || 0) - (b.prices?.[0]?.price || 0)
    );
  } else if (sortOrder === "desc") {
    filteredProducts.sort(
      (a: any, b: any) =>
        (b.prices?.[0]?.price || 0) - (a.prices?.[0]?.price || 0)
    );
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <Filter
        onPriceFilterChange={setPriceFilter}
        onBrandFilterChange={setSelectedBrands}
      />

      <div className="col-span-5 mr-5 space-y-6">
        <div className="flex space-x-4 items-center">
          <span className="">Sắp xếp theo</span>
          <button
            className={`px-6 py-2 border rounded-lg text-semibold ${
              sortOrder === "asc"
                ? "border-blue-600 text-blue-600"
                : "border-gray-300 text-black/50"
            }`}
            onClick={() => setSortOrder("asc")}
          >
            Giá tăng dần
          </button>
          <button
            className={`px-6 py-2 border rounded-lg text-semibold ${
              sortOrder === "desc"
                ? "border-blue-600 text-blue-600"
                : "border-gray-300 text-black/50"
            }`}
            onClick={() => setSortOrder("desc")}
          >
            Giá giảm dần
          </button>
        </div>
        <div className="w-full max-md:px-5 max-md:max-w-full">
          <div className="text-gray-500 text-sm mb-4">
            Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
          </div>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="flex flex-row gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                </div>
                <p className="mt-2 text-lg">Loading...</p>
              </div>
            </div>
          ) : products && products.length > 0 ? (
            filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-5 gap-3 max-md:grid-cols-1">
                  {(showAll
                    ? filteredProducts
                    : filteredProducts.slice(0, topN)
                  ).map((productData: any, index: any) => (
                    <ProductFindCard key={index} products={productData} />
                  ))}
                </div>
                {filteredProducts.length > topN && (
                  <div className="text-center mt-5">
                    <button
                      className="px-6 py-2 text-[#0053E2] rounded-lg transition text-sm font-medium"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll
                        ? "Thu gọn"
                        : `Xem thêm (${
                            filteredProducts.length - topN
                          } sản phẩm)`}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                <Image
                  src={shopping}
                  alt="No products"
                  width={150}
                  height={150}
                />
                <p className="mt-2">Không có sản phẩm nào</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 py-10">
              <Image
                src={shopping}
                alt="No products"
                width={150}
                height={150}
              />
              <p className="mt-2">Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
