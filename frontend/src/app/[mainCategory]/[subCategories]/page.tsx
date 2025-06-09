"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductsViewedList from "@/components/Product/productsViewedList";
import SubSubCategory from "@/components/Category/subSubCategory";
import { useCategory } from "@/hooks/useCategory";
import { useMemo, useState } from "react";
import ProductSubCategoryList from "@/components/Product/productSubCategoryList";
import Loading from "@/app/loading";
import ProductFeaturedList from "@/components/Product/productFeaturedList";

export default function CategoryPage() {
  const params = useParams() as {
    mainCategory: string | string[];
    subCategories: string | string[];
  };
  const { subCategory, fetchSubCategory } = useCategory();
  const { mainCategory } = useCategory();

  const mainCategories = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;
  const subCategories = Array.isArray(params.subCategories)
    ? params.subCategories[0]
    : params.subCategories;
  const categoryTitle = mainCategory?.main_category_name || "Danh mục sản phẩm";
  const [loading, setLoading] = useState(false);
  useMemo(() => {
    setLoading(true);
    fetchSubCategory(
      mainCategories,
      subCategories,
      () => {
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  }, []);
  console.log("subCategory", subCategory);

  const subCategoriesTitle = subCategory?.sub_category_name || "Danh mục con";

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      {loading ? (
        <Loading />
      ) : (
        <main className="flex flex-col pt-14">
          <div className="text-sm text-[#0053E2] px-5">
            <Link href="/" className="hover:underline text-blue-600">
              Trang chủ
            </Link>
            <span> / </span>
            <Link
              href={`/${mainCategory?.main_category_slug}`}
              className="hover:underline text-blue-600"
            >
              {categoryTitle}
            </Link>
            <>
              <span className="text-gray-500"> / </span>
              <span className="text-sm text-gray-500">
                {subCategoriesTitle}
              </span>
            </>
          </div>
          <div className="text-2xl font-bold px-5 py-4">
            {subCategoriesTitle}
          </div>
          <SubSubCategory
            sub_category={subCategory}
            main_category={mainCategory}
          />
          <div className="mt-6">
            <ProductSubCategoryList
              data={subCategory}
              mainCategoryName={mainCategory?.main_category_name}
            />
          </div>
        </main>
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
