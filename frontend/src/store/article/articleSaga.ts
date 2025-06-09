import {call, put, takeLatest} from 'redux-saga/effects';
import {
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
    
} from '@/store';
import * as articleService from '@/services/articleService';

import {getToken, setSession} from '@/utils/cookie';

function* fetchGetAllArticleAdmin(action: any): Generator<any, void, any> {
   const {payload} = action;
       const {
           
           onSuccess = () => {
           },
           onFailure = () => {
           },
       } = payload;
   
       try {
           const response = yield call(articleService.getAllArticlesAdmin);
           if (response.status_code === 200) {
               onSuccess(response.data)
               yield put(fetchGetAllArticleAdminSuccess(response.data));
               return;
           }
           onFailure()
           yield put(fetchGetAllArticleAdminFailure("Failed to get all vouchers"));
   
       } catch (error) {
           onFailure()
           yield put(fetchGetAllArticleAdminFailure("Failed to get all vouchers"));
       }
}

function* fetchAddArticleAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        formData,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    // const formData = new FormData();
    console.log("fetchAddArticleAdmin", formData);    
        try {
        const response = yield call(articleService.addArticleAdmin, formData);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchAddArticleAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchAddArticleAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchAddArticleAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchDeleteArticleAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        article_id,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    try {
        const response = yield call(articleService.deleteArticleAdmin, article_id);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchDeleteArticleAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchDeleteArticleAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchDeleteArticleAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchUpdateArticleAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        article_id,
        category,
        created_by,
        tags,
        title,
        content,
        slug,
        image,
       onSuccess = () => {
        },
        onFailure = () => {
        },

    } = payload;
    const body = {
        article_id,
        category,
        created_by,
        tags,
        title,
        content,
        slug,
        image
    };
    
    try {
        const response = yield call(articleService.updateArticleAdmin, body);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchUpdateArticleAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateArticleAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchUpdateArticleAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchUpdateLogoArticleAdmin(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        formData,
        article_id,
        onSuccess = () => {
        },
        onFailure = () => {
        },

    } = payload;
    
    
    try {
        const response = yield call(articleService.updateArticleLogoAdmin, formData, article_id);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchUpdateLogoArticleAdminSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchUpdateLogoArticleAdminFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchUpdateLogoArticleAdminFailure("Failed to get all vouchers"));
    }
}

function* fetchGetArticleById(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        article_id,
        onSuccess = () => {
        },
        onFailure = () => {
        },

    } = payload;
    try {
        const response = yield call(articleService.getArticleById, article_id);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchGetArticleByIdSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchGetArticleByIdFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchGetArticleByIdFailure("Failed to get all vouchers"));
    }
}

function* fetchGetAllArticleUser(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        onSuccess = () => {
        },
        onFailure = () => {
        },

    } = payload;
    try {
        const response = yield call(articleService.getAllArticlesUser);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchGetAllArticleUserSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchGetAllArticleUserFailure("Failed to get all vouchers"));

    } catch (error) {
        onFailure()
        yield put(fetchGetAllArticleUserFailure("Failed to get all vouchers"));
    }
}




export function* articleSaga() {
    yield takeLatest(fetchGetAllArticleAdminStart, fetchGetAllArticleAdmin);
    yield takeLatest(fetchAddArticleAdminStart, fetchAddArticleAdmin);
    yield takeLatest(fetchDeleteArticleAdminStart, fetchDeleteArticleAdmin);
    yield takeLatest(fetchUpdateArticleAdminStart, fetchUpdateArticleAdmin);
    yield takeLatest(fetchUpdateLogoArticleAdminStart, fetchUpdateLogoArticleAdmin);
    yield takeLatest(fetchGetArticleByIdStart, fetchGetArticleById);
    yield takeLatest(fetchGetAllArticleUserStart, fetchGetAllArticleUser);

   
}