import axiosClient from "@/utils/configs/axiosClient";
import medicine from "@/images/medicinee.png";

export const checkVoucher = async (data: any) => {
    try {
        const response: any = await axiosClient.post('/v1/order/check_shipping_fee', data);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy phí vận chuyển',
        }
    }
}

export const checkOrder = async (data: any, session: any): Promise<any> => {
    try {
        const url = session ? `/v1/order/check?session=${session}` : '/v1/order/check';
        const response: any = await axiosClient.post(url, data);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi đặt hàng',
        };
    }
}

export const createOrder = async (data: any): Promise<any> => {
    try {
        const response = await axiosClient.post('/v1/order/add', data);
        return {
            status: response?.status,
            message: 'Đặt hàng thành công',
            data: response.data
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi đặt hàng',
        };
    }
}

export const getAllOrderAdmin = async (params: any) => {
    try {
        const response: any = await axiosClient.get('/v1/order/all-orders-admin', {params});
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy danh sách đơn hàng',
        }
    }

}

export const getOrderByUserId = async () => {
    try {
        const response: any = await axiosClient.get('/v1/order/order');
        return response;
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy danh sách đơn hàng',
        }
    }
}

export const callWebhook = async (data: any) => {
    try {
        const verify_token = process.env.NEXT_PUBLIC_WEBHOOK_TOKEN;
        const host_hook = process.env.NEXT_PUBLIC_HOST_HOOK;
        const response: any = await axiosClient.post(`${host_hook}/api/v1/webhook/shipment/status?verify_token=${verify_token}`, data);
        return response;
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi gọi webhook',
        }
    }
}

export const checkShippingFee = async (data: any) => {
    try {
        const response: any = await axiosClient.post('/v1/order/check_shipping_fee', data);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy phí vận chuyển',
        }
    }
}

export const cancelOrder = async (order_id: any) => {
    try {
        const response: any = await axiosClient.delete(`/v1/order/delete?order_id=${order_id}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi hủy đơn hàng',
        }
    }
}
export const getTrackingOrder = async (order_id: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/tracking?order_id=${order_id}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy thông tin đơn hàng',
        }
    }
}

export const downloadInvoice = async (order_id: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/invoice?order_id=${order_id}`, {
            responseType: 'blob', // <<< THÊM responseType blob
        });
        return response;
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi tải hóa đơn',
        }
    }
}

export const getStatistics365Days = async () => {
    try {
        const response: any = await axiosClient.get('/v1/order/statistic-last-365-days');
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy thống kê 365 ngày',
        }
    }
}

export const userRequestPrescription = async (data: any) => {

    try {
        console.log(data, "service")
        data.forEach((value: any, key: any) => {
            console.log(`${key}:`, value);
        });
        const response: any = await axiosClient.post('/v1/order/request-prescription', data);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };

    } catch (error: any) {
        // console.log(error)
        // if (error.response) {
        //     // console.error("Backend error response:", error.response.data);
        //   } else {
        //     console.error("Other error:", error.message);
        //   }
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}

export const getRequestOrder = async () => {
    try {
        const response: any = await axiosClient.get('/v1/order/request-order');
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy danh sách đơn hàng yêu cầu',
        }
    }
}

export const getApproveRequestOrder = async (
    data: any  // Default parameters
) => {
    try {
        const params = new URLSearchParams();
        params.append("page", data.page);
        params.append("page_size", data.page_size);
        if (data.status) {
            params.append("status", data.status);
        }
        const response: any = await axiosClient.get(`/v1/order/approve-prescription?${params.toString()}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy danh sách đơn hàng yêu cầu',
        }
    }
}

export const approveRequestOrder = async (data: any) => {
    try {
        const response: any = await axiosClient.post("/v1/order/approve", data);
        console.log("service", data)
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi duyệt đơn hàng yêu cầu',
        }
    }
}


export const checkFeeApproveRequestOrder = async (data: any) => {
    try {
        const response: any = await axiosClient.post("/v1/order/approve-fee", data);
        console.log("service", data)
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi kiểm tra phí đơn tư vấn',
        }
    }
}

export const getOverviewStatisticsOrder = async () => {
    try {
        const response: any = await axiosClient.get("/v1/order/overview-statistics");
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lỗi lấy thống kê tổng quát',
        }
    }
}

export const getMonthlyRevenueStatisticsOrder = async (year: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/monthly-revenue-statistics?year=${year}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error monthly revenue", error)
        return {
            status_code: false,
            message: 'Lỗi lấy doanh thu theo tháng',
        }
    }
}

export const getCategoryMonthlyRevenueStatisticsOrder = async (month: number, year: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/category-monthly-revenue-statistics?month=${month}&year=${year}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error category monthly revenue", error)
        return {
            status_code: false,
            message: 'Lỗi lấy doanh thu danh mục theo tháng',
        }
    }
}

export const getTypeMonthlyRevenueStatisticsOrder = async (month: number, year: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/type-monthly-revenue-statistics?month=${month}&year=${year}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error type monthly revenue", error)
        return {
            status_code: false,
            message: 'Lỗi lấy doanh thu thanh toán theo tháng',
        }
    }
}

export const getMonthlyProductSoldStatistics = async (year: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/monthly-product-sold-statistics?year=${year}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error monthly product sold", error)
        return {
            status_code: false,
            message: 'Lỗi lấy số lượng sản phẩm bán theo tháng',
        }
    }
}

export const getMonthlyTopSellingProductStatistics = async (month: number, year: number, top_n: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/monthly-top-selling-product-statistics?month=${month}&year=${year}&top_n=${top_n}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error monthly top selling product", error)
        return {
            status_code: false,
            message: 'Lỗi lấy top sản phẩm bán chạy bán theo tháng',
        }
    }
}

export const getMonthlyCountOrderStatistics = async (year: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/order/monthly-count-order-statistics?year=${year}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error monthly count order product", error)
        return {
            status_code: false,
            message: 'Lỗi lấy số lượng đơn hàng theo tháng',
        }
    }
}