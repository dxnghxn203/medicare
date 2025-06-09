"use client";
import { useState, useEffect, useRef } from "react";
import { useCategory } from "@/hooks/useCategory";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { IoMdLogOut } from "react-icons/io";
import { X } from "lucide-react";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  const { allCategory, fetchAllCategory, fetchGetCategoryForMenu } =
    useCategory();

  const [subCategoryMap, setSubCategoryMap] = useState<{
    [key: string]: any[];
  }>({});

  useEffect(() => {
    fetchAllCategory();
  }, []);

  useEffect(() => {
    if (!allCategory || allCategory.length === 0) return;

    const fetchSubs = async () => {
      const promises = allCategory.map(
        (category: any) =>
          new Promise((resolve) => {
            fetchGetCategoryForMenu(
              category.main_category_slug,
              (data) => {
                resolve({
                  slug: category.main_category_slug,
                  subcategories: data.sub_category || [],
                });
              },
              () =>
                resolve({
                  slug: category.main_category_slug,
                  subcategories: [],
                })
            );
          })
      );

      const results = await Promise.all(promises);

      const map = results.reduce((acc, item) => {
        acc[item.slug] = item.subcategories;
        return acc;
      }, {});

      setSubCategoryMap(map);
    };

    fetchSubs();
  }, [allCategory]);

  return (
    <>
      <div className="flex items-center bg-blue-700 py-3 text-white">
        <IoMenu
          size={28}
          onClick={() => setOpen(true)}
          className="cursor-pointer"
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b">
          {isAuthenticated ? (
            <div className="relative py-3">
              <X
                size={24}
                className="absolute top-0 right-2 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => setOpen(false)}
              />

              <div className="relative" ref={dropdownRef}>
                <Link
                  href="/ca-nhan"
                  className="focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative flex items-center cursor-pointer px-3 py-1 rounded-full transition">
                    <div className="rounded-full bg-white/20 flex items-center justify-center">
                      {user?.image ? (
                        <img
                          src={user?.image}
                          alt={"User"}
                          className="text-2xl rounded-full object-cover w-10 h-10"
                        />
                      ) : (
                        <HiOutlineUserCircle className="text-2xl" />
                      )}
                    </div>

                    <div className="ml-2 flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {user?.name || user?.user_name || ""}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                </Link>

                <div
                  className="flex items-center cursor-pointer px-3 py-1 rounded-full hover:bg-red-100 text-red-500"
                  onClick={() => {
                    logout(
                      "user",
                      () => {
                        console.log("Đăng xuất thành công");
                      },
                      (error) => {
                        console.error("Đăng xuất thất bại!", error);
                      }
                    );
                    setOpen(false);
                    router.push("/");
                  }}
                >
                  <IoMdLogOut className="text-2xl" />
                  <span className="ml-2 text-[14px]">Đăng xuất</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link href="/dang-nhap" className="focus:outline-none">
                <div
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center cursor-pointer px-2 py-1 rounded-full w-[120px] h-[48px] transition ${
                    pathname === "/dang-nhap"
                      ? "bg-[#002E99] text-white"
                      : "hover:bg-blue-100 text-blue-700"
                  }`}
                >
                  <HiOutlineUserCircle className="text-2xl" />
                  <span className="ml-2 text-[14px]">Đăng nhập</span>
                </div>
              </Link>
            </div>
          )}

          <X
            size={36}
            className="cursor-pointer px-2 text-2xl"
            onClick={() => setOpen(false)}
          />
        </div>
        <ul className="p-4 space-y-3 overflow-y-auto max-h-[90vh]">
          {allCategory.map((category: any) => (
            <li key={category.main_category_slug}>
              <Link
                href={`/${category.main_category_slug}`}
                className="text-blue-700 font-semibold"
              >
                {category.main_category_name}
              </Link>
              <ul className="ml-4 mt-1 text-sm text-gray-600 space-y-1">
                {subCategoryMap[category.main_category_slug]?.map((sub) => (
                  <li key={sub.sub_category_slug}>
                    <Link
                      href={`/${category.main_category_slug}/${sub.sub_category_slug}`}
                    >
                      {sub.sub_category_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          <li className="">
            <Link href="/goc-suc-khoe" className="text-blue-700 font-semibold">
              Góc sức khỏe
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
