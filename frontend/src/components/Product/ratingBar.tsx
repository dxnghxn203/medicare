export default function RatingBar({ allReviews }: { allReviews: any }) {
  // Đếm số lượng đánh giá theo số sao
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalReviews = 0;
  allReviews?.reviews?.forEach((review: any) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating] += 1;
      totalReviews++;
    }
  });

  // Chuyển đổi dữ liệu để hiển thị
  const ratingsData = Object.keys(ratingCounts)
    .map((stars) => {
      const starCount = Number(stars);
      return {
        stars: starCount,
        count: ratingCounts[starCount], // Số lượng đánh giá
        percent:
          totalReviews > 0 ? (ratingCounts[starCount] / totalReviews) * 100 : 0, // Tính phần trăm
      };
    })
    .sort((a, b) => b.stars - a.stars); // Sắp xếp giảm dần theo số sao

  return (
    <div className="w-full max-w-md space-y-2">
      {ratingsData.map((item) => (
        <div key={item.stars} className="flex items-center space-x-2">
          <span className="w-16">{item.stars} sao</span>
          <div className="w-[250px] bg-gray-200 rounded-full relative">
            <div
              className="bg-[#FCD53F] h-2 rounded-full"
              style={{ width: `${item.percent}%` }}
            ></div>
          </div>
          <div className="flex w-[80px] whitespace-nowrap">
            <span className="text-sm text-start">
              {item.percent.toFixed(1)}% ({item.count})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
