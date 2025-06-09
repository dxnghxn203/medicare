// components/LatestOrders.jsx
import React, { useState } from "react";

import { useOrder } from "@/hooks/useOrder";
import { MdNavigateBefore, MdOutlineMoreHoriz } from "react-icons/md";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import { useToast } from "@/providers/toastProvider";

const statusConfig: Record<
  string,
  { label: string; color: string; textColor: string }
> = {
  created: {
    label: "Đã tạo",
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-green-100",
    textColor: "text-green-700",
  },
  processing: {
    label: "Đang xử lý",
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  shipping: {
    label: "Đang vận chuyển",
    color: "bg-purple-100",
    textColor: "text-purple-700",
  },
  delivery_success: {
    label: "Đã giao hàng",
    color: "bg-green-100",
    textColor: "text-green-700",
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100",
    textColor: "text-red-700",
  },
};
export default function LatestOrders() {
  const {
    allOrderAdmin,
  } = useOrder();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toast = useToast();

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

  const toggleActions = (orderId: string) => {
    setShowActions(showActions === orderId ? null : orderId);
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
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Đơn hàng mới đặt</h2>
        <a href="/quan-ly-don-hang" className="text-blue-500 text-sm">
          Xem tất cả
        </a>
      </div>
      {allOrderAdmin && allOrderAdmin.length > 0 ? (
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
                  <th
                    scope="col"
                    className="px-6 py-4 text-right uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOrderAdmin.map((order: any) => (
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
                              <div className="text-sm font-medium text-gray-900">
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
                        {formatCurrency(calculateOrderTotal(order.product))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="relative">
                          <button
                            onClick={() => toggleActions(order.order_id)}
                            className={`text-gray-400 p-2 rounded-full transition
                              ${
                                showActions === order.order_id
                                  ? "bg-gray-200"
                                  : "hover:bg-gray-200"
                              }
                            `}
                          >
                            <MdOutlineMoreHoriz size={20} />
                          </button>

                          {showActions === order.order_id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu">
                                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <Eye size={16} className="mr-2" />
                                  Xem chi tiết
                                </button>
                                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <Edit size={16} className="mr-2" />
                                  Chỉnh sửa
                                </button>
                                <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                  <Trash2 size={16} className="mr-2" />
                                  Hủy đơn
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
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
        </>
      ) : (
        <div className="flex justify-center items-center py-10 text-gray-500">
          Không tìm thấy đơn hàng nào
        </div>
      )}
    </div>
  );
}
