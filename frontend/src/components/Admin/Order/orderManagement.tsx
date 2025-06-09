"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BsBoxSeam } from "react-icons/bs";
import { BsInboxes, BsBox2Heart, BsXCircle } from "react-icons/bs";
import Image from "next/image";
import { X } from "lucide-react";
import { FiDownload } from "react-icons/fi";
import TableOrdersAdmin from "./tableOrders";
import { useOrder } from "@/hooks/useOrder";
import { useToast } from "@/providers/toastProvider";
import { getAllOrderAdmin } from "@/services/orderService";
import { formatDateCSV } from "@/utils/string";

type Status = {
  label: string;
  key: string;
  count: number;
  bgColor: string;
  textColor: string;
};

function flattenOrder(order: any) {
  return {
    order_id: order.order_id,
    tracking_id: order.tracking_id,
    status: order.status,
    payment_type: order.payment_type,
    payment_status: order.payment_status,
    shipping_fee: order.shipping_fee,
    product_fee: order.product_fee,
    estimated_total_fee: order.estimated_total_fee,

    created_date: formatDateCSV(order.created_date),
    delivery_time: formatDateCSV(order.delivery_time),

    customer_name: order.pick_to?.name,
    customer_phone: `'${order.pick_to.phone_number.toString()}`,
    customer_email: order.pick_to?.email,
    customer_address: order.pick_to?.address
      ? `${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`
      : "",

    warehouse_name: order.pick_from?.name,
    warehouse_address: order.pick_from?.address
      ? `${order.pick_from.address.address}, ${order.pick_from.address.ward}, ${order.pick_from.address.district}, ${order.pick_from.address.province}`
      : "",

    product_list: order.product
      ?.map((p: any) => `${p.product_name}-${p.weight} (${p.quantity} ${p.unit}): ${p.original_price}(${p.discount}%)=${p.price}`)
      .join(" | "),
  };
}


const Order = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toast = useToast();
  const {
      getAllOrdersAdmin,
      allOrderAdmin,
      totalOrderAdmin,
      countStatusOrder,
      page,
      setPage,
      pageSize,
      setPageSize,
      downloadInvoice
    } = useOrder();

  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    if (!countStatusOrder) return;

    const dynamicStatuses = [
      {
        label: "Tất cả",
        key: "total",
        count: countStatusOrder?.total || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Đã tạo",
        key: "created",
        count: countStatusOrder?.created || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Chờ lấy hàng",
        key: "waiting_to_pick",
        count: countStatusOrder?.waiting_to_pick || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Đang lấy hàng",
        key: "picking",
        count: countStatusOrder?.picking || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Đang giao hàng",
        key: "delivering",
        count: countStatusOrder?.delivering || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Giao hàng thành công",
        key: "delivery_success",
        count: countStatusOrder?.delivery_success || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Giao hàng thất bại",
        key: "delivery_fail",
        count: countStatusOrder?.delivery_fail || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Chờ trả hàng",
        key: "waiting_to_return",
        count: countStatusOrder?.waiting_to_return || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Đã trả hàng",
        key: "returned",
        count: countStatusOrder?.returned || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
      {
        label: "Đã hủy",
        key: "canceled",
        count: countStatusOrder?.canceled || 0,
        bgColor: "bg-gray-300",
        textColor: "text-gray-500",
      },
    ];

    setStatuses(dynamicStatuses);
  }, [countStatusOrder]);
  const [selectedTab, setSelectedTab] = useState("Tất cả");

  useEffect(() => {
    const currentStatus = statuses.find((s) => s.label === selectedTab)?.key;
    getAllOrdersAdmin(currentStatus === "total" ? undefined : currentStatus );
  }, [selectedTab, page, pageSize]);

  const handleSelectOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const { allStatistics365Days, statistics365Days } = useOrder();

  useEffect(() => {
    allStatistics365Days(
      () => {},
      () => {}
    );
  }, []);

  const handleDownloadInvoice = (order: any) => {
    downloadInvoice(
      order, // Truyền đúng order_id
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob); // ❗ KHÔNG tạo new Blob([blob])
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `HoaDon-${order}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // thu hồi URL

        toast.showToast("Tải hóa đơn thành công", "success");
      },
      () => {
        toast.showToast("Tải hóa đơn thất bại", "error");
      }
    );
    console.log(order.order_id, "orderIDs");
  };

  const downloadCSV= (orders: any[]) => {
    if (!orders || !orders.length) return;

    const flattened = orders.map(flattenOrder);
    const headers = Object.keys(flattened[0]);

    const csvRows = [
      "\uFEFF" + headers.join(","), // BOM + headers
      ...flattened.map(order =>
        headers.map(h =>
          `"${(order[h as keyof typeof order] ?? "")
            .toString()
            .replace(/"/g, '""')}"`
        )
      )
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    const now = new Date();
    const timestamp = now.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).replace(/[/:]/g, "-").replace(", ", "_");
    const fileName = `don-hang_${timestamp}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await getAllOrderAdmin({ page: 1, page_size: totalOrderAdmin });

      if (response.status_code) {
        const orders = response.data.orders || [];
        downloadCSV(orders);
      } else {
        console.log({
          title: "Lỗi tải đơn hàng",
          description: response.message || "Không thể lấy dữ liệu",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log({
        title: "Lỗi mạng",
        description: "Không thể tải dữ liệu đơn hàng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">Quản lý đơn hàng</h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/quan-ly-don-hang" className="text-gray-850">
            Quản lý đơn hàng
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#E7ECF7] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">Tổng đơn hàng</span>
              <div className="flex text-[#1E4DB7] text-2xl items-center">
                <span className="font-medium">{statistics365Days?.total}</span>
              </div>
              <div className="text-sm text-gray-500">
                Tổng số đơn hàng trong 365 ngày qua
              </div>
            </div>

            <div className="bg-[#1E4DB7] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsInboxes className="text-white text-2xl" />
            </div>
          </div>

          <div className="bg-[#EBFAF2] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">Đơn hàng mới</span>
              <div className="flex text-[#00C292] text-2xl items-center">
                <span className="font-medium">{statistics365Days?.new}</span>
              </div>
              <div className="text-sm text-gray-500">
                Đơn hàng mới trong 365 ngày qua
              </div>
            </div>

            <div className="bg-[#00C292] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsBoxSeam className="text-white text-2xl" />
            </div>
          </div>

          <div className="bg-[#FDF3F5] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">
                Đơn hàng hoàn thành
              </span>
              <div className="flex text-[#FD5171] text-2xl items-center">
                <span className="font-medium">
                  {statistics365Days?.completed}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Đơn hàng hoàn thành trong 365 ngày qua
              </div>
            </div>

            <div className="bg-[#FD5171] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsBox2Heart className="text-white text-2xl" />
            </div>
          </div>

          <div className="bg-[#FFF4E5] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">Đơn hàng hủy</span>
              <div className="flex text-[#FDC90F] text-2xl items-center">
                <span className="font-medium">{statistics365Days?.cancel}</span>
              </div>
              <div className="text-sm text-gray-500">
                Đơn hàng hủy trong 365 ngày qua
              </div>
            </div>

            <div className="bg-[#FDC90F] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
              <BsXCircle className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center gap-2 px-3 py-2 border border-[#1E4DB7] text-[#1E4DB7] rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              onClick={handleDownloadCSV}
            >
              <FiDownload className="text-[#1E4DB7]" />
              Tải file CSV
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-1 py-1 rounded-2xl overflow-x-auto max-w-[800px] text-sm flex-nowrap">
          {statuses.map((status) => (
            <button
              key={status.label}
              className={`flex items-center gap-1 px-2 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition ${
                selectedTab === status.label
                  ? "bg-[#1E4DB7] text-white"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
              onClick={() =>{
                setPage(1);
                setSelectedTab(status.label);
              }}
            >
              {status.label}
              <span
                className={`rounded-full w-4 h-4 text-xs font-semibold flex items-center justify-center ${
                  selectedTab === status.label
                    ? "bg-white text-[#1E4DB7]"
                    : status.bgColor + " " + status.textColor
                }`}
              >
                {status.count}
              </span>
            </button>
          ))}
        </div>

        <TableOrdersAdmin 
          orders={allOrderAdmin}
          currentPage={page}
          pageSize={pageSize}
          totalOrders={totalOrderAdmin}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSelectOrder={handleSelectOrder}
          />
      </div>
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-[600px] h-full shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">
                  Order #{selectedOrder?.order_id}
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  <X className="text-2xl text-gray-700" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto px-6 pb-6 flex-1">
              <div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold my-4">
                    Order items{" "}
                    <span className="text-gray-500 ml-1">
                      {selectedOrder?.product?.length || 0}
                    </span>
                  </h2>

                  {Array.isArray(selectedOrder?.product) &&
                    selectedOrder.product.map((product: any, index: number) => (
                      <div
                        key={index}
                        className="border-b pb-3 flex items-center space-x-4"
                      >
                        <Image
                          src={product?.images_primary}
                          alt={product?.product_name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-lg border border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="text-sm line-clamp-2">{product?.product_name} dạng {product?.unit}</p>
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
                    Total Product
                    <span className="ml-4 text-black font-semibold">
                      {selectedOrder?.product_fee?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="mt-3 text-right text-lg text-gray-500">
                    Shipping fee
                    <span className="ml-4 text-black font-semibold">
                      {selectedOrder?.shipping_fee?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="mt-3 text-right text-lg text-gray-500">
                    Basic Total Fee
                    <span className="ml-4 text-black font-semibold">
                      {selectedOrder?.basic_total_fee?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="mt-3 text-right text-lg text-gray-500">
                    Discount Order Voucher
                    <span className="ml-4 text-black font-semibold">
                      -{selectedOrder?.voucher_order_discount?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="mt-3 text-right text-lg text-gray-500">
                    Discount Shipping Voucher
                    <span className="ml-4 text-black font-semibold">
                      -{selectedOrder?.voucher_delivery_discount?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="mt-3 text-right text-lg text-gray-500">
                    Final Total Fee
                    <span className="ml-4 text-black font-semibold">
                      {selectedOrder?.estimated_total_fee?.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold my-4">Contact</h2>
                  <div className="gap-4">
                    <div className="flex">
                      <p className="text-gray-500 font-medium w-1/3">Customer:</p>
                      <p className="w-2/3">{selectedOrder?.pick_to?.name}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-500 font-medium w-1/3">Phone:</p>
                      <p className="w-2/3">{selectedOrder?.pick_to?.phone_number}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-500 font-medium w-1/3">Email:</p>
                      <p className="w-2/3">{selectedOrder?.pick_to?.email}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-500 font-medium w-1/3">Address:</p>
                      <p className="w-2/3">
                        {selectedOrder?.pick_to?.address
                          ? `${selectedOrder.pick_to.address.address}, ${selectedOrder.pick_to.address.ward}, ${selectedOrder.pick_to.address.district}, ${selectedOrder.pick_to.address.province}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer cố định cho nút Download Bill */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => handleDownloadInvoice(selectedOrder?.order_id)}
                className="w-full bg-[#1E4DB7] text-white px-4 py-2 rounded-lg hover:bg-[#173F98] text-sm"
              >
                Download Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
