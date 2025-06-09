import { ChevronLeft, ChevronRight } from "lucide-react";

const vouchers = [
  {
    id: 1,
    discount: "Giảm 20K",
    description: "Áp dụng đơn hàng online",
    condition: "cho đơn online từ 0K",
    date: "24/04-21/05",
    brand: "Free",
    bgColor: "bg-green-500",
  },
  {
    id: 2,
    discount: "Giảm 35K",
    description: "Áp dụng cho sản phẩm Bình sữa",
    condition: "cho đơn online từ 299K",
    date: "24/04-21/05",
    brand: "concung",
    bgColor: "bg-gradient-to-r from-pink-500 to-pink-400",
  },
  {
    id: 3,
    discount: "Giảm 50K",
    description: "Trừ sữa Abbott",
    condition: "cho đơn online từ 599K",
    date: "24/04-21/05",
    brand: "concung",
    bgColor: "bg-gradient-to-r from-pink-500 to-pink-400",
  },
];

export default function VoucherList() {
  return (
    <div className="bg-white ">
      <h2 className="text-2xl font-bold mb-4">Nhận Voucher</h2>

      <div className="relative flex items-center gap-4 overflow-x-auto scrollbar-hide">
        {/* Button điều hướng trái */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-1 z-10">
          <ChevronLeft className="w-6 h-6 text-pink-400" />
        </button>

        <div className="flex gap-4 pl-10 pr-10">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="flex rounded-xl border min-w-[300px] overflow-hidden shadow"
            >
              <div
                className={`w-1/3 flex flex-col justify-center items-center text-white text-xs font-semibold p-2 ${v.bgColor}`}
              >
                <span className="bg-yellow-300 text-[10px] text-black px-1 rounded mb-2">
                  Chỉ Online
                </span>
                <div className="text-center">
                  <div className="text-sm font-bold">{v.brand}</div>
                  <div className="text-xs">{v.condition}</div>
                </div>
              </div>

              <div className="w-2/3 bg-white flex flex-col justify-between p-4">
                <div>
                  <p className="text-sm font-bold">{v.discount}</p>
                  <p className="text-xs text-gray-500">{v.description}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[12px] text-gray-400">
                    Thời hạn: {v.date}
                  </span>
                  <button className="text-white bg-gradient-to-r from-pink-500 to-pink-400 text-xs px-3 py-1 rounded-full font-semibold">
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button điều hướng phải */}
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-1 z-10">
          <ChevronRight className="w-6 h-6 text-pink-400" />
        </button>
      </div>
    </div>
  );
}
