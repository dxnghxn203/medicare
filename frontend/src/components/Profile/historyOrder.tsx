"use client";
import {
  Search,
  X,
  ArrowLeft,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Archive,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { formatDate } from "@/utils/string";
import {
  getOrderStatusInfo,
  canCancelOrder,
  ORDER_STATUS_NAMES,
} from "@/utils/orderStatusMapping";
import { useToast } from "@/providers/toastProvider";
import Image from "next/image";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
// import { console } from "inspector";

const HistoryOrder: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const {
    ordersUser,
    getOrdersByUser,
    cancelOrder,
    getTrackingCode,
    downloadInvoice,
  } = useOrder();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState<string | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);

  const toast = useToast();

  const getOrders = () => {
    getOrdersByUser();
  };

  useEffect(() => {
    getOrders();
  }, []);

  const openCancelDialog = (orderId: string) => {
    setOrderIdToCancel(orderId);
    setIsCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
    setOrderIdToCancel(null);
  };

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

        // toast.showToast("Tải hóa đơn thành công", "success");
      },
      () => {
        toast.showToast("Tải hóa đơn thất bại", "error");
      }
    );
    console.log(order.order_id, "orderIDs");
  };

  const handleCancelOrder = async () => {
    if (orderIdToCancel) {
      cancelOrder(
        orderIdToCancel,
        () => {
          toast.showToast("Hủy đơn hàng thành công", "success");
          closeCancelDialog();
          if (viewMode === "detail") {
            setViewMode("list");
            setSelectedOrderDetail(null);
          }
          getOrders();
        },
        (error) => {
          toast.showToast("Hủy đơn hàng thất bại", "error");
          console.error(error);
          closeCancelDialog();
        }
      );
    }
  };

  const showOrderDetail = (order: any) => {
    setSelectedOrderDetail(order);
    setViewMode("detail");
    setTrackingHistory([]);
    setLoadingTracking(true);
    getTrackingCode(
      order.order_id,
      (data: any) => {
        setTrackingHistory(data);
        setLoadingTracking(false);
      },
      (error: any) => {
        console.error("Failed to fetch tracking history:", error);
        setLoadingTracking(false);
        toast.showToast("Không thể tải lịch sử vận đơn", "error");
      }
    );
  };

  const showOrderList = () => {
    setSelectedOrderDetail(null);
    setViewMode("list");
  };

  const tabs = [
    { id: "all", label: "Tất cả" },
    ...Object.keys(ORDER_STATUS_NAMES).map((status) => ({
      id: status,
      label: ORDER_STATUS_NAMES[status as keyof typeof ORDER_STATUS_NAMES],
    })),
  ];

  const renderOrderDetail = (order: any) => {
    const statusInfo = getOrderStatusInfo(order.status);

    const trackingIconMap: { [key: string]: React.ElementType } = {
      created: Package,
      confirmed: Package,
      waiting_to_pick: Clock,
      picking: Truck,
      picked: Truck,
      delivering: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
      returning: Truck,
      returned: Archive,
    };

    const processedTrackingHistory = (trackingHistory || [])
      .sort(
        (a: any, b: any) =>
          new Date(b.created_date).getTime() -
          new Date(a.created_date).getTime()
      )
      .map((event: any) => {
        const statusKey = event.status as keyof typeof ORDER_STATUS_NAMES;
        const statusText =
          ORDER_STATUS_NAMES[statusKey] || `Trạng thái: ${event.status}`;
        const statusIcon = trackingIconMap[event.status] || Package;

        return {
          status:
            statusText +
            (event.shipper_name ? ` (Shipper: ${event.shipper_name})` : ""),
          time: event.created_date,
          icon: statusIcon,
        };
      });

    return (
      <div className="mt-2">
        <button
          onClick={showOrderList}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
        </button>
        <h3 className="leading-6 font-semibold text-gray-900 mb-4">
          Chi tiết đơn hàng: {order.order_id}
        </h3>
        <div className="space-y-4 text-gray-700 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">
                Thông tin chung
              </h4>
              <div className="space-y-1">
                <p>
                  <span className="font-medium ">Mã theo dõi:</span>{" "}
                  {order.tracking_id}
                </p>
                <p>
                  <span className="font-medium ">Trạng thái:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${statusInfo.colors.bg} ${statusInfo.colors.text}`}
                  >
                    {statusInfo.displayName}
                  </span>
                </p>
                <p>
                  <span className="font-medium ">Ngày tạo:</span>{" "}
                  {formatDate(order.created_date)}
                </p>
                {order.shipper_name && (
                  <p>
                    <span className="font-medium ">Shipper:</span>{" "}
                    {order.shipper_name} ({order.shipper_id})
                  </p>
                )}

                <p>
                  <span className="font-medium ">Hướng dẫn giao hàng:</span>
                  {order.delivery_instruction || "Không có"}
                </p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">
                Thông tin thanh toán
              </h4>
              <div className="space-y-1">
                <p>
                  <span className="font-medium ">Hình thức:</span>{" "}
                  {order.payment_type}
                </p>
                <p className="flex items-center">
                  <span className="font-medium  mr-2">Trạng thái TT:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-sm font-medium ${
                      order.payment_status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.payment_status === "PAID"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </p>
                <p>
                  <span className="font-medium ">Tiền hàng:</span>{" "}
                  {order.product_fee?.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <span className="font-medium ">Phí ship:</span>{" "}
                  {order.shipping_fee?.toLocaleString("vi-VN")}đ
                </p>
                <p className="font-semibold text-blue-700">
                  <span className="font-medium ">Tổng tiền:</span>{" "}
                  {order.estimated_total_fee?.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <span className="font-medium ">Cân nặng:</span> {order.weight}{" "}
                  kg
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">
                Thông tin người nhận
              </h4>
              <p>
                <span className="font-medium ">Tên:</span> {order.pick_to.name}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {order.pick_to.phone_number}
              </p>
              <p>
                <span className="font-medium ">Địa chỉ:</span>{" "}
                {`${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`}
              </p>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 text-black">Sản phẩm</h4>
            <ul className="space-y-4">
              {order.product.map((product: any) => (
                <li
                  key={product.product_id}
                  className="flex items-center border-b pb-4 last:border-b-0  text-black"
                >
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src={product.images_primary}
                      alt={product.product_name}
                      width={64}
                      height={64}
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{product.product_name}</p>
                    <p className="text-sm text-gray-500">
                      SL: {product.quantity} {product.unit}
                    </p>
                  </div>
                  <p className="font-semibold ml-4 flex-shrink-0 text-blue-700">
                    {product.price?.toLocaleString("vi-VN")}đ
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border rounded-lg min-h-[150px]">
            <h4 className="font-semibold mb-3 text-gray-800">
              Lịch sử vận đơn
            </h4>
            {loadingTracking ? (
              <div className="flex items-center justify-center text-gray-500 py-4">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                <span>Đang tải lịch sử...</span>
              </div>
            ) : processedTrackingHistory.length > 0 ? (
              <div className="relative pl-6">
                <div className="absolute left-5.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <ul className="space-y-6">
                  {processedTrackingHistory.map((item: any, index: number) => (
                    <li key={index} className="relative flex items-start">
                      <div
                        className={`absolute left-0 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 "
                        }`}
                      >
                        <item.icon size={16} />
                      </div>
                      <div className="ml-6 pl-4">
                        <p
                          className={`font-medium ${
                            index === 0 ? "text-green-700" : "text-gray-700"
                          }`}
                        >
                          {item.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.time)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Chưa có thông tin vận đơn.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            {canCancelOrder(order.status) && (
              <div className="mt-4">
                <button
                  onClick={() => openCancelDialog(order.order_id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const filteredOrders = ordersUser.filter((order: any) => {
    const search = searchText.toLowerCase();
    const orderIdMatch = order.order_id.toLowerCase().includes(search);
    const productNameMatch = order.product.some((product: any) =>
      product.product_name.toLowerCase().includes(search)
    );
    return orderIdMatch || productNameMatch;
  });

  const countByStatus = (status: string) => {
    return ordersUser.filter((order: any) => order.status === status).length;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <h2 className="font-semibold text-lg">Lịch sử đơn hàng</h2>
        <div className="relative w-full md:w-[440px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 border-b border-gray-300 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-3 md:px-4 text-sm font-medium whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "hover:text-blue-500"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setViewMode("list");
              }}
            >
              {tab.label}
              <span className="ml-2 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full flex items-center justify-center">
                {tab.id === "all" ? ordersUser.length : countByStatus(tab.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {viewMode === "list" && (
        <>
          {filteredOrders?.map((order: any) => (
            <div
              key={order?.order_id}
              className="bg-[#F5F7F9] rounded-lg p-4 mt-4 text-sm"
            >
              <div className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span
                      onClick={() => showOrderDetail(order)}
                      className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      {order?.order_id}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(order?.order_id)
                      }
                      className="text-gray-500 hover:text-blue-600 cursor-pointer"
                      title="Copy mã đơn hàng"
                    >
                      <MdOutlineContentCopy />
                    </button>
                  </div>

                  {activeTab === "all" && (
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        getOrderStatusInfo(order.status).colors.bg
                      } ${getOrderStatusInfo(order.status).colors.text}`}
                    >
                      ● {getOrderStatusInfo(order.status).displayName}
                    </span>
                  )}

                  <span className="text-gray-500 text-sm">
                    {formatDate(order.created_date) || "N/A"}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                <div className="space-y-2.5">
                  <div className="flex items-center flex-wrap gap-2">
                    <FaRegUser /> Người nhận:{" "}
                    <span className="font-medium">{order.pick_to.name}</span> |
                    <span className="text-gray-700">
                      {order.pick_to.phone_number}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <GrLocation /> Nơi giao hàng:
                    <span className="font-medium block">
                      {`${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                  <div className="flex items-start flex-col md:flex-row md:items-center">
                    <div className="px-0 md:px-4 py-2">
                      Thành tiền:
                      <span className="font-bold text-lg ml-2 text-blue-700">
                        {order?.estimated_total_fee?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex items-center pl-0 md:pl-4 mt-2 md:mt-0">
                      {order?.payment_type === "COD" ? (
                        <>
                          💵
                          <span className="ml-1 items-center">
                            Phương thức:
                          </span>
                          <span className="ml-2 px-2.5 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium">
                            Thanh toán khi nhận hàng COD
                          </span>
                        </>
                      ) : (
                        <>
                          💳
                          <span className="ml-1">Phương thức:</span>
                          <span className="ml-2 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Đã thanh toán
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleDownloadInvoice(order.order_id)}
                    className="text-red-500 font-semibold py-1 px-3 rounded-lg underline hover:bg-red-100 transition-colors"
                  >
                    Tải hóa đơn
                  </button>
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => openCancelDialog(order.order_id)}
                      className="ml-4 mt-2 md:mt-0 bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-lg"
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      {/* Hiển thị chi tiết đơn hàng khi viewMode là "detail" */}
      {viewMode === "detail" && selectedOrderDetail && (
        <div>{renderOrderDetail(selectedOrderDetail)}</div>
      )}

      {/* Modal hủy đơn hàng */}
      {isCancelDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Xác nhận hủy đơn hàng
            </h3>
            <p>
              Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end mt-6 gap-2 text-sm">
              <button
                onClick={closeCancelDialog}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Không
              </button>
              <button
                onClick={handleCancelOrder}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Hủy đơn hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryOrder;
