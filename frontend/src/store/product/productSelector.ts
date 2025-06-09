export const selectProduct = (state: any) => state.product;
export const selectProducts = (state: any) => state.product.products;
export const selectProductBySlug = (state: any) => state.product.product;
export const selectProductLoading = (state: any) => state.product.loading;
export const selectProductError = (state: any) => state.product.error;
export const selectProductAdmin = (state: any) => state.product.productsAdmin;
export const selectTotalProductAdmin = (state: any) => state.product.totalProductAdmin;
export const selectProductTopSelling = (state: any) => state.product.productsTopSelling;
export const selectProductRelated = (state: any) => state.product.productsRelated;
export const selectProductGetRecentlyViewed = (state: any) => state.product.productsGetRecentlyViewed;
export const selectProductProductFeatured = (state: any) => state.product.productProductFeatured;
export const selectProductBestDeal = (state: any) => state.product.productsBestDeal;
export const selectProductApproved = (state: any) => state.product.productApproved;
export const selectTotalProductApproved = (state: any) => state.product.totalProductApproved;
export const selectSearchProduct = (state: any) => state.product.searchResult;
// all brands
export const selectAllBrands = (state: any) => state.product.allBrand;
// all file import 
export const selectAllFileImport = (state: any) => state.product.fileImport;
export const selectTotalFileImport = (state: any) => state.product.totalFileImport;
export const selectAllProductDiscount = (state: any) => state.product.productDiscount;
export const selectAllProductDiscountAdmin = (state: any) => state.product.productDiscountAdmin;
export const selectTotalProductDiscountAdmin = (state: any) => state.product.totalProductDiscountAdmin;
export const selectImageToProduct = (state: any) => state.product.imageToProduct;
export const selectProductLowStock = (state: any) => state.product.productLowStock;
