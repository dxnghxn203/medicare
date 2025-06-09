import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { all } from "axios";
import { fetchGetAllAdminFailure } from "../user";
import { getAllBrands } from "@/services/productService";

const initialState: any = {
    getAllBrandsAdmin: [],
    getAllBrandsUser: [],
    getAllBrandsById: [],

    loading: false,
    error: null,
};

export const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        // getallbrand admin
        fetchGetAllBrandAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchGetAllBrandAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.getAllBrandsAdmin = action.payload;
        },
        fetchGetAllBrandAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // add brand
        fetchAddBrandAdminStart: (state, action: PayloadAction<any>) => {
            console.log("fetchAddBrandAdminStart", action.payload);
            state.loading = true;
            state.error = null;
        },
        fetchAddBrandAdminSuccess: (state, action: PayloadAction<any>) => {
            console.log("fetchAddBrandAdminSuccess", action.payload);
            state.loading = false;
        },
        fetchAddBrandAdminFailure: (state, action: PayloadAction<any>) => {
            console.log("fetchAddBrandAdminFailure", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        // delete brand
        fetchDeleteBrandAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchDeleteBrandAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            ;
        },
        fetchDeleteBrandAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // update brand
        fetchUpdateBrandAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchUpdateBrandAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
           
        },
        fetchUpdateBrandAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // update logo
        fetchUpdateLogoBrandAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchUpdateLogoBrandAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
           
        },
        fetchUpdateLogoBrandAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // fetch get all brand user
        fetchGetAllBrandUserStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchGetAllBrandUserSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.getAllBrandsUser = action.payload;
        },
        fetchGetAllBrandUserFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch get all brand by id
        fetchGetAllBrandByIdStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchGetAllBrandByIdSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.getAllBrandsById = action.payload;
        },
        fetchGetAllBrandByIdFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

        
    },
});

export const {
    fetchGetAllBrandAdminStart,
    fetchGetAllBrandAdminSuccess,
    fetchGetAllBrandAdminFailure,

    fetchAddBrandAdminStart,
    fetchAddBrandAdminSuccess,
    fetchAddBrandAdminFailure,

    fetchDeleteBrandAdminStart,
    fetchDeleteBrandAdminSuccess,
    fetchDeleteBrandAdminFailure,

    fetchUpdateBrandAdminStart,
    fetchUpdateBrandAdminSuccess,
    fetchUpdateBrandAdminFailure,

    fetchUpdateLogoBrandAdminStart,
    fetchUpdateLogoBrandAdminSuccess,
    fetchUpdateLogoBrandAdminFailure,
   
    fetchGetAllBrandUserStart,
    fetchGetAllBrandUserSuccess,
    fetchGetAllBrandUserFailure,

    fetchGetAllBrandByIdStart,
    fetchGetAllBrandByIdSuccess,
    fetchGetAllBrandByIdFailure,
    
} = brandSlice.actions;

export default brandSlice.reducer;


