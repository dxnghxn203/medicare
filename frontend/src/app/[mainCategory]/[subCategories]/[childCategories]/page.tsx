"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductsViewedList from "@/components/Product/productsViewedList";
import { useCategory } from "@/hooks/useCategory";
import { useEffect, useState } from "react";
import ProductChildCategoryList from "@/components/Product/productChildCategoryList ";
import Loading from "@/app/loading";
import ProductFeaturedList from "@/components/Product/productFeaturedList";

export default function CategoryPage() {
  const params = useParams() as {
    mainCategory: string | string[];
    subCategories: string | string[];
    childCategories: string | string[];
  };
  const { mainCategory } = useCategory();
  const { childCategory, fetchChildCategory, fetchSubCategory, subCategory } =
    useCategory();

  const mainCategories = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;

  const subCategories = Array.isArray(params.subCategories)
    ? params.subCategories[0]
    : params.subCategories;
  const childCategories = Array.isArray(params.childCategories)
    ? params.childCategories[0]
    : params.childCategories;

  const categoryTitle = mainCategory?.main_category_name || "Danh mục sản phẩm";

  const [loadingSub, setLoadingSub] = useState(true);
  const [loadingChild, setLoadingChild] = useState(true);

  useEffect(() => {
    fetchSubCategory(
      mainCategories,
      subCategories,
      () => {
        setLoadingSub(false);
      },
      () => {
        setLoadingSub(false);
      }
    );
    fetchChildCategory(
      mainCategories,
      subCategories,
      childCategories,
      () => {
        setLoadingChild(false);
      },
      () => {
        setLoadingChild(false);
      }
    );
  }, []);

  const subCategoriesTitle = subCategory?.sub_category_name || "Danh mục con";
  const childCategoryTitle = childCategory?.child_category_name;

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {loadingSub || loadingChild ? (
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
            <span> / </span>
            <Link
              href={`/${mainCategory?.main_category_slug}/${subCategory?.sub_category_slug}`}
              className="hover:underline text-blue-600"
            >
              {subCategoriesTitle}
            </Link>
            <span className="text-gray-500"> / </span>
            <span className="text-sm text-gray-500">{childCategoryTitle}</span>
          </div>
          <div className="text-2xl font-bold px-5 py-4">
            {childCategoryTitle}
          </div>
          <ProductChildCategoryList
            data={childCategory}
            mainCategoryName={mainCategory?.main_category_name}
          />
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
