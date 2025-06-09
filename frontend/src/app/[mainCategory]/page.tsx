"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductMainCategoryList from "@/components/Product/productMainCategoryList";
import ProductsViewedList from "@/components/Product/productsViewedList";
import { useCategory } from "@/hooks/useCategory";
import { useEffect, useState } from "react";
import CategoryList from "@/components/Category/categoryList";
import Loading from "../loading";
import ProductFeaturedList from "@/components/Product/productFeaturedList";

export default function MainCategoryPage() {
  const params = useParams() as {
    mainCategory: string | string[];
  };
  const { mainCategory, fetchMainCategory } = useCategory();
  const [loading, setLoading] = useState(false);
  console.log("params", params);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetchMainCategory(
        params.mainCategory,
        () => {
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {loading ? (
        <Loading />
      ) : (
        <>
          <main className="flex flex-col pt-14">
            <div className="text-sm text-[#0053E2] px-5">
              <Link href="/" className="hover:underline text-blue-600">
                Trang chủ
              </Link>
              <span className="text-gray-500">
                / {mainCategory?.main_category_name}
              </span>
            </div>
            <div className="text-2xl font-bold px-5 py-4">
              {mainCategory?.main_category_name}
            </div>
            <CategoryList data={mainCategory} />
            <div className="mt-6">
              <ProductMainCategoryList
                data={mainCategory}
                maincategoryId={mainCategory?.main_category_id}
                mainCategoryName={mainCategory?.main_category_name}
              />
            </div>
          </main>
        </>
      )}
      <div className="text-2xl font-extrabold text-black px-5 pt-10">
        Sản phẩm nổi bật
      </div>
      <div className="px-5">
        <ProductFeaturedList
          data={mainCategory}
          maincategoryId={mainCategory?.main_category_id}
          mainCategoryName={mainCategory?.main_category_name}
        />
      </div>
      <div className="text-2xl font-extrabold text-black px-5 pt-10">
        Sản phẩm vừa xem
      </div>
      <div className="px-5">
        <ProductsViewedList />
      </div>
    </div>
  );
}
