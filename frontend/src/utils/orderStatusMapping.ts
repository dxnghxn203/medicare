/**
 * Order status mapping utility
 * Maps status names to their respective descriptions, colors, and icons
 */

// Define string-based status codes
export enum OrderStatusCode {
    CREATED = "created",
    WAITING_TO_PICK = "waiting_to_pick",
    PICKING = "picking",
    DELIVERING = "delivering",
    DELIVERY_SUCCESS = "delivery_success",
    DELIVERY_FAIL = "delivery_fail",
    WAITING_TO_RETURN = "waiting_to_return",
    RETURNED = "returned",
    CANCELED = "canceled"
}

// Reverse mapping for legacy code that might still use numeric codes
export const NUMERIC_STATUS_MAP = {
    "created": "0",
    "waiting_to_pick": "1",
    "picking": "2",
    "delivering": "3",
    "delivery_success": "4",
    "delivery_fail": "5",
    "waiting_to_return": "6",
    "returned": "7",
    "canceled": "8"
};

export const ORDER_STATUS_NAMES = {
    "created": "Tạo đơn hàng",
    "waiting_to_pick": "Chờ lấy hàng",
    "picking": "Đang lấy hàng",
    "delivering": "Đang giao hàng",
    "delivery_success": "Giao hàng thành công",
    "delivery_fail": "Giao hàng thất bại",
    "waiting_to_return": "Chờ trả hàng",
    "returned": "Đã trả hàng",
    "canceled": "Hủy đơn hàng"
};

export const ORDER_STATUS_DESCRIPTIONS = {
    "created": "Hệ thống tạo đơn thành công",
    "waiting_to_pick": "Đơn hàng đã sẵn sàng, đang chờ shipper lấy hàng từ kho giao",
    "picking": "Shipper đang lấy hàng ở kho",
    "delivering": "Shipper đang giao hàng tới điểm nhận",
    "delivery_success": "Shipper đã giao hàng thành công",
    "delivery_fail": "Vì lý do gì đó mà hàng không thể đến tay người nhận",
    "waiting_to_return": "Shipper đang trở về trả full hàng",
    "returned": "Shipper đã trả đơn hàng về kho",
    "canceled": "Đơn hàng đã bị hủy – Chỉ khi đơn hàng chưa được đưa ra khỏi kho nghĩa là ở status created"
};

// Color scheme for status visualization
export const ORDER_STATUS_COLORS = {
    // Tailwind CSS color classes
    "created": {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-300"
    },
    "waiting_to_pick": {
        bg: "bg-sky-100",
        text: "text-sky-800",
        border: "border-sky-300"
    },
    "picking": {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        border: "border-indigo-300"
    },
    "delivering": {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-300"
    },
    "delivery_success": {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300"
    },
    "delivery_fail": {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300"
    },
    "waiting_to_return": {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-300"
    },
    "returned": {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-300"
    },
    "canceled": {
        bg: "bg-rose-100",
        text: "text-rose-700",
        border: "border-rose-300"
    },
};

// HEX color values (for non-Tailwind contexts)
export const ORDER_STATUS_HEX_COLORS = {
    "created": "#dbeafe", // blue-100
    "waiting_to_pick": "#e0f2fe", // sky-100
    "picking": "#e0e7ff", // indigo-100
    "delivering": "#fef9c3", // yellow-100
    "delivery_success": "#dcfce7", // green-100
    "delivery_fail": "#fee2e2", // red-100
    "waiting_to_return": "#ffedd5", // orange-100
    "returned": "#fef3c7", // amber-100
    "canceled": "#ffe4e6", // rose-100
};

// Icon mapping
export const ORDER_STATUS_ICONS = {
    // Replace these with actual icon components from your icon library
    "created": "PackageIcon", // FiPackage - Created
    "waiting_to_pick": "ClockIcon", // FiClock - Waiting to pick
    "picking": "LoaderIcon", // FiLoader - Picking
    "delivering": "TruckIcon", // FiTruck - Delivering
    "delivery_success": "CheckCircleIcon", // FiCheckCircle - Success
    "delivery_fail": "AlertCircleIcon", // FiAlertCircle - Delivery fail
    "waiting_to_return": "RotateCcwIcon", // FiRotateCcw - Waiting to return
    "returned": "CornerLeftDownIcon", // FiCornerLeftDown - Returned
    "canceled": "XCircleIcon", // FiXCircle - Canceled
};

/**
 * Get complete status information for a given status name
 * @param statusName Order status name (e.g., "canceled", "returned")
 * @returns Object containing all info about the status
 */
export function getOrderStatusInfo(statusName: string) {
    // Handle numeric codes for backward compatibility
    if (/^\d+$/.test(statusName)) {
        // Convert numeric code to string status name using the reverse of our original mapping
        const statusKeys = Object.keys(NUMERIC_STATUS_MAP);
        for (const key of statusKeys) {
            if (NUMERIC_STATUS_MAP[key as keyof typeof NUMERIC_STATUS_MAP] === statusName) {
                statusName = key;
                break;
            }
        }
    }

    return {
        name: statusName,
        displayName: ORDER_STATUS_NAMES[statusName as keyof typeof ORDER_STATUS_NAMES] || "Unknown Status",
        description: ORDER_STATUS_DESCRIPTIONS[statusName as keyof typeof ORDER_STATUS_DESCRIPTIONS] || "No description available",
        colors: ORDER_STATUS_COLORS[statusName as keyof typeof ORDER_STATUS_COLORS] || {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-300"
        },
        hexColor: ORDER_STATUS_HEX_COLORS[statusName as keyof typeof ORDER_STATUS_HEX_COLORS] || "#f3f4f6",
        icon: ORDER_STATUS_ICONS[statusName as keyof typeof ORDER_STATUS_ICONS] || "QuestionIcon",
    };
}

/**
 * Determines if an order is eligible for cancellation
 * (Only possible when order is in "created" status)
 */
export function canCancelOrder(statusName: string): boolean {
    return statusName === OrderStatusCode.CREATED;
}

/**
 * Determines if an order is in a "pending" state
 */
export function isOrderPending(statusName: string): boolean {
    return [
        OrderStatusCode.CREATED,
        OrderStatusCode.WAITING_TO_PICK,
        OrderStatusCode.PICKING,
        OrderStatusCode.DELIVERING
    ].includes(statusName as OrderStatusCode);
}

/**
 * Determines if an order is in a completed state (successful delivery)
 */
export function isOrderCompleted(statusName: string): boolean {
    return [
        OrderStatusCode.DELIVERY_SUCCESS
    ].includes(statusName as OrderStatusCode);
}

/**
 * Determines if an order has failed or been canceled
 */
export function isOrderFailed(statusName: string): boolean {
    return [
        OrderStatusCode.DELIVERY_FAIL,
        OrderStatusCode.CANCELED
    ].includes(statusName as OrderStatusCode);
}

/**
 * Determines if an order is in a return process
 */
export function isOrderReturning(statusName: string): boolean {
    return [
        OrderStatusCode.WAITING_TO_RETURN,
        OrderStatusCode.RETURNED
    ].includes(statusName as OrderStatusCode);
}
