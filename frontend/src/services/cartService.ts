import axiosClient from "@/utils/configs/axiosClient";

export const addCart = async ( data: any): Promise<any> => {

    try {
        return {
            status: true,
            message: 'Thêm thành công vào giỏ hàng',
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Lổi thêm vào giỏ hàng',
        };
    }
}

export const addToCartSession = async (params: any)=>{
    try {
        const res = await axiosClient.post(`/v1/cart/session/?session=${params.session}&product_id=${params.product_id}&price_id=${params.price_id}&quantity=${params.quantity}`);
        return res;
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi thêm vào giỏ hàng',
        };
    }
}

export const addToCartToken = async (params: any)=>{
    try {
        const res = await axiosClient.post(`/v1/cart/?&product_id=${params.product_id}&price_id=${params.price_id}&quantity=${params.quantity}`);
        return res;
        
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi thêm vào giỏ hàng',
        };
    }
}

export const getCartSession = async (params: any)=>{
    try {
        const res = await axiosClient.get('/v1/cart/session/', {params});
        return res;
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi thêm vào giỏ hàng',
        };
    }
}

export const getCartToken = async (params: any)=>{
    try {
        const res = await axiosClient.get('/v1/cart/', );
        return res;
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi thêm vào giỏ hàng',
        };
    }
}

export const removeCartSession = async (params: any)=>{
    try {
        const res = await axiosClient.delete(`/v1/cart/session/`, {params});
        return res;
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi thêm vào giỏ hàng',
        };
    }
}

export const removeCartToken = async (params: any)=>{
    try {
        const res = await axiosClient.delete(`/v1/cart/`, {params});
        return res;
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi thêm vào giỏ hàng',
        };
    }
}
