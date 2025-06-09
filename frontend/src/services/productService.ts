import axiosClient from "@/utils/configs/axiosClient";

export const getProductBySlug = async (slug: string) => {
    try {
        const response = await axiosClient.get(`/v1/product/${slug}/`);
        return response;
    } catch (error) {
        console.error("Error fetching child category:", error);
        throw error;
    }

}

export const imageToProduct = async (params: any) => {
    try {
        const response: any = await axiosClient.post(`${process.env.NEXT_PUBLIC_RECOMMENDATION_API}/v1/extract-drugs`, params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getDealForYou = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/best-deal?top_n=${params.top_n}`);
        return response;
    } catch (error: any) {
        return {
            status: 500,
            message: error.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductTopSelling = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/top-selling`, {params: {params}});
        return response;
    } catch (error: any) {
        return {
            status: 500,
            message: error.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const addProduct = async (data: any): Promise<any> => {
    try {
        const response: any = await axiosClient.post(`/v1/product/add`, data);
        console.log("response", response);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }

    } catch (error: any) {
        // console.log("error", error?.response?.data?.message);
        return {
            status_code: error?.response?.status || 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }

    }
}

export const getAllProductAdmin = async (
    page: any, pageSize: any,
    low_stock_status: any = null,
    main_category: any = null,
    best_seller: any = null
) => {
    try {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("page_size", pageSize);

        if (low_stock_status !== null && low_stock_status !== undefined) {
            params.append("low_stock_status", low_stock_status);
        }

        if (main_category) {
            params.append("main_category", main_category);
        }

        if (best_seller !== null && best_seller !== undefined) {
            params.append("best_seller", best_seller);
        }

        const response: any = await axiosClient.get(`/v1/products/all-product-admin?${params.toString()}`);
        console.log(response.data);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductBySlugSession = async (slug: any, session_id: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/product/session/${slug}`, {params: {session_id}});
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductsRelated = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`${process.env.NEXT_PUBLIC_RECOMMENDATION_API}/v1/related/${params.product_id}?top_n=${params.top_n}`);
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}

export const getProductReviewSession = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/get-recently-viewed/${params}`, {});
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductReviewToken = async () => {
    try {
        const response: any = await axiosClient.get(`/v1/products/get-recently-viewed`, {});
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}


export const getProductFeatured = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/featured`, {params});
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductsBestDeal = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/best-deal`, {params});
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const deleteProduct = async (product_id: any) => {
    try {
        const params = `/v1/product/delete?product_id=${product_id}`;
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

export const getAllProductApproved = async (
    page: any, pageSize: any,
    keyword: any = null,
    mainCategory: any = null,
    prescriptionRequired: any = null,
    status: any = null
) => {
    try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("page_size", pageSize);
        if (keyword) {
            params.append("keyword", keyword);
        }
        if (mainCategory) {
            params.append("main_category", mainCategory);
        }
        if (prescriptionRequired !== null && prescriptionRequired !== undefined) {
            params.append("prescription_required", prescriptionRequired);
        }
        if (status) {
            params.append("status", status);
        }

        const response: any = await axiosClient.get(`/v1/products/get-approve-product?${params.toString()}`);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getAvailableProduct = async (product_id: string, price_id: string) => {
    try {
        const response: any = await axiosClient.get("/v1/products/getAvailableQuantity", {
            params: {
                product_id,
                price_id
            }
        });
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getSimilarProducts = async (product_id: any, pageSize: number = 10, page: number = 1) => {
    try {
        const response: any = await axiosClient.get(`${process.env.NEXT_PUBLIC_RECOMMENDATION_API}/v1/related/${product_id}`);
        if (response.status_code === 200 && Array.isArray(response.data)) {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedProducts = response.data.slice(startIndex, endIndex);

            return {
                products: paginatedProducts,
                total: response.data.length
            };
        } else {
            console.error('API response error:', response.message || 'Unknown error');
            return {products: [], total: 0};
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const approveProductByPharmacist = async (params: any) => {
    try {
        const response: any = await axiosClient.post("/v1/products/approve", params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const updateProduct = async (params: any) => {
    try {
        const response: any = await axiosClient.put("/v1/products/update-product", params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}

export const addMediaProduct = async (params: any) => {
    try {
        const response: any = await axiosClient.post("/v1/products/add-media", params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}

export const updateCertificateFileProduct = async (product_id: any, params: any) => {
    try {
        console.log("params", params);
        console.log("product_id", product_id);
        const response: any = await axiosClient.put(`/v1/products/update-certificate-file?product_id=${product_id}`, params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}
export const updateImagesPrimaryProduct = async (product_id: any, params: any) => {
    try {
        const response: any = await axiosClient.put(`/v1/products/update-images-primary?product_id=${product_id}`, params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}

export const updateImagesProduct = async (product_id: any, params: any) => {
    try {
        // console.log("params", params);
        // console.log("product_id", product_id);
        const response: any = await axiosClient.put(`/v1/products/update-images?product_id=${product_id}`, params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}

export const searchProduct = async (query: any, page: any, page_size: any) => {
    try {

        const response: any = await axiosClient.get(`/v1/products/search?query=${query}&page=${page}&page_size=${page_size}`);
        // console.log("response", response.data);
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getAllBrands = async () => {
    try {

        const response: any = await axiosClient.get(`/v1/products/get_all_brands`);
        return response;
    } catch (error) {
        console.error("Error fetching child category:", error);
        throw error;
    }
}

export const importFileAddProduct = async (params: any) => {
    try {
        console.log("service", params)
        params.forEach((value: any, key: any) => {
            console.log(`${key}:`, value);
        });
        const response: any = await axiosClient.post(`/v1/products/import`, params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getAllImportFileAddProduct = async (page: any, page_size: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/import?page=${page}&page_size=${page_size}`);
        return response;
    } catch (error) {
        console.error("Error fetching child category:", error);
        throw error;
    }
}

export const deleteImportFileProduct = async (import_id: any) => {
    try {
        const response: any = await axiosClient.delete(`/v1/products/import?import_id=${import_id}`);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductDiscount = async (page: any, page_size: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/discount?page=${page}&page_size=${page_size}`);
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductDiscountAdmin = async (page: any, page_size: any, is_approved: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/discount-admin?page=${page}&page_size=${page_size}&is_approved=${is_approved}`);
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductLowStock = async () => {
    try {
        const response: any = await axiosClient.get(`/v1/products/low-stock`);
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}