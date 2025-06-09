import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ProductState {
    products: any[];
    productsAdmin: any[];
    totalProductAdmin: number;
    productsTopSelling: any[];
    productsRelated: any[];
    productsGetRecentlyViewed: any[];
    productProductFeatured: any[];
    productsBestDeal: any[];
    productApproved: any[];
    totalProductApproved: number;
    product: any;
    allBrand: any[];
    searchResult: any[];
    fileImport: any[];
    totalFileImport: number;
    productDiscount: any[];
    productDiscountAdmin: any[];
    totalProductDiscountAdmin: number;
    loading: boolean;
    error: string | null;
    imageToProduct: any[];
    productLowStock: any[];
}

const initialState: ProductState = {
    products: [],
    productsAdmin: [],
    totalProductAdmin: 0,
    productsTopSelling: [],
    productsGetRecentlyViewed: [],
    productProductFeatured: [],
    productsRelated: [],
    productsBestDeal: [],
    productApproved: [],
    totalProductApproved: 0,
    product: null,
    allBrand: [],
    searchResult: [],
    fileImport: [],
    totalFileImport: 0,
    productDiscount: [],
    productDiscountAdmin: [],
    totalProductDiscountAdmin: 0,
    loading: false,
    error: null,
    imageToProduct: [],
    productLowStock: [],
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // Fetch product by slug
        fetchProductBySlugStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchProductBySlugSuccess(state, action: PayloadAction<any[]>) {
            state.product = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchProductBySlugFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // Fetch add product
        fetchAddProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAddProductSuccess(state) {
            state.loading = false;
            state.error = null;
        },
        fetchAddProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch all product admin
        fetchAllProductAdminStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductAdminSuccess(state, action: PayloadAction<any>) {
            state.productsAdmin = action.payload.products;
            state.totalProductAdmin = action.payload.total_products;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductAdminFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // Fetch all product top selling
        fetchAllProductTopSellingStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductTopSellingSuccess(state, action: PayloadAction<any[]>) {
            state.productsTopSelling = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductTopSellingFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // Fetch all product related
        fetchAllProductRelatedStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductRelatedSuccess(state, action: PayloadAction<any[]>) {
            state.productsRelated = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductRelatedFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch all product get-recently-viewed
        fetchAllProductGetRecentlyViewedStart(state) {
            state.loading = true;
        },
        fetchAllProductGetRecentlyViewedSuccess(state, action: PayloadAction<any[]>) {
            state.productsGetRecentlyViewed = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductGetRecentlyViewedFailed(state) {
            state.loading = false;
        },
        // Fetch all product getProductFeatured
        fetchAllProductGetProductFeaturedStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductGetProductFeaturedSuccess(state, action: PayloadAction<any[]>) {
            state.productProductFeatured = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductGetProductFeaturedFailed(state) {
            state.productProductFeatured = [];
            state.loading = false;
        },
        //fetch all product best deal
        fetchAllProductBestDealStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductBestDealSuccess(state, action: PayloadAction<any[]>) {
            state.productsBestDeal = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductBestDealFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // delete product
        fetchDeleteProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchDeleteProductSuccess(state, action: PayloadAction<any[]>) {

            state.loading = false;
            state.error = null;
        },
        fetchDeleteProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch product approved
        fetchProductApprovedStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchProductApprovedSuccess(state, action: PayloadAction<any>) {
            state.productApproved = action.payload.products;
            state.totalProductApproved = action.payload.total_products;
            state.loading = false;
            state.error = null;
        },
        fetchProductApprovedFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // approve product by pharmacist
        fetchApproveProductByPharmacistStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchApproveProductByPharmacistSuccess(state, action: PayloadAction<any[]>) {

            state.loading = false;
            state.error = null;
        },
        fetchApproveProductByPharmacistFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch update product
        fetchUpdateProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchUpdateProductSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchUpdateProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // add media product
        fetchAddMediaProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAddMediaProductSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchAddMediaProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch update images
        fetchUpdateImagesProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchUpdateImagesProductSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchUpdateImagesProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch update images primary
        fetchUpdateImagesPrimaryProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchUpdateImagesPrimaryProductSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchUpdateImagesPrimaryProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch update certificate file
        fetchUpdateCertificateFileProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchUpdateCertificateFileProductSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchUpdateCertificateFileProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch search product 
        fetchSearchProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchSearchProductSuccess(state, action: PayloadAction<any[]>) {
            state.searchResult = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchSearchProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        //fetch clear search result
        fetchClearSearchResult(state) {
            state.searchResult = [];
        },

        // fetch all brand
        fetchAllBrandStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllBrandSuccess(state, action: PayloadAction<any[]>) {
            state.allBrand = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllBrandFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch import file add product
        fetchImportFileAddProductStart(state, action: PayloadAction<any>) {

            state.loading = true;
        },
        fetchImportFileAddProductSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchImportFileAddProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch get all import file
        fetchGetAllImportFileAddProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetAllImportFileAddProductSuccess(state, action: PayloadAction<any>) {
            state.fileImport = action.payload.imports;
            state.totalFileImport = action.payload.total_imports;
            state.loading = false;
            state.error = null;
        },
        fetchGetAllImportFileAddProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // delete import product
        fetchDeleteImportProductStart(state, action: PayloadAction<any>) {

            state.loading = true;
        },
        fetchDeleteImportProductSuccess(state, action: PayloadAction<any[]>) {
            state.loading = false;
            state.error = null;
        },
        fetchDeleteImportProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // fetch product discount 
        fetchProductDiscountStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchProductDiscountSuccess(state, action: PayloadAction<any[]>) {
            state.productDiscount = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchProductDiscountFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // fetch product discount admin
        fetchProductDiscountAdminStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchProductDiscountAdminSuccess(state, action: PayloadAction<any>) {
            state.productDiscountAdmin = action.payload.products;
            state.totalProductDiscountAdmin = action.payload.total_products;
            state.loading = false;
            state.error = null;
        },
        fetchProductDiscountAdminFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        fetchImageToProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchImageToProductSuccess(state, action: PayloadAction<any[]>) {
            state.imageToProduct = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchImageToProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        fetchProductLowStockStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchProductLowStockSuccess(state, action: PayloadAction<any[]>) {
            state.productLowStock = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchProductLowStockFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchProductBySlugStart,
    fetchProductBySlugSuccess,
    fetchProductBySlugFailed,

    fetchAddProductStart,
    fetchAddProductSuccess,
    fetchAddProductFailed,

    fetchAllProductAdminStart,
    fetchAllProductAdminSuccess,
    fetchAllProductAdminFailed,

    fetchAllProductTopSellingStart,
    fetchAllProductTopSellingSuccess,
    fetchAllProductTopSellingFailed,

    fetchAllProductRelatedStart,
    fetchAllProductRelatedSuccess,
    fetchAllProductRelatedFailed,

    fetchAllProductGetRecentlyViewedStart,
    fetchAllProductGetRecentlyViewedSuccess,
    fetchAllProductGetRecentlyViewedFailed,

    fetchAllProductGetProductFeaturedStart,
    fetchAllProductGetProductFeaturedSuccess,
    fetchAllProductGetProductFeaturedFailed,

    fetchAllProductBestDealFailed,
    fetchAllProductBestDealStart,
    fetchAllProductBestDealSuccess,

    fetchDeleteProductFailed,
    fetchDeleteProductStart,
    fetchDeleteProductSuccess,

    fetchProductApprovedFailed,
    fetchProductApprovedStart,
    fetchProductApprovedSuccess,

    fetchApproveProductByPharmacistFailed,
    fetchApproveProductByPharmacistStart,
    fetchApproveProductByPharmacistSuccess,

    fetchUpdateProductFailed,
    fetchUpdateProductStart,
    fetchUpdateProductSuccess,

    fetchAddMediaProductFailed,
    fetchAddMediaProductStart,
    fetchAddMediaProductSuccess,

    fetchUpdateCertificateFileProductFailed,
    fetchUpdateCertificateFileProductStart,
    fetchUpdateCertificateFileProductSuccess,

    fetchUpdateImagesPrimaryProductFailed,
    fetchUpdateImagesPrimaryProductStart,
    fetchUpdateImagesPrimaryProductSuccess,

    fetchUpdateImagesProductFailed,
    fetchUpdateImagesProductStart,
    fetchUpdateImagesProductSuccess,

    fetchSearchProductFailed,
    fetchSearchProductStart,
    fetchSearchProductSuccess,
    fetchClearSearchResult,

    fetchAllBrandFailed,
    fetchAllBrandStart,
    fetchAllBrandSuccess,

    fetchImportFileAddProductFailed,
    fetchImportFileAddProductStart,
    fetchImportFileAddProductSuccess,

    fetchGetAllImportFileAddProductFailed,
    fetchGetAllImportFileAddProductStart,
    fetchGetAllImportFileAddProductSuccess,

    fetchDeleteImportProductFailed,
    fetchDeleteImportProductStart,
    fetchDeleteImportProductSuccess,

    fetchProductDiscountFailed,
    fetchProductDiscountStart,
    fetchProductDiscountSuccess,

    fetchImageToProductStart,
    fetchImageToProductSuccess,
    fetchImageToProductFailed,

    fetchProductLowStockStart,
    fetchProductLowStockSuccess,
    fetchProductLowStockFailed,

    fetchProductDiscountAdminStart,
    fetchProductDiscountAdminSuccess,
    fetchProductDiscountAdminFailed,
} = productSlice.actions;

export default productSlice.reducer;


