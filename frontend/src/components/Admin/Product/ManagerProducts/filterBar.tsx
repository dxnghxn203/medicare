import { useState } from "react";

type FilterType = {
  stockStatus: string;
  category: string;
  bestSeller: string;
  productType: string;
};

interface FilterBarProps {
  onFilterChange: (filters: FilterType) => void;
  low_stock_status: any;
  main_category: any;
  best_seller: any;
  allCategory: any[];
  SetLowStockStatus: (palow_stock_statuse: any) => void;
  SetMainCategory: (main_category: any) => void;
  SetBestSeller: (best_seller: any) => void;
}

export default function FilterBar({
    allCategory,
    onFilterChange,
    low_stock_status,
    main_category,
    best_seller,
    SetLowStockStatus,
    SetMainCategory,
    SetBestSeller
  }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterType>({
    stockStatus: "",
    category: "",
    bestSeller: "",
    productType: "",
  });

  const handleChange = (key: keyof FilterType, value: string) => {
    setFilters({ ...filters, [key]: value });

    switch (key) {
    case "stockStatus":
      if (value === "low-stock") SetLowStockStatus(true);
      else if (value === "out-of-stock") SetLowStockStatus(false);
      else SetLowStockStatus(null);
      break;
    case "category":
      SetMainCategory(value || null);
      break;
    case "bestSeller":
      if (value === "yes") SetBestSeller(true);
      else if (value === "no") SetBestSeller(false);
      else SetBestSeller(null);
      break;
  }
  };

  const handleClearBestSeller = () => {
    setFilters((prev) => ({ ...prev, bestSeller: "" }));
    SetBestSeller(null);
  };
  const handleClearCategory = () => {
    setFilters((prev) => ({ ...prev, category: "" }));
    SetMainCategory(null);
  };
  const handleClearStock = () => {
    setFilters((prev) => ({ ...prev, stockStatus: "" }));
    SetLowStockStatus(null);
  };

  return (
    <div className="flex gap-4 justify-between">
      {/* Bộ lọc */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Lọc theo tồn kho</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearStock}
          >
            Clear
          </span>
        </div>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.stockStatus}
          onChange={(e) => handleChange("stockStatus", e.target.value)}
        >
          <option value="" disabled hidden>Chọn trạng thái tồn kho</option>
          <option value="in-stock">Còn hàng</option>
          <option value="out-of-stock">Hết hàng</option>
          <option value="low-stock">Sắp hết hàng</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Danh mục chính</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearCategory}
          >
            Xóa
          </span>
        </div>

        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="" disabled hidden>Chọn danh mục chính</option>
          {allCategory.map((category) => (
            <option key={category.main_category_id} value={category.main_category_id}>
              {category.main_category_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Sản phẩm bán chạy</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearBestSeller}
          >
            Xóa
          </span>
        </div>

        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.bestSeller}
          onChange={(e) => handleChange("bestSeller", e.target.value)}
        >
          <option value="" disabled hidden>Select best seller</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>
  );
}
