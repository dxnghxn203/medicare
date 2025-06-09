import { useToast } from "@/providers/toastProvider";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

const QRPayment = ({ image, order_id, price, setClose }: any) => {
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const toast = useToast();
    useEffect(() => {
        if (timeLeft <= 0) {
            toast.showToast("Đơn hàng đã hết thời gian thanh toán", "error");
            setClose();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <main className="flex flex-col space-y-8 w-full">
                <div className="flex flex-col px-5 ">
                    <div className="pt-14">
                        <a
                            onClick={() => {
                                setClose()
                            }}
                            className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span>Quay lại giỏ hàng</span>
                        </a>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-2">
                        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
                            <div className="text-center mb-5">
                                <h3 className="font-semibold text-xl text-gray-800">Quét mã QR để thanh toán</h3>
                                <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
                            </div>

                            <div className="flex flex-row gap-6">
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-gray-600 font-medium">Số tiền:</p>
                                            <p className="font-bold text-blue-600 text-lg">{price?.total_price.toLocaleString("vi-VN")} VNĐ</p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-gray-600 font-medium">Mã đơn hàng:</p>
                                            <p className="font-bold text-blue-600">{order_id}</p>
                                        </div>
                                        
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
                                            <p className="text-sm text-yellow-700">
                                                <span className="font-medium">Lưu ý:</span> Vui lòng sử dụng mã đơn hàng làm nội dung chuyển khoản
                                            </p>
                                        </div>
                                        
                                        <div className="text-center mt-3">
                                            <p className="text-sm text-gray-500 mb-1">Thời gian còn lại</p>
                                            <div className="bg-gray-100 rounded-full px-4 py-2">
                                                <p className="text-xl font-mono font-bold text-blue-800">{formatTime(timeLeft)}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">Đơn hàng sẽ tự động hủy khi hết thời gian</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex justify-center items-center">
                                    <div className="border-4 border-blue-100 rounded-lg p-2 bg-white">
                                        <img
                                            src={`data:image/png;base64,${image}`}
                                            alt="QR Code"
                                            className="w-[180px] h-[180px] object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
}

export default QRPayment;