"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import {useToast} from "@/providers/toastProvider";
import TableVoucher from "./tableVoucher";
import {useVoucher} from "@/hooks/useVoucher";
import AddVoucherDialog from "../Dialog/addVoucherDialog";

const VoucherManagement = () => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const toast = useToast();
    const {
        allVouchers,
        totalVouchers,
        fetchAllVouchers,
        page,
        pageSize,
        setPage,
        setPageSize
    } = useVoucher();
    const [loading, setLoading] = useState(false);

    const fetchVoucher = () => {
        setLoading(true);
        try {
            fetchAllVouchers(page, pageSize, () => {
            }, () => {
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchVoucher();
    }, [page, pageSize]);

    return (
        <div>
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-black">Quản lý Voucher</h2>
                <div className="my-4 text-sm">
                    <Link href="/dashboard" className="hover:underline text-blue-600">
                        Dashboard
                    </Link>
                    <span> / </span>
                    <Link href="/quan-ly-voucher" className="text-gray-850">
                        Quản lý Voucher
                    </Link>
                </div>
                <div className="flex justify-end items-center">
                    <div
                        className="flex gap-2 px-2 py-2 rounded-lg text-sm items-center bg-blue-700 text-white cursor-pointer hover:bg-blue-800"
                        onClick={() => setIsOpenDialog(true)}
                    >
                        + Thêm voucher
                    </div>
                </div>
                {
                    loading ? (
                        <div className="flex justify-center items-center">
                            <svg
                                className="animate-spin h-5 w-5 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    strokeWidth="4"
                                    stroke="currentColor"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1h9a2.5 2.5 0 1 1-9 0z"
                                />
                            </svg>
                        </div>
                    ) : <TableVoucher
                        allVouchers={allVouchers}
                        totalVouchers={totalVouchers}
                        currentPage={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        fetchVoucher={fetchVoucher}
                    />

                }

            </div>
            <AddVoucherDialog
                isOpen={isOpenDialog}
                setIsOpen={setIsOpenDialog}
                setPage={setPage}
                page={page}
                pageSize={pageSize}
                setPageSize={setPageSize}
                fetchVoucher={fetchVoucher}
            />
        </div>
    );
};

export default VoucherManagement;
