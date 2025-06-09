import { useCategory } from "@/hooks/useCategory";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MenuFullDropdownProps {
  mainCategoryData: string;
}

const MenuFullDropdown = ({ mainCategoryData }: MenuFullDropdownProps) => {
    const { fetchMainCategory, mainCategory } = useCategory();
    const [categoryData, setCategoryData] = useState<any>(null);
    
    // Sử dụng useEffect thay vì useMemo để fetch dữ liệu khi mainCategoryData thay đổi
    // useEffect(() => {
    //     const loadData = async () => {
    //         await fetchMainCategory(mainCategoryData);
    //         setCategoryData(mainCategory);
    //     };

    //     loadData();
    // }, [mainCategoryData, fetchMainCategory]);
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryData && categoryData.sub_category && categoryData.sub_category.length > 0 ? (
                    categoryData.sub_category.map((subCategory: any) => (
                        <div key={subCategory.sub_category_id} className="mb-6">
                            <h3 className="text-lg font-semibold text-blue-700 mb-4 pb-2 border-b border-gray-200">
                                <Link
                                    href={`/${mainCategoryData}/${subCategory.sub_category_slug}`}
                                    className="hover:text-blue-900 transition-colors"
                                >
                                    {subCategory.sub_category_name}
                                </Link>
                            </h3>
                            <ul className="space-y-2">
                                {subCategory.child_category && subCategory.child_category.map((childCategory: any) => (
                                    <li key={childCategory.child_category_id}>
                                        <Link
                                            href={`/${mainCategoryData}/${subCategory.sub_category_slug}/${childCategory.child_category_slug}`}
                                            className="text-gray-600 hover:text-blue-700 transition-colors flex items-center"
                                        >
                                            <span className="mr-1.5 text-xs">►</span>
                                            {childCategory.child_category_name}
                                        </Link>
                                    </li>
                                ))}
                                {subCategory.child_category && subCategory.child_category.length > 0 && (
                                    <li className="pt-2">
                                        <Link
                                            href={`/${mainCategoryData}/${subCategory.sub_category_slug}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                        >
                                            Xem tất cả
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div className="col-span-4 text-center py-4">Không có danh mục nào</div>
                )}
            </div>
        </>
    );
}

export default MenuFullDropdown;