import { useOrder } from "@/hooks/useOrder";
import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const monthLabels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

export default function MonthlySalesChart() {
  const { fetchGetMonthlyProductSoldStatistics } = useOrder();
  const initCurrentYear = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(initCurrentYear);
  const [salesData, setSalesData] = useState<{ month: string; value: number }[]>(
    monthLabels.map((label) => ({ month: label, value: 0 }))
  );
  useEffect(() => {
  fetchGetMonthlyProductSoldStatistics(
    currentYear,
    (data) => {
      const transformed = (data || []).map((value: number, index: number) => ({
        month: monthLabels[index],
        value,
      }));
      setSalesData(transformed);
    },
    () => {
      setSalesData(
        Array.from({ length: 12 }, (_, i) => ({
          month: monthLabels[i],
          value: 0,
        }))
      );
    }
  );
}, [currentYear]);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const maxValue = Math.max(...salesData.map((item) => item.value), 1);

  const handlePrevYear = () => setCurrentYear((y) => y - 1);
  const handleNextYear = () => {
    if (currentYear < new Date().getFullYear()) setCurrentYear((y) => y + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full h-full items-end">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Tiến độ hàng tháng
        </h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
            Năm {currentYear}
          </button>
          <button
            onClick={handlePrevYear}
            className="text-xl text-gray-500 hover:text-gray-700 p-1 border rounded-full"
          >
            <MdNavigateBefore />
          </button>
          <button
            onClick={handleNextYear}
            disabled={currentYear >= initCurrentYear}
            className={`text-xl p-1 border rounded-full ${
              currentYear >= initCurrentYear
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MdNavigateNext />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between h-full pb-12">
        {salesData.map((item, i) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isHovered = hoverIndex === i;

          return (
            <div
              key={i}
              className="relative flex flex-col items-center w-[20px] cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-16 bg-black text-white text-xs px-2 py-1 rounded z-20 text-center whitespace-nowrap">
                  <div>{item.month}</div>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <span>{item.value}</span>
                  </div>
                </div>
              )}

              {/* Bar */}
              <div
                className="w-12 rounded-full transition-all duration-300 bg-[#10B981] group-hover:bg-[#000000]"
                style={{ height: `${heightPercent}px` }}
              ></div>

              {/* Label */}
              <div className="mt-2 text-sm text-gray-500">{item.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
