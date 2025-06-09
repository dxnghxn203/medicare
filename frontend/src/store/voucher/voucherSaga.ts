import {call, put, takeLatest} from 'redux-saga/effects';
import * as voucherService from '@/services/voucherService';


import {
    fetchAllVouchersStart,
    fetchAllVouchersSuccess,
    fetchAllVouchersFailure,

    fetchAddVoucherStart,
    fetchAddVoucherSuccess,
    fetchAddVoucherFailure,

    fetchUpdateVoucherStart,
    fetchUpdateVoucherSuccess,
    fetchUpdateVoucherFailure,

    fetchDeleteVoucherStart,
    fetchDeleteVoucherSuccess,
    fetchDeleteVoucherFailure,

    fetchUpdateStatusStart,
    fetchUpdateStatusSuccess,
    fetchUpdateStatusFailure,

    fetchGetAllVoucherUserFailure,
    fetchGetAllVoucherUserStart,
    fetchGetAllVoucherUserSuccess,
} from '@/store';

function* handleGetAllVouchers(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        page,
        page_size,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;

    try {
        const response = yield call(voucherService.getAllVouchers, page, page_size);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchAllVouchersSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchAllVouchersFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchAllVouchersFailure("Failed to get all vouchers"));
    }
}

function* handleAddVoucher(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        voucher_name,
        inventory,
        description,
        discount,
        min_order_value,
        max_discount_value,
        voucher_type,
        expired_date,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    const body = {
        voucher_name,
        inventory,
        description,
        discount,
        min_order_value,
        max_discount_value,
        voucher_type,
        expired_date,
    }
    console.log("body", body)
    try {
        const response = yield call(voucherService.addVoucher, body);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchAddVoucherSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchAddVoucherFailure("Failed to add voucher"));

    } catch (error) {
        onFailure()
        yield put(fetchAddVoucherFailure("Failed to add voucher"));
    }
}

function* handleUpdateVoucher(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        voucher_id,
        voucher_name,
        inventory,
        description,
        discount,
        min_order_value,
        max_discount_value,
        voucher_type,
        expired_date,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    const body = {
        voucher_name,
        inventory,
        description,
        discount,
        min_order_value,
        max_discount_value,
        voucher_type,
        expired_date,
    }
    console.log("body", body)
    try {
        const response = yield call(voucherService.updateVoucher, voucher_id, body);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchUpdateVoucherSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateVoucherFailure("Failed to update voucher"));

    } catch (error) {
        onFailure()
        yield put(fetchUpdateVoucherFailure("Failed to update voucher"));
    }
}

function* handleDeleteVoucher(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        voucher_id,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;

    try {
        const response = yield call(voucherService.deleteVoucher, voucher_id);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchDeleteVoucherSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchDeleteVoucherFailure("Failed to delete voucher"));

    } catch (error) {
        onFailure()
        yield put(fetchDeleteVoucherFailure("Failed to delete voucher"));
    }
}

function* handleUpdateStatus(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {

        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;

    try {
        const response = yield call(voucherService.updateStatusVoucher, payload);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchUpdateStatusSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateStatusFailure("Failed to update status"));

    } catch (error) {
        onFailure()
        yield put(fetchUpdateStatusFailure("Failed to update status"));
    }
}

function* handleGetAllVoucherUser(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    try {
        const response = yield call(voucherService.getAllVouchersUser);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchGetAllVoucherUserSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchGetAllVoucherUserFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchGetAllVoucherUserFailure("Failed to get all vouchers"));
    }
}


export function* voucherSaga() {
    yield takeLatest(fetchAllVouchersStart, handleGetAllVouchers);
    yield takeLatest(fetchAddVoucherStart, handleAddVoucher);
    yield takeLatest(fetchUpdateVoucherStart, handleUpdateVoucher);
    yield takeLatest(fetchDeleteVoucherStart, handleDeleteVoucher);
    yield takeLatest(fetchUpdateStatusStart, handleUpdateStatus);
    yield takeLatest(fetchGetAllVoucherUserStart, handleGetAllVoucherUser);

}