import React, { useState } from "react";
import ProductPortfolioCard from "./productMainCategoryCard";
import { ProductData } from "@/types/product";
import medicine1 from "@/images/medicinee.png";
import { generateRandomId } from "@/utils/string";
import Filter from "@/components/Category/filter";
import shopping from "@/images/shopping.png";
import Image from "next/image";
import ProductPersonalCareCard from "./productChildCategoryCard";
import ProductChildCategoryCard from "./productChildCategoryCard";
import { useParams } from "next/navigation";

export default function ProductChildCategoryList({
  data,
  mainCategoryName,
}: {
  data: { childCategory: string; products: any };
  mainCategoryName: string;
}) {
  // const params = useParams() as {
  //   mainCategory: string | string[];
  //   subCategories: string | string[];
  //   childCategories: string | string[];
  // };

  const childCategory = data.childCategory;
  const products = data.products || [];
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Lọc sản phẩm theo giá và thương hiệu
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
          {products.length > 0 ? (
            filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-5 gap-3 max-md:grid-cols-1">
                  {filteredProducts.map((productData: any, index: any) => (
                    <ProductChildCategoryCard
                      key={index}
                      childCategory={childCategory}
                      products={productData}
                      mainCategoryName={mainCategoryName}
                    />
                  ))}
                </div>
                {showAll && (
                  <div className="text-center mt-5">
                    <button
                      className="px-6 py-2 border border-[#0053E2] text-[#0053E2] rounded-lg transition"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "Thu gọn" : "Xem thêm"}
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
