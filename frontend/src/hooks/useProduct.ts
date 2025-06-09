import {
    fetchAddMediaProductStart,
    fetchAddProductStart,
    fetchAllProductAdminStart,
    fetchAllProductBestDealStart,
    fetchAllProductGetProductFeaturedStart,
    fetchAllProductGetRecentlyViewedStart,
    fetchAllProductRelatedStart,
    fetchAllProductTopSellingStart,
    fetchApproveProductByPharmacistStart,
    fetchDeleteProductStart,
    fetchProductApprovedStart,
    fetchProductBySlugStart,
    fetchSearchProductStart,
    fetchUpdateCertificateFileProductStart,
    fetchUpdateImagesPrimaryProductStart,
    fetchUpdateImagesProductStart,
    fetchUpdateProductStart,
    selectProductAdmin,
    selectProductApproved,
    selectProductBySlug,
    selectProductGetRecentlyViewed,
    selectProductRelated,
    selectProductTopSelling,
    selectSearchProduct,
    fetchClearSearchResult,
    fetchAllBrandStart,
    selectAllBrands,
    fetchImportFileAddProductStart,
    selectAllFileImport,
    fetchGetAllImportFileAddProductStart,
    fetchDeleteImportProductStart,
    selectAllProductDiscount,
    fetchProductDiscountStart, selectProductBestDeal, selectImageToProduct, fetchImageToProductStart,
    fetchProductLowStockStart,
    selectProductLowStock,
    selectTotalProductAdmin,
    selectTotalFileImport,
    selectAllProductDiscountAdmin,
    selectTotalProductDiscountAdmin,
    fetchProductDiscountAdminStart,
    selectTotalProductApproved
} from "@/store";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

export function useProduct() {
    const dispatch = useDispatch();
    const productBySlug = useSelector(selectProductBySlug);
    const allProductAdmin = useSelector(selectProductAdmin);
    const totalProductAdmin = useSelector(selectTotalProductAdmin);
    const totalFileImport = useSelector(selectTotalFileImport);
    const productsTopSelling = useSelector(selectProductTopSelling);
    const productRelated = useSelector(selectProductRelated);
    const productGetRecentlyViewed = useSelector(selectProductGetRecentlyViewed);
    const productGetFeatured = useSelector(selectProductRelated);
    const productBestDeal = useSelector(selectProductBestDeal);
    const productApproved = useSelector(selectProductApproved);
    const totalProductApproved = useSelector(selectTotalProductApproved);
    const searchResult = useSelector(selectSearchProduct);
    const allBrands = useSelector(selectAllBrands);
    const allFileImport = useSelector(selectAllFileImport);
    const allProductDiscount = useSelector(selectAllProductDiscount);
    const allProductDiscountAdmin = useSelector(selectAllProductDiscountAdmin);
    const totalProductDiscountAdmin = useSelector(selectTotalProductDiscountAdmin);
    const imageToProduct = useSelector(selectImageToProduct);
    const productLowStock = useSelector(selectProductLowStock);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [top_n, setTopN] = useState(10);
    const [low_stock_status, setLowStockStatus] = useState(null);
    const [main_category, setMainCategory] = useState(null);
    const [best_seller, setBestSeller] = useState(null);

    const fetchProductBySlug = async (slug: string, onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchProductBySlugStart({
            slug: slug,
            onSucces: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchProductFeatured = (
        mainCategory: string | null,
        subCategory: string | null,
        childCategory: string | null,
        top_n: number,
        onSuccess: () => void,
        onFailed: () => void,
    ) => {
        dispatch(fetchAllProductGetProductFeaturedStart(
            {
                mainCategory: mainCategory,
                subCategory: subCategory,
                childCategory: childCategory,
                top_n: top_n,
                onSuccess: onSuccess,
                onFailed: onFailed
            }
        ))
    }


    const getAllProductsAdmin = (onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchAllProductAdminStart({
            page: page,
            page_size: pageSize,
            low_stock_status: low_stock_status,
            main_category: main_category,
            best_seller: best_seller,
            onSuccess: onSuccess,
            onFailed: onFailed
        }))
    };

    const getProductTopSelling = () => {
        dispatch(fetchAllProductTopSellingStart({
            top_n
        }))
    }

    const addProduct = async (
        product: any,
        onsucces: (message: any) => void,
        onfailed: (message: any) => void
    ) => {
        dispatch(fetchAddProductStart({
            form: product,
            onsucces: onsucces,
            onfailed: onfailed
        }));
    }

    const fetchProductRelated = async (product_id: any) => {
        dispatch(fetchAllProductRelatedStart({
            product_id: product_id,
            top_n: top_n
        }));
    }
    const fetchProductRecentlViewed = () => {
        dispatch(fetchAllProductGetRecentlyViewedStart())
    }

    const fetchProductBestDeal = () => {
        dispatch(fetchAllProductBestDealStart({
            top_n: 5
        }))
    }

    const deleteProduct = async (product_id: any, onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchDeleteProductStart({
            product_id: product_id,
            onSuccess: onSuccess,
            onFailed: onFailed
        }))
    }

    const fetchProductApproved = (
        data: any,
    ) => {
        dispatch(fetchProductApprovedStart({
            page: data.page,
            pageSize: data.pageSize,
            keyword: data.keyword,
            mainCategory: data.mainCategory,
            prescriptionRequired: data.prescriptionRequired,
            status: data.status
        }))
    }

    const fetchApproveProductByPharmacist = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchApproveProductByPharmacistStart({
                ...params,
                onSuccess,
                onFailure: onFailed
            })
        );
    };

    const fetchUpdateProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchUpdateProductStart({
                ...params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }

    const fetchAddMediaProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchAddMediaProductStart({
                ...params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }

    const fetchUpdateCertificateFileProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchUpdateCertificateFileProductStart({
                ...params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }

    const fetchUpdateImagesPrimaryProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchUpdateImagesPrimaryProductStart({
                ...params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }

    const fetchUpdateImagesProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchUpdateImagesProductStart({
                ...params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }

    const fetchSearchProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchSearchProductStart({
                ...params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }
    const fetchClearSearch = () => {
        dispatch(fetchClearSearchResult())
    }
    const fetchAllBrands = async (onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchAllBrandStart({

            onSuccess: onSuccess,
            onFailed: onFailed
        }))
    }

    const fetchImportAddFileProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchImportFileAddProductStart({
                formData: params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }
    const fetchImageToProduct = async (
        files: any,
        onSuccess: () => void,
        onFailed: () => void) => {
        dispatch(
            fetchImageToProductStart({
                files: files,
                onSuccess: onSuccess,
                onFailed: onFailed
            })
        );

    }
    const fetchGetImportFileAddProduct = async (
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchGetAllImportFileAddProductStart({
                page: page,
                page_size: pageSize,
                onSuccess,
                onFailure: onFailed
            })
        );
    }

    const fetchDeleteImportFileProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        dispatch(
            fetchDeleteImportProductStart({
                import_id: params,
                onSuccess,
                onFailure: onFailed
            })
        );
    }
    const fetchGetProductDiscount = async () => {
        dispatch(
            fetchProductDiscountStart({
                page: page,
                page_size: pageSize,

            })
        );
    }

    const fetchGetProductDiscountAdmin = async (is_approved: any) => {
        dispatch(
            fetchProductDiscountAdminStart({
                page: page,
                page_size: pageSize,
                is_approved: is_approved
            })
        );
    }

    const fetchGetProducLowStock = async (onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchProductLowStockStart({
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }


    return {
        addProduct,
        productBySlug,
        fetchProductBySlug,
        getAllProductsAdmin,
        page,
        setPage,
        pageSize,
        setPageSize,
        low_stock_status,
        setLowStockStatus,
        main_category,
        setMainCategory,
        best_seller,
        setBestSeller,
        allProductAdmin,
        totalProductAdmin,
        getProductTopSelling,
        productsTopSelling,
        fetchProductRelated,
        productRelated,
        productGetRecentlyViewed,
        fetchProductRecentlViewed,
        productGetFeatured,
        fetchProductFeatured,
        productBestDeal,
        fetchProductBestDeal,
        deleteProduct,
        fetchProductApproved,
        productApproved,
        totalProductApproved,
        fetchApproveProductByPharmacist,

        fetchUpdateProduct,
        fetchAddMediaProduct,

        fetchUpdateCertificateFileProduct,
        fetchUpdateImagesPrimaryProduct,
        fetchUpdateImagesProduct,

        fetchSearchProduct,
        searchResult,
        fetchClearSearch,

        fetchAllBrands,
        allBrands,

        fetchImportAddFileProduct,
        fetchGetImportFileAddProduct,
        allFileImport,
        totalFileImport,

        fetchDeleteImportFileProduct,

        allProductDiscount,
        fetchGetProductDiscount,

        allProductDiscountAdmin,
        fetchGetProductDiscountAdmin,
        totalProductDiscountAdmin,

        imageToProduct,
        fetchImageToProduct,

        productLowStock,
        fetchGetProducLowStock
    };
}

