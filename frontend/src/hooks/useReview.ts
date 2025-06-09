import { fetchAnswerReviewStart, fetchAnswerStart, fetchCommentStart, fetchGetAllCommentStart, fetchGetAllReviewStart, fetchReviewStart, insertAnswerSelector, insertCommentSelector, insertReviewSelector, selectAllComment, selectAllReview } from "@/store/review";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useReview() {
    const dispatch = useDispatch();
    const allReview: any = useSelector(selectAllReview);
    const allComment: any = useSelector(selectAllComment);
    const insertReview: any = useSelector(insertReviewSelector);
    const insertComment: any = useSelector(insertCommentSelector);
    const insertAnswer: any = useSelector(insertAnswerSelector);
    const insertAnswerReview: any = useSelector(insertAnswerSelector);
  
    const fetchGetAllReview = (id: any, pageSize: number, rating: number,
      onSuccess: () => void,
      onFailure: () => void) => {
      dispatch(fetchGetAllReviewStart({
        id: id,
        pageSize: pageSize,
        rating: rating,
        onSuccess: onSuccess,
        onFailure: onFailure,
      }));
      // console.log("Dispatching fetchGetAllReviewStart action with id:", id, pageSize);
    };
    const fetchGetAllComment = (id: any, pageSize: number,sort_type: string,
      onSuccess: () => void,
      onFailure: () => void) => {
      // console.log("Dispatching fetchGetAllCommentStart action with id:", id, pageSize); 
        dispatch(fetchGetAllCommentStart({
          id: id,
          pageSize: pageSize,
          sort_type: sort_type,
          onSuccess: onSuccess,
          onFailure: onFailure,
        }));
      };
    const fetchInsertReview = ({
      param, onSuccess, onFailure
    }: {
      param: any;
      onSuccess: (message: string) => void;
      onFailure: (message: string) => void;
    }) => {
      dispatch(fetchReviewStart({
        ...param,
        onSuccess,
        onFailure
      }));
      console.log("Dispatching fetchInsertReview action with param:", param);
    };
    const fetchInsertComment = ({
      param, onSuccess, onFailure
    }: {
      param: any;
      onSuccess: (message: string) => void;
      onFailure: (message: string) => void;
    }) => {
      dispatch(fetchCommentStart({
        ...param,
        onSuccess,
        onFailure
      }));
      console.log("Dispatching fetchInsertComment action with param:", param);
    };
    const fetchInsertAnswer = ({
      param, onSuccess, onFailure
    }: {
      param: any;
      onSuccess: (message: string) => void;
      onFailure: (message: string) => void;
    }) => {
      dispatch(fetchAnswerStart({
        ...param,
        onSuccess,
        onFailure
      }));
      console.log("Dispatching fetchInsertAnswer action with param:", param);
    };
    const fetchInsertAnswerReview = ({
      param, onSuccess, onFailure
    }: {
      param: any;
      onSuccess: (message: string) => void;
      onFailure: (message: string) => void;
    }) => {
      dispatch(fetchAnswerReviewStart({
        ...param,
        onSuccess,
        onFailure
      }));
    };



    

  return {
    allReview,
    fetchGetAllReview,

    allComment,
    fetchGetAllComment,

    insertReview,
    fetchInsertReview,

    insertComment,
    fetchInsertComment,

    insertAnswer,
    fetchInsertAnswer,

    insertAnswerReview,
    fetchInsertAnswerReview,
    


  };
}
