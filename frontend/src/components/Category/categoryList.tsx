"use client";
import { useParams } from "next/navigation";
import CategoryCard from "@/components/Category/categoryCard";

export default function CategoryList({
  data,
}: {
  data: { mainCategory: string; sub_category: string } | any;
}) {
  const params = useParams() as {
    mainCategory: string | string[];
    subCategories: string | string[];
    childCategories: string | string[];
  }
  const mainCategory = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;

  // console.log("mammain_category", mainCategory);
  const sub_category = data?.sub_category || [];
  // console.log("sub_category", sub_category);

  return (
    <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sub_category && sub_category.length > 0 ? (
        sub_category.map((categoryData: any, index: any) => (
          <CategoryCard
            key={index}
            mainCategory={mainCategory}
            subCategories={categoryData}
          />
        ))
      ) : (
        <p className="text-center w-full text-gray-500">
          Không có sản phẩm nào.
        </p>
      )}
    </div>
  );
}
