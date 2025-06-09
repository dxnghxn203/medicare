import axiosClient from "@/utils/configs/axiosClient";

export const getAllBrandsAdmin = async () => {
    try {
        return await axiosClient.get(`v1/brands/get-brands-admin`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}

export const addBrandAdmin = async (data: any) : Promise<any> => {
    console.log("addBrandAdmin", data);
    try {
            const params = `/v1/brands/add`;
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

export const deleteBrandAdmin = async (brand_id: string) => {
    try {
        const params = `/v1/brands/delete/${brand_id}`;
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

export const updateBrandAdmin = async (data: any) => {
    try {
        const params = `/v1/brands/update`;
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
export const updateBrandLogoAdmin = async (data: any, brand_id: any) => {
    try {
        const params = `/v1/brands/update-logo?brand_id=${brand_id}`;
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

export const getAllBrandsUser = async () => {
    try {
        return await axiosClient.get(`v1/brands/get-brands`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}

export const getAllBrandsById = async (brand_id: string) => {
    console.log("brand_id", brand_id);
    try {
        return await axiosClient.get(`v1/brands/${brand_id}`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}

