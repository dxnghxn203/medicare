import { call, put, takeLatest } from 'redux-saga/effects';
import {
   fetchGetAllReviewStart,
    fetchGetAllReviewSuccess,
    fetchGetAllReviewFailed,

    fetchGetAllCommentStart,
    fetchGetAllCommentSuccess,
    fetchGetAllCommentFailed,

    fetchReviewStart,
    fetchReviewSuccess,
    fetchReviewFailure,

    fetchCommentStart,
    fetchCommentSuccess,
    fetchCommentFailure,

    fetchAnswerStart,
    fetchAnswerSuccess,
    fetchAnswerFailure,

    fetchAnswerReviewStart,
    fetchAnswerReviewSuccess,   
    fetchAnswerReviewFailed,

} from './reviewSlice';
import { getSession, getToken, setSession } from '@/utils/cookie';
import * as reviewService from '@/services/reviewService';
import { setClientToken } from '@/utils/configs/axiosClient';

function* fetchGetAllReview(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const { id, pageSize, rating,  // id là productId
             onSuccess = () => {}, onFailure = () => {} } = payload;

        const review = yield call(reviewService.getAllReview, id, pageSize, rating);

        // Kiểm tra status_code từ response
        if (review.status_code === 200) {
            onSuccess();
            yield put(fetchGetAllReviewSuccess(review.data));
            // console.log(review.data, "review.data");
        } else {
            // Nếu status_code không phải 200
            onFailure();
            yield put(fetchGetAllReviewFailed("Review not found"));
            // console.log("API returned error status: ", review.status_code);
        }
    } catch (error) {
        // Log lỗi chi tiết nếu có
        // console.error("Error in fetchGetAllReview:", error);
        yield put(fetchGetAllReviewFailed("Failed to fetch Review"));
    }
}

function* fetchGetAllComment(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const { id, pageSize, sort_type, onSuccess = () => {}, onFailure = () => {} } = payload;

        const comment = yield call(reviewService.getAllComment, id, pageSize, sort_type);

        // Kiểm tra status_code từ response
        if (comment.status_code === 200) {
            onSuccess();
            yield put(fetchGetAllCommentSuccess(comment.data));
            // console.log(comment.data, "comment.data");
        } else {
            // Nếu status_code không phải 200
            onFailure();
            yield put(fetchGetAllCommentFailed("Comment not found"));
            console.log("API returned error status: ", comment.status_code);
        }
    } catch (error) {
        // Log lỗi chi tiết nếu có
        console.error("Error in fetchGetAllComment:", error);
        yield put(fetchGetAllCommentFailed("Failed to fetch Comment"));
    }
}

function* reviewWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
        const {
            onSuccess =()=> {},
            onFailure =()=> {},
        } = payload; 
        const form = new FormData();
        form.append("rating", payload.rating);
        form.append("comment", payload.comment || "");
        if (payload.images) {
            payload.images.forEach((image: any) => {
                form.append("images", image);
            });
        }
        form.append("product_id", payload.productId);
        console.log("payload: ", payload);
        try {
            const response = yield call(reviewService.insertReview, form);
            if (response.status_code === 201) {
                yield put(fetchReviewSuccess());
                console.log("response: ", response);
                onSuccess(response.message);
            } else {
                yield put(fetchReviewFailure());
                console.log("response: ", response);
                onFailure(response.message);
            }
        } catch (error: any) {
            onFailure(error?.response?.data?.message);
            yield put(fetchReviewFailure());
        }
}

function* commentWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
        const {
            onSuccess =()=> {},
            onFailure =()=> {},
        } = payload; 
        
        try {
            const response = yield call(reviewService.insertComment, payload);
            console.log("payload: ", payload);
            if (response.status_code === 201) {
                yield put(fetchCommentSuccess());
                // console.log("response: ", response);
                onSuccess(response.message);
            } else {
                yield put(fetchCommentFailure());
                // console.log("response: ", response);
                onFailure(response.message);
            }
            // console.log("response: ", response);
        } catch (error: any) {
            yield put(fetchCommentFailure());
        }
}

function* answerWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
        const {
            onSuccess =()=> {},
            onFailure =()=> {},
        } = payload; 
        try {
            const response = 
            yield call(reviewService.insertAnswer, payload) ;
            console.log("payload: ", payload);
            if (response.status_code === 200) {
                yield put(fetchAnswerSuccess());
                console.log("response: ", response);
                onSuccess(response.message);
            } else {
                yield put(fetchAnswerFailure());
                console.log("response: ", response);
                onFailure(response.message);
            }
            console.log("response: ", response);
        } catch (error: any) {
            yield put(fetchAnswerFailure());
        }
}
function * answerReviewWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
        const {
            onSuccess =()=> {},
            onFailure =()=> {},
        } = payload;   
        const form = new FormData();
        form.append("review_id", payload.review_id);
        form.append("comment", payload.comment);
        
        if (payload.images) {
            payload.images.forEach((image: any) => {
                form.append("images", image);
            });
        }
        console.log("payload: ", payload);
        try {
            const response = yield call(reviewService.insertAnswerReview, form);
            console.log("payload: ", form);
            if (response.status_code === 200) {
                yield put(fetchAnswerReviewSuccess());
                console.log("response: ", response);
                onSuccess(response.message);
            } else {
                yield put(fetchAnswerReviewFailed());
                console.log("response: ", response);
                onFailure(response.message);
            }
            console.log("response: ", response);
        } catch (error: any) {
            yield put(fetchAnswerReviewFailed());
        }
}

export function* reviewSaga() {
    yield takeLatest(fetchGetAllReviewStart.type, fetchGetAllReview);
    yield takeLatest(fetchGetAllCommentStart.type, fetchGetAllComment);
    yield takeLatest(fetchReviewStart.type, reviewWorkerSaga);
    yield takeLatest(fetchCommentStart.type, commentWorkerSaga);
    yield takeLatest(fetchAnswerStart.type, answerWorkerSaga);
    yield takeLatest(fetchAnswerReviewStart.type, answerReviewWorkerSaga);
    
    

}
