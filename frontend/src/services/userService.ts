import axiosClient from "@/utils/configs/axiosClient";
export const insertUser = async (params: any): Promise<any> => {
    try {
        const url = "/v1/user/register_email";
        // console.log("param:", params);
        const paramsReq = {
            "phone_number": params.phoneNumber,
            "user_name": params.username,
            "email": params.email,
            "password": params.password,
            "gender": params.gender,
            "birthday": params.dateOfBirth
        }

        const result = await axiosClient.post(url, paramsReq);
        return result;

    } catch (error) {
        throw error;
    }
}

export const updateUserInfo = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/profile";
        const paramsReq = {
            "phone_number": params.phoneNumber,
            "user_name": params.username,
            "gender": params.gender,
            "birthday": params.dateOfBirth
        }

        const result = await axiosClient.put(url, paramsReq);
        return result;

    } catch (error) {
        throw error;
    }
}

export const verifyOtp = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/verify-email";
        const result = await axiosClient.post(url, params);
        return result;

    } catch (error) {
        throw error;
    }
}

export const sendOtp = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/otp";
        const result = await axiosClient.post(url, params);
        return result;

    } catch (error) {
        throw error;
    }
}



export const forgotPasswordUser = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/forgot-password";
        const result: any = await axiosClient.post(url, params);
        
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

export const changePasswordUser = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/change-password";
        const result: any = await axiosClient.post(url, params);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

export const changePasswordAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/change-password";
        const result: any = await axiosClient.post(url, params);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data,
            data: null
        }

    }
}

export const forgotPasswordAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/forgot-password";
        const result: any = await axiosClient.post(url, params);
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

export const updateAdminInfo = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/profile";
        const paramsReq = {
            "phone_number": params.phoneNumber,
            "user_name": params.username,
            "gender": params.gender,
            "birthday": params.dateOfBirth
        }

        const result = await axiosClient.put(url, paramsReq);
        return result;

    } catch (error) {
        throw error;
    }
}

export const updatePharmacistInfo = async (params: any): Promise<any> => {
    try {
        const url = "/v1/pharmacist/profile";
        const paramsReq = {
            "phone_number": params.phoneNumber,
            "user_name": params.username,
            "gender": params.gender,
            "birthday": params.dateOfBirth
        }

        const result = await axiosClient.put(url, paramsReq);
        return result;

    } catch (error) {
        throw error;
    }
}


export const updateStatusUser = async (params: { user_id: string; status_user: boolean }): Promise<any> => {
    try {
        const url = "/v1/users/status";
        const result: any = await axiosClient.put(url, null, {
            params: {
                user_id: params.user_id,
                status_user: params.status_user,
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
};

export const changePasswordPharmacist = async (params: any): Promise<any> => {
    try {
        const url = "/v1/pharmacist/change-password";
        const result: any = await axiosClient.post(url, params);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

export const forgotPasswordPharmacist = async (params: any): Promise<any> => {
    try {
        const url = "/v1/pharmacist/forgot-password";
        const result: any = await axiosClient.post(url, params);
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

export const getAllPharmacist = async (params: any): Promise<any> => {
    try {
        const url = "/v1/pharmacist/all-pharmacist-admin";
        const result: any = await axiosClient.get(url, { params });
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error) {
        return {
            status_code: 500,
            message: "Lỗi không xác định",
            data: null
        }

    }
}
export const getAllAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/all-admin";
        const result: any = await axiosClient.get(url, { params });
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error) {
        return {
            status_code: 500,
            message: "Lỗi không xác định",
            data: null
        }

    }
}
export const getAllUserAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/all-user-admin";
        const result: any = await axiosClient.get(url, { params });
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error) {
        return {
            status_code: 500,
            message: "Lỗi không xác định",
            data: null
        }

    }
}

export const updateStatusAdmin = async (params: { user_id: string; status_user: boolean }): Promise<any> => {
    try {
        const url = "/v1/admin/status";
        const result: any = await axiosClient.put(url, null, {
            params: {
                user_id: params.user_id,
                status_user: params.status_user,
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

export const updateStatusPharmacist = async (params: { pharmacist_id: string; status_pharmacist : boolean }): Promise<any> => {
    try {
        const url = "/v1/pharmacist/status";
        const result: any = await axiosClient.put(url, null, {
            params: {
                pharmacist_id: params.pharmacist_id,
                status_pharmacist : params.status_pharmacist,
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

export const insertPharmacist = async (params: any): Promise<any> => {
    try {
        const url = "/v1/pharmacist/insert";
        const result: any = await axiosClient.post(url, params);
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data,
        };
    } catch (error: any) {
        throw error;
    
    }
};

export const registerAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/register";
        const result: any = await axiosClient.post(url, params);
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data,
        };
    } catch (error: any) {
        throw error;
    
    }
};

export const verifyOTPAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/verify-email";
        const result: any = await axiosClient.post(url, params);
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data,
        };
    } catch (error: any) {
        throw error;
    
    }
};

export const sendOTPAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/otp";
        const result: any = await axiosClient.post(url, params);
        console.log("result:", result);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data,
        };
    } catch (error: any) {
        throw error;
    
    }
};

export const getMonthlyLoginStatistics = async (year: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/admin/monthly-login-statistics?year=${year}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error monthly login statistics", error)
        return {
            status_code: false,
            message: 'Lỗi lấy chỉ số đăng nhập tài khoản theo tháng',
        }
    }
}

export const getCountUserRoleStatistics = async () => {
    try {
        const response: any = await axiosClient.get(`/v1/admin/user-role-statistics`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error count user role statistics", error)
        return {
            status_code: false,
            message: 'Lỗi lấy tổng số người dùng theo loại',
        }
    }
}

export const getTopRevenueCustomersStatistics = async (top_n: number) => {
    try {
        const response: any = await axiosClient.get(`/v1/admin/top-revenue-customer-statistics?top_n=${top_n}`);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        console.log("error top revenue customer statistics", error)
        return {
            status_code: false,
            message: 'Lỗi lấy top khách hàng mua nhiều nhất',
        }
    }
}