import { useOrder } from "@/hooks/useOrder";
import { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const monthLabels = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];

export default function OrderChartComponent() {
  const { fetchGetMonthlyCountOrderProductStatistics } = useOrder();
  const initCurrentYear = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(initCurrentYear);
  const [salesData, setSalesData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
      fetchGetMonthlyCountOrderProductStatistics(
        currentYear,
        (data) => {
          setSalesData(data || []);
        },
        () => {
          setSalesData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
      );
  
    }, [currentYear]);

  const handlePrevYear = () => setCurrentYear((y) => y - 1);
  const handleNextYear = () => {
    if (currentYear < new Date().getFullYear()) setCurrentYear((y) => y + 1);
  };

  const chartData = salesData.map((value, index) => ({
    month: monthLabels[index],
    orders: value,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full h-[350px]">
      <div className="flex items-center gap-2 justify-between">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Thống kê đơn hàng theo tháng
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
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />{" "}
          {/* Bỏ đường dọc */}
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 5, stroke: "#f97316", strokeWidth: 2, fill: "#f97316" }}
          >
            <LabelList
              dataKey="orders"
              position="top"
              fill="#000"
              fontSize={14}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
