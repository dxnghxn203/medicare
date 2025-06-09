import axiosClient from "@/utils/configs/axiosClient";

export const startChatBoxUser = async () => {
    try {
        return await axiosClient.post(`/v1/conversations/user`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi bắt đầu chatbox USER',
        };
    }
}

export const startChatBoxGuest = async (params: any) => {
    try {
        return await axiosClient.post(`/v1/conversations/guest`, params);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi bắt đầu chatbox USER',
        };
    }
}

export const getAllConversationWaiting = async (limit: any): Promise<any> => {
    try {
        const params = `/v1/conversations/waiting?page=${limit.page}&page_size=${limit.page_size}`;
        return await axiosClient.get(params);
    } catch (error) {
        throw error;
    }
}

export const acceptConversation = async (params: any) => {
    try {
        return await axiosClient.patch(`/v1/conversations/${params}/accept`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi bắt đầu chatbox USER',
        };
    }
}



