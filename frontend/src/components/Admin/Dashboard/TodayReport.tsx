import { useOrder } from "@/hooks/useOrder";
import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export default function TodayReport() {
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7);
  const [currentMonth, setCurrentMonth] = useState(currentMonthStr);
  const [chartData, setChartData] = useState<
   { value: number; radius: number; color: string, label: string}[]
  >([]);

  const [totalEarning, setTotalEarning] = useState(0);
  const { fetchGetTypeMonthlyRevenueStatisticsOrder } = useOrder();
  useEffect(() => {
    const [year, month] = currentMonth.split("-").map(Number);

    fetchGetTypeMonthlyRevenueStatisticsOrder(
      month,
      year,
      (res) => {
        const { revenue_cod = 0, revenue_bank = 0, revenue_all = 0 } = res || {};

        const codPercent = revenue_all ? (revenue_cod / revenue_all) * 100 : 0;
        const bankPercent = revenue_all ? (revenue_bank / revenue_all) * 100 : 0;
        const totalPercent = revenue_all ? 100 : 0;

        setChartData([
          {
            radius: 70,
            color: "#F87171",
            value: totalPercent,
            label: `Tổng thu: ${new Intl.NumberFormat("vi-VN",{
              style: "currency",
              currency: "VND",
            }).format(revenue_all)}`,
          },
          {
            radius: 58,
            color: "#FACC15",
            value: codPercent,
            label: `Tiền mặt: ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenue_cod)}`,
          },
          {
            radius: 46,
            color: "#3B82F6",
            value: bankPercent,
            label: `Ngân hàng: ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenue_bank)}`,
          },
        ]);
        setTotalEarning(revenue_all);
      },
      () => {
        setChartData([]);
        setTotalEarning(0);
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

  return (
    <div className="bg-white rounded-xl shadow gap-6 p-6 h-full">
      <div className="flex items-center gap-2 justify-end">
        
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
      <div className="h-full justify-center flex items-center gap-4">
        <div className="relative w-48 h-48">
          {chartData.map(({ radius, color, value }, i) => {
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset =
              circumference - (value / 100) * circumference;

            return (
              <svg
                key={i}
                className="absolute top-0 left-0 w-48 h-48"
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E5E7EB"
                  strokeWidth={10}
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={color}
                  strokeWidth={10}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                />
              </svg>
            );
          })}
        </div>

        <div className="flex flex-col justify-center ml-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Phương thức thanh toán
          </h3>

          <div className="text-2xl font-bold text-gray-900 mb-4">
            ${totalEarning.toFixed(2)}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            {chartData.map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
