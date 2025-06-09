import { useOrder } from "@/hooks/useOrder";
import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#EF4444", // Red-500
  "#3B82F6", // Blue-500
  "#10B981", // Green-500
  "#F59E0B", // Amber-500
  "#8B5CF6", // Violet-500
  "#EC4899", // Pink-500
  "#F97316", // Orange-500
  "#14B8A6", // Teal-500
];

export default function CategoryRevenueChart() {
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7);
  const [currentMonth, setCurrentMonth] = useState(currentMonthStr);
  const [salesData, setSalesData] = useState<{ name: string; value: number }[]>(
    []
  );
  const { fetchGetCategoryMonthlyRevenueStatisticsOrder } = useOrder();

  useEffect(() => {
    const [year, month] = currentMonth.split("-");
    fetchGetCategoryMonthlyRevenueStatisticsOrder(
      parseInt(month),
      parseInt(year),
      (data) => {
        const formattedData = (data || []).map((item: any) => ({
          name: item.category_name,
          value: item.revenue,
        }));
        setSalesData(formattedData);
      },
      () => {
        setSalesData([]);
      }
    );
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + 1);
    const nextMonthStr = date.toISOString().slice(0, 7);

    if (nextMonthStr <= currentMonthStr) {
      setCurrentMonth(nextMonthStr);
    }
  };

  const total = salesData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full h-[420px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Doanh thu theo danh mục
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="text-xl text-gray-500 hover:text-gray-700 p-1 border rounded-full"
          >
            <MdNavigateBefore />
          </button>
          <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
            {new Date(currentMonth).toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </button>
          <button
            onClick={handleNextMonth}
            disabled={currentMonth >= currentMonthStr}
            className={`text-xl p-1 border rounded-full ${
              currentMonth >= currentMonthStr
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MdNavigateNext />
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Danh sách danh mục */}
        <div className="w-1/2 space-y-3 pr-4">
          {salesData.map((item, index) => {
            const percent = total ? ((item.value / total) * 100).toFixed(0) : 0;
            return (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-gray-500">– {percent}%</span>
              </div>
            );
          })}
        </div>

        {/* Biểu đồ Pie */}
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                cornerRadius={8}
              >
                {salesData.map((_, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `${new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)}`
                }
                
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
