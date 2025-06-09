import { useState, useEffect } from "react";

type FilterType = {
  role: string;
  nameOrder: string;
  date: string;
  procedure: string;
  status: string;
};

interface FilterBarProps {
  onFilterChange: (filters: FilterType) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterType>({
    role: "",
    nameOrder: "",
    date: "",
    procedure: "",
    status: "",
  });

  const handleChange = (key: keyof FilterType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearRole = () => {
    setFilters((prev) => ({ ...prev, role: "" }));
  };
  const handleClearNameOrder = () => {
    setFilters((prev) => ({ ...prev, nameOrder: "" }));
  };
  const handleClearDate = () => {
    setFilters((prev) => ({ ...prev, date: "" }));
  };
  const handleClearProcedure = () => {
    setFilters((prev) => ({ ...prev, procedure: "" }));
  };
  const handleClearStatus = () => {
    setFilters((prev) => ({ ...prev, status: "" }));
  };

  // Gửi bộ lọc mỗi khi filters thay đổi
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="flex gap-6 justify-between">
      {/* Nhóm 1: Role + Tên */}
      <div className="flex flex-col gap-4">
        {/* Lọc theo role */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-semibold text-sm">
            <span>Lọc theo role</span>
            <span
              className="text-xs cursor-pointer font-normal"
              onClick={handleClearRole}
            >
              Xóa
            </span>
          </div>
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
            value={filters.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <option value="">Chọn role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Lọc theo tên */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-semibold text-sm">
            <span>Lọc theo tên</span>
            <span
              className="text-xs cursor-pointer font-normal"
              onClick={handleClearNameOrder}
            >
              Xóa
            </span>
          </div>
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
            value={filters.nameOrder}
            onChange={(e) => handleChange("nameOrder", e.target.value)}
          >
            <option value="">Chọn thứ tự</option>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
      </div>

      {/* Nhóm 3: Phương thức + Trạng thái */}
      <div className="flex flex-col gap-4">
        {/* Lọc theo phương thức */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-semibold text-sm">
            <span>Lọc theo phương thức</span>
            <span
              className="text-xs cursor-pointer font-normal"
              onClick={handleClearProcedure}
            >
              Xóa
            </span>
          </div>
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
            value={filters.procedure}
            onChange={(e) => handleChange("procedure", e.target.value)}
          >
            <option value="">Chọn phương thức</option>
            <option value="google">Google</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Lọc theo trạng thái */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-semibold text-sm">
            <span>Lọc theo trạng thái</span>
            <span
              className="text-xs cursor-pointer font-normal"
              onClick={handleClearStatus}
            >
              Xóa
            </span>
          </div>
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">Chọn trạng thái</option>
            <option value="inactive">Chưa kích hoạt</option>
            <option value="active">Đã kích hoạt</option>
          </select>
        </div>
      </div>

      {/* Nhóm 2: Ngày tạo */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-semibold text-sm">
            <span>Lọc theo ngày tạo</span>
            <span
              className="text-xs cursor-pointer font-normal"
              onClick={handleClearDate}
            >
              Xóa
            </span>
          </div>
          <input
            type="date"
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
            value={filters.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
