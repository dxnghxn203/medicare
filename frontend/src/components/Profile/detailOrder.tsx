"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuChevronLeft } from "react-icons/lu";
import { IoStorefront } from "react-icons/io5";
import medicine from "@/images/medicinee.png";

import Image, { StaticImageData } from "next/image";

interface Order {
  id: string;
  pharmacy: string;
  product: string;
  type: string;
  price: number;
  time: string;
  points: number;
  image: StaticImageData;
  quantity: number;
}

const orderData: Order[] = [
  {
    id: "1",
    pharmacy: "122 Hoàng Diệu 2",
    product:
      "Thuốc dùng ngoài Ketovazol 2% điều trị nhiễm nấm ngoài da (tuýp 5g)",
    type: "Tuýp",
    price: 9000,
    time: "17:34 06/11/2024",
    points: 90,
    image: medicine,
    quantity: 1,
  },
  {
    id: "SGPMC277-SGPMC27702-288306",
    pharmacy: "90 Lý Thường Kiệt",
    product: "Paracetamol 500mg - Giảm đau, hạ sốt",
    type: "Hộp",
    price: 35000,
    time: "12:15 05/11/2024",
    points: 120,
    image: medicine,
    quantity: 2,
  },
];

const OrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const foundOrder = orderData.find(
      (order) => order.id.toString() === orderId
    );
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      router.push("/personal/order-history"); // Điều hướng nếu không tìm thấy đơn hàng
    }
  }, [orderId, router]);

  if (!order)
    return <p className="text-center mt-10">Đơn hàng không tồn tại.</p>;

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center">
        <LuChevronLeft className="text-xl cursor-pointer" />
        <button
          className="font-semibold text-lg"
          onClick={() => router.push("/ca-nhanh/lich-su-don-hang")}
        >
          Chi tiết đơn hàng
        </button>
      </div>
      <div className="bg-[#F5F7F9] p-4 rounded-lg mt-2">
        {/* Mua tại nhà thuốc */}
        <div className="rounded-full px-3 py-2 bg-green-100 flex items-center gap-2 w-[180px]">
          <IoStorefront className="text-green-700 text-xl" />
          <div className=" text-green-700 text-sm font-semibold">
            Mua tại nhà thuốc
          </div>
        </div>
        <hr className="border-dashed border-t border-gray-300 my-4" />

        <div className="flex justify-between">
          {/* Thông tin người nhận */}
          <div className="space-y-2">
            <p className="font-bold">Thông tin người nhận</p>
            <p className="text-gray-600">Họ và tên: DUYEN</p>
            <p className="text-gray-600">Số điện thoại: 0943640913</p>
          </div>

          {/* Dấu gạch đứng */}
          <div className="border-l border-gray-300"></div>

          {/* Mã đơn hàng */}
          <div className="space-y-2">
            <p className="font-bold">Mã đơn hàng</p>
            <div className="flex flex-col space-y-2">
              {/* Mã đơn hàng với nút sao chép */}
              <div className="flex justify-between items-center space-x-8">
                <p className="text-gray-600">{order.id}</p>
                <span className="text-blue-500 cursor-pointer">Sao chép</span>
              </div>

              {/* Thời gian đặt hàng */}
              <div className="flex justify-between items-center space-x-8">
                <p className="text-gray-600">Thời gian đặt hàng:</p>
                <span className="text-gray-600">{order.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F5F7F9] p-4 mt-4 rounded-lg space-y-2">
        <p className="font-bold">Địa chỉ nhà thuốc</p>
        <p className="text-gray-600">
          122 Hoàng Diệu, phường Linh Chiểu, thành phố Thủ Đức
        </p>
      </div>
      <div className="bg-[#F5F7F9] p-4 mt-4 rounded-lg space-y-2">
        <p className="font-bold text-lg">Sản phẩm đã mua</p>
        <div className="flex mt-3">
          <Image
            src={order.image}
            alt="Product"
            className="w-16 h-16 rounded-lg object-cover border"
          />
          <div className="ml-4 flex-1 space-y-1">
            <p className="font-medium text-black">{order.product}</p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <p className="text-gray-500 text-sm">Phân loại: {order.type}</p>
                <p className="text-gray-500 text-sm">x{order.quantity}</p>
              </div>

              <span className="font-medium">
                {order.price.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F5F7F9] p-4 mt-4 rounded-lg space-y-4">
        <p className="font-bold text-xl text-center">Chi tiết thanh toán</p>
        <div className="px-56 space-y-2 ">
          <div className="flex justify-between text-center items-center">
            <p className="">Tiền hàng</p>
            <p className="font-semibold">90.000đ</p> {/* Hiển thị giá tiền */}
          </div>
          <div className="flex justify-between text-center items-center">
            <p className="">Phí vận chuyển</p>
            <p className="font-semibold">90.000đ</p> {/* Hiển thị giá tiền */}
          </div>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-between text-center items-center">
            <div className="flex space-x-2">
              <p>Tổng tiền</p>
              <p>(2 sản phẩm)</p>
            </div>
            <p className="font-semibold text-2xl text-[#0053E2]">90.000đ</p>
          </div>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-between text-center items-center">
            <p className="">Số điểm tích lũy</p>
            <p className="font-semibold text-[#FAB328]">+9 điểm</p>
          </div>
          <div className="flex justify-between text-center items-center pt-4">
            <p className="">Phương thức thanh toán</p>
            <p className="font-semibold">Tiền mặt</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6">
        <button className="px-4 py-2 border border-gray-500 rounded-lg hover:text-[#0053E2] hover:border-[#0053E2]">
          Hủy đơn hàng
        </button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
