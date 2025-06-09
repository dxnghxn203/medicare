import axiosClient from "@/utils/configs/axiosClient";


export const getDocumentByRequestId = async (
    requestId: any
) => {
    try {
        return await axiosClient.get(`/v1/documents/${requestId}`);
    } catch (error) {
        return {
            status_code: 500,
            message: 'Lỗi lấy tài liệu',
        }
    }
}

export const updateDocument = async (
    requestId: string,
    data: any
) => {
    try {
        return await axiosClient.put(`/v1/documents/${requestId}`, data);
    } catch (error) {
        return {
            status_code: 500,
            message: 'Lỗi cập nhật tài liệu',
        }
    }
}