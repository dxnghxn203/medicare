import { useUser } from "@/hooks/useUser";
import React, { useEffect, useMemo, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface Props {}

const monthLabels = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
const currentMonth = new Date().getMonth();
const COLORS = ["#F87171", "#34D399", "#3B82F6"];

const LineChartComponent: React.FC<Props> = () => {
  const { fetchGetMonthlyLoginStatistics } = useUser();
  const initCurrentYear = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(initCurrentYear);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchGetMonthlyLoginStatistics(
        currentYear,
        (data) => {
          const { admin_stastistics, pharmacist_stastistics, user_stastistics } = data;
          const lastMonthIndex = currentYear === initCurrentYear ? currentMonth : 11;
          const formatted = monthLabels.map((label, i) => ({
            name: label,
            value1: i <= lastMonthIndex ? admin_stastistics[i] : null,
            value2: i <= lastMonthIndex ? pharmacist_stastistics[i] : null,
            value3: i <= lastMonthIndex ? user_stastistics[i] : null,
          }));
          setChartData(formatted);
        },
        () => {
          setChartData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    );
  }, [currentYear]);
  const handlePrevYear = () => setCurrentYear((y) => y - 1);
  const handleNextYear = () => {
    if (currentYear < new Date().getFullYear()) setCurrentYear((y) => y + 1);
  };

  return (
    <>
      <div className="flex justify-between items-center space-x-2 mb-2">
        <h2 className="text-sm font-semibold mb-2">Chỉ số đăng nhập tài khoản</h2>
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

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="name"
            interval={0}
            padding={{ left: 10, right: 10 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value1"
            name="Quản trị viên"
            stroke={COLORS[0]}
            strokeWidth={3}
            dot={{ r: 4, stroke: COLORS[0], strokeWidth: 2, fill: COLORS[0] }}
          />
          <Line
            type="monotone"
            dataKey="value2"
            name="Dược sĩ"
            stroke={COLORS[1]}
            strokeWidth={3}
            dot={{ r: 4, stroke: COLORS[1], strokeWidth: 2, fill: COLORS[1] }}
          />
          <Line
            type="monotone"
            dataKey="value3"
            name="Khách hàng"
            stroke={COLORS[2]}
            strokeWidth={3}
            dot={{ r: 4, stroke: COLORS[2], strokeWidth: 2, fill: COLORS[2] }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineChartComponent;
