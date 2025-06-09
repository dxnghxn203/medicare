export const selectAllReview = (state: any) => state.review.reviews;
export const selectAllComment = (state: any) => state.review.comments;
export const insertReviewSelector = (state: any) => state.review.responseInsertReview;
export const insertCommentSelector = (state: any) => state.review.responseInsertComment;
export const insertAnswerSelector = (state: any) => state.review.responseInsertAnswer;
export const answerReviewSelector = (state: any) => state.review.answerReview;