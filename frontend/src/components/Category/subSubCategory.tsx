"use client";
import Image from "next/image";
import Link from "next/link";

export default function SubSubCategory({
  sub_category,
  main_category,
}: {
  sub_category: any;
  main_category: any;
}) {
  return (
    <div>
      {sub_category &&
      sub_category?.child_category &&
      sub_category?.child_category.length > 0 ? (
        <div className="flex justify-start gap-6 flex-wrap px-5">
          {sub_category?.child_category.map((child: any, index: any) => (
            <Link
              // key={child.child_category_slug}
              href={`/${main_category?.main_category_slug}/${sub_category?.sub_category_slug}/${child?.child_category_slug}`}
            >
              <div key={index} className="flex flex-col items-center">
                <div className="rounded-full bg-[#EAEFFA] w-[130px] h-[130px] flex items-center justify-center">
                  <Image
                    src={child?.child_image_url}
                    alt="icon"
                    width={100}
                    height={100}
                    className="object-contain bg-transparent"
                  />
                </div>
                <span className="mt-2 w-[130px] text-center">
                  {child?.child_category_name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>Không có danh mục con nào.</p>
      )}
    </div>
  );
}
