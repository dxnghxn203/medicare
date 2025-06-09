"use client";
import { useState, useEffect } from "react";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrder";
import { BsBoxSeam } from "react-icons/bs";
import { BsInboxes, BsBox2Heart, BsXCircle } from "react-icons/bs";
import { X } from "lucide-react";
import Image from "next/image";
import { RiMore2Fill } from "react-icons/ri";
import { IoFilter } from "react-icons/io5";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import FilterBar from "./filterBar";
import AddOrderDialog from "../Dialog/addOrderDialog";

const Order = () => {
  const { allOrderAdmin } = useOrder();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 5; // Số đơn hàng hiển thị trên mỗi trang

  // Tính toán dữ liệu hiển thị theo trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrderAdmin.slice(indexOfFirstOrder, indexOfLastOrder);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const toggleMenu = (productId: string | number) => {
    setMenuOpen(menuOpen === productId ? null : productId);
  };
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleAddOrder = (newUser: {
    name: string;
    email: string;
    phoneNumber: number;
    role: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log("User added:", newUser);
  };
  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">Order Management</h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Home
          </Link>
          <span> / </span>
          <Link href="/order" className="text-gray-800">
            Order management
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-[#E7ECF7] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            {/* Cột trái */}
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">Total Orders</span>
              <div className="flex text-[#1E4DB7] text-2xl items-center">
                <span className="font-medium">63.879.0</span>
              </div>
              <div className="text-sm text-gray-500">
                Total Orders last 365 days
              </div>
            </div>

            {/* Cột phải */}
            <div className="bg-[#1E4DB7] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsInboxes className="text-white text-2xl" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#EBFAF2] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            {/* Cột trái */}
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">New Orders</span>
              <div className="flex text-[#00C292] text-2xl items-center">
                <span className="font-medium">63.879.0</span>
              </div>
              <div className="text-sm text-gray-500">
                New Orders last 365 days
              </div>
            </div>

            {/* Cột phải */}
            <div className="bg-[#00C292] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsBoxSeam className="text-white text-2xl" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FDF3F5] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            {/* Cột trái */}
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">Completed Orders</span>
              <div className="flex text-[#FD5171] text-2xl items-center">
                <span className="font-medium">63.879.0</span>
              </div>
              <div className="text-sm text-gray-500">
                Completed Orders last 365 days
              </div>
            </div>

            {/* Cột phải */}
            <div className="bg-[#FD5171] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsBox2Heart className="text-white text-2xl" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#FFF4E5] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            {/* Cột trái */}
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">Cancel Orders</span>
              <div className="flex text-[#FDC90F] text-2xl items-center">
                <span className="font-medium">63.879.0</span>
              </div>
              <div className="text-sm text-gray-500">
                Cancel Orders last 365 days
              </div>
            </div>

            {/* Cột phải */}
            <div className="bg-[#FDC90F] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsXCircle className="text-white text-2xl" />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="justify-start border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
            onClick={() => setShowFilter(!showFilter)}
          >
            <IoFilter className="text-lg" />
            Filter
          </button>
          <div className="justify-end flex items-center gap-4">
            <button
              className="bg-[#1E4DB7] text-white px-2 py-2 rounded-lg hover:bg-[#173F98] text-sm flex items-center gap-1"
              onClick={() => setDialogOpen(true)}
            >
              <HiOutlinePlusSmall className="text-lg" />
              Add new
            </button>
          </div>
        </div>
        {showFilter && (
          <FilterBar onFilterChange={(filters) => console.log(filters)} />
        )}

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead className="text-[#1E4DB7] text-sm border-b border-gray-200 bg-[#F0F3FD]">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Product Name</th>
                  <th className="px-6 py-4 text-left">Order Date</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order: any, index: any) => (
                  <tr
                    key={order.id}
                    className={`text-sm hover:bg-gray-50 transition ${
                      index !== currentOrders.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="p-6 w-32 text-left">{order?.id}</td>
                    <td className="p-6 w-64 text-left">
                      {order?.customer?.name}
                    </td>
                    <td className="p-6 w-72 text-left">
                      {order?.products?.map((product: any, index: number) => (
                        <div key={index} className="line-clamp-2">
                          {product.name}
                        </div>
                      ))}
                    </td>

                    <td className="p-6 w-48 text-left">{order?.createdAt}</td>
                    <td className="p-6 text-left">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="p-6 w-32 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Ordered"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-center relative menu-container items-center space-x-4">
                      <div
                        className="p-2 rounded-full hover:text-[#1E4DB7] hover:bg-[#E7ECF7] cursor-pointer inline-flex items-center justify-center"
                        onClick={(e) => {
                          toggleMenu(order.id);
                        }}
                      >
                        <RiMore2Fill className="text-xl " />
                      </div>

                      {menuOpen === order.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
                          <button
                            className="flex items-center w-full px-6 py-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDrawerOpen(true);
                            }}
                          >
                            Detail
                          </button>
                          <div className="border-t border-gray-200"></div>
                          <button className="flex items-center w-full px-6 py-2 text-left hover:bg-gray-100 text-red-500">
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* CustomPagination */}
        <div className="flex justify-center p-6">
          <CustomPagination
            current={currentPage}
            total={allOrderAdmin?.length}
            pageSize={ordersPerPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
        {/* Drawer (Chi tiết đơn hàng) */}
      </div>
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-[400px] h-full shadow-lg p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">
                Order #{selectedOrder?.id}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="text-2xl text-gray-700" />
              </button>
            </div>

            <div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold my-4">
                  Order items{" "}
                  <span className="text-gray-500 ml-1">
                    {selectedOrder?.products?.length || 0}
                  </span>
                </h2>

                {Array.isArray(selectedOrder?.products) &&
                  selectedOrder.products.map((product: any, index: number) => (
                    <div
                      key={index}
                      className="border-b pb-3 flex items-center space-x-4"
                    >
                      <Image
                        src={product?.img}
                        alt={product?.name}
                        className="w-16 h-16 rounded-lg border border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2">{product?.name}</p>
                      </div>
                      <span className="space-x-4">
                        <span className="font-semibold">
                          {product?.quantity || 0}
                        </span>
                        <span className="font-normal text-gray-500">x</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product?.price || 0)}
                        </span>
                      </span>
                    </div>
                  ))}

                <div className="mt-3 text-right text-lg text-gray-500">
                  Total
                  <span className="ml-4 text-black font-semibold">
                    {selectedOrder?.total?.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <h2 className="text-lg font-semibold my-4">Contact</h2>
                <div className="gap-4">
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Customer:</p>
                    <p className="w-2/3">{selectedOrder?.customer?.name}</p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Phone:</p>
                    <p className="w-2/3">{selectedOrder?.customer?.phone}</p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Email:</p>
                    <p className="w-2/3">{selectedOrder?.customer?.email}</p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Address:</p>
                    <p className="w-2/3">
                      {selectedOrder?.customer?.address
                        ? `${selectedOrder.customer.address.street}, ${selectedOrder.customer.address.ward}, ${selectedOrder.customer.address.district}, ${selectedOrder.customer.address.city}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-[#1E4DB7] text-white px-2 text-sm py-2 rounded-lg hover:bg-[#173F98]">
                Download Bill
              </button>
            </div>
          </div>
        </div>
      )}
      <AddOrderDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddOrder={handleAddOrder}
      />
    </div>
  );
};

export default Order;
