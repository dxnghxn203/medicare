import {call, put, takeLatest} from 'redux-saga/effects';
import {
    fetchDocumentByRequestIdStart,
    fetchDocumentByRequestIdSuccess,
    fetchDocumentByRequestIdFailure, fetchGetAllArticleAdminStart
} from '@/store';

import * as documentService from '@/services/documentService';

function* fetchDocumentByRequestIdSaga(action: any): Generator<any, void, any> {
    const {
        requestId,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = action.payload;
    try {
        const response = yield call(documentService.getDocumentByRequestId, requestId);
        if (response.status_code !== 200) {
            yield put(fetchDocumentByRequestIdFailure(response.message));
            onFailure(response.message);
            return;
        }
        onSuccess(response.data);
        yield put(fetchDocumentByRequestIdSuccess(response.data));
    } catch (error) {
        yield put(fetchDocumentByRequestIdFailure("Lỗi lấy tài liệu"));
    }
}

export function* documentSaga() {
    yield takeLatest(fetchDocumentByRequestIdStart, fetchDocumentByRequestIdSaga);
}