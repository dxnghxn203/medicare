import axiosClient from "@/utils/configs/axiosClient";

export const getAllArticlesAdmin = async () => {
    try {
        return await axiosClient.get(`v1/articles/get-articles-admin`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}

export const addArticleAdmin = async (data: any) : Promise<any> => {
    console.log("addArticleAdmin", data);
    try {
            const params = `/v1/articles/add`;
            const response: any = await axiosClient.post(params, data);
            return {
                status_code: response.status_code,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            throw error;
        }
}

export const deleteArticleAdmin = async (article_id: string) => {
    try {
        const params = `/v1/articles/delete/${article_id}`;
        const response: any = await axiosClient.delete(params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        };
    } catch (error: any) {
        throw error;
    }
}

export const updateArticleAdmin = async (data: any) => {
    try {
        const params = `/v1/articles/update`;
        const response: any = await axiosClient.put(params, data);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        };
    } catch (error: any) {
        throw error;
    }
}
export const updateArticleLogoAdmin = async (data: any, article_id: any) => {
    try {
        const params = `/v1/articles/update-image?article_id=${article_id}`;
        const response: any = await axiosClient.put(params, data);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        };
    } catch (error: any) {
        throw error;
    }
}

export const getArticleById = async (article_id: string) => {
    try {
        const params = `/v1/articles/${article_id}`;
        const response: any = await axiosClient.get(params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        };
    } catch (error: any) {
        throw error;
    }
}

export const getAllArticlesUser = async () => {
    try {
        return await axiosClient.get(`v1/articles/get-articles`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}

