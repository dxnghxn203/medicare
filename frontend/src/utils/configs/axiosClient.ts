import axios from "axios";
import {removeToken, removeTokenAdmin, removeTokenPharmacist} from "@/utils/cookie";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Private-Network": true,
        "Content-Security-Policy": "upgrade-insecure-requests",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        "Access-Control-Allow-Methods": '*',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
    },
    paramsSerializer: (params) => {
        return Object.keys(params)
            .map((key) => {
                if (Array.isArray(params[key])) {
                    return params[key]
                        .map(
                            (val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
                        )
                        .join("&");
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            })
            .join("&");
    },
});

axiosClient.interceptors.request.use(
    async (config) => {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    function (response: any) {
        if (response?.status_code === 401 || response?.status_code === 403) {
            // removeToken();
            // removeTokenAdmin();
            // removeTokenPharmacist();
        }
        return response?.data;
    },
    function (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // removeToken();
            // removeTokenAdmin();
            // removeTokenPharmacist();
        }
        return Promise.reject(error);
    }
);

export const setClientToken = (token: any) => {
    axiosClient.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log("setClientToken", config.headers.Authorization)
        return config;
    });
};

export default axiosClient;
