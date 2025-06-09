import {call, put, takeLatest} from 'redux-saga/effects';
import * as categoryService from '@/services/categoryService';
import {
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

    fetchGetAllCategoryForAdminStart,
    fetchGetAllCategoryForAdminSuccess,
    fetchGetAllCategoryForAdminFailed,

    fetchUpdateMainCategoryStart,
    fetchUpdateMainCategorySuccess,
    fetchUpdateMainCategoryFailed,

    fetchUpdateSubCategoryStart,
    fetchUpdateSubCategorySuccess,
    fetchUpdateSubCategoryFailed,

    fetchUpdateChildCategorySuccess,
    fetchUpdateChildCategoryFailed,
    fetchUpdateChildCategoryStart,

    fetchAddCategorySuccess,
    fetchAddCategoryStart,
    fetchAddCategoryFailed,

    fetchAddChildCategoryStart,
    fetchAddChildCategorySuccess,
    fetchAddChildCategoryFailed,
    fetchAddSubCategorySuccess,
    fetchAddSubCategoryFailed,
    fetchAddSubCategoryStart,
    fetchUpdateImageSubCategorySuccess,
    fetchUpdateImageSubCategoryFailed,
    fetchUpdateImageSubCategoryStart,
    fetchUpdateImageChildCategorySuccess,
    fetchUpdateImageChildCategoryFailed,
    fetchUpdateImageChildCategoryStart,
    fetchDeleteChildCategoryStart,
    fetchDeleteSubCategorySuccess,
    fetchDeleteSubCategoryFailed,
    fetchDeleteSubCategoryStart,
    fetchDeleteMainCategorySuccess,
    fetchDeleteMainCategoryFailed,
    fetchDeleteMainCategoryStart,

    fetchGetAllCategoryForMenuStart,
    fetchGetAllCategoryForMenuSuccess,
    fetchGetAllCategoryForMenuFailed

} from '@/store';


// fetch all category for menu
function* fetchGetAllCategoryForMenu(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        mainCategory,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;

    try {
        const category = yield call(categoryService.getMainCategory, mainCategory);
        if (category.status_code === 200) {
            onSuccess(category.data)
            yield put(fetchGetAllCategoryForMenuSuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchGetAllCategoryForMenuFailed("Category not found"));

    } catch (error) {
        onFailure()
        yield put(fetchGetAllCategoryForMenuFailed("Failed to fetch order"));
    }
}

// Fetch all category
function* fetchGetAllCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const category = yield call(categoryService.getAllCategory);
        if (category.status_code === 200) {
            yield put(fetchGetAllCategorySuccess(category.data));
            return;
        }
        yield put(fetchGetAllCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetAllCategoryFailed("Failed to fetch order"));
    }
}

function* fetchGetMainCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            mainCategory,
            onSuccess = () => {
            },
            onFailure = () => {
            },
        } = payload;

        const category = yield call(categoryService.getMainCategory, mainCategory);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchGetMainCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchGetMainCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetMainCategoryFailed("Failed to fetch category"));
    }
}

function* fetchGetSubCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            mainCategory,
            subCategory,
            onSuccess = () => {
            },
            onFailure = () => {
            },
        } = payload;
        const category = yield call(categoryService.getSubCategory, mainCategory, subCategory);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchGetSubCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchGetSubCategoryFailed("Category not found"));
    } catch (error) {
        yield put(fetchGetSubCategoryFailed("Failed to fetch category"));
    }
}

function* fetchGetChildCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            mainCategory,
            subCategory,
            childCategory,
            onSuccess = () => {
            },
            onFailure = () => {
            },
        } = payload;
        const category = yield call(categoryService.getChildCategory, mainCategory, subCategory, childCategory);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchGetChildCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchGetChildCategoryFailed("Category not found"));
    } catch (error) {
        yield put(fetchGetChildCategoryFailed("Failed to fetch catfffegory"));
    }
}

// function* fetchGetProductByMainSlug(action: any): Generator<any, void, any> {
//     try {
//         const { payload } = action;
//         const product = yield call(categoryService.getProductByMainSlug, payload);
//         if (product.status_code === 200) {
//             yield put(fetchGetProductByMainSlugSuccess(product.data));
//             console.log("SAGA", product.data);
//             return;
//         }
//         yield put(fetchGetProductByMainSlugFailed("Product not found"));

//     }
//     catch (error) {
//         yield put(fetchGetProductByMainSlugFailed("Failed to fetch product"));
//     }
// }

// Fetch all category for admin
function* fetchGetAllCategoryForAdmin(action: any): Generator<any, void, any> {
    try {
        const category = yield call(categoryService.getAllCategoryForAdmin);
        if (category.status_code === 200) {
            yield put(fetchGetAllCategoryForAdminSuccess(category.data));
            return;
        }
        yield put(fetchGetAllCategoryForAdminFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetAllCategoryForAdminFailed("Failed to fetch order"));
    }
}

function* fetchUpdateMainCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailure = () => {
            },
            ...credentials
        } = payload;
        const mainCategoryId = credentials.main_category_id;
        const category = yield call(categoryService.updateMainCategory, mainCategoryId, credentials);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchUpdateMainCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateMainCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchUpdateMainCategoryFailed("Failed to fetch category"));
    }
}

function* fetchUpdateSubCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailure = () => {
            },
            ...credentials
        } = payload;
        const childCategoryId = credentials.sub_category_id;
        const category = yield call(categoryService.updateSubCategory, childCategoryId, credentials);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchUpdateChildCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateChildCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchUpdateChildCategoryFailed("Failed to fetch category"));
    }
}

function* fetchUpdateChildCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailure = () => {
            },
            ...credentials
        } = payload;
        const childCategoryId = credentials.child_category_id;
        const category = yield call(categoryService.updateChildCategory, childCategoryId, credentials);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchUpdateSubCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateSubCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchUpdateSubCategoryFailed("Failed to fetch category"));
    }
}

function* fetchAddCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            main_category_name,
            main_category_slug,
            sub_category,
            child_category,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            },
        } = payload;


        const body = {
            main_category_name,
            main_category_slug,
            sub_category,
            child_category,
        };
        console.log("payload", payload)
        console.log("body", body)

        const category = yield call(categoryService.addCategory, body);

        if (category.status_code === 200) {
            onSuccess();
            yield put(fetchAddCategorySuccess(category.data));
        } else {
            onFailure(category.message);
            yield put(fetchAddCategoryFailed(category.message));
        }
    } catch (error: any) {
        const {payload} = action;
        const {
            onFailure = (message: any) => {
            }
        } = payload;
        const errorMessage = error?.response?.data?.message;
        onFailure(errorMessage);
        yield put(fetchAddCategoryFailed(errorMessage));
    }
}

function* fetchAddChildCategory(action: any): Generator<any, void, any> {
    try {
        const {
            child_category_name,
            child_category_slug,
            main_slug,
            sub_slug,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            },
        } = action.payload;

        const body = {
            child_category_name,
            child_category_slug,
        };

        const category = yield call(
            categoryService.addChildCategory,
            main_slug,
            sub_slug,
            body
        );

        if (category.status_code === 200) {
            onSuccess();
            yield put(fetchAddChildCategorySuccess(category.data));
        } else {
            onFailure(category.message || "Thêm danh mục thất bại.");
            yield put(fetchAddChildCategoryFailed(category.message || "Thêm danh mục thất bại."));
        }
    } catch (error) {
        console.error("Error in fetchAddChildCategory:", error);
        yield put(fetchAddChildCategoryFailed("Failed to fetch category"));
    }
}

function* fetchAddSubCategory(action: any): Generator<any, void, any> {
    try {
        const {
            sub_category_name,
            sub_category_slug,
            main_slug,
            child_category,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            },
        } = action.payload;

        const body = {
            sub_category_name,
            sub_category_slug,
            child_category // đây là một mảng gồm các child_category_name và slug
        };

        const category = yield call(
            categoryService.addSubCategory,
            main_slug, // truyền main_slug làm parameter
            body        // truyền body như API yêu cầu
        );

        if (category.status_code === 200) {
            onSuccess();
            yield put(fetchAddSubCategorySuccess(category.data));
        } else {
            onFailure(category.message || "Thêm danh mục thất bại.");
            yield put(fetchAddSubCategoryFailed(category.message || "Thêm danh mục thất bại."));
        }
    } catch (error: any) {
        const {payload} = action;
        const {
            onFailure = (message: any) => {
            }
        } = payload;
        const errorMessage = error?.response?.data?.message;
        onFailure(errorMessage);
        yield put(fetchAddSubCategoryFailed(errorMessage));
    }
}

function* fetchUpdateImageSubCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            sub_category_id,
            image,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            }

        } = payload;
        const formData = new FormData();
        formData.append("image", image);
        const category = yield call(categoryService.updateImageSubCategory, sub_category_id, formData);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchUpdateImageSubCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateImageSubCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchUpdateImageSubCategoryFailed("Failed to fetch category"));
    }
}

function* fetchUpdateImageChildCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            child_category_id,
            image,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            }

        } = payload;
        const formData = new FormData();
        formData.append("image", image);
        console.log("formData", formData)
        const category = yield call(categoryService.updateImageChildCategory, child_category_id, formData);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchUpdateImageChildCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateImageChildCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchUpdateImageChildCategoryFailed("Failed to fetch category"));
    }
}

function* fetchDeleteChildCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            child_category_id,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            }

        } = payload;
        const category = yield call(categoryService.deleteChildCategory, child_category_id);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchUpdateImageChildCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateImageChildCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchUpdateImageChildCategoryFailed("Failed to fetch category"));
    }
}

function* fetchDeleteSubCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            sub_category_id,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            }

        } = payload;
        const category = yield call(categoryService.deleteSubCategory, sub_category_id);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchDeleteSubCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchDeleteSubCategoryFailed("Category not found"));
    } catch (error) {
        yield put(fetchDeleteSubCategoryFailed("Failed to fetch category"));
    }
}

function* fetchDeleteMainCategory(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            main_category_id,
            onSuccess = () => {
            },
            onFailure = (message: any) => {
            }

        } = payload;
        const category = yield call(categoryService.deleteMainCategory, main_category_id);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchDeleteMainCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchDeleteMainCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchDeleteMainCategoryFailed("Failed to fetch category"));
    }
}


export function* categorySaga() {
    yield takeLatest(fetchGetAllCategoryStart.type, fetchGetAllCategory);
    yield takeLatest(fetchGetMainCategoryStart.type, fetchGetMainCategory);
    yield takeLatest(fetchGetSubCategoryStart.type, fetchGetSubCategory);
    yield takeLatest(fetchGetChildCategoryStart.type, fetchGetChildCategory);
    yield takeLatest(fetchGetAllCategoryForAdminStart.type, fetchGetAllCategoryForAdmin);
    yield takeLatest(fetchUpdateMainCategoryStart.type, fetchUpdateMainCategory);
    yield takeLatest(fetchUpdateSubCategoryStart.type, fetchUpdateSubCategory);
    yield takeLatest(fetchUpdateChildCategoryStart.type, fetchUpdateChildCategory);
    yield takeLatest(fetchAddCategoryStart.type, fetchAddCategory);
    yield takeLatest(fetchAddChildCategoryStart.type, fetchAddChildCategory);
    yield takeLatest(fetchGetAllCategoryForMenuStart.type, fetchGetAllCategoryForMenu);
    yield takeLatest(fetchAddSubCategoryStart.type, fetchAddSubCategory);
    yield takeLatest(fetchUpdateImageSubCategoryStart.type, fetchUpdateImageSubCategory);
    yield takeLatest(fetchUpdateImageChildCategoryStart.type, fetchUpdateImageChildCategory);
    yield takeLatest(fetchDeleteChildCategoryStart.type, fetchDeleteChildCategory);
    yield takeLatest(fetchDeleteSubCategoryStart.type, fetchDeleteSubCategory);
    yield takeLatest(fetchDeleteMainCategoryStart.type, fetchDeleteMainCategory);


}

