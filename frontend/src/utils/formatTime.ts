import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const formatCommentTime = (timestamp: string) => {
  const now = dayjs();
  const time = dayjs(timestamp);

  const diffInDays = now.diff(time, "day");

  if (diffInDays >= 7) {
    return time.format("DD/MM/YYYY"); // Quá 7 ngày → hiển thị ngày
  }

  return time.fromNow(); // Dưới 7 ngày → hiển thị dạng tương đối
};
