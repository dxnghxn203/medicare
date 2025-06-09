import {
    fetchChangePasswordAdminStart,
    fetchChangePasswordPharmacistStart,
    fetchChangePasswordStart,
    fetchForgotPasswordAdminStart,
    fetchForgotPasswordPharmacistStart,
    fetchForgotPasswordStart,
    fetchGetAllAdminStart,
    fetchGetAllPharmacistStart,
    fetchGetAllUserAdminStart,
    fetchInsertPharmacistStart,
    fetchInsertUserStart,
    fetchUpdateUserInfoStart,
    fetchUpdateAdminInfoStart,
    fetchUpdatePharmacistInfoStart,
    fetchRegisterAdminStart,
    fetchSendOtpAdminStart,
    fetchSendOtpStart,
    fetchUpdateStatusPharmacistStart,
    fetchUpdateStatusUserStart,
    fetchVerifyOtpAdminStart,
    fetchVerifyOtpStart,
    fetchGetMonthlyLoginStatisticsStart,
    fetchGetCountUserRoleStatisticsStart,
    fetchGetTopRevenueCustomersStatisticsStart
} from "@/store";
import {
    insertUserSelector, 
    selectAllAdmin, 
    selectAllPharmacist, 
    selectAllUserAdmin, 
    selectCountUserRole, 
    selectTopRevenueCustomers,
    selectTotalAdmin,
    selectTotalPharmacist,
    selectTotalUserAdmin
} from "@/store/user/userSelector";
import {useDispatch, useSelector} from "react-redux";
import {useSession} from "next-auth/react";
import {useState} from "react";

export interface UserData {
    _id: string;
    phone_number: string;
    user_name: string;
    email: string;
    gender: string;
    auth_provider: string;
    birthday: string;
    role_id: string;
    active: boolean;
    verified_email_at: string;
    created_at: string;
    updated_at: string;
}

export function useUser() {
    const dispatch = useDispatch();
    const insertUser: any = useSelector(insertUserSelector);
    const {data: session} = useSession();
    // const {user, setUser, isLoading} = useAuthContext();
    const allUserAdmin = useSelector(selectAllUserAdmin);
    const totalUserAdmin = useSelector(selectTotalUserAdmin);
    const allPharmacist = useSelector(selectAllPharmacist);
    const totalPharmacist = useSelector(selectTotalPharmacist);
    const allAdmin = useSelector(selectAllAdmin);
    const totalAdmin = useSelector(selectTotalAdmin);
    const countUserRole = useSelector(selectCountUserRole);
    const topRevenueCustomers = useSelector(selectTopRevenueCustomers);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // const saveUser = (userData: UserData) => {
    //     localStorage.setItem("user", JSON.stringify(userData));
    //     setUser(userData);
    // };
    //
    // const clearUser = () => {
    //     localStorage.removeItem("user");
    //     setUser(null);
    // };
    //
    // const updateUser = (updatedData: Partial<UserData>) => {
    //     if (user) {
    //         const newUserData = {...user, ...updatedData};
    //         localStorage.setItem("user", JSON.stringify(newUserData));
    //         setUser(newUserData);
    //     }
    // };

    const getAllUser = () => {
        dispatch(fetchGetAllUserAdminStart({
            page: page,
            page_size: pageSize
        }));
    };

    const fetchInsertUser = ({
                                 param, onSuccess, onFailure
                             }: {
        param: any;
        onSuccess: (message: string) => void;
        onFailure: (message: string) => void;
    }) => {
        dispatch(fetchInsertUserStart({
            ...param,
            onSuccess,
            onFailure
        }));
    };

    const fetchUpdateUserInfo = ({
                                 param, onSuccess, onFailure
                             }: {
        param: any;
        onSuccess: (message: string) => void;
        onFailure: (message: string) => void;
    }) => {
        dispatch(fetchUpdateUserInfoStart({
            ...param,
            onSuccess,
            onFailure
        }));
    };

    const fetchUpdateAdminInfo = ({
                                 param, onSuccess, onFailure
                             }: {
        param: any;
        onSuccess: (message: string) => void;
        onFailure: (message: string) => void;
    }) => {
        dispatch(fetchUpdateAdminInfoStart({
            ...param,
            onSuccess,
            onFailure
        }));
    };

    const fetchUpdatePharmacistInfo = ({
                                 param, onSuccess, onFailure
                             }: {
        param: any;
        onSuccess: (message: string) => void;
        onFailure: (message: string) => void;
    }) => {
        dispatch(fetchUpdatePharmacistInfoStart({
            ...param,
            onSuccess,
            onFailure
        }));
    };

    const verifyOtp = ({
                           param, onSuccess, onFailure
                       }: {
        param: any;
        onSuccess: (message: string) => void;
        onFailure: (message: string) => void;
    }) => {
        dispatch(fetchVerifyOtpStart({
            ...param,
            onSuccess,
            onFailure
        }));
    };

    const sendOtp = ({
                         param, onSuccess, onFailure
                     }: {
        param: any;
        onSuccess: (message: string) => void;
        onFailure: (message: string) => void;
    }) => {
        dispatch(fetchSendOtpStart({
            ...param,
            onSuccess,
            onFailure
        }));
    }

    const forgotPasswordUser = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchForgotPasswordStart({
            ...params,
            onSuccess,
            onFailure
        }));

    }

    const changePasswordUser = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchChangePasswordStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }

    const changePasswordAdmin = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchChangePasswordAdminStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }

    const forgotPasswordAdmin = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchForgotPasswordAdminStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }

    const updateStatusUser = (
        params: { user_id: string; status_user: boolean },
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchUpdateStatusUserStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }

    const changePasswordPharmacist = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchChangePasswordPharmacistStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }

    const forgotPasswordPharmacist = (
        credentials: any,
        onSuccess: (message: any) => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(fetchForgotPasswordPharmacistStart({
            ...credentials,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    }

    const fetchAllPharmacist = () => {
        dispatch(fetchGetAllPharmacistStart({
            page: page,
            page_size: pageSize
        }));
    }

    const fetchAllAdmin = () => {
        dispatch(fetchGetAllAdminStart({
            page: page,
            page_size: pageSize
        }));
    }
    const fetchUpdateStatusPharmacist = (
        params: { pharmacist_id: string; status_pharmacist: boolean },
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchUpdateStatusPharmacistStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }
    const fetchInsertPharmacist = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchInsertPharmacistStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }

    const fetchRegisterAdmin = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchRegisterAdminStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }

    const fetchVerifyEmail = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchVerifyOtpAdminStart({
            ...params,
            onSuccess,
            onFailure
        }));
    }
    const fetchSendOTPAdmin = (
        params: any,
        onSuccess: (message: string) => void,
        onFailure: (message: string) => void
    ) => {
        dispatch(fetchSendOtpAdminStart({
            ...params,
            onSuccess,
            onFailure
        }));

    }

    const fetchGetMonthlyLoginStatistics = async (year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
            dispatch(fetchGetMonthlyLoginStatisticsStart({
                year: year,
                onSuccess: onSuccess,
                onFailed: onFailed
            }));
        }

    const fetchGetCountUserRoleStatistics = async (onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
            dispatch(fetchGetCountUserRoleStatisticsStart({
                onSuccess: onSuccess,
                onFailed: onFailed
            }));
        }

    const fetchGetTopRevenueCustomersStatistics = async (top_n: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
            dispatch(fetchGetTopRevenueCustomersStatisticsStart({
                top_n: top_n,
                onSuccess: onSuccess,
                onFailed: onFailed
            }));
        }

    return {
        insertUser,
        fetchInsertUser,
        fetchUpdateUserInfo,
        fetchUpdateAdminInfo,
        fetchUpdatePharmacistInfo,
        verifyOtp,
        sendOtp,
        // user,
        session,
        // isLoading,
        // isAuthenticated: !!user,
        // isAdmin: user?.role_id === "admin",
        // saveUser,
        // clearUser,
        // updateUser,
        getAllUser,
        allUserAdmin,
        totalUserAdmin,
        page,
        setPage,
        pageSize,
        setPageSize,
        forgotPasswordUser,
        changePasswordUser,
        changePasswordAdmin,
        forgotPasswordAdmin,

        updateStatusUser,
        changePasswordPharmacist,
        forgotPasswordPharmacist,

        allPharmacist,
        totalPharmacist,
        fetchAllPharmacist,

        allAdmin,
        totalAdmin,
        fetchAllAdmin,

        fetchUpdateStatusPharmacist,

        fetchInsertPharmacist,

        fetchRegisterAdmin,

        fetchVerifyEmail,

        fetchSendOTPAdmin,

        fetchGetMonthlyLoginStatistics,

        fetchGetCountUserRoleStatistics,
        countUserRole,

        fetchGetTopRevenueCustomersStatistics,
        topRevenueCustomers
    };
}

