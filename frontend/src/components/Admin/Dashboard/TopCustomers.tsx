import { useUser } from "@/hooks/useUser";
import React, { useEffect } from "react";

const TopCustomers: React.FC = () => {
  const { fetchGetTopRevenueCustomersStatistics, topRevenueCustomers } = useUser();
  
  
    useEffect(() => {
      fetchGetTopRevenueCustomersStatistics(
        5,
        () => {
        },
        () => {
        }
      );
    }, []);
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Top khách hàng</h2>
      <ul className="space-y-2">
        {topRevenueCustomers?.map((c: any) => (
          <li
            key={c.user_id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-medium">{c.user_name}</p>
              <p className="text-xs text-gray-500">{c.phone_number}</p>
            </div>
            <p className="font-semibold text-right">
              {c.total_revenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomers;
