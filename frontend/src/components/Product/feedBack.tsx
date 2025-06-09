import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import RatingBar from "./ratingBar";
import RatingDialog from "../Dialog/ratingDialog";
import { useReview } from "@/hooks/useReview";
import { useProduct } from "@/hooks/useProduct";
import ReviewContent from "./reviewContent";
import CommentContent from "./commentContent";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/providers/toastProvider";
const FeedBack = ({ product, productId }: { product: any; productId: any }) => {
  const [isDialogRatingOpen, setIsDialogRatingOpen] = useState(false);
  const { allReview, fetchGetAllReview } = useReview();
  const { fetchProductBySlug } = useProduct();
  const [selected, setSelected] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { user } = useAuth();
  const toast = useToast();
  const handleWriteReviewClick = () => {
    if (!user) {
      toast.showToast("Vui lòng đăng nhập trước khi đánh giá", "warning");
    } else {
      setIsDialogRatingOpen(true);
    }
  };

  return (
    <div className="">
      <div className="mx-auto bg-[#F5F7F9] p-5 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Trung bình đánh giá</h2>
            <div className="text-4xl font-bold mt-1">
              {Number(product?.rating).toFixed(1)}/ 5.0
            </div>

            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Star
                    key={index}
                    className="text-[#FCD53F] fill-[#FCD53F]"
                    size={20}
                  />
                ))}
              <span className="ml-2 text-gray-500">
                {allReview?.total} đánh giá
              </span>
            </div>
          </div>
          <RatingBar allReviews={allReview} />
          <button
            className="bg-[#0053E2] text-white px-4 rounded-full h-[50px] font-bold"
            onClick={handleWriteReviewClick}
          >
            Viết đánh giá
          </button>
        </div>
        <ReviewContent productId={productId} />
      </div>
      <CommentContent productId={productId} />
      {isDialogRatingOpen && (
        <RatingDialog
          onClose={() => setIsDialogRatingOpen(false)}
          product={product}
          productId={productId}
          onCommentSubmitted={() => {
            fetchGetAllReview(
              productId,
              pageSize,
              selected,
              () => {},
              () => {}
            );
            fetchProductBySlug(
              product?.slug,
              () => {},
              () => {}
            );
          }}
        />
      )}
    </div>
  );
};

export default FeedBack;
