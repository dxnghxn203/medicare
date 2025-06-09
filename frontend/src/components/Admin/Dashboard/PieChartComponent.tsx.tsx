import { useUser } from "@/hooks/useUser";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface Props {}

const COLORS = ["#56bfa0", "#c5e37d", "#f5a5ab"];

const PieChartComponent: React.FC<Props> = () => {
  const { fetchGetCountUserRoleStatistics, countUserRole } = useUser();


  useEffect(() => {
    fetchGetCountUserRoleStatistics(
      () => {
        console.log("fetchGetCountUserRoleStatistics", countUserRole);
      },
      () => {
      }
    );
  }, []);

  const pieChartData = [
    { name: "Khách hàng", value: countUserRole?.user || 0 },
    { name: "Dược sĩ", value: countUserRole?.pharmacist || 0 },
    { name: "Quản trị viên", value: countUserRole?.admin || 0 },
  ];

  return (
    <div className="w-[400px] h-[400px] relative">
      <PieChart width={400} height={400}>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          outerRadius={140}
          dataKey="value"
          cornerRadius={8}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) / 2;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight={600}
                className="focus:outline-none"
              >
                {`${pieChartData[index].name} (${(percent * 100).toFixed(2)}%)`}
              </text>
            );
          }}
          labelLine={false}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          itemStyle={{ color: "#333" }}
        />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
