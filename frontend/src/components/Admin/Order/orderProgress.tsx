import { Truck, PackageCheck, Hourglass } from "lucide-react";
import { LuPackage } from "react-icons/lu";
import { Progress } from "antd";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RiProgress2Line } from "react-icons/ri";

interface OrderProgressProps {
  status: "Processing" | "Shipped" | "Out for delivery" | "Delivered";
}

const OrderProgress: React.FC<OrderProgressProps> = ({ status }) => {
  // Gán phần trăm tương ứng với từng trạng thái
  const progressMap = {
    Processing: [25, 0, 0, 0], // Chỉ cây đầu tiên chạy
    Shipped: [100, 50, 0, 0], // Cây 1 hoàn tất, cây 2 chạy 50%
    "Out for delivery": [100, 100, 75, 0], // Cây 1,2 hoàn tất, cây 3 chạy 75%
    Delivered: [100, 100, 100, 100], // Tất cả hoàn tất
  };

  const progress = progressMap[status] || [0, 0, 0, 0];

  // Function để chọn icon phù hợp với trạng thái
  const getIcon = (progressValue: number, DefaultIcon: React.ReactNode) => {
    return progressValue === 100 ? (
      <IoCheckmarkCircle className="size-5 text-[#1E4DB7]" />
    ) : (
      DefaultIcon
    );
  };

  return (
    <div className="flex gap-6 w-full">
      {/* Processing */}
      <div className="flex flex-col w-1/4">
        <div className="flex gap-2">
          {getIcon(
            progress[0],
            <RiProgress2Line className="size-5 text-gray-400" />
          )}
          <span className="text-sm font-medium">Processing</span>
        </div>
        <Progress
          percent={progress[0]}
          strokeColor="#1E4DB7"
          showInfo={false}
          size="small"
        />
      </div>

      {/* Shipped */}
      <div className="flex flex-col w-1/4">
        <div className="flex gap-2">
          {getIcon(progress[1], <LuPackage className="size-5 text-gray-400" />)}
          <span className="text-sm font-medium">Shipped</span>
        </div>
        <Progress
          percent={progress[1]}
          strokeColor="#1E4DB7"
          showInfo={false}
          size="small"
        />
      </div>

      {/* Out for Delivery */}
      <div className="flex flex-col w-1/4">
        <div className="flex gap-2">
          {getIcon(progress[2], <Truck className="size-5 text-gray-400" />)}
          <span className="text-sm font-medium">Out for delivery</span>
        </div>
        <Progress
          percent={progress[2]}
          strokeColor="#1E4DB7"
          showInfo={false}
          size="small"
        />
      </div>

      {/* Delivered */}
      <div className="flex flex-col w-1/4">
        <div className="flex gap-2">
          {getIcon(
            progress[3],
            <PackageCheck className="size-5 text-gray-400" />
          )}
          <span className="text-sm font-medium">Delivered</span>
        </div>
        <Progress
          percent={progress[3]}
          strokeColor="#1E4DB7"
          showInfo={false}
          size="small"
        />
      </div>
    </div>
  );
};

export default OrderProgress;
