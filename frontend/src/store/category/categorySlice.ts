import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CategoryState {
    categories: any[];
    products: any[];
    categoryAdmin: any[];
    mainCategories: any[];
    subCategories: any[];
    childCategories: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    categoryAdmin: [],
    mainCategories: [],
    subCategories: [],
    childCategories: [],
    products: [],
    loading: false,
    error: null,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        fetchGetAllCategoryStart(state) {
            // console.log("Fetching categories started");
            state.loading = true;
        },
        fetchGetAllCategorySuccess(state, action: PayloadAction<any[]>) {
            // console.log("Fetching categories successful, data:", action.payload);
            state.categories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetAllCategoryFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        fetchGetMainCategoryStart(state, action) {
            state.loading = true;
        },
        fetchGetMainCategorySuccess(state, action: PayloadAction<any[]>) {
            // console.log("Fetching categories successful, data:", action.payload);
            state.mainCategories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetMainCategoryFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        fetchGetSubCategoryStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetSubCategorySuccess(state, action: PayloadAction<any[]>) {
            state.subCategories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetSubCategoryFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        fetchGetChildCategoryStart(state, action: PayloadAction<any>) {

            state.loading = true;
        },
        fetchGetChildCategorySuccess(state, action: PayloadAction<any[]>) {

            state.childCategories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetChildCategoryFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch product by main slug
        fetchGetProductByMainSlugStart(state, action: PayloadAction<string>) {
            state.loading = true;
        },
        fetchGetProductByMainSlugSuccess(state, action: PayloadAction<any[]>) {
            state.products = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetProductByMainSlugFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch all category for admin
        fetchGetAllCategoryForAdminStart(state) {
            state.loading = true;
        },
        fetchGetAllCategoryForAdminSuccess(state, action: PayloadAction<any[]>) {
            state.categoryAdmin = action.payload
            state.loading = false;
        },
        fetchGetAllCategoryForAdminFailed(state, action: PayloadAction<string>) {
            state.loading = false;
        },
        // update main category
        fetchUpdateMainCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchUpdateMainCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchUpdateMainCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },
        //update sub category
        fetchUpdateSubCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchUpdateSubCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchUpdateSubCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },
        // update child category
        fetchUpdateChildCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchUpdateChildCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchUpdateChildCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },
        // add category
        fetchAddCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchAddCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchAddCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },

        // add child category
        fetchAddChildCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchAddChildCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchAddChildCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },

        // add sub category
        fetchAddSubCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchAddSubCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchAddSubCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },

        // update image sub category
        fetchUpdateImageSubCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchUpdateImageSubCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchUpdateImageSubCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },
        // fetch update image child category
        fetchUpdateImageChildCategoryStart(state) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchUpdateImageChildCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchUpdateImageChildCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },
        // delete child category
        fetchDeleteChildCategoryStart(state, action: PayloadAction<any>) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchDeleteChildCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchDeleteChildCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },
        //fetch delete sub category
        fetchDeleteSubCategoryStart(state, action: PayloadAction<any>) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchDeleteSubCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchDeleteSubCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },

        //fetch delete main category
        fetchDeleteMainCategoryStart(state, action: PayloadAction<any>) {
            console.log("Fetching categories started");
            state.loading = true;
        },
        fetchDeleteMainCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);
            // state.updateMainCategory = action.payload
            state.loading = false;
        },
        fetchDeleteMainCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, data:", action.payload);
            state.loading = false;
        },
        fetchGetAllCategoryForMenuStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetAllCategoryForMenuSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchGetAllCategoryForMenuFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchGetAllCategoryStart,
    fetchGetAllCategorySuccess,
    fetchGetAllCategoryFailed,

    fetchGetMainCategoryStart,
    fetchGetMainCategorySuccess,
    fetchGetMainCategoryFailed,

    fetchGetSubCategoryStart,
    fetchGetSubCategorySuccess,
    fetchGetSubCategoryFailed,

    fetchGetChildCategoryStart,
    fetchGetChildCategorySuccess,
    fetchGetChildCategoryFailed,

    fetchGetProductByMainSlugStart,
    fetchGetProductByMainSlugSuccess,
    fetchGetProductByMainSlugFailed,

    fetchGetAllCategoryForAdminStart,
    fetchGetAllCategoryForAdminSuccess,
    fetchGetAllCategoryForAdminFailed,

    fetchUpdateMainCategoryStart,
    fetchUpdateMainCategorySuccess,
    fetchUpdateMainCategoryFailed,

    fetchUpdateSubCategoryStart,
    fetchUpdateSubCategorySuccess,
    fetchUpdateSubCategoryFailed,

    fetchUpdateChildCategoryStart,
    fetchUpdateChildCategorySuccess,
    fetchUpdateChildCategoryFailed,

    fetchAddCategoryStart,
    fetchAddCategorySuccess,
    fetchAddCategoryFailed,

    fetchAddChildCategoryStart,
    fetchAddChildCategorySuccess,
    fetchAddChildCategoryFailed,

    fetchAddSubCategoryStart,
    fetchAddSubCategoryFailed,
    fetchAddSubCategorySuccess,

    fetchUpdateImageSubCategorySuccess,
    fetchUpdateImageSubCategoryStart,
    fetchUpdateImageSubCategoryFailed,

    fetchUpdateImageChildCategoryStart,
    fetchUpdateImageChildCategorySuccess,
    fetchUpdateImageChildCategoryFailed,

    fetchDeleteChildCategoryFailed,
    fetchDeleteChildCategoryStart,
    fetchDeleteChildCategorySuccess,

    fetchDeleteSubCategoryStart,
    fetchDeleteSubCategorySuccess,
    fetchDeleteSubCategoryFailed,

    fetchDeleteMainCategoryStart,
    fetchDeleteMainCategorySuccess,
    fetchDeleteMainCategoryFailed,

    fetchGetAllCategoryForMenuStart,
    fetchGetAllCategoryForMenuSuccess,
    fetchGetAllCategoryForMenuFailed

} = categorySlice.actions;

export default categorySlice.reducer;


