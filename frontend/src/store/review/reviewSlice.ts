import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReviewState {
    reviews: any[];
    comments: any[];
    answers: any[];
    answerReview: any[];
    responseInsertAnswer: any;
    responseInsertReview: any;
    responseInsertComment: any;
    responseInsertAnswerReview: any;
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    comments: [],
    answers: [],
    answerReview: [],
    responseInsertAnswer: null,
    responseInsertReview: null,
    responseInsertComment: null,
    responseInsertAnswerReview: null,
    loading: false,
    error: null,
};

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        // Fetch product by slug
        fetchGetAllReviewStart(state, action: PayloadAction<any>) {
            // console.log("fetchGetAllReviewStart reducer: ", action.payload);
            state.loading = true;
        },
        fetchGetAllReviewSuccess(state, action: PayloadAction<any[]>) {
            // console.log("fetchGetAllReviewSuccess", action.payload);
            state.reviews = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetAllReviewFailed(state, action: PayloadAction<string>) {
            // console.log("fetchGetAllReviewFailed", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        // Fetch comments by product ID
        fetchGetAllCommentStart(state, action: PayloadAction<any>) {
            // console.log("fetchGetAllCommentStart reducer: ", action.payload);
            state.loading = true;
        },
        fetchGetAllCommentSuccess(state, action: PayloadAction<any[]>) {
            // console.log("fetchGetAllCommentSuccess", action.payload);
            state.comments = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetAllCommentFailed(state, action: PayloadAction<string>) {
            // console.log("fetchGetAllCommentFailed", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        // Insert review
        fetchReviewStart: (state) => {
            console.log("fetchReviewStart reducer: ");
            state.loading = true;
        },
        fetchReviewSuccess: (state) => {
            console.log("fetchReviewSuccess reducer: ");
            state.responseInsertReview = true;
            state.loading = false;
        },
        fetchReviewFailure: (state) => {
            console.log("fetchReviewFailure reducer: ");
            state.responseInsertReview = false;
            state.loading = false;
        },

        // Insert comment
        fetchCommentStart: (state) => {
            console.log("fetchCommentStart reducer: ");
            state.loading = true;
        },
        fetchCommentSuccess: (state) => {
            console.log("fetchCommentSuccess reducer: ");
            state.responseInsertComment = true;
            state.loading = false;
        },
        fetchCommentFailure: (state) => {
            console.log("fetchCommentFailure reducer: ");
            state.responseInsertComment = false;
            state.loading = false;
        },
        // Insert answer
        fetchAnswerStart: (state) => {
            console.log("fetchAnswerStart reducer: ");
            state.loading = true;
        },
        fetchAnswerSuccess: (state) => {
            console.log("fetchAnswerSuccess reducer: ");
            state.responseInsertAnswer = true;
            state.loading = false;
        },
        fetchAnswerFailure: (state) => {   
            console.log("fetchAnswerFailure reducer: ");
            state.responseInsertAnswer = false;
            state.loading = false;
        },

        // Fetch answer by comment ID
        fetchAnswerReviewStart(state) {
            // console.log("fetchAnswerReviewStart reducer: ", action.payload);
            state.loading = true;
        },

        fetchAnswerReviewSuccess(state) {
            // console.log("fetchAnswerReviewSuccess", action.payload);
            state.responseInsertAnswerReview = true;
            state.loading = false;
            state.error = null;
        },
        fetchAnswerReviewFailed(state) {
            // console.log("fetchAnswerReviewFailed", action.payload);
            state.loading = false;
            state.responseInsertAnswerReview = false;
        }


        
    },
});

export const {
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

} = reviewSlice.actions;

export default reviewSlice.reducer;


