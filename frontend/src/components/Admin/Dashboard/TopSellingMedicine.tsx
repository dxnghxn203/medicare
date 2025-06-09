// components/TopSellingMedicine.jsx
import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import image from "@/images/2.jpg";
import { useOrder } from "@/hooks/useOrder";

const colors = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-lime-400",
  "bg-pink-500",
  "bg-purple-500",
  "bg-teal-500",
];

export default function TopSellingMedicine() {
  const { fetchGetMonthlyTopSellingProductStatistics } = useOrder();
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7);
  const [currentMonth, setCurrentMonth] = useState(currentMonthStr);
  const [salesData, setSalesData] = useState<
    {
      // day: string;
      value: number;
      color: string;
      // image: string;
      name: string
    }[]
  >([]);

  useEffect(() => {
    const [year, month] = currentMonth.split("-");
    fetchGetMonthlyTopSellingProductStatistics(
      parseInt(month),
      parseInt(year),
      3,
      (data) => {
        const mappedData = data.map((item: any, idx: any) => ({
          // day: (idx + 1).toString().padStart(2, "0"),
          value: item.total_quantity,
          color: colors[idx % colors.length],
          // image: item.images_primary || image.src,
          name: item.product_name,
        }));
        setSalesData(mappedData);
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

  const rawMax = Math.max(...salesData.map((d) => d.value), 10);
  const digits = Math.floor(Math.log10(rawMax));
  const roundTo = 10 ** digits;
  const maxValue = Math.ceil(rawMax / roundTo) * roundTo;
  const step = Math.ceil(maxValue / 5);
  const chartHeight = 256;

  const yLabels = [];
  for (let i = maxValue; i >= 0; i -= step) {
    yLabels.push(i);
  }

  return (
    <div className="rounded-2xl shadow p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Top thuốc bán chạy nhất
        </h2>
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

      {/* Biểu đồ */}
      <div className="flex gap-4">
        {/* Trục Y */}
        <div className="w-14 h-64 flex flex-col justify-between items-end">
          {yLabels.map((label, idx) => (
            <div key={idx} className="flex items-center justify-end h-0 relative">
              <span className="text-xs text-gray-500 absolute -left-2 translate-x-[-100%]">
                {label.toLocaleString()}
              </span>
              <div className="absolute left-0 w-full border-t border-dashed border-gray-300"></div>
            </div>
          ))}
        </div>

        {/* Biểu đồ + tên tách riêng */}
        <div className="flex flex-col">
          {/* Biểu đồ cột */}
          <div className="flex items-end gap-20 h-64">
            {salesData.map((item, idx) => {
              const height = (item.value / maxValue) * chartHeight;
              return (
                <div key={idx} className="w-12 flex justify-center">
                  <div
                    style={{ height: `${height}px` }}
                    className={`w-full rounded-full ${item.color} transition-all duration-300`}
                  ></div>
                </div>
              );
            })}
          </div>
          {/* Tên + số lượng tách riêng ra dưới, vẫn căn giữa với cột */}
          <div className="flex justify-between gap-20 mt-2">
            {salesData.map((item, idx) => (
              <div key={idx} className="w-12 text-center text-xs text-gray-600 font-medium leading-tight">
                {item.name}
                <br />
                ({item.value.toLocaleString()})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}