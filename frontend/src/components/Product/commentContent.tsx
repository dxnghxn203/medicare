import { useEffect, useState } from "react";
import CommentDialog from "../Dialog/commentDialog";
import { useReview } from "@/hooks/useReview";
import { formatCommentTime } from "@/utils/formatTime";
import ReplyFormComment from "./replyFormComment";
import starrating from "@/images/starrating.png";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/providers/toastProvider";
interface CommentContentProps {
  productId: any;
}
const CommentContent: React.FC<CommentContentProps> = ({ productId }) => {
  const [isDialogCommentOpen, setIsDialogCommentOpen] = useState(false);
  const { fetchGetAllComment, allComment } = useReview();
  const [selected, setSelected] = useState<string>("newest");
  const [visibleAQ, setVisibleAQ] = useState(5);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const { user } = useAuth();
  const toast = useToast();
  useEffect(() => {
    if (productId) {
      fetchGetAllComment(
        productId,
        pageSize,
        selected,
        () => {},
        () => {}
      );
    }
  }, [productId, pageSize]);
  const getInitials = (name: string | undefined | null) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };
  const handleSendCommentClick = () => {
    if (!user) {
      toast.showToast("Vui lòng đăng nhập để gửi bình luận", "warning");
    } else {
      setIsDialogCommentOpen(true);
    }
  };

  return (
    <>
      <div className="mt-6 mx-auto bg-[#F5F7F9] p-5 rounded-lg space-y-4">
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold">Hỏi và đáp</div>
          <div className="text-black/50">({allComment?.total} bình luận)</div>
        </div>

        <button
          className="bg-[#0053E2] text-white px-4 rounded-full h-[50px] font-bold cursor-pointer"
          onClick={handleSendCommentClick}
        >
          Gửi bình luận
        </button>

        <div className="mt-6 border-t border-gray-300"></div>

        <div className="flex items-center space-x-3">
          <span className="text-gray-500">Lọc theo:</span>
          {["newest", "oldest"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelected(type);
                fetchGetAllComment(
                  productId,
                  pageSize,
                  type,
                  () => {},
                  () => {}
                );
              }}
              className={`px-4 py-2 rounded-full border text-sm ${
                selected === type
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {type === "newest" ? "Mới nhất" : "Cũ nhất"}
            </button>
          ))}
        </div>

        {(allComment?.comments?.length === 0 || !allComment?.comments) && (
          <div>
            <div className="flex items-center justify-center mt-4">
              <Image
                src={starrating}
                alt="No reviews"
                width={150}
                height={150}
              />
            </div>
            <div className="text-center text-gray-500 text-sm">
              Chưa có hỏi đáp nào
            </div>
          </div>
        )}

        {allComment?.comments?.slice(0, visibleAQ).map((comment: any) => (
          <div key={comment._id} className="pb-4 space-y-4">
            <div className="mt-4 flex space-x-4">
              <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
                {getInitials(comment.user_name)}
              </div>
              <div className="space-y-2">
                <div className="font-bold">{comment.user_name}</div>
                <div>{comment.comment}</div>
                <div className="flex space-x-6">
                  <div className="text-sm text-gray-500">
                    {formatCommentTime(comment.created_at)}
                  </div>
                  <div
                    className="text-blue-500 text-sm cursor-pointer"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )
                    }
                  >
                    Trả lời
                  </div>
                </div>
              </div>
            </div>
            {replyingTo === comment._id && (
              <ReplyFormComment
                comment_id={comment._id}
                user_name={comment.user_name}
                product_id={productId}
              />
            )}

            {comment.answers?.length > 0 && (
              <div className="mt-4 space-y-4 mx-12">
                {comment.answers.map((answer: any) => (
                  <div key={answer.answer_id} className="flex space-x-4">
                    <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                      {getInitials(answer.user_name)}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="font-bold">{answer.user_name}</div>
                      <p>{answer.comment}</p>
                      <div className="flex space-x-6">
                        <div className="text-sm text-gray-500">
                          {formatCommentTime(answer.created_at)}
                        </div>
                        <div
                          className="text-blue-500 text-sm cursor-pointer"
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === answer.answer_id
                                ? null
                                : answer.answer_id
                            )
                          }
                        >
                          Trả lời
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ReplyForm đặt ngoài map để tránh lồng vào answer */}
              </div>
            )}
            {comment.answers.map((answer: any) =>
              replyingTo === answer.answer_id ? (
                <ReplyFormComment
                  key={answer.answer_id + "_reply"}
                  comment_id={comment._id}
                  user_name={answer.user_name}
                  product_id={productId}
                />
              ) : null
            )}
          </div>
        ))}

        {allComment?.comments?.length > 5 && (
          <div className="mt-6 flex justify-center">
            {visibleAQ < allComment.comments.length ? (
              <button
                onClick={() => {
                  setPageSize((prev) => prev + 5);
                  setVisibleAQ((prev) => prev + 5);
                }}
                className="text-[#002E99] cursor-pointer"
              >
                Xem thêm {allComment.comments.length - visibleAQ} bình luận
              </button>
            ) : (
              <button
                onClick={() => {
                  setPageSize((prev) => prev - 5);
                  setVisibleAQ((prev) => prev - 5);
                }}
                className="text-[#002E99] cursor-pointer"
              >
                Thu gọn
              </button>
            )}
          </div>
        )}
      </div>
      {isDialogCommentOpen && (
        <CommentDialog
          onClose={() => setIsDialogCommentOpen(false)}
          productId={productId}
          onCommentSubmitted={() => {
            fetchGetAllComment(
              productId,
              pageSize,
              selected,
              () => {},
              () => {}
            );
          }}
        />
      )}
    </>
  );
};

export default CommentContent;
