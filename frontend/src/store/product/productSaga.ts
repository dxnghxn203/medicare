import {call, put, takeLatest} from 'redux-saga/effects';
import * as productService from '@/services/productService';
import {
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

    fetchAllProductBestDealStart,
    fetchAllProductBestDealSuccess,
    fetchAllProductBestDealFailed,

    fetchDeleteProductFailed,
    fetchDeleteProductStart,
    fetchDeleteProductSuccess,

    fetchProductApprovedFailed,
    fetchProductApprovedStart,
    fetchProductApprovedSuccess,

    fetchApproveProductByPharmacistFailed,
    fetchApproveProductByPharmacistStart,
    fetchApproveProductByPharmacistSuccess,
    fetchUpdateProductSuccess,
    fetchUpdateProductFailed,
    fetchUpdateProductStart,

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
    fetchSearchProductSuccess,
    fetchSearchProductFailed,
    fetchSearchProductStart,

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

    fetchProductDiscountAdminFailed,
    fetchProductDiscountAdminStart,
    fetchProductDiscountAdminSuccess,

    fetchImageToProductStart,
    fetchImageToProductSuccess,
    fetchImageToProductFailed,

    fetchProductLowStockStart,
    fetchProductLowStockSuccess,
    fetchProductLowStockFailed
} from '@/store';
import {getSession, getToken, setSession} from '@/utils/cookie';

// Fetch image to product
function* fetchImageToProduct(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        files,
        onSuccess = () => {
        },
        onFailed = () => {
        }
    } = payload;
    try {
        const formData = new FormData();

        files.forEach((file: string | Blob) => {
            formData.append('files', file);
        });

        formData.append('extraction_method', 'hybrid');

        const product = yield call(productService.imageToProduct, formData);
        if (product.status_code === 200) {
            onSuccess();
            yield put(fetchImageToProductSuccess(product.data));
            return;
        }
        onFailed();
        yield put(fetchImageToProductFailed("Failed to upload images to product"));
    } catch (error) {
        onSuccess()
        yield put(fetchImageToProductFailed("Failed to upload images to product"));
    }
}

// Fetch product Featured
function* fetchProductFeatured(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            mainCategory,
            subCategory,
            childCategory,
            top_n,
            onSuccess = () => {
            },
            onFailed = () => {
            }
        } = payload;

        interface ProductData {
            main_category_id?: string | null;
            sub_category_id?: string | null;
            child_category_id?: string | null;
            top_n?: number | null;
        }

        const data: ProductData = {}

        if (mainCategory) {
            data.main_category_id = mainCategory;
        }
        if (subCategory) {
            data.sub_category_id = subCategory;
        }
        if (childCategory) {
            data.child_category_id = childCategory;
        }
        data.top_n = top_n;

        const product = yield call(productService.getProductFeatured, data);
        if (product.status_code === 200) {
            onSuccess();
            yield put(fetchAllProductGetProductFeaturedSuccess(product.data));
            return;
        }
        onFailed();
        yield put(fetchAllProductGetProductFeaturedFailed());
    } catch (error) {
        yield put(fetchAllProductGetProductFeaturedFailed());
    }
}

// Fetch product by slug
function* fetchProductBySlug(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            slug,
            onSucces = () => {
            },
            onFailed = () => {
            }
        } = payload;
        const token: any = getToken();
        const session = getSession();
        const product = token ?
            yield call(productService.getProductBySlug, slug) :
            yield call(productService.getProductBySlugSession, slug, session)
        ;
        if (product?.status_code === 200) {
            onSucces();
            yield put(fetchProductBySlugSuccess(product?.data?.product));
            if (product?.data?.session_id && product?.data?.session_id !== session) {
                setSession(product?.data?.session_id);
            }
            return;
        }
        onFailed()
        yield put(fetchProductBySlugFailed("Product not found"));

    } catch (error) {
        yield put(fetchProductBySlugFailed("Failed to fetch product by slug"));
    }
}

// Add product reviewed
function* fetchGetProductGetRecentlyViewed(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const token: any = getToken();
        const session = getSession();

        const product: any = token ?
            yield call(productService.getProductReviewToken) :
            yield call(productService.getProductReviewSession, session)
        ;

        if (product?.status_code === 200) {
            yield put(fetchAllProductGetRecentlyViewedSuccess(product?.data));
            return;
        }
        yield put(fetchAllProductGetRecentlyViewedFailed());
    } catch (error) {
        yield put(fetchAllProductGetRecentlyViewedFailed());
    }
}

function* handlerAddProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            form,
            onsucces = () => {
            },
            onfailed = () => {
            }
        } = payload;

        const product = yield call(productService.addProduct, form);
        // console.log("product", product);
        if (product.status_code === 200) {
            onsucces(product.message);
            yield put(fetchAddProductSuccess());
            return;
        }
        // console.log("test",product.message);
        onfailed(product.message);

        yield put(fetchAddProductFailed(
            product.message || "Failed to add product"
        ));

    } catch (error) {
        yield put(fetchAddProductFailed(
            "Failed to add product"
        ));

        // console.log("final",error);

    }
}

function* handlerGetAllProductAdmin(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            page,
            page_size,
            low_stock_status,
            main_category,
            best_seller,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;

        const product = yield call(productService.getAllProductAdmin, page, page_size, low_stock_status, main_category, best_seller);
        // console.log('Product Data:', product);
        if (product.status_code === 200) {
            // console.log('Product Data Length:', product.data.length);
            yield put(fetchAllProductAdminSuccess(product.data));
            onSuccess(product.data);
            return;
        }
        yield put(fetchAllProductAdminFailed("Product not found"));
        onFailed(product.message);
    } catch (error) {
        yield put(fetchAllProductAdminFailed("Failed to fetch product by slug"));
    }
}

// Fetch all product top selling
function* handlerGetAllProductTopSelling(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const product = yield call(productService.getProductTopSelling, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductTopSellingSuccess(product.data));
            return;
        }
        yield put(fetchAllProductTopSellingFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductTopSellingFailed("Failed to fetch product by slug"));
    }
}

// Fetch all product related
function* handlerGetAllProductRelated(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const product = yield call(productService.getProductsRelated, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductRelatedSuccess(product.data));
            return;
        }
        yield put(fetchAllProductRelatedFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductRelatedFailed("Failed to fetch product by slug"));
    }
}

// Fetch all product best deal
function* handlerGetAllProductBestDeal(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const product = yield call(productService.getDealForYou, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductBestDealSuccess(product.data));
            return;
        }
        yield put(fetchAllProductBestDealFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductBestDealFailed("Failed to fetch product by slug"));
    }
}

// Fetch delete product
function* handlerDeleteProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;

        const {
            product_id,
            onSuccess = (message: any) => {
            },
            onFailure = (message: any) => {
            }
        } = payload;
        const product = yield call(productService.deleteProduct, product_id);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchDeleteProductSuccess(product.message));
            return;
        }
        onFailure(product.message);
        yield put(fetchDeleteProductFailed(product.message));

    } catch (error) {
        yield put(fetchDeleteProductFailed("Failed to fetch product by slug"));
    }
}

function* getAllProductApproved(action: any): Generator<any, void, any> {
    try {
        const {
            payload
        } = action;
        const {
            page,
            pageSize,
            keyword,
            mainCategory,
            prescriptionRequired,
            status
        } = payload;
        const product = yield call(
            productService.getAllProductApproved, page, pageSize, keyword, mainCategory, prescriptionRequired, status
        );
        if (product.status_code === 200) {
            yield put(fetchProductApprovedSuccess(product.data));
            return;
        }
        yield put(fetchProductApprovedFailed("Product not found"));
    } catch (error) {
        yield put(fetchProductApprovedFailed("Failed to fetch product by slug"));
    }
}

function* handleApproveProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            product_id,
            rejected_note,
            is_approved,
            onSuccess = (message: any) => {
            },
            onFailure = (message: any) => {
            }
        } = payload;
        const body = {
            product_id,
            rejected_note,
            is_approved

        };
        const product = yield call(productService.approveProductByPharmacist, body);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchApproveProductByPharmacistSuccess(product.message));
            return;
        }
        onFailure(product.message);
        yield put(fetchApproveProductByPharmacistFailed(product.message));
    } catch (error) {
        yield put(fetchApproveProductByPharmacistFailed("Failed to fetch product by slug"));
    }
}

function* handleUpdateProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            product_id,
            product_name,
            name_primary,
            prices, // array of price objects
            inventory,
            slug,
            description,
            full_descriptions,
            category,
            origin,
            ingredients, // array of ingredient objects
            uses,
            dosage,
            side_effects,
            precautions,
            storage,
            manufacturer,
            dosage_form,
            brand,
            prescription_required,
            registration_number,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;

        const body = {
            product_id,
            product_name,
            name_primary,
            prices,
            inventory,
            slug,
            description,
            full_descriptions,
            category,
            origin,
            ingredients,
            uses,
            dosage,
            side_effects,
            precautions,
            storage,
            manufacturer,
            dosage_form,
            brand,
            prescription_required,
            registration_number,
        };

        const product = yield call(productService.updateProduct, body);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchUpdateProductSuccess(product.message));
            return;
        }

        onFailed(product.message);
        yield put(fetchUpdateProductFailed(product.message || 'Failed to update product'));
    } catch (error) {
        yield put(fetchUpdateProductFailed('Failed to update product'));
    }
}

function* handleAddMediaProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            formData,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;


        const product = yield call(productService.addMediaProduct, formData);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchAddMediaProductSuccess(product.message));
            return;
        }

        onFailed(product.message);
        yield put(fetchAddMediaProductFailed(product.message || 'Failed to add media product'));
    } catch (error) {
        yield put(fetchAddMediaProductFailed('Failed to add media product'));
    }
}

function* handleUpdateCertificateFileProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            product_id,
            file,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;

        const product = yield call(productService.updateCertificateFileProduct, product_id, file);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchUpdateCertificateFileProductSuccess(product.message));
            return;
        }

        onFailed(product.message);
        yield put(fetchUpdateCertificateFileProductFailed(product.message || 'Failed to update certificate file product'));
    } catch (error) {
        yield put(fetchUpdateCertificateFileProductFailed('Failed to update certificate file product'));
    }
}

function* handleUpdateImagesPrimaryProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            product_id,
            file,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;


        const product = yield call(productService.updateImagesPrimaryProduct, product_id, file);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchUpdateImagesPrimaryProductSuccess(product.message));
            return;
        }

        onFailed(product.message);
        yield put(fetchUpdateImagesPrimaryProductFailed(product.message || 'Failed to update images primary product'));
    } catch (error) {
        yield put(fetchUpdateImagesPrimaryProductFailed('Failed to update images primary product'));
    }
}

function* handleUpdateImagesProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            product_id,
            files,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;


        const product = yield call(productService.updateImagesProduct, product_id, files);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchUpdateImagesProductSuccess(product.message));
            return;
        }

        onFailed(product.message);
        yield put(fetchUpdateImagesProductFailed(product.message || 'Failed to update images product'));
    } catch (error) {
        yield put(fetchUpdateImagesProductFailed('Failed to update images product'));
    }
}

function* searchProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            query,
            page,
            page_size,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;

        const product = yield call(productService.searchProduct, query, page, page_size);
        if (product.status_code === 200) {
            console.log("product", product);
            onSuccess(product.message);
            yield put(fetchSearchProductSuccess(product.data));
            return;
        }

        onFailed(product.message);
        yield put(fetchSearchProductFailed(product.message || 'Failed to update images product'));
    } catch (error) {
        yield put(fetchSearchProductFailed('Failed to update images product'));
    }
}

function* handleGetAllBrand(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;
        console.log("payload", payload);

        const product = yield call(productService.getAllBrands);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchAllBrandSuccess(product.data));
            return;
        }

        onFailed(product.message);
        yield put(fetchAllBrandFailed(product.message || 'Failed to update images product'));
    } catch (error) {
        yield put(fetchAllBrandFailed('Failed to update images product'));
    }
}

function* handleImportFileAddProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {

            formData,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;

        console.log("saga", formData)

        const product = yield call(productService.importFileAddProduct, formData);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchImportFileAddProductSuccess(product.message));
            return;
        }

        onFailed(product.message);
        yield put(fetchImportFileAddProductFailed(product.message || 'Failed to update images product'));
    } catch (error) {
        yield put(fetchImportFileAddProductFailed('Failed to update images product'));
    }
}

function* fetchGetAllImportFileAddProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            page,
            page_size,
            onSuccess = () => {
            },
            onFailed = () => {
            },

        } = payload;

        const product = yield call(productService.getAllImportFileAddProduct, page, page_size);
        if (product.status_code === 200) {
            yield put(fetchGetAllImportFileAddProductSuccess(product.data));
            onSuccess(product.data);
            return;
        }
        yield put(fetchGetAllImportFileAddProductFailed("Product not found"));
        onFailed(product.message);
    } catch (error) {
        yield put(fetchGetAllImportFileAddProductFailed("Failed to fetch imprort file product"));
    }
}

function* handleDeleteImportFileAddProduct(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            import_id,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;
        const product = yield call(productService.deleteImportFileProduct, import_id);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchDeleteImportProductSuccess(product.message));
            return;
        }
        onFailed(product.message);
        yield put(fetchDeleteImportProductFailed(product.message || 'Failed to update images product'));
    } catch (error) {
        yield put(fetchDeleteImportProductFailed('Failed to update images product'));
    }
}

function* fetchProductDiscount(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            page,
            page_size,
        } = payload;

        const product = yield call(productService.getProductDiscount, page, page_size);
        if (product.status_code === 200) {
            yield put(fetchProductDiscountSuccess(product.data));
            return;
        }

        yield put(fetchProductDiscountFailed(product.data || 'Failed to update images product'));
    } catch (error) {
        yield put(fetchProductDiscountFailed('Failed to update images product'));
    }
}

function* fetchProductDiscountAdmin(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            page,
            page_size,
            is_approved
        } = payload;

        const product = yield call(productService.getProductDiscountAdmin, page, page_size, is_approved);
        if (product.status_code === 200) {
            yield put(fetchProductDiscountAdminSuccess(product.data));
            return;
        }

        yield put(fetchProductDiscountAdminFailed(product.data || 'Failed to update images product'));
    } catch (error) {
        yield put(fetchProductDiscountAdminFailed('Failed to update images product'));
    }
}

function* fetchProductLowStock(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;

        const product = yield call(productService.getProductLowStock);
        if (product.status_code === 200) {
            yield put(fetchProductLowStockSuccess(product.data));
            onSuccess(product.data);
            return;
        }
        yield put(fetchProductLowStockFailed(product.message || 'Failed to get product low stock'));
        onFailed(product.data);
    } catch (error) {
        console.log("error low stock", error);
        yield put(fetchProductLowStockFailed('Failed to get product low stock'));
    }
}

export function* productSaga() {
    yield takeLatest(fetchProductBySlugStart.type, fetchProductBySlug);
    yield takeLatest(fetchAddProductStart.type, handlerAddProduct);
    yield takeLatest(fetchAllProductAdminStart.type, handlerGetAllProductAdmin);
    yield takeLatest(fetchAllProductTopSellingStart.type, handlerGetAllProductTopSelling);
    yield takeLatest(fetchAllProductRelatedStart.type, handlerGetAllProductRelated);
    yield takeLatest(fetchAllProductGetRecentlyViewedStart.type, fetchGetProductGetRecentlyViewed);
    yield takeLatest(fetchAllProductGetProductFeaturedStart.type, fetchProductFeatured);
    yield takeLatest(fetchAllProductBestDealStart.type, handlerGetAllProductBestDeal);
    yield takeLatest(fetchDeleteProductStart.type, handlerDeleteProduct);
    yield takeLatest(fetchProductApprovedStart.type, getAllProductApproved);
    yield takeLatest(fetchApproveProductByPharmacistStart.type, handleApproveProduct);
    yield takeLatest(fetchUpdateProductStart.type, handleUpdateProduct);
    yield takeLatest(fetchAddMediaProductStart.type, handleAddMediaProduct);
    yield takeLatest(fetchUpdateCertificateFileProductStart.type, handleUpdateCertificateFileProduct);
    yield takeLatest(fetchUpdateImagesPrimaryProductStart.type, handleUpdateImagesPrimaryProduct);
    yield takeLatest(fetchUpdateImagesProductStart.type, handleUpdateImagesProduct);
    yield takeLatest(fetchSearchProductStart.type, searchProduct);
    yield takeLatest(fetchAllBrandStart.type, handleGetAllBrand);
    yield takeLatest(fetchImportFileAddProductStart.type, handleImportFileAddProduct);
    yield takeLatest(fetchGetAllImportFileAddProductStart.type, fetchGetAllImportFileAddProduct);
    yield takeLatest(fetchDeleteImportProductStart.type, handleDeleteImportFileAddProduct);
    yield takeLatest(fetchProductDiscountStart.type, fetchProductDiscount);
    yield takeLatest(fetchProductDiscountAdminStart.type, fetchProductDiscountAdmin);
    yield takeLatest(fetchImageToProductStart.type, fetchImageToProduct);
    yield takeLatest(fetchProductLowStockStart.type, fetchProductLowStock);
}
