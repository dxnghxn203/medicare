import {call, put, takeLatest} from 'redux-saga/effects';
import {
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

    fetchGetAllBrandByIdFailure,
    fetchGetAllBrandByIdStart,
    fetchGetAllBrandByIdSuccess,
    
} from '@/store';
import * as brandService from '@/services/brandService';

import {getToken, setSession} from '@/utils/cookie';

function* fetchGetAllBrandAdmin(action: any): Generator<any, void, any> {
   const {payload} = action;
       const {
           
           onSuccess = () => {
           },
           onFailure = () => {
           },
       } = payload;
   
       try {
           const response = yield call(brandService.getAllBrandsAdmin);
           if (response.status_code === 200) {
               onSuccess(response.data)
               yield put(fetchGetAllBrandAdminSuccess(response.data));
               return;
           }
           onFailure()
           yield put(fetchGetAllBrandAdminFailure("Failed to get all vouchers"));
   
       } catch (error) {
           onFailure()
           yield put(fetchGetAllBrandAdminFailure("Failed to get all vouchers"));
       }
}

function* fetchAddBrandAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        formData,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    // const formData = new FormData();
    console.log("fetchAddBrandAdmin", formData);    
        try {
        const response = yield call(brandService.addBrandAdmin, formData);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchAddBrandAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchAddBrandAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchAddBrandAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchDeleteBrandAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        brand_id,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    try {
        const response = yield call(brandService.deleteBrandAdmin, brand_id);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchDeleteBrandAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchDeleteBrandAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchDeleteBrandAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchUpdateBrandAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        brand_id,
        name,
        description,
        category,
        active,
       onSuccess = () => {
        },
        onFailure = () => {
        },

    } = payload;
    const body = {
        brand_id,
        name,
        description,
        category,
        active
    };
    
    try {
        const response = yield call(brandService.updateBrandAdmin, body);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchUpdateBrandAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateBrandAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchUpdateBrandAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchUpdateLogoBrandAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        formData,
        brand_id,
        onSuccess = () => {
        },
        onFailure = () => {
        },

    } = payload;
    
    
    try {
        const response = yield call(brandService.updateBrandLogoAdmin, formData, brand_id);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchUpdateLogoBrandAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateLogoBrandAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchUpdateLogoBrandAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchGetAllBrandUser(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    
    try {
        const response = yield call(brandService.getAllBrandsUser);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchGetAllBrandUserSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchGetAllBrandUserFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchGetAllBrandUserFailure("Failed to get all vouchers"));
    }
}

function* fetchGetAllBrandById(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        brand_id,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    try {
        const response = yield call(brandService.getAllBrandsById, brand_id);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchGetAllBrandByIdSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchGetAllBrandByIdFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchGetAllBrandByIdFailure("Failed to get all vouchers"));
    }
}





export function* brandSaga() {
    yield takeLatest(fetchGetAllBrandAdminStart, fetchGetAllBrandAdmin);
    yield takeLatest(fetchAddBrandAdminStart, fetchAddBrandAdmin);
    yield takeLatest(fetchDeleteBrandAdminStart, fetchDeleteBrandAdmin);
    yield takeLatest(fetchUpdateBrandAdminStart, fetchUpdateBrandAdmin);
    yield takeLatest(fetchUpdateLogoBrandAdminStart, fetchUpdateLogoBrandAdmin);
    yield takeLatest(fetchGetAllBrandUserStart, fetchGetAllBrandUser);
    yield takeLatest(fetchGetAllBrandByIdStart, fetchGetAllBrandById);
   
}