import { call, put, takeLatest } from "redux-saga/effects";

import {
    fetchInsertUserFailure,
    fetchInsertUserStart,
    fetchInsertUserSuccess,

    fetchUpdateUserInfoStart,
    fetchUpdateUserInfoSuccess,
    fetchUpdateUserInfoFailure,
    fetchUpdateAdminInfoStart,
    fetchUpdateAdminInfoSuccess,
    fetchUpdateAdminInfoFailure,
    fetchUpdatePharmacistInfoStart,
    fetchUpdatePharmacistInfoSuccess,
    fetchUpdatePharmacistInfoFailure,

    fetchVerifyOtpStart,
    fetchVerifyOtpSuccess,
    fetchVerifyOtpFailure,

    fetchSendOtpStart,
    fetchSendOtpSuccess,    
    fetchSendOtpFailure,

    fetchGetAllUserAdminStart,
    fetchGetAllUserAdminSuccess,
    fetchGetAllUserAdminFailure,

    fetchForgotPasswordFailure,
    fetchForgotPasswordStart,
    fetchForgotPasswordSuccess,

    fetchChangePasswordFailure,
    fetchChangePasswordStart,
    fetchChangePasswordSuccess,

    fetchChangePasswordAdminFailure,
    fetchChangePasswordAdminStart,
    fetchChangePasswordAdminSuccess,

    fetchForgotPasswordAdminFailure,
    fetchForgotPasswordAdminStart,
    fetchForgotPasswordAdminSuccess,
    fetchUpdateStatusUserSuccess,
    fetchUpdateStatusUserFailure,
    fetchUpdateStatusUserStart,

    fetchChangePasswordPharmacistFailure,
    fetchChangePasswordPharmacistStart,
    fetchChangePasswordPharmacistSuccess,
    fetchForgotPasswordPharmacistStart,
    fetchForgotPasswordPharmacistFailure,
    fetchForgotPasswordPharmacistSuccess,

    fetchGetAllPharmacistStart,
    fetchGetAllPharmacistSuccess,
    fetchGetAllPharmacistFailure,

    fetchGetAllAdminFailure,
    fetchGetAllAdminStart,
    fetchGetAllAdminSuccess,

    fetchUpdateStatusPharmacistFailure,
    fetchUpdateStatusPharmacistStart,
    fetchUpdateStatusPharmacistSuccess,

    fetchInsertPharmacistFailure,   
    fetchInsertPharmacistStart,
    fetchInsertPharmacistSuccess,

    fetchRegisterAdminFailure,
    fetchRegisterAdminStart,
    fetchRegisterAdminSuccess,

    fetchSendOtpAdminFailure,
    fetchSendOtpAdminStart,
    fetchSendOtpAdminSuccess,

    fetchVerifyOtpAdminFailure,
    fetchVerifyOtpAdminStart,
    fetchVerifyOtpAdminSuccess,

    fetchGetMonthlyLoginStatisticsStart,
    fetchGetMonthlyLoginStatisticsSuccess,
    fetchGetMonthlyLoginStatisticsFailure,

    fetchGetCountUserRoleStatisticsSuccess,
    fetchGetCountUserRoleStatisticsFailure,
    fetchGetCountUserRoleStatisticsStart,

    fetchGetTopRevenueCustomersStatisticsStart,
    fetchGetTopRevenueCustomersStatisticsSuccess,
    fetchGetTopRevenueCustomersStatisticsFailure

} from "./userSlice";
import { 
    getAllUserAdmin,
    insertUser,
    sendOtp,
    verifyOtp,
    forgotPasswordUser,
    changePasswordUser,
    changePasswordAdmin,
    forgotPasswordAdmin,
    updateStatusUser,
    changePasswordPharmacist, 
    forgotPasswordPharmacist, 
    getAllPharmacist, 
    getAllAdmin, 
    updateStatusAdmin, 
    updateStatusPharmacist, 
    insertPharmacist, 
    registerAdmin, 
    sendOTPAdmin, 
    verifyOTPAdmin, 
    getMonthlyLoginStatistics,
    getCountUserRoleStatistics, 
    getTopRevenueCustomersStatistics, 
    updateUserInfo,
    updateAdminInfo,
    updatePharmacistInfo} from "@/services/userService";
import { getToken} from '@/utils/cookie';
function* userInsertWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    
    try {
        const response = yield call(insertUser, payload);
        if (response.status_code === 201) {
            yield put(fetchInsertUserSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchInsertUserFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchInsertUserFailure());
    }
}

function* userUpdateInfoSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    
    try {
        const response = yield call(updateUserInfo, payload);
        if (response.status_code === 200) {
            yield put(fetchUpdateUserInfoSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchUpdateUserInfoFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchUpdateUserInfoFailure());
    }
}

function* adminUpdateInfoSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    
    try {
        const response = yield call(updateAdminInfo, payload);
        if (response.status_code === 200) {
            yield put(fetchUpdateAdminInfoSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchUpdateAdminInfoFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchUpdateAdminInfoFailure());
    }
}

function* pharmacistUpdateInfoSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    
    try {
        const response = yield call(updatePharmacistInfo, payload);
        if (response.status_code === 200) {
            yield put(fetchUpdatePharmacistInfoSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchUpdatePharmacistInfoFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchUpdatePharmacistInfoFailure());
    }
}

function* userVerifyOtpWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload; 
    
    try {
        const response = yield call(verifyOtp, payload);
        if (response.status_code === 200) {
            yield put(fetchVerifyOtpSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchVerifyOtpFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchVerifyOtpFailure());
    }
}
function* userSendOtpWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;    
    try {
        const response = yield call(sendOtp, payload);
        if (response.status_code === 200) {
            yield put(fetchSendOtpSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchSendOtpFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchSendOtpFailure());
    }
}

function* userGetAllUserAdminWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    try {
        const response = yield call(getAllUserAdmin, payload);
        if (response.status_code === 200) {
            yield put(fetchGetAllUserAdminSuccess(response.data));
        } else {
            yield put(fetchGetAllUserAdminFailure());
        }
    } catch (error: any) {
        yield put(fetchGetAllUserAdminFailure());
    }
}

function* userForgotPasswordWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        email
    } = payload;
    const body = {
        email
    };
    
    try
    {
            const response = yield call(forgotPasswordUser, body);
            if (response.status_code === 200) {
                yield put(fetchForgotPasswordSuccess(response.data));
                onSuccess(response.message);
            } else {
                yield put(fetchForgotPasswordFailure());
                onFailure(response.message);
            }
        }
    catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchForgotPasswordFailure());
    }
}

function* userChangePasswordWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        old_password,
        new_password,
    } = payload;    
    const body = {
        old_password,
        new_password
    };
    const token = getToken();
    try {
        const response = yield call(changePasswordUser, body);
        if (response.status_code === 200) {
            yield put(fetchChangePasswordSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchChangePasswordFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchChangePasswordFailure());
    }
}

function* userChangePasswordAdminWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        old_password,
        new_password,
    } = payload;    
    const body = {
        old_password,
        new_password
    };
    try {
        const response = yield call(changePasswordAdmin, body);
        if (response.status_code === 200) {
            yield put(fetchChangePasswordAdminSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchChangePasswordAdminFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchChangePasswordAdminFailure());
    }
}

export function* userForgotPasswordAdminWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        email
    } = payload;
    const body = {
        email
    };
    try {
        const response = yield call(forgotPasswordAdmin, body);
        if (response.status_code === 200) {
            yield put(fetchForgotPasswordAdminSuccess(response.data));
            onSuccess(response.message);
            console.log("response", response)
        } else {
            yield put(fetchForgotPasswordAdminFailure());
            onFailure(response.message);
        console.log("response", response)
        }
    }
    catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchForgotPasswordAdminFailure());
    }
}

function* updateStatusUserWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;    
    try {
        const response = yield call(updateStatusUser, payload);
        if (response.status_code === 200) {
            yield put(fetchUpdateStatusUserSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchUpdateStatusUserFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchUpdateStatusUserFailure());
    }
}

function* changePasswordPharmacistWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        old_password,
        new_password,
    } = payload;    
    const body = {
        old_password,
        new_password
    };
    try {
        const response = yield call(changePasswordPharmacist, body);
        if (response.status_code === 200) {
            yield put(fetchChangePasswordPharmacistSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchChangePasswordPharmacistFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchChangePasswordPharmacistFailure());
    }
}

function* forgotPasswordPharmacistWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        email
    } = payload;
    const body = {
        email
    };
    try {
        const response = yield call(forgotPasswordPharmacist, body);
        if (response.status_code === 200) {
            yield put(fetchForgotPasswordPharmacistSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchForgotPasswordPharmacistFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchForgotPasswordPharmacistFailure());
    }
}

function* userGetAllPharmacistWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    try {
        const response = yield call(getAllPharmacist, payload);
        if (response.status_code === 200) {
            yield put(fetchGetAllPharmacistSuccess(response.data));
        } else {
            yield put(fetchGetAllPharmacistFailure());
        }
    } catch (error: any) {
        yield put(fetchGetAllPharmacistFailure());
    }
}

function* userGetAllAdminWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    try {
        console.log("payload", payload)
        const response = yield call(getAllAdmin, payload);
        if (response.status_code === 200) {
            yield put(fetchGetAllAdminSuccess(response.data));
        } else {
            yield put(fetchGetAllAdminFailure());
        }
    } catch (error: any) {
        yield put(fetchGetAllAdminFailure());
    }
}

function* updateStatusPharmacistWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    try {
        const response = yield call(updateStatusPharmacist, payload);
        if (response.status_code === 200) {
            yield put(fetchUpdateStatusPharmacistSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchUpdateStatusPharmacistFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchUpdateStatusPharmacistFailure());
    }
}

function* insertPharmacistWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        phone_number,
        user_name,
        email,
        gender,
        birthday,
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    const body = {
        phone_number,
        user_name,
        email,
        gender,
        birthday
    }
    try {
        const response = yield call(insertPharmacist, body);
        if (response.status_code === 201) {
            yield put(fetchInsertPharmacistSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchInsertPharmacistFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchInsertPharmacistFailure());
    }
}

function* handlRegisterAdmin (action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        phone_number,
        user_name,
        email,
        password,
        gender,
        birthday,
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;

    const body = {
        
        phone_number,
        user_name,
        email,
        password,
        gender,
        birthday
    }
    try {
        const response = yield call(registerAdmin, body);
        if (response.status_code === 201) {
            yield put(fetchRegisterAdminSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchRegisterAdminFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchRegisterAdminFailure());
    }
}

function* handleVerifyOTPAdmin (action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        email,
        otp,
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    const body = {
        email,
        otp
    }
    try {
        const response = yield call(verifyOTPAdmin, body);
        if (response.status_code === 200) {
            yield put(fetchVerifyOtpAdminSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchVerifyOtpAdminFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchVerifyOtpAdminFailure());
    }
}

function* handleSendOTPAdmin (action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        email,
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    const body = {
        email
    }
    try {
        const response = yield call(sendOTPAdmin, body);
        if (response.status_code === 200) {
            yield put(fetchSendOtpAdminSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchSendOtpAdminFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchSendOtpAdminFailure());
    }
}

function* fetchGetMonthlyLoginStatistics(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            year,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(getMonthlyLoginStatistics, year);
        if (rs.status_code === 200) {
            yield put(fetchGetMonthlyLoginStatisticsSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetMonthlyLoginStatisticsFailure(rs.message));
    } catch (error) {
        console.log(error);
        yield put(fetchGetMonthlyLoginStatisticsFailure());
    }
}

function* fetchGetCountUserRoleStatistics(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;
        const rs = yield call(getCountUserRoleStatistics);
        if (rs.status_code === 200) {
            yield put(fetchGetCountUserRoleStatisticsSuccess(rs.data));
            onSuccess();
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetCountUserRoleStatisticsFailure(rs.message));
    } catch (error) {
        console.log(error);
        yield put(fetchGetCountUserRoleStatisticsFailure());
    }
}

function* fetchGetTopRevenueCustomersStatistics(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            top_n,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;
        const rs = yield call(getTopRevenueCustomersStatistics, top_n);
        if (rs.status_code === 200) {
            yield put(fetchGetTopRevenueCustomersStatisticsSuccess(rs.data));
            onSuccess();
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetTopRevenueCustomersStatisticsFailure(rs.message));
    } catch (error) {
        console.log(error);
        yield put(fetchGetTopRevenueCustomersStatisticsFailure());
    }
}

export function* userSaga() {
    yield takeLatest(fetchInsertUserStart.type, userInsertWorkerSaga);
    yield takeLatest(fetchUpdateUserInfoStart.type, userUpdateInfoSaga);
    yield takeLatest(fetchUpdateAdminInfoStart.type, adminUpdateInfoSaga);
    yield takeLatest(fetchUpdatePharmacistInfoStart.type, pharmacistUpdateInfoSaga);
    yield takeLatest(fetchVerifyOtpStart.type, userVerifyOtpWorkerSaga);
    yield takeLatest(fetchSendOtpStart.type, userSendOtpWorkerSaga);
    yield takeLatest(fetchGetAllUserAdminStart.type, userGetAllUserAdminWorkerSaga);
    yield takeLatest(fetchForgotPasswordStart.type, userForgotPasswordWorkerSaga);
    yield takeLatest(fetchChangePasswordStart.type, userChangePasswordWorkerSaga);
    yield takeLatest(fetchChangePasswordAdminStart.type, userChangePasswordAdminWorkerSaga);
    yield takeLatest(fetchForgotPasswordAdminStart.type, userForgotPasswordAdminWorkerSaga);
    yield takeLatest(fetchUpdateStatusUserStart.type, updateStatusUserWorkerSaga);
    yield takeLatest(fetchChangePasswordPharmacistStart.type, changePasswordPharmacistWorkerSaga);
    yield takeLatest(fetchForgotPasswordPharmacistStart.type, forgotPasswordPharmacistWorkerSaga);
    yield takeLatest(fetchGetAllPharmacistStart.type, userGetAllPharmacistWorkerSaga);
    yield takeLatest(fetchGetAllAdminStart.type, userGetAllAdminWorkerSaga);
    yield takeLatest(fetchUpdateStatusPharmacistStart.type, updateStatusPharmacistWorkerSaga);
    yield takeLatest(fetchInsertPharmacistStart.type, insertPharmacistWorkerSaga);
    yield takeLatest(fetchRegisterAdminStart.type, handlRegisterAdmin);
    yield takeLatest(fetchVerifyOtpAdminStart.type, handleVerifyOTPAdmin);
    yield takeLatest(fetchSendOtpAdminStart.type, handleSendOTPAdmin);
    yield takeLatest(fetchGetMonthlyLoginStatisticsStart.type, fetchGetMonthlyLoginStatistics);
    yield takeLatest(fetchGetCountUserRoleStatisticsStart.type, fetchGetCountUserRoleStatistics);
    yield takeLatest(fetchGetTopRevenueCustomersStatisticsStart.type, fetchGetTopRevenueCustomersStatistics);
}

