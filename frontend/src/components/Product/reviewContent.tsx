import { useAuth } from "@/hooks/useAuth";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatCommentTime } from "@/utils/formatTime";
import { useReview } from "@/hooks/useReview";
import starrating from "@/images/starrating.png";
import ReplyFormReview from "./replyFormReview";
interface ReviewContentProps {
  productId: any;
}

const ReviewContent: React.FC<ReviewContentProps> = ({ productId }) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedRating, setSelectedRating] = useState<number | null>(0);

  const { fetchGetAllReview, allReview } = useReview();

  useEffect(() => {
    if (productId) {
      fetchGetAllReview(
        productId,
        pageSize,
        selectedRating ?? 0,
        () => {},
        () => {}
      );
    }
  }, [productId, pageSize, selectedRating]);

  const reviews = allReview?.reviews || [];

  const getInitials = (name?: string | null): string => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  const handleRatingFilter = (rating: number) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    fetchGetAllReview(
      productId,
      pageSize,
      newRating ?? 0,
      () => {},
      () => {}
    );
  };

  return (
    <div className="mt-6">
      <hr className="border-gray-300" />
      <div className="flex items-center space-x-3 mt-4">
        <span className="text-gray-500">Lọc theo:</span>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRatingFilter(rating)}
            className={`px-4 py-2 rounded-full border text-sm ${
              selectedRating === rating
                ? "border-blue-600 text-blue-600"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {rating} sao
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-6">
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.slice(0, visibleCount).map((review: any) => (
            <div key={review?._id}>
              <div className="flex items-center">
                {[...Array(review.rating)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="text-[#FCD53F] fill-[#FCD53F]"
                    size={16}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {formatCommentTime(review?.created_at)}
                </span>
              </div>
              <div key={review._id} className="pb-4 space-y-4">
                <div className="mt-4 flex space-x-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
                    {getInitials(review.user_name)}
                  </div>

                  {/* Nội dung review */}
                  <div className="space-y-2">
                    {/* Tên người dùng */}
                    <div className="font-bold">{review.user_name}</div>
                    {/* Hình ảnh */}
                    {Array.isArray(review?.images) &&
                      review.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {review.images.map((image: string, index: number) => (
                            <Image
                              key={index}
                              src={image}
                              alt={`review-image-${index}`}
                              width={80}
                              height={80}
                              className="w-[80px] h-[80px] object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                    {/* Comment và thời gian */}
                    <div>{review.comment}</div>
                    <div className="flex space-x-6 text-sm text-gray-500">
                      <div>{formatCommentTime(review.created_at)}</div>
                      <button
                        className="text-blue-500"
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === review._id ? null : review._id
                          )
                        }
                      >
                        Trả lời
                      </button>
                    </div>
                  </div>
                </div>
                {replyingTo === review._id && (
                  <ReplyFormReview
                    review_id={review._id}
                    user_name={review.user_name}
                    product_id={productId}
                  />
                )}

                {review.replies?.length > 0 && (
                  <div className="mt-4 space-y-4 mx-12">
                    {review.replies.map((reply: any) => (
                      <div key={reply.reply_id} className="flex space-x-4">
                        <div className="mt-4 flex space-x-4">
                          {/* Avatar */}
                          <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
                            {getInitials(reply.user_name)}
                          </div>
                          {/* Nội dung review */}
                          <div className="space-y-2">
                            {/* Tên người dùng */}
                            <div className="font-bold">{reply.user_name}</div>
                            {/* Hình ảnh */}
                            {Array.isArray(reply?.images) &&
                              reply.images.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {reply.images.map(
                                    (image: string, index: number) => (
                                      <Image
                                        key={index}
                                        src={image}
                                        alt={`review-image-${index}`}
                                        width={80}
                                        height={80}
                                        className="w-[80px] h-[80px] object-cover rounded"
                                      />
                                    )
                                  )}
                                </div>
                              )}

                            {/* Comment và thời gian */}
                            <div>{reply.comment}</div>
                            <div className="flex space-x-6 text-sm text-gray-500">
                              <div>{formatCommentTime(reply.created_at)}</div>
                              <button
                                className="text-blue-500"
                                onClick={() =>
                                  setReplyingTo(
                                    replyingTo === reply.reply_id
                                      ? null
                                      : reply.reply_id
                                  )
                                }
                              >
                                Trả lời
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* ReplyForm đặt ngoài map để tránh lồng vào answer */}
                  </div>
                )}
                {review.replies.map((reply: any) =>
                  replyingTo === reply.reply_id ? (
                    <ReplyFormReview
                      key={reply.reply_id + "_reply"}
                      review_id={review._id}
                      user_name={reply.user_name}
                      product_id={productId}
                    />
                  ) : null
                )}
              </div>
            </div>
          ))
        ) : (
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
              Chưa có đánh giá nào
            </div>
          </div>
        )}
      </div>

      {reviews.length > 5 && (
        <div className="mt-6 flex justify-center">
          {visibleCount < reviews.length ? (
            <button
              onClick={() => {
                setPageSize((prev) => prev + 5);
                setVisibleCount((prev) => prev + 5);
              }}
              className="text-[#002E99] cursor-pointer"
            >
              Xem thêm {reviews.length - visibleCount} bình luận
            </button>
          ) : (
            <button
              onClick={() => {
                setPageSize((prev) => prev - 5);
                setVisibleCount((prev) => prev - 5);
              }}
              className="text-[#002E99] cursor-pointer"
            >
              Thu gọn
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewContent;
