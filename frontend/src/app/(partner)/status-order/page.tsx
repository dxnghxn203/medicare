"use client";

import { useState, useEffect } from "react";
import { OrderStatusCode, getOrderStatusInfo, NUMERIC_STATUS_MAP } from "@/utils/orderStatusMapping";
import { FiCheck, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { useOrder } from "@/hooks/useOrder";

export default function StatusOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [status, setStatus] = useState("");
    const [deliveryInstruction, setDeliveryInstruction] = useState("");
    const [shipperId, setShipperId] = useState("SHIPPER1"); // Default value
    const [shipperName, setShipperName] = useState("Tuấn"); // Default value
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { callWebHook } = useOrder();
    // Get the payload data for both display and submission
    const getPayloadData = () => {
        return {
            order_id: orderId || "ORDER71O1744084682",
            status: status || "returned",
            status_code: status ? NUMERIC_STATUS_MAP[status as OrderStatusCode] : "7",
            delivery_instruction: deliveryInstruction || "12345",
            shipper_id: shipperId,
            shipper_name: shipperName
        };
    };

    // Handle submit status change - replace with actual API call
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderId.trim()) {
            setError("Vui lòng nhập mã đơn hàng");
            return;
        }

        if (!status) {
            setError("Vui lòng chọn trạng thái mới cho đơn hàng");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            // Prepare the request payload
            const payload = getPayloadData();

            callWebHook(
                payload,
                () => {
                    setSuccess("Cập nhật trạng thái đơn hàng thành công!");
                    setError("");
                    setOrderId("");
                    setStatus("");
                    setDeliveryInstruction("");
                },
                () => {
                    setError("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
                }
            )

        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update display data when form values change
    const [displayData, setDisplayData] = useState(getPayloadData());

    useEffect(() => {
        setDisplayData(getPayloadData());
    }, [orderId, status, deliveryInstruction, shipperId, shipperName]);

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Cập nhật trạng thái đơn hàng</h1>
                <p className="text-gray-600 mt-1">
                    Nhập mã đơn hàng và chọn trạng thái mới để cập nhật
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Input Form */}
                <div className="w-full md:w-3/5">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cập nhật</h2>

                        <form onSubmit={handleSubmit}>
                            {/* Order ID input */}
                            <div className="mb-5">
                                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mã đơn hàng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="orderId"
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Nhập mã đơn hàng (VD: ORDER71O1744084682)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Status selection */}
                            <div className="mb-5">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái mới <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                >
                                    <option value="">-- Chọn trạng thái mới --</option>
                                    {Object.values(OrderStatusCode).map((statusCode) => (
                                        <option key={statusCode} value={statusCode}>
                                            {getOrderStatusInfo(statusCode).displayName} (Mã: {NUMERIC_STATUS_MAP[statusCode]})
                                        </option>
                                    ))}
                                </select>

                                {status && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <div className="flex items-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                                Mã: {NUMERIC_STATUS_MAP[status as OrderStatusCode]}
                                            </span>
                                            <StatusBadge status={status} />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {getOrderStatusInfo(status).description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Delivery instructions */}
                            <div className="mb-5">
                                <label htmlFor="deliveryInstruction" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú giao hàng
                                </label>
                                <textarea
                                    id="deliveryInstruction"
                                    value={deliveryInstruction}
                                    onChange={(e) => setDeliveryInstruction(e.target.value)}
                                    placeholder="Nhập ghi chú về việc giao hàng hoặc cập nhật trạng thái"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>

                            {/* Shipper information */}
                            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label htmlFor="shipperId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mã shipper
                                    </label>
                                    <input
                                        id="shipperId"
                                        type="text"
                                        value={shipperId}
                                        onChange={(e) => setShipperId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipperName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên shipper
                                    </label>
                                    <input
                                        id="shipperName"
                                        type="text"
                                        value={shipperName}
                                        onChange={(e) => setShipperName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Error and success messages */}
                            {error && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <FiAlertTriangle className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <FiCheck className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">{success}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit button */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang cập nhật...
                                        </span>
                                    ) : "Cập nhật trạng thái"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column - Data Preview */}
                <div className="w-full md:w-2/5">
                    <div className="bg-white shadow rounded-lg p-6 sticky top-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">Dữ liệu gửi đi</span>
                            <FiArrowRight className="text-gray-400" />
                        </h2>

                        <div className="bg-gray-800 rounded-lg p-4 overflow-hidden">
                            <div className="flex justify-between items-center mb-2 text-xs text-gray-400">
                                <span>JSON Payload</span>
                                <span className="px-2 py-1 bg-gray-700 rounded text-gray-300">
                                    POST /api/v1/webhook/shipment/status?verify_token=************..

                                </span>
                            </div>
                            <pre className="text-sm text-green-400 overflow-auto max-h-[500px]">
                                {JSON.stringify(displayData, null, 2)}
                            </pre>
                        </div>

                        {status && (
                            <div className="mt-4">
                                <h3 className="font-medium text-sm text-gray-600 mb-2">Thông tin trạng thái:</h3>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <StatusBadge status={status} />
                                        <span className="text-sm text-gray-500">
                                            (Mã: {NUMERIC_STATUS_MAP[status as OrderStatusCode]})
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {getOrderStatusInfo(status).description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* <div className="mt-4">
                            <h3 className="font-medium text-sm text-gray-600 mb-2">Thông tin người giao hàng:</h3>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-xs text-gray-500">ID:</span>
                                        <p className="text-sm font-medium">{shipperId}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">Tên:</span>
                                        <p className="text-sm font-medium">{shipperName}</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* Example response preview */}
                        {/* <div className="mt-4">
                            <h3 className="font-medium text-sm text-gray-600 mb-2">Phản hồi dự kiến:</h3>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="text-xs text-gray-400 mb-2">
                                    Response (200 OK)
                                </div>
                                <pre className="text-sm text-green-400 overflow-auto">
{`{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order_id": "${orderId || "ORDER71O1744084682"}",
    "status": "${status || "returned"}",
    "updated_at": "${new Date().toISOString()}"
  }
}`}
                                </pre>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatusBadgeProps {
    status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
    const statusInfo = getOrderStatusInfo(status);

    return (
        <span className={`inline-flex items-center rounded-full ${statusInfo.colors.bg} ${statusInfo.colors.text} px-3 py-1 text-sm font-medium`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5"></span>
            {statusInfo.displayName}
        </span>
    );
}