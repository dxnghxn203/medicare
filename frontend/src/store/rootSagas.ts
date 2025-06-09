import {all, fork} from 'redux-saga/effects';
import {authSaga} from './auth';
import {cartSaga} from './cart';
import {productSaga} from './product';
import {orderSaga} from './order';
import {locationSaga} from './location';
import {categorySaga} from './category';
import {userSaga} from './user';
import {reviewSaga} from './review';
import {chatSaga} from './chat';
import {voucherSaga} from './voucher';
import {brandSaga} from './brand';
import {articleSaga} from './article';
import {documentSaga} from './document';


export default function* rootSaga() {
    yield all([fork(authSaga)]);
    yield all([fork(cartSaga)]);
    yield all([fork(productSaga)]);
    yield all([fork(orderSaga)]);
    yield all([fork(locationSaga)]);
    yield all([fork(categorySaga)]);
    yield all([fork(userSaga)]);
    yield all([fork(reviewSaga)]);
    yield all([fork(chatSaga)]);
    yield all([fork(voucherSaga)]);
    yield all([fork(brandSaga)]);
    yield all([fork(articleSaga)]);
    yield all([fork(documentSaga)]);

}
