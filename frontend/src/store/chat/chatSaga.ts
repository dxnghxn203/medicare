import {call, put, takeLatest} from 'redux-saga/effects';
import * as chatService from '@/services/chatService';

import {
    fetchChatBoxInitStart,
    fetchChatBoxSuccess,
    fetchChatBoxFailed,

    fetchGetAllConversationWaitingFailed,
    fetchGetAllConversationWaitingStart,
    fetchGetAllConversationWaitingSuccess,

    fetchAcceptConversationStart,
    fetchAcceptConversationSuccess,
    fetchAcceptConversationFailed
} from '@/store';

import {getToken, setSession} from '@/utils/cookie';

function* handlerAcceptConversation(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        data,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;

    try {
        const response = yield call(chatService.acceptConversation, data);
        if (response.status_code === 200) {
            onSuccess(response.data)
            yield put(fetchAcceptConversationSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchAcceptConversationFailed("Failed to accept conversation"));

    } catch (error) {
        onFailure()
        yield put(fetchAcceptConversationFailed("Failed to accept conversation"));
    }
}

function* getAllConversationWaiting(action: any): Generator<any, void, any> {
    const {payload} = action;
    const {
        data,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    } = payload;
    try {
        const response = yield call(chatService.getAllConversationWaiting, data);
        if (response.status_code === 200) {
            onSuccess()
            yield put(fetchGetAllConversationWaitingSuccess(response.data));
            return;
        }
        onFailure()
        yield put(fetchGetAllConversationWaitingFailed("Category not found"));

    } catch (error) {
        onFailure()
        yield put(fetchGetAllConversationWaitingFailed("Failed to fetch order"));
    }
}

function* handleInitChatBox(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            data,
            onSuccess = () => {
            },
            onFailure = () => {
            },
        } = payload;
        const token = getToken()
        const response = token ?
            yield call(chatService.startChatBoxUser) :
            yield call(chatService.startChatBoxGuest, data);
        if (response?.status_code === 200) {
            onSuccess(response?.data);
            setSession(response?.data);
            yield put(fetchChatBoxSuccess(response?.data));
            return;
        }
        onFailure(response.message);
        yield put(fetchChatBoxFailed(response.message));
    } catch (error) {
        yield put(fetchChatBoxFailed('Lỗi lấy giỏ hàng'));
    }
}

export function* chatSaga() {
    yield takeLatest(fetchChatBoxInitStart.type, handleInitChatBox);
    yield takeLatest(fetchAcceptConversationStart.type, handlerAcceptConversation);
    yield takeLatest(fetchGetAllConversationWaitingStart.type, getAllConversationWaiting);
}