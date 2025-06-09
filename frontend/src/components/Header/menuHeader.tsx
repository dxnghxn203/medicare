"use client";
import Link from "next/link";
import { useCategory } from "@/hooks/useCategory";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHandHoldingHeart } from "react-icons/fa";
import { TbStarsFilled } from "react-icons/tb";
import { GoChevronDown } from "react-icons/go";

export default function MenuHeader() {
  const {
    allCategory,
    fetchAllCategory,
    mainCategory,
    fetchMainCategory,
    fetchGetCategoryForMenu,
  } = useCategory();
  const router = useRouter();
  const [subCategoryMap, setSubCategoryMap] = useState<{
    [key: string]: any[];
  }>({});

  useEffect(() => {
    fetchAllCategory();
  }, []);

  useEffect(() => {
    if (!allCategory || allCategory.length === 0) return;

    const fetchAllSubcategories = async () => {
      try {
        const promises = allCategory.map((category: any) => {
          return new Promise((resolve) => {
            fetchGetCategoryForMenu(
              category.main_category_slug,
              (data: any) => {
                resolve({
                  slug: category.main_category_slug,
                  subcategories: data.sub_category || [],
                });
              },
              () => {
                resolve({
                  slug: category.main_category_slug,
                  subcategories: [],
                });
              }
            );
          });
        });

        const results = await Promise.all(promises);

        const newSubCategoryMap = results.reduce((acc: any, result: any) => {
          acc[result.slug] = result.subcategories;
          return acc;
        }, {});

        setSubCategoryMap(newSubCategoryMap);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchAllSubcategories();
  }, [allCategory]);

  const handleMouseEnter = async (category: any) => {
    if (
      !subCategoryMap[category.main_category_slug] ||
      subCategoryMap[category.main_category_slug].length === 0
    ) {
      fetchGetCategoryForMenu(
        category.main_category_slug,
        (data: any) => {
          setSubCategoryMap((prevMap) => ({
            ...prevMap,
            [category.main_category_slug]: data.sub_category || [],
          }));
        },
        () => {}
      );
    } else {
    }
  };

  const action = (category: any) => {
    router.push(`/${category.main_category_slug}`);
  };

  const visibleCategories = Array.isArray(allCategory)
    ? allCategory.slice(0, 6)
    : [];
  const extraCategories = Array.isArray(allCategory)
    ? allCategory.slice(6)
    : [];

  return (
    <nav className="hidden md:flex bg-blue-700 py-3 flex justify-center items-center">
      <ul className="flex justify-center space-x-10 font-semibold text-sm ">
        {visibleCategories.map((category: any) => (
          <div key={category.main_category_slug}>
            <li className="flex items-center relative group">
              <button
                onClick={() => action(category)}
                onMouseEnter={() => handleMouseEnter(category)}
                className="flex items-center justify-between w-full text-white rounded-sm md:w-auto uppercase"
              >
                {category.main_category_name}
              </button>
              <GoChevronDown className="w-4 h-4 ml-1 text-white" />
              <div className="absolute left-0 top-full bg-white shadow rounded-lg hidden group-hover:block z-10">
                <ul className="text-sm py-2">
                  <li
                    className="flex items-center gap-2 px-4 py-2 text-[#0053E2] uppercase whitespace-nowrap cusor-pointer"
                    onClick={() =>
                      router.push(`/${category.main_category_slug}`)
                    }
                  >
                    Xem tất cả {category.main_category_name}
                  </li>
                  <li className="flex gap-2 flex-col whitespace-nowrap font-medium">
                    {subCategoryMap[category.main_category_slug]?.map(
                      (subCategory: any) => (
                        <Link
                          key={subCategory.sub_category_slug}
                          href={`/${category.main_category_slug}/${subCategory.sub_category_slug}`}
                          className="hover:bg-blue-100 px-4 py-3"
                        >
                          {subCategory.sub_category_name}
                        </Link>
                      )
                    )}
                  </li>
                </ul>
              </div>
            </li>
          </div>
        ))}

        {/* Góc sức khỏe */}
        <li className="relative group text-white uppercase">
          <div
            className="cursor-pointer flex items-center"
            onClick={() => router.push("/bai-viet")}
          >
            Góc sức khỏe
          </div>
        </li>

        {/* Khác - hiển thị phần dư */}
        <li className="relative group text-white uppercase">
          <div className="cursor-pointer hover:text-blue-500">Khác</div>
          {extraCategories.length > 0 && (
            <div className="absolute left-0 top-full mt-0 bg-white border border-gray-200 shadow-lg rounded-lg hidden group-hover:block z-10 w-[200px]">
              <ul className="text-sm text-gray-700 py-2">
                {extraCategories.map((category: any) => (
                  <li
                    key={category.main_category_slug}
                    onClick={() => action(category)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {category.main_category_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
