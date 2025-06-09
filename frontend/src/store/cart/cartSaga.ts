import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as cartService from '@/services/cartService';
import {
    addCartStart,
    addCartSuccess,
    addCartFailure,
    addCartLocal,
    updateQuantityCartLocal,
    removeCartLocal,
    clearCartLocal,

    getCartStart,
    getCartSuccess,
    getCartFailure,

    addToCartStart,
    addToCartSuccess,
    addToCartFailure,

    removeCartStart,
    removeCartSuccess,
    removeCartFailure,

} from './cartSlice';
import { getSession, getToken, setSession } from '@/utils/cookie';

function* handleAddCart(): Generator<any, void, any> {
    try {
        const response = yield call(cartService.addCart, {});
        yield put(addCartSuccess(response));
    }
    catch (error) {
        yield put(addCartFailure('Lỗi thêm vào giỏ hàng'));
    }
}

function* handleRemoveCart(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            product_id,
            price_id,
            onSuccess = () => { },
            onFailure = () => { },
        } = payload;
        const session = getSession();
        const token = getToken();
        const data = {
            session: session,
            product_id: product_id,
            price_id: price_id,
        }
        const response = token ?
            yield call(cartService.removeCartToken, data)
            : yield call(cartService.removeCartSession, data);
        if (response?.status_code === 200) {
            onSuccess();
            yield put(removeCartSuccess(response));
            return;
        }
        onFailure(response.message);
        yield put(removeCartFailure(response.message));
    }
    catch (error) {
        yield put(removeCartFailure('Lỗi xóa giỏ hàng'));
    }
}

function* handleGetCart(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            onSuccess = () => { },
            onFailure = () => { },
        } = payload;
        const session = getSession();
        const token = getToken()

        const response = token ?
            yield call(cartService.getCartToken, { session })
            : yield call(cartService.getCartSession, { session });
        if (response?.status_code === 200) {
            onSuccess();
            if (response?.data?.session_id && response?.data?.session_id !== session) {
                setSession(response?.data?.session_id);
            }
            yield put(getCartSuccess(response?.data?.products));
            return;
        }
        onFailure(response.message);
        yield put(getCartFailure(response.message));
    }
    catch (error) {
        yield put(getCartFailure('Lỗi lấy giỏ hàng'));
    }
}

function* handleAddToCart(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            product_id,
            price_id,
            quantity,
            onSuccess = () => { },
            onFailure = () => { },
        } = payload;
        const session = getSession();
        const token = getToken();

        const data = {
            session: session,
            product_id: product_id,
            price_id: price_id,
            quantity: quantity,
        }
        
        const response = token ?
            yield call(cartService.addToCartToken, data)
            : yield call(cartService.addToCartSession, data);

        if (response?.status_code === 200) {
            onSuccess();
            if (response?.data?.session_id
                && response?.data?.session_id !== session) {
                setSession(response?.data?.session_id);
            }
            yield put(addToCartSuccess(response));
            return;
        }
        onFailure(response.message);
        yield put(addToCartFailure(response.message));
    }
    catch (error) {
        yield put(addToCartFailure('Lỗi thêm vào giỏ hàng'));
    }
}

export function* cartSaga() {
    yield takeLatest(addCartStart.type, handleAddCart);
    yield takeLatest(addToCartStart.type, handleAddToCart);
    yield takeLatest(getCartStart.type, handleGetCart);
    yield takeLatest(removeCartStart.type, handleRemoveCart);
}
