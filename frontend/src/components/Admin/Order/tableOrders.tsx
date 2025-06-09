"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import React from "react";
import { useToast } from "@/providers/toastProvider";
import {
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

const statusConfig: Record<
  string,
  { label: string; color: string; textColor: string }
> = {
  created: {
    label: "Đã tạo",
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
  waiting_to_pick: {
    label: "Chờ lấy hàng",
    color: "bg-gray-100",
    textColor: "text-gray-700",
  },
  picking: {
    label: "Đang lấy hàng",
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
  delivering: {
    label: "Đang giao hàng",
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  delivery_success: {
    label: "Giao thành công",
    color: "bg-green-100",
    textColor: "text-green-700",
  },
  delivery_fail: {
    label: "Giao thất bại",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
  waiting_to_return: {
    label: "Chờ trả hàng",
    color: "bg-orange-100",
    textColor: "text-orange-700",
  },
  returned: {
    label: "Đã trả hàng",
    color: "bg-purple-100",
    textColor: "text-purple-700",
  },
  canceled: {
    label: "Đã hủy",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
};

interface OrderTableProps {
    orders: any[];
    currentPage: number;
    pageSize: number;
    totalOrders: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onSelectOrder: (order: any) => void
}

const TableOrdersAdmin = ({
  orders,
  currentPage,
  pageSize,
  totalOrders,
  onPageChange,
  onSelectOrder
}: OrderTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toast = useToast();

  const totalPages = Math.ceil(totalOrders / pageSize);

  const calculateOrderTotal = (products: any[]) => {
    return products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ");
  };

  const toggleExpand = (orderId: string) => {
    setExpandedRow(expandedRow === orderId ? null : orderId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.showToast("Đã sao chép mã đơn hàng", "success");
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => {
        toast.showToast("Không thể sao chép mã đơn hàng", "error");
        console.error("Không thể sao chép: ", err);
      });
  };

  return (
    <>
      {orders && totalOrders > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-[#1E4DB7] text-xs font-bold bg-[#F0F3FD]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left uppercase tracking-wider"
                  >
                    Mã đơn hàng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left  uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-left  uppercase tracking-wider"
                  >
                    Người nhận
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left uppercase tracking-wider"
                  >
                    Sản phẩm
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left uppercase tracking-wider"
                  >
                    Tổng tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <React.Fragment key={order.order_id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleExpand(order.order_id)}
                            className="mr-2 text-gray-400 hover:text-gray-500"
                          >
                            {expandedRow === order.order_id ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 cursor-pointer" onClick={() => onSelectOrder(order)}>
                                {order.order_id}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.tracking_id}
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(order.order_id)}
                              className="ml-2 text-gray-400 hover:text-blue-500 focus:outline-none"
                              title="Sao chép mã đơn hàng"
                            >
                              {copiedId === order.order_id ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium 
                            ${
                              statusConfig[order.status]?.color || "bg-gray-100"
                            } 
                            ${
                              statusConfig[order.status]?.textColor ||
                              "text-gray-800"
                            }`}
                        >
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.pick_to.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.pick_to.phone_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {order.product.length} sản phẩm
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(order.estimated_total_fee)}
                      </td>
                    </tr>

                    {expandedRow === order.order_id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Thông tin sản phẩm */}
                              <div className="pr-6 border-r border-gray-200">
                                <div className="font-semibold text-gray-900 mb-3">
                                  Sản phẩm đặt hàng
                                </div>
                                <div className="space-y-2">
                                  {order.product.map(
                                    (item: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className={`flex justify-between py-2 ${
                                          idx !== order.product.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                        }`}
                                      >
                                        <div>
                                          <div className="flex justify-between text-sm space-x-4">
                                            <div>{item.product_name}</div>
                                            <div className="text-gray-500">
                                              x{item.quantity}
                                            </div>
                                          </div>

                                          <div className="text-xs text-gray-500 line-through">
                                            {formatCurrency(
                                              item.original_price
                                            )}{" "}
                                            ({item.unit})
                                          </div>
                                          <div className="text-sm text-gray-500 font-medium">
                                            {formatCurrency(item.price)} (
                                            {item.unit})
                                          </div>
                                        </div>
                                        <div className="text-sm font-medium text-blue-600">
                                          {formatCurrency(
                                            item.price * item.quantity
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}

                                  <div className="flex justify-between py-2 font-semibold text-blue-700">
                                    <div>Tổng cộng</div>
                                    <div>
                                      {formatCurrency(
                                        calculateOrderTotal(order.product)
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Thông tin vận chuyển */}
                              <div>
                                <div className="font-semibold text-gray-900 mb-4">
                                  Thông tin vận chuyển
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <h5 className="text-sm">Người gửi</h5>
                                    <div className="text-sm mt-1 font-semibold">
                                      {order.pick_from.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {order.pick_from.phone_number}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {`${order.pick_from.address.address}, ${order.pick_from.address.ward}, ${order.pick_from.address.district}, ${order.pick_from.address.province}`}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h5 className="text-sm">Người nhận</h5>
                                    <div className="text-sm mt-1 font-medium">
                                      {order.pick_to.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {order.pick_to.phone_number}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {`${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`}
                                    </div>
                                  </div>
                                </div>

                                {order.delivery_instruction && (
                                  <div className="mt-4">
                                    <h5 className="text-xs font-medium text-gray-700">
                                      Chỉ dẫn giao hàng
                                    </h5>
                                    <div className="text-sm mt-1 italic">
                                      {order.delivery_instruction}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex items-center justify-center space-x-2 py-4">
            {/* Nút previous */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
            >
              <MdNavigateBefore className="text-xl" />
            </button>

            {/* Các nút số trang */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              // Quy tắc ẩn bớt số
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 &&
                  pageNumber <= currentPage + 1) ||
                (currentPage <= 3 && pageNumber <= 5) ||
                (currentPage >= totalPages - 2 && pageNumber >= totalPages - 4)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                      currentPage === pageNumber
                        ? "bg-blue-700 text-white"
                        : "text-black hover:bg-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }

              // Hiển thị dấu ...
              if (
                (pageNumber === currentPage - 2 && currentPage > 4) ||
                (pageNumber === currentPage + 2 && currentPage < totalPages - 3)
              ) {
                return (
                  <span key={pageNumber} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }

              return null;
            })}

            {/* Nút next */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-gray-400 hover:text-black disabled:cursor-not-allowed"
            >
              <MdNavigateNext className="text-xl" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center py-10 text-gray-500">
          Không tìm thấy đơn hàng nào
        </div>
      )}
    </>
  );
};

export default TableOrdersAdmin;
