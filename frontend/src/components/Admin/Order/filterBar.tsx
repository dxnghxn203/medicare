import { useState } from "react";

type FilterType = {
  status: string;
  date: string;
  price: string;
};

interface FilterBarProps {
  onFilterChange: (filters: FilterType) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterType>({
    status: "",
    date: "",
    price: "",
  });

  const handleChange = (key: keyof FilterType, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearStatus = () => {
    setFilters((prev) => ({ ...prev, status: "" }));
  };
  const handleClearDate = () => {
    setFilters((prev) => ({ ...prev, date: "" }));
  };
  const handleClearPrice = () => {
    setFilters((prev) => ({ ...prev, price: "" }));
  };

  return (
    <div className="flex gap-4 justify-between">
      {/* Bộ lọc */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Filter by Status</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearStatus}
          >
            Clear
          </span>
        </div>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option>Select status</option>
          <option value="in-stock">Completed</option>
          <option value="out-of-stock">Cancel</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Filter by Order Date</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearDate}
          >
            Clear
          </span>
        </div>

        <input
          type="date"
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Filter by Price</span>
          <span
            className="text-xs cursor-pointer font-normal"
            onClick={handleClearPrice}
          >
            Clear
          </span>
        </div>

        <select
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
          value={filters.price}
          onChange={(e) => handleChange("price", e.target.value)}
        >
          <option value="">Select order</option>
          <option value="rise">Rise</option>
          <option value="desc">Decrease</option>
        </select>
      </div>
    </div>
  );
}
