import axiosClient from "@/utils/configs/axiosClient";
import {message} from "antd";

export const getAllCategory = async (): Promise<any> => {
    try {
        const response = await axiosClient.get("/v1/category/");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}
export const getMainCategory = async (main_slug: any): Promise<any> => {
    try {
        const response = await axiosClient.get(`/v1/category/${main_slug}`);
        // console.log("service");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getSubCategory = async (main_slug: any, sub_slug: any): Promise<any> => {
    try {
        const response = await axiosClient.get(`/v1/category/${main_slug}/sub-category/${sub_slug}`);
        // console.log("service");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getChildCategory = async (main_slug: any, sub_slug: any, child_slug: any): Promise<any> => {
    try {
        const response = await axiosClient.get(`/v1/category/${main_slug}/sub-category/${sub_slug}/child-category/${child_slug}`);

        return response;
    } catch (error) {
        // console.error("Error fetching child category:", error);
        throw error;
    }
};

export const getAllCategoryForAdmin = async (): Promise<any> => {
    try {
        const response: any = await axiosClient.get("/v1/categories/get-all-for-admin");
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error) {
        return {
            error: true,
            message: "Failed to fetch categories",
        }
    }
};

export const updateMainCategory = async (mainCategory: any, data: any): Promise<any> => {
    try {
        const params = `/v1/category/update/${mainCategory}?main_category_name=${data.main_category_name}&main_category_slug=${data.main_category_slug}`;
        const response: any = await axiosClient.put(params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error) {
        return {
            error: true,
            message: "Failed to update category",
        }
    }
}

export const updateSubCategory = async (subCategoryId: any, data: any): Promise<any> => {
    try {
        const params = `/v1/category/sub-category/update/${subCategoryId}?sub_category_name=${data.sub_category_name}&sub_category_slug=${data.sub_category_slug}`;
        const response: any = await axiosClient.put(params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error) {
        return {
            error: true,
            message: "Failed to update category",
        }
    }
}

export const updateChildCategory = async (childCategoryId: any, data: any): Promise<any> => {
    try {
        const params = `/v1/category/child-category/update/${childCategoryId}?child_category_name=${data.child_category_name}&child_category_slug=${data.child_category_slug}`;
        const response: any = await axiosClient.put(params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error) {
        return {
            error: true,
            message: "Failed to update category",
        }
    }
}

export const addCategory = async (params: any): Promise<any> => {
    try {

        const response: any = await axiosClient.post("/v1/category/add", params);
        console.log("params", params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error: any) {
        throw error;
    }
}

export const addChildCategory = async (
    main_slug: string,
    sub_slug: string,
    body: {
        child_category_name: string;
        child_category_slug: string;
    }
): Promise<any> => {
    try {
        const url = `/v1/category/${main_slug}/sub-category/${sub_slug}/child-category/add`;

        const response: any = await axiosClient.post(url, body); // gửi JSON body

        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        };
    } catch (error: any) {
        throw error;
    }
};

export const addSubCategory = async (
    main_slug: string, body: any): Promise<any> => {
    try {
        const url = `/v1/category/${main_slug}/sub-category/add`;

        const response: any = await axiosClient.post(url, body); // gửi JSON body

        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        };
    } catch (error: any) {
        throw error;
    }
}

export const updateImageSubCategory = async (
    sub_category_id: string,
    data: any
): Promise<any> => {
    try {
        const params = `/v1/category/sub-category/${sub_category_id}/update-image`;
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

export const updateImageChildCategory = async (
    child_category_id: string,
    data: any
): Promise<any> => {
    try {
        const params = `/v1/category/child-category/${child_category_id}/update-image`;
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

export const deleteChildCategory = async (child_category_id: string): Promise<any> => {
    try {
        const params = `/v1/category/child/${child_category_id}`;
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

export const deleteSubCategory = async (sub_category_id: string): Promise<any> => {
    try {
        const params = `/v1/category/sub/${sub_category_id}`;
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

export const deleteMainCategory = async (main_category_id: string): Promise<any> => {
    try {
        const params = `/v1/category/main/${main_category_id}`;
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

  

