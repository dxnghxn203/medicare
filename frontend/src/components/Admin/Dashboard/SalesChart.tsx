import { useOrder } from "@/hooks/useOrder";
import React, { useEffect, useMemo, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const monthLabels = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];

export default function SalesChart() {
  const { fetchGetMonthlyRevenueStatisticsOrder } = useOrder();
  const initCurrentYear = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(initCurrentYear);
  const [salesData, setSalesData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  
  useEffect(() => {
    fetchGetMonthlyRevenueStatisticsOrder(
      currentYear,
      (data) => {
        setSalesData(data || []);
      },
      () => {
        setSalesData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
    );

  }, [currentYear]);

  const chartHeight = 256;

  const { maxValue, step, yLabels } = useMemo(() => {
    const max = Math.max(...salesData, 1_000_000);
    const roundedMaxValue = Math.ceil(max / 1_000_000) * 1_000_000;
    const step = Math.ceil(roundedMaxValue / 5);

    const labels = [];
    for (let i = roundedMaxValue; i >= 0; i -= step) {
      labels.push(i);
    }

    return { maxValue: roundedMaxValue, step, yLabels: labels };
  }, [salesData]);

  const handlePrevYear = () => setCurrentYear((y) => y - 1);
  const handleNextYear = () => {
    if (currentYear < new Date().getFullYear()) setCurrentYear((y) => y + 1);
  };

  return (
    <div className="mx-auto rounded-2xl shadow p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Phân tích doanh thu theo năm</h2>
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

      {/* Biểu đồ */}
      <div className="flex gap-4">
        {/* Trục Y với nhãn */}
        <div className=" w-14 h-64 flex flex-col justify-between items-end ">
          {yLabels.map((label, idx) => (
            <div
              key={idx}
              className="flex items-center justify-end h-0 relative"
              style={{ top: idx === 0 ? 0 : undefined }}
            >
              <span className="text-xs text-gray-500 absolute -left-2 translate-x-[-100%]">
                {label.toLocaleString()}đ
              </span>
              <div className="absolute left-0 w-full border-t border-dashed border-gray-300"></div>
            </div>
          ))}
        </div>

        {/* Cột dữ liệu */}
        <div className="relative flex items-end bottom-0 gap-12 w-full">
          {salesData.map((value, idx) => {
            const height = (value / maxValue) * chartHeight;
            return (
              <div
                key={idx}
                className="flex flex-col items-center group w-6 relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 hidden group-hover:block bg-white border border-gray-300 text-xs px-2 py-1 rounded shadow z-10">
                  <div>{value.toLocaleString()}₫</div>
                </div>

                <div className="w-12 h-64 bg-gray-100 rounded-full relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-12 bg-green-700 hover:bg-green-800 transition-all duration-300 rounded-full"
                    style={{ height: `${height}px` }}
                  ></div>
                </div>

                {/* Cột */}

                {/* Nhãn trục X */}
                <span className="text-xs text-gray-600 mt-1">{monthLabels[idx]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
