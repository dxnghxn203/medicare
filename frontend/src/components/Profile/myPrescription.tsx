import { ArrowLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx"; // hoặc classnames
import { useOrder } from "@/hooks/useOrder";
import { on } from "events";
import Image from "next/image";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";

const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Đang chờ duyệt", value: "pending" },
  { label: "Chưa thể liên lạc", value: "unconnect" },
  { label: "Từ chối", value: "rejected" },
];

const MyPrescriptionComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { fetchGetRequestOrder, allRequestOrder } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchGetRequestOrder(
      (onSuccess: any) => {
        console.log("fetchGetRequestOrder", onSuccess);
      },
      (onError: any) => {
        console.log("fetchGetRequestOrder", onError);
      }
    );
  }, []);
  const countByStatus = (status: string) => {
    return (
      allRequestOrder &&
      allRequestOrder.filter((order: any) => order.status === status).length
    );
  };
  const filteredOrders = allRequestOrder.filter((request: any) => {
    const search = searchText.toLowerCase();
    const orderIdMatch = request.request_id.toLowerCase().includes(search);
    const productNameMatch = request.product.some((product: any) =>
      product.product_name.toLowerCase().includes(search)
    );
    return orderIdMatch || productNameMatch;
  });
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <h2 className="font-semibold text-lg">Đơn thuốc của tôi</h2>
        <div className="relative w-full md:w-[410px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-4 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setSelectedOrder(null);
            }}
            className={clsx(
              "pb-2 px-3 text-sm whitespace-nowrap font-medium border-b-2 transition flex items-center",
              activeTab === tab.value
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500"
            )}
          >
            {tab.label}
            <span className="ml-2 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full flex items-center justify-center">
              {tab.value === "all"
                ? allRequestOrder?.length
                : countByStatus(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {selectedOrder ? (
        <div className="bg-[#F5F7F9] rounded-lg p-4 mt-4">
          <button
            className="mb-4 text-sm text-blue-600  flex "
            onClick={() => setSelectedOrder(null)}
          >
            <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
          </button>

          <div className="border-b last:border-0 pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center ">
                <div className="">
                  <span className="font-semibold">Thông tin chung</span>
                  <div className="items-center justify-between mt-2">
                    <div className="flex-col text-sm space-y-2">
                      <div className="flex space-x-2 items-center">
                        <span className="text-gray-600"> Mã yêu cầu: </span>
                        <span className="text-sm">
                          {selectedOrder.request_id}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Trạng thái: </span>
                        <span
                          className={`text-xs font-medium rounded-full px-2 py-1 w-fit  ${
                            selectedOrder.status === "pending"
                              ? "text-yellow-500 bg-yellow-100"
                              : selectedOrder.status === "unconnect"
                              ? "text-gray-500  bg-gray-100"
                              : selectedOrder.status === "rejected"
                              ? "text-red-500 bg-red-100"
                              : selectedOrder.status === "approved"
                              ? "text-green-600 bg-green-100"
                              : "text-gray-400 bg-gray-100"
                          }`}
                        >
                          {selectedOrder.status === "pending"
                            ? "Đang chờ duyệt"
                            : selectedOrder.status === "unconnect"
                            ? "Chưa thể liên lạc"
                            : selectedOrder.status === "rejected"
                            ? "Từ chối"
                            : selectedOrder.status === "approved"
                            ? "Đã được duyệt"
                            : "Không rõ"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <FaRegUser />
                          Người nhận:
                        </span>
                        <span className="font-medium ml-1 items-center">
                          {selectedOrder.pick_to.name}
                        </span>
                        <span className="mx-1">|</span>
                        <span className="text-gray-700">
                          {selectedOrder.pick_to.phone_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 ">
                        <GrLocation className="text-gray-600" />
                        <span className="text-gray-600">Nơi giao hàng:</span>
                        <span className="font-medium block ml-1 items-center">
                          {selectedOrder.pick_to.address.address}{" "}
                          {selectedOrder.pick_to.address.ward},{" "}
                          {selectedOrder.pick_to.address.district},{" "}
                          {selectedOrder.pick_to.address.province}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    {/* Cột sản phẩm */}
                    <div className="flex flex-col gap-4 mt-4">
                      {/* Cột sản phẩm */}
                      <div className="w-full border border-gray-300 rounded-lg p-4">
                        <span className="font-semibold">
                          Thông tin sản phẩm
                        </span>
                        {selectedOrder.product?.map(
                          (product: any, index: number) => (
                            <div
                              key={product.product_id}
                              className={`flex flex-col sm:flex-row sm:items-center py-2 text-sm gap-2 ${
                                index !== selectedOrder.product.length - 1
                                  ? "border-b border-gray-300"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start gap-4 sm:w-2/3">
                                <Image
                                  src={product.images_primary}
                                  alt={product.product_name}
                                  width={70}
                                  height={70}
                                  className="rounded-lg object-cover"
                                />
                                <span className="text-sm line-clamp-3">
                                  {product.product_name}
                                </span>
                              </div>
                              <div className="sm:w-1/3 text-right">
                                x{product.quantity} {product.unit}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* Cột ảnh toa thuốc */}
                      <div className="w-full border border-gray-300 rounded-lg p-4">
                        <span className="font-semibold">Ảnh toa thuốc</span>
                        <div className="flex flex-wrap gap-4 mt-2">
                          {selectedOrder.images?.length > 0 ? (
                            selectedOrder.images.map((image: any) => (
                              <Image
                                key={image.images_id}
                                src={image.images_url}
                                alt="Ảnh toa thuốc"
                                width={140}
                                height={140}
                                className="rounded border object-cover"
                              />
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              Không có ảnh toa thuốc
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedOrder.status === "rejected" && (
                    <div className="mt-4 space-y-2 w-full md:w-1/2">
                      <span className="font-semibold">Lý do từ chối</span>
                      <textarea
                        className="w-full h-24 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 resize-none"
                        value={selectedOrder.note}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm">
            {filteredOrders
              ?.filter(
                (order: any) =>
                  activeTab === "all" || order.status === activeTab // Lọc theo trạng thái
              )
              .map((allRequestOrder: any) => (
                <div
                  key={allRequestOrder?.request_id}
                  className="bg-[#F5F7F9] rounded-lg p-4 mt-4"
                >
                  <div className="border-b last:border-0 pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center ">
                        <span
                          onClick={() => {
                            setSelectedOrder(allRequestOrder);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold mr-2 cursor-pointer"
                        >
                          {allRequestOrder?.request_id}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              allRequestOrder?.request_id
                            );
                          }}
                          className="text-gray-500 hover:text-blue-600 cursor-pointer"
                          title="Copy mã đơn hàng"
                        >
                          <MdOutlineContentCopy />
                        </button>
                      </div>
                      {activeTab === "all" && (
                        <span
                          className={`ml-2 text-sm font-medium px-2 py-1 rounded-full ${
                            allRequestOrder.status === "pending"
                              ? "bg-yellow-100 text-yellow-500"
                              : allRequestOrder.status === "unconnect"
                              ? "bg-green-100 text-green-700"
                              : allRequestOrder.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : allRequestOrder.status === "approved"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }`}
                        >
                          ●{" "}
                          {allRequestOrder.status === "pending"
                            ? "Đang chờ duyệt"
                            : allRequestOrder.status === "unconnect"
                            ? "Chưa thể liên lạc"
                            : allRequestOrder.status === "rejected"
                            ? "Từ chối"
                            : allRequestOrder.status === "approved"
                            ? "Đã được duyệt"
                            : ""}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-dashed border-gray-400 w-full my-2"></div>
                    <div className="mt-3 space-y-2.5 ">
                      <div className="flex items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <FaRegUser />
                          Người nhận:
                        </span>
                        <span className="font-medium ml-1">
                          {allRequestOrder.pick_to.name}
                        </span>
                        <span className="mx-1">|</span>
                        <span className="text-gray-700">
                          {allRequestOrder.pick_to.phone_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GrLocation className="text-gray-600" />
                        <span className="text-gray-600">Nơi giao hàng:</span>
                        <span className="font-medium block ml-1">
                          {`${allRequestOrder.pick_to.address.address}, ${allRequestOrder.pick_to.address.ward}, ${allRequestOrder.pick_to.address.district}, ${allRequestOrder.pick_to.address.province}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyPrescriptionComponent;
