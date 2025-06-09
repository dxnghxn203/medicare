"use client";
import { useState, useEffect } from "react";
import FilterBar from "./filterBar";
import Link from "next/link";
import AddNewDropdown from "./addNewDropdown";

import { IoFilter } from "react-icons/io5";
import TableProduct from "./tableProduct";

import { useProduct } from "@/hooks/useProduct";
import { useCategory } from "@/hooks/useCategory";
import { formatDateCSV } from "@/utils/string";
import { getAllProductAdmin } from "@/services/productService";
import { FiDownload } from "react-icons/fi";

function flattenProduct(product: any) {
  return {
    product_id: product.product_id,
    product_name: product.product_name,
    name_primary: product.name_primary,
    slug: product.slug,
    // description: product.description,
    // full_descriptions: product.full_descriptions,
    images_primary: product.images_primary,
    origin: product.origin,
    manufacture_name: product.manufacturer?.manufacture_name,
    manufacture_address: product.manufacturer?.manufacture_address,
    manufacture_contact: product.manufacturer?.manufacture_contact,
    dosage_form: product.dosage_form,
    brand: product.brand,
    uses: product.uses,
    dosage: product.dosage,
    side_effects: product.side_effects,
    precautions: product.precautions,
    storage: product.storage,
    registration_number: product.registration_number,
    certificate_file: product.certificate_file,
    prescription_required: product.prescription_required ? "Kê toa" : "Khong kê toa",
    verified_by: product.verified_by,
    pharmacist_name: product.pharmacist_name,
    pharmacist_gender: product.pharmacist_gender,
    is_approved: product.is_approved ? "Đã duyệt" : "Chưa duyệt",
    rejected_note: product.rejected_note,
    active: product.active ? "Hoạt động" : "Tạm dừng",
    image_list: product.images
      ?.map((image: any) => `${image.images_id}: ${image.images_url}`)
      .join(" | "),
    price_list: product.prices
      ?.map((p: any) => 
        `${p.price_id}-${p.weight}kg (${p.amount}/${p.unit}): ${p.original_price} (${p.discount}%) = ${p.price} (${p.inventory}_${p.sell}_${p.delivery}) (Expired date: ${formatDateCSV(p.expired_date)})`
      )
      .join(" | "),
    main_category_id: product.category?.main_category_id,
    main_category_name: product.category?.main_category_name,
    main_category_slug: product.category?.main_category_slug,
    sub_category_id: product.category?.sub_category_id,
    sub_category_name: product.category?.sub_category_name,
    sub_category_slug: product.category?.sub_category_slug,
    child_category_id: product.category?.child_category_id,
    child_category_name: product.category?.child_category_name,
    child_category_slug: product.category?.child_category_slug,
    ingredient_list: product.ingredients
      ?.map((i: any) => `${i.ingredient_name}: ${i.ingredient_amount}`)
      .join(" | "),
  };
}

const ManagerProducts = () => {
  const {
      getAllProductsAdmin,
      allProductAdmin,
      totalProductAdmin,
      page,
      setPage,
      pageSize,
      setPageSize,
      low_stock_status,
      setLowStockStatus,
      main_category,
      setMainCategory,
      best_seller,
      setBestSeller
    } = useProduct();
  const { fetchAllCategory, allCategory } = useCategory();
  const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchAllCategory();
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    getAllProductsAdmin(() => {}, () => {});
  }, [page, pageSize, low_stock_status, main_category, best_seller]);

  const downloadCSV= (products: any[]) => {
    if (!products || !products.length) return;

    const flattened = products.map(flattenProduct);
    const headers = Object.keys(flattened[0]);

    const csvRows = [
      "\uFEFF" + headers.join(","), // BOM + headers
      ...flattened.map(product =>
        headers.map(h =>
          `"${(product[h as keyof typeof product] ?? "")
            .toString()
            .replace(/"/g, '""')}"`
        )
      )
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    const now = new Date();
    const timestamp = now.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).replace(/[/:]/g, "-").replace(", ", "_");
    const fileName = `Data san pham ${timestamp}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = async () => {
      try {
        const response = await getAllProductAdmin(1, totalProductAdmin, low_stock_status, main_category, best_seller);
  
        if (response.status_code) {
          const products = response.data.products || [];
          downloadCSV(products);
        } else {
          console.log({
            title: "Lỗi tải sản phẩm",
            description: response.message || "Không thể lấy dữ liệu",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.log({
          title: "Lỗi mạng",
          description: "Không thể tải dữ liệu sản phẩm",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">Quản lý sản phẩm</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/san-pham" className="text-gray-800">
          Sản phẩm
        </Link>
         <span> / </span>
        <Link href="/san-pham/quan-ly-san-pham" className="text-gray-800">
          Quản lý sản phẩm
        </Link>
      </div>

      <div className="flex space-x-4"></div>
      <div className="flex justify-between items-center">
        <button
          className="border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
          onClick={() =>{
            setShowFilter(!showFilter)
            setLowStockStatus(null)
            setMainCategory(null)
            setBestSeller(null)
          }}
        >
          <IoFilter className="text-lg" />
          Lọc
        </button>
        <div className="flex gap-2">
          <AddNewDropdown />

          <button
            className="border border-[#1E4DB7] text-[#1E4DB7] px-2 py-2 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-1"
            onClick={handleDownloadCSV}
          >
            <FiDownload className="text-lg" />
            Tải CSV
          </button>
        </div>
      </div>

      {showFilter && (
        <FilterBar
        allCategory={allCategory}
        onFilterChange={(filters) => console.log(filters)}
        low_stock_status={low_stock_status}
        main_category={main_category}
        best_seller={best_seller}
        SetLowStockStatus={setLowStockStatus}
        SetMainCategory={setMainCategory}
        SetBestSeller={setBestSeller}
        />
      )}
      <
        TableProduct
        allProductAdmin={allProductAdmin}
        currentPage={page}
        pageSize={pageSize}
        totalProductAdmin={totalProductAdmin}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default ManagerProducts;
