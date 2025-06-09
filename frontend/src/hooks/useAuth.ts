import {useSelector, useDispatch} from 'react-redux';
import {useSession} from 'next-auth/react';
import {useEffect, useMemo, useState} from 'react';
import {
    fetchLogoutAdminStart, fetchLogoutPharmacistStart,
    googleLoginStart,
    googleLoginSuccess,
    loginAdminStart,
    loginPharmacistStart,
    loginStart,
    logoutStart,
    selectAdminAuth,
    selectAuth,
    selectPharmacistAuth,
    selectUserAuth,
    updateUserInfo,
    updateAdminInfo,
    updatePharmacistInfo
} from '@/store';
import {getToken} from "@/utils/cookie";

export function useAuth() {
    const dispatch = useDispatch();
    const {data: session} = useSession();
    const {loading, error, isAuthenticated} = useSelector(selectAuth);
    const user = useSelector(selectUserAuth);
    const admin = useSelector(selectAdminAuth);
    const pharmacist = useSelector(selectPharmacistAuth);

    useEffect(() => {
        if (session?.user && !isAuthenticated) {
            dispatch(googleLoginSuccess(session.user));
        }
    }, [session, dispatch, isAuthenticated]);

    const signInWithGoogle = async () => {
        dispatch(googleLoginStart());
    };

    const login = (
        credentials: any,
        onSucess: () => void,
        onFailed: (message: any) => void,
    ) => {
        dispatch(loginStart({
            ...credentials,
            onSuccess:
            onSucess,
            onFailed:
            onFailed,
        }));
    };


    const logout = (
        role_type: string,
        onSuccess: (message: any) => void,
        onFailure: (message: any) => void,
    ) => {
        if (!role_type) {
            console.error('Role type is required for logout');
            return;
        }
        if (role_type == 'admin') {
            dispatch(fetchLogoutAdminStart({
                onSuccess: onSuccess,
                onFailure: onFailure,
            }));
            return;
        }
        if (role_type == 'pharmacist') {
            dispatch(fetchLogoutPharmacistStart({
                onSuccess: onSuccess,
                onFailure: onFailure,
            }));
            return;
        }
        dispatch(logoutStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
            }
        ));
    };

    const loginAdmin = (
        credentials: any,
        onSuccess: (message: any) => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(loginAdminStart({
            ...credentials,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));

    };

    const loginPharmacist = (
        credentials: any,
        onSuccess: (message: any) => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(loginPharmacistStart({
            ...credentials,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    }

    const fetchupdateUser = async (params: any): Promise<any> => {
        console.log("param", params);
        dispatch(updateUserInfo(params));
        console.log("user", user);
    }

    const fetchupdateAdmin = async (params: any): Promise<any> => {
        console.log("param", params);
        dispatch(updateAdminInfo(params));
        console.log("user", user);
    }

    const fetchupdatePharmacist = async (params: any): Promise<any> => {
        console.log("param", params);
        dispatch(updatePharmacistInfo(params));
        console.log("user", user);
    }

    return {
        user: user || session?.user || null,
        isAuthenticated: isAuthenticated || !!session?.user || getToken(),
        isLoading: loading,
        error,
        signInWithGoogle,
        login,
        logout,
        loginAdmin,
        admin: admin || null,
        loginPharmacist,
        pharmacist: pharmacist || null,
        fetchupdateUser,
        fetchupdateAdmin,
        fetchupdatePharmacist
    };
}
