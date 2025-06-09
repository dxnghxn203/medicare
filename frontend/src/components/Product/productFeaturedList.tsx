import React, { useEffect, useState } from "react";
import Filter from "@/components/Category/filter";
import shopping from "@/images/shopping.png";
import Image from "next/image";
import ProductMainCategoryCard from "./productMainCategoryCard";
import { useProduct } from "@/hooks/useProduct";
import Link from "next/link";
import ProductFeaturedCard from "./productFeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";

export default function ProductFeaturedList({
  data,
  maincategoryId,
  mainCategoryName,
}: {
  data: { subCategory: string; products: any };
  maincategoryId: string | null;
  mainCategoryName: string;
}) {
  // console.log("MainCategoryId:", maincategoryId);
  const { fetchProductFeatured, productRelated } = useProduct();
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(5);

  useEffect(() => {
    if (maincategoryId) {
      fetchProductFeatured(
        maincategoryId,
        null,
        null,
        topN,
        () => {
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    }
  }, []);

  // console.log("Product:", productRelated);

  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  // const sortedAndFilteredProducts = [...productRelated]
  //   .filter(
  //     (product) =>
  //       product.price >= priceFilter.min &&
  //       product.price <= priceFilter.max &&
  //       (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
  //   )
  //   .sort((a, b) => {
  //     if (sortOrder === "asc") return a.price - b.price;
  //     if (sortOrder === "desc") return b.price - a.price;
  //     return 0;
  //   });

  return (
    <div className="w-full max-md:max-w-full mt-6">
      <Link href="/bo-suu-tap/deals-tot-nhat-danh-cho-ban">
        <div className="flex flex-wrap gap-5 justify-between items-start w-full text-black mt-[-30px]">
          <div className="flex gap-4 text-sm font-semibold ml-auto items-center">
            <div>Tất cả sản phẩm</div>
            <FaArrowRightLong />
          </div>
        </div>
      </Link>
      <div className="w-full max-md:max-w-full mt-5">
        {productRelated && productRelated.length > 0 ? (
          <>
            <div className="grid grid-cols-5 gap-6 max-md:grid-cols-2">
              {productRelated &&
                productRelated
                  .slice(0, 5)
                  .map((productData: any, index: any) => (
                    <ProductFeaturedCard
                      key={index}
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
            <Image src={shopping} alt="No products" width={150} height={150} />
            <p className="mt-2">Không có sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
