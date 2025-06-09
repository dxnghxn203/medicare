import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { all } from "axios";
import { fetchGetAllAdminFailure } from "../user";

const initialState: any = {
    getAllArticlesAdmin: [],
    getAllArticlesUser: [],
    getArticleById: null,
    loading: false,
    error: null,
};

export const articleSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        // getallbrand admin
        fetchGetAllArticleAdminStart: (state, action: PayloadAction<any>) => {
            console.log("fetchGetAllArticleAdminStart", action.payload);
            state.loading = true;
            state.error = null;
        },
        fetchGetAllArticleAdminSuccess: (state, action: PayloadAction<any>) => {
            console.log("fetchGetAllArticleAdminSuccess", action.payload);
            state.loading = false;
            state.getAllArticlesAdmin = action.payload;
        },
        fetchGetAllArticleAdminFailure: (state, action: PayloadAction<any>) => {
            console.log("fetchGetAllArticleAdminFailure", action.payload);
            state.loading = false;
            state.error = action.payload;
        },

        // add brand
        fetchAddArticleAdminStart: (state, action: PayloadAction<any>) => {
            console.log("fetchAddArticleAdminStart", action.payload);
            state.loading = true;
            state.error = null;
        },
        fetchAddArticleAdminSuccess: (state, action: PayloadAction<any>) => {
            console.log("fetchAddArticleAdminSuccess", action.payload);
            state.loading = false;
        },
        fetchAddArticleAdminFailure: (state, action: PayloadAction<any>) => {
            console.log("fetchAddArticleAdminFailure", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        // delete brand
        fetchDeleteArticleAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchDeleteArticleAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            ;
        },
        fetchDeleteArticleAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // update brand
        fetchUpdateArticleAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchUpdateArticleAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
           
        },
        fetchUpdateArticleAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // update logo
        fetchUpdateLogoArticleAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchUpdateLogoArticleAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
           
        },
        fetchUpdateLogoArticleAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // get article by id
        fetchGetArticleByIdStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchGetArticleByIdSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.getArticleById = action.payload;
        },
        fetchGetArticleByIdFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // get all article user
        fetchGetAllArticleUserStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchGetAllArticleUserSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.getAllArticlesUser = action.payload;
        },
        fetchGetAllArticleUserFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        
    },
});

export const {
    fetchGetAllArticleAdminStart,
    fetchGetAllArticleAdminSuccess,
    fetchGetAllArticleAdminFailure,

    fetchAddArticleAdminStart,
    fetchAddArticleAdminSuccess,
    fetchAddArticleAdminFailure,

    fetchDeleteArticleAdminStart,
    fetchDeleteArticleAdminSuccess,
    fetchDeleteArticleAdminFailure,

    fetchUpdateArticleAdminStart,
    fetchUpdateArticleAdminSuccess,
    fetchUpdateArticleAdminFailure,

    fetchUpdateLogoArticleAdminStart,
    fetchUpdateLogoArticleAdminSuccess,
    fetchUpdateLogoArticleAdminFailure,
    fetchGetArticleByIdStart,
    fetchGetArticleByIdSuccess,
    fetchGetArticleByIdFailure,

    fetchGetAllArticleUserStart,
    fetchGetAllArticleUserSuccess,
    fetchGetAllArticleUserFailure,
   
    
} = articleSlice.actions;

export default articleSlice.reducer;


