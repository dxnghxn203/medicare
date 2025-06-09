import {Admin, AuthState, Pharmacist, User} from "@/types/auth";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    admin: null,
    pharmacist: null,
    isAdmin: false,
    isPharmacist: false,
    isAuthenticated: false,
    loading: false,
    error: null,

};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Google login actions
        googleLoginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        googleLoginSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        googleLoginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Normal login actions
        loginStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Logout actions
        logoutStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        logoutSuccess: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //login Admin
        loginAdminStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginAdminSuccess: (state, action: PayloadAction<{ admin: Admin; token: string }>) => {
            state.loading = false;
            state.admin = action.payload.admin;
        },
        loginAdminFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // login pharmacist
        loginPharmacistStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginPharmacistSuccess: (state, action: PayloadAction<{ pharmacist: Pharmacist; token: string }>) => {
            state.loading = false;
            state.pharmacist = action.payload.pharmacist;
        },
        loginPharmacistFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchLogoutAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchLogoutAdminSuccess: (state) => {
            state.loading = false;
            state.isAdmin = false;
            state.admin = null;
        },
        fetchLogoutAdminFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchLogoutPharmacistStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchLogoutPharmacistSuccess: (state) => {
            state.loading = false;
            state.isPharmacist = false;
            state.pharmacist = null;
        },
        fetchLogoutPharmacistFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateUserInfo: (state, action) => {
            state.user.user_name = action.payload.username;
            state.user.phone_number = action.payload.phoneNumber;
            state.user.gender = action.payload.gender;
            state.user.birthday = action.payload.dateOfBirth;
        },

        updateAdminInfo: (state, action) => {
            state.admin.user_name = action.payload.username;
            state.admin.phone_number = action.payload.phoneNumber;
            state.admin.gender = action.payload.gender;
            state.admin.birthday = action.payload.dateOfBirth;
        },

        updatePharmacistInfo: (state, action) => {
            state.pharmacist.user_name = action.payload.username;
            state.pharmacist.phone_number = action.payload.phoneNumber;
            state.pharmacist.gender = action.payload.gender;
            state.pharmacist.birthday = action.payload.dateOfBirth;
        },
    },
});

export const {
    googleLoginStart,
    googleLoginSuccess,
    googleLoginFailure,
    loginStart,
    loginSuccess,
    loginFailure,
    logoutStart,
    logoutSuccess,
    logoutFailure,

    loginAdminStart,
    loginAdminSuccess,
    loginAdminFailure,

    loginPharmacistStart,
    loginPharmacistSuccess,
    loginPharmacistFailure,

    fetchLogoutAdminStart,
    fetchLogoutAdminSuccess,
    fetchLogoutAdminFailure,

    fetchLogoutPharmacistStart,
    fetchLogoutPharmacistSuccess,
    fetchLogoutPharmacistFailure,

    updateUserInfo,
    updateAdminInfo,
    updatePharmacistInfo

} = authSlice.actions;

export default authSlice.reducer;


