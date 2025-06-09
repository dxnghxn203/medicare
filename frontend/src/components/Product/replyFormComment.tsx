import { useAuth } from "@/hooks/useAuth";
import { useReview } from "@/hooks/useReview";
import { useToast } from "@/providers/toastProvider";
import { useState } from "react";

const ReplyFormComment = ({
  comment_id,
  user_name,
  product_id,
}: {
  comment_id: string;
  user_name: string;
  product_id: any;
}) => {
  const { user } = useAuth();
  const { fetchInsertAnswer, insertAnswer } = useReview();
  const toast = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("newest");
  const { fetchGetAllComment, allComment } = useReview();
  const [pageSize, setPageSize] = useState(10);
  const [showReplyForm, setShowReplyForm] = useState(true);
  const getInitials = (name: string | undefined | null) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };
  const [formData, setFormData] = useState({
    comment_id: comment_id,
    comment: "",
  });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      setErrors({ comment: "Vui lòng nhập nội dung trả lời." });
      return;
    }

    try {
      await fetchInsertAnswer({
        param: formData,
        onSuccess: (message: string) => {
          toast.showToast(message, "success");
          console.log("insertAnswer", insertAnswer);
          setReplyingTo(null);
          setFormData({ comment_id: comment_id, comment: "" });
          setShowReplyForm(false);
          fetchGetAllComment(
            product_id,
            pageSize,
            selected,
            () => {},
            () => {}
          );
        },
        onFailure: (message: string) => {
          toast.showToast(message, "error");
        },
      });
    } catch (error) {
      toast.showToast("Trả lời không thành công!", "error");
    }
  };

  return (
    <>
      {showReplyForm && (
        <div className="mt-3 flex items-start space-x-4 mx-12">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold mt-2">
            {getInitials(user?.user_name)}
          </div>
          <div className="flex-1 flex items-start space-x-6">
            <form
              onSubmit={onSubmit}
              className="flex-1 flex items-start space-x-2"
            >
              <div className="flex-1 flex flex-col">
                <p className="text-sm text-gray-900 font-medium">
                  Đang trả lời:{" "}
                  <span className="font-semibold">{user_name}</span>
                </p>
                <input
                  type="text"
                  placeholder="Nhập nội dung trả lời..."
                  className="w-full px-3 py-4 mt-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) =>
                    setFormData({
                      comment_id: comment_id,
                      comment: e.target.value,
                    })
                  }
                  value={formData.comment}
                />
                {errors.comment && (
                  <div className="text-red-500 text-sm pt-2">
                    {errors.comment}
                  </div>
                )}
              </div>
              <button
                className="bg-[#0053E2] text-white px-6 py-4 mt-6 rounded-full font-semibold hover:bg-blue-700"
                type="submit"
              >
                Gửi bình luận
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default ReplyFormComment;
