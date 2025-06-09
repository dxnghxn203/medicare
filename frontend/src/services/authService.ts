import axiosClient from "@/utils/configs/axiosClient";
import {AuthResponse} from "@/types/auth";
import {message} from "antd";

export const signInWithGoogle = async (data: any) => {
    try {
        const response: any = await axiosClient.post('/v1/auth/google-auth', data);
        return {
            status_code: response?.status_code || 200,
            message: response?.message || 'Đăng nhập bằng Google thành công',
            data: response?.data || null,
        }
    } catch (error: any) {
        console.error('Google login error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Đăng nhập bằng Google thất bại'
        };
    }
};

export const login = async (data: any): Promise<any> => {
    try {
        const response: any = await axiosClient.post('/v1/auth/login', data);
        return {
            status_code: response?.status_code || 200,
            user: response?.data || null,
            token: response?.data?.token || null,
            message: response?.message || 'Đăng nhập thành công',
        };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Đăng nhập thất bại'
        };
    }
};

// Logout
export const logout = async (token: string): Promise<boolean> => {
    try {
        console.log("logout service api")
        await axiosClient.get('/v1/auth/logout')
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Verify token
export const verifyToken = async (token: string) => {
    try {
        const response = await axiosClient.post("/auth/verify-token", {
            token: token,
        });
        return {isValid: true, userData: response.data.user};
    } catch (error) {
        console.error("Error verifying token:", error);
        return {isValid: false};
    }
};

// Get user profile
export const getUserProfile = async (token: string) => {
    try {
        const response = await axiosClient.get("/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

// loginAdmin
export const loginAdmin = async (data: any): Promise<AuthResponse> => {
    try {
        const response: any = await axiosClient.post('/v1/admin/login', data);
        return {
            success: true,
            admin: response?.data || null,
            token: response?.data?.token || null,
            message: response?.message || 'Đăng nhập thành công',

        };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Đăng nhập thất bại'
        };
    }

};

export const loginPharmacist = async (data: any): Promise<AuthResponse> => {
    try {
        const response: any = await axiosClient.post('/v1/pharmacist/login', data);
        return {
            success: true,
            pharmacist: response?.data || null,
            token: response?.data?.token || null,
            message: response?.message || 'Đăng nhập thành công'
        };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Đăng nhập thất bại'
        };
    }

}



