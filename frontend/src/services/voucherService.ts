import axiosClient from "@/utils/configs/axiosClient";

export const getAllVouchers = async (page: any, page_size: any) => {
    try {
        return await axiosClient.get(`v1/vouchers/all-vouchers-admin?page=${page}&page_size=${page_size}`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}

export const addVoucher = async (params: any) => {
    console.log("params", params)
    try {
        return await axiosClient.post(`/v1/vouchers/add`, params);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi thêm voucher',
        };
    }
}

export const updateVoucher = async (voucher_id: any, payload: any) => {
    try {
        return await axiosClient.put(`/v1/vouchers/update?voucher_id=${voucher_id}`, payload);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi cập nhật voucher',
        };
    }
}

export const deleteVoucher = async (voucher_id: any) => {
    try {
        return await axiosClient.delete(`/v1/vouchers/delete?voucher_id=${voucher_id}`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi xóa voucher',
        };
    }
}


export const updateStatusVoucher = async (params: { voucher_id: string; status_voucher : boolean }) => {
   try {
        const url = "/v1/vouchers/status";
        const result: any = await axiosClient.put(url, null, {
            params: {
                voucher_id: params.voucher_id,
                status_voucher : params.status_voucher,
            },
        });
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data,
        };
    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message || "Server error",
            data: null,
        };
    }
}

export const getAllVouchersUser = async () => {
    try {
        return await axiosClient.get(`/v1/vouchers/all-vouchers`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}



