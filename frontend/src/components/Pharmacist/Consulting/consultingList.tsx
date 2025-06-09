"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import {
    MdNavigateBefore,
    MdNavigateNext,
} from "react-icons/md";
import {FiEye} from "react-icons/fi";
import {LuBadgeCheck} from "react-icons/lu";
import {useOrder} from "@/hooks/useOrder";
import {useRouter} from "next/navigation";
import FilterBar from "./filterBar";

const ConsultingList = () => {
    const {fetchGetApproveRequestOrder, allRequestOrderApprove, totalRequestOrderApprove} = useOrder();
    const [pagination, setPagination] = useState({ page: 1, page_size: 10 });
    const [status, setStatus] = useState("");

    const totalPages = Math.ceil(totalRequestOrderApprove / pagination.page_size);
    const currentPageData = (pagination.page - 1) * pagination.page_size;
    const firstIndex = currentPageData + 1;
    const lastIndex = Math.min(currentPageData + pagination.page_size, totalRequestOrderApprove);
    const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
    const router = useRouter();

    const onPageChange = (page: number) => {
        setPagination((prevPages: any) => ({
            ...prevPages,
            page: page
        }));
    };

    const handlePageSizeChange = (size: number) => {
        setPagination((prevPages: any) => ({
            ...prevPages,
            page_size: size,
            page: 1
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(".menu-container")) {
                setMenuOpen(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchGetApproveRequestOrder(
            {
                page: pagination.page,
                page_size: pagination.page_size,
                status: status
            },
            () => {},
            (error: any) => {
                console.error("Error fetching orders:", error);
            }
        );
    }, [pagination, status]);

    return (
        <div>
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-black">
                    Danh sách yêu cầu tư vấn thuốc
                </h2>
                <div className="my-4 text-sm">
                    <Link href="/dashboard" className="hover:underline text-blue-600">
                        Dashboard
                    </Link>
                    <span> / </span>
                    <Link href="/kiem-duyet-yeu-cau-tu-van-thuoc" className="text-gray-800">
                        Danh sách yêu cầu tư vấn thuốc
                    </Link>
                </div>
                <
                    FilterBar
                    status={status}
                    onStatusChange={(status: string) => setStatus(status)} 
                />
                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
                            <tr className="uppercase text-sm">
                                <th className="py-3 pl-4">Mã yêu cầu</th>
                                <th className="py-3  ">Tên khách hàng</th>
                                <th className="py-3 ">SĐT</th>
                                <th className="py-3 ">Email</th>
                                <th className="py-3">Trạng thái</th>
                                <th className="py-3 pr-4"></th>
                            </tr>
                            </thead>

                            <tbody>
                            {allRequestOrderApprove && totalRequestOrderApprove> 0 ? (
                                allRequestOrderApprove.map((request: any, index: number) => (
                                    <tr
                                        key={request.request_id}
                                        className={`text-sm hover:bg-gray-50 transition ${
                                            index !== totalRequestOrderApprove - 1
                                                ? "border-b border-gray-200"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-4 pl-4">{request.request_id}</td>
                                        <td className="py-4 ">{request.pick_to.name}</td>
                                        <td className="py-4 ">{request.pick_to.phone_number}</td>
                                        <td className="py-4">{request.pick_to.email}</td>
                                        <td className="py-4 text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full ${
                                                    request.status === "rejected"
                                                        ? "bg-red-100 text-red-600"
                                                        : request.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : request.status === "approved"
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-blue-100 text-blue-600"
                                                }`}
                                            >
                                            {request.status === "rejected"
                                                ? "Đã từ chối"
                                                : request.status === "pending"
                                                    ? "Chờ duyệt"
                                                    : request.status === "approved"
                                                        ? "Đã duyệt"
                                                        : "Chưa liên lạc được"}
                                            </span>
                                        </td>
                                        <td className="py-4 pl-4 text-center relative">
                                            {["approved", "rejected"].includes(request.status) ? (
                                                <button
                                                    className="py-2 font-medium flex items-center gap-1 text-sm text-gray-500"
                                                    onClick={() => {
                                                        router.push(
                                                            `/kiem-duyet-yeu-cau-tu-van-thuoc?chi-tiet=${request.request_id}`
                                                        );
                                                    }}
                                                >
                                                    <FiEye className="text-gray-500 text-lg"/>
                                                    Chi tiết
                                                </button>
                                            ) : (
                                                <button
                                                    className="underline py-2 text-blue-600 font-medium rounded-lg  flex items-center gap-2 text-sm"
                                                    onClick={() => {
                                                        router.push(
                                                            `/kiem-duyet-yeu-cau-tu-van-thuoc?edit=${request.request_id}`
                                                        );
                                                    }}
                                                >
                                                    <LuBadgeCheck className="text-blue-600 text-lg"/>
                                                    Duyệt
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center text-gray-500">
                                        Không có yêu cầu nào
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    {/* Page size selector */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Hiển thị:</span>
                        <select
                            value={pagination.page_size}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>/ trang</span>
                    </div>

                    {/* Current page display */}
                    <div className="text-sm text-gray-600">
                        Hiển
                        thị {firstIndex} - {lastIndex} trong
                        tổng số {totalRequestOrderApprove} yêu cầu
                    </div>

                    {/* Page navigation */}
                    <div className="flex items-center justify-center space-x-2">
                        {/* Previous button */}
                        <button
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="text-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdNavigateBefore className="text-xl"/>
                        </button>

                        {/* Page numbers */}
                        {Array.from({length: totalPages}, (_, index) => {
                            const pageNumber = index + 1;

                            // Show page numbers with smart ellipsis
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1) ||
                                (pagination.page <= 3 && pageNumber <= 5) ||
                                (pagination.page >= totalPages - 2 && pageNumber >= totalPages - 4)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                                            pagination.page === pageNumber
                                                ? "bg-blue-700 text-white"
                                                : "text-black hover:bg-gray-200"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }

                            // Show ellipsis where needed
                            if (
                                (pageNumber === pagination.page - 2 && pagination.page > 4) ||
                                (pageNumber === pagination.page + 2 && pagination.page < totalPages - 3)
                            ) {
                                return (
                                    <span key={pageNumber} className="px-2 text-gray-500">
                                        ...
                                    </span>
                                );
                            }

                            return null;
                        })}

                        {/* Next button */}
                        <button
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page === totalPages || totalPages === 0}
                            className="text-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdNavigateNext className="text-xl"/>
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ConsultingList;

