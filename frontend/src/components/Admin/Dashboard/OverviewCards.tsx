import React, { useEffect, useState } from "react";
import {
  BsBox2Heart,
  BsBoxSeam,
  BsFillCartCheckFill,
  BsFillPeopleFill,
  BsInboxes,
  BsXCircle,
} from "react-icons/bs";
import { FaChartLine } from "react-icons/fa";
import {
  FaCartShopping,
  FaCircleDollarToSlot,
  FaProductHunt,
} from "react-icons/fa6";
import { IoImage, IoPeople } from "react-icons/io5";
import SalesChart from "./SalesChart";
import LatestOrders from "./LatestOrders";
import TopSellingMedicine from "./TopSellingMedicine";
import PieChartComponent from "./PieChartComponent.tsx";
import LineChartComponent from "./LineChartComponent";
import TopCustomers from "./TopCustomers";
import { GiMedicines } from "react-icons/gi";
import TodayReport from "./TodayReport";
import MonthlySalesChart from "./MonthlySalesChart";
import { useOrder } from "@/hooks/useOrder";
import { MdMoreHoriz } from "react-icons/md";
import { useProduct } from "@/hooks/useProduct";
import OutOfStock from "./OutOfStock";
import CategoryRevenueChart from "./CategoryRevenueChart";
import OrderChartComponent from "./OrderChartComponents";
// import { OrderChartByWeek } from "./OrderCharyByWeekk";


type OverviewCard = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.JSX.Element;
  change: string;
};

export default function OverviewCards() {

  const { fetchGetOverviewSatisticsOrder, overviewStatisticsOrder } = useOrder();
  const [cards, setCards] = useState<OverviewCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const now = new Date();
  const currentDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  const updateCardsFromOverviewData = (data: any) => {
    const { total_orders, total_revenue, total_customers, total_products_sold } = data || {};
    setCards([
      {
        title: "Tổng doanh thu đơn hàng",
        value: total_revenue ? `${total_revenue.toLocaleString()}Đ` : "0Đ",
        subtitle: currentDate,
        icon: <FaCircleDollarToSlot />,
        change: "+2%",
      },
      {
        title: "Tổng khách hàng đã đặt hàng",
        value: total_customers?.toString() || "0",
        subtitle: currentDate,
        icon: <IoPeople />,
        change: "-0.2%",
      },
      {
        title: "Tổng sản phẩm đã bán",
        value: total_products_sold?.toString() || "0",
        subtitle: currentDate,
        icon: <FaProductHunt />,
        change: "+6%",
      },
      {
        title: "Tổng đơn hàng đã tạo",
        value: total_orders?.toString() || "0",
        subtitle: currentDate,
        icon: <FaCartShopping />,
        change: "+6%",
      },
    ]);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchGetOverviewSatisticsOrder(
      () => {
        updateCardsFromOverviewData(overviewStatisticsOrder);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  const selectedCard = cards[selectedIndex];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-pulse">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {cards.map((card, i) => {
          const isSelected = selectedIndex === i;
          return (
            <div
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all shadow ${
                isSelected
                  ? "bg-[#1E4DB7] text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              <div className="absolute bottom-2 right-2 opacity-20 text-gray-400 text-6xl">
                {i === 0 ? (
                  <FaChartLine />
                ) : i === 1 ? (
                  <BsFillPeopleFill />
                ) : i === 2 ? (
                  <GiMedicines />
                ) : (
                  <BsFillCartCheckFill />
                )}
              </div>

              <div className="flex justify-between items-center relative z-10">
                <div
                  className={`text-2xl rounded-full p-2 ${
                    isSelected
                      ? "bg-white text-blue-700"
                      : "bg-gray-100 text-[#1E4DB7]"
                  }`}
                >
                  {card.icon}
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <h4
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-gray-500"
                  }`}
                >
                  {card.title}
                </h4>
                <p className="text-xl font-bold">{card.value}</p>
                <span
                  className={`text-xs ${
                    isSelected ? "text-white" : "text-gray-400"
                  }`}
                >
                  {card.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCard === cards[0] && (
        <div className="space-y-4">
          <SalesChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <CategoryRevenueChart />
            </div>
            <div className="lg:col-span-1">
              <TodayReport />
            </div>
          </div>
        </div>
      )}
      {selectedCard === cards[1] && (
  <div className="bg-[#f8fbfc] min-h-screen my-4 p-4 space-y-4">

    {/* Hàng 1: Biểu đồ đường 1 */}
    <div className="bg-white rounded-2xl p-4 shadow">
      <LineChartComponent />
    </div>

    {/* Hàng 2: PieChart + TopCustomers chia đôi ngang */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-4">Tổng người dùng</h2>
        <PieChartComponent />
      </div>
      <div className="bg-white rounded-2xl p-4 shadow">
        <TopCustomers />
      </div>
    </div>
  </div>
)}

      {selectedCard === cards[2] && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 h-full">
              <MonthlySalesChart />
            </div>
            <div className="lg:col-span-1 h-full">
              <TopSellingMedicine />
            </div>
          </div>
          <OutOfStock />
        </div>
      )}

      {selectedCard === cards[3] && (
        <div className="space-y-4">
          <OrderChartComponent />
          <LatestOrders />
        </div>
      )}
    </>
  );
}
