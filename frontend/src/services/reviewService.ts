import axiosClient from "@/utils/configs/axiosClient";
import { message } from "antd";

export const getAllReview = async (id: string, pageSize: number, rating: number) => {
    try {
        const response = await axiosClient.get(`/v1/review/product/${id}?page=1&page_size=${pageSize}&rating=${rating}`);
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllComment = async (id: string, pageSize: number, sortType: string) => {
    try {
        const response = await axiosClient.get(`/v1/comment/product/${id}?page=1&page_size=${pageSize}&sort_type=${sortType}`);
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const insertReview = async (params: any) => {
    try {
        const url = "/v1/review/add";
        console.log("param:", params);
        const result = await axiosClient.post(url, params);
        
        return result;
    } catch (error: any) {
        console.log("result:", params.rating);
        console.error("Chi tiết lỗi:", error?.response?.data);
        throw error;
    }
    
}

export const insertComment = async (params: any) => {
    try {
        const url = "/v1/comment/add";
        console.log("param:", params);
        const paramsReq = {
            "comment" : params.comment, 
            "product_id": params.productId,
        }
        const result = await axiosClient.post(url, paramsReq);
        // console.log("result:", result);
        return result;
    } catch (error) {
        throw error;
    }
    
}

export const insertAnswer = async (params: any) => {    
    try {
        const url = "/v1/comment/answer";
        console.log("param:", params);
        const paramsReq = {
            "comment_id": params.comment_id, 
            "comment": params.comment, 
        }
        const result = await axiosClient.post(url, paramsReq);
        console.log("result:", result);
        return result;
    } catch (error) {
        throw error;
    }
    
}
export const insertAnswerReview = async (params: any) => {
    try {
        const url = "/v1/review/reply";
        console.log("param:", params);
        
        const result = await axiosClient.post(url, params);
        console.log("result:", result);
        return result;
    } catch (error) {
        throw error;
    }
    
}


