import {useDispatch, useSelector} from 'react-redux';
import {selectAllVoucher, selectAllVoucherUser, selectTotalVoucher} from "@/store/voucher/voucherSelector";
import {
    fetchAddVoucherStart,
    fetchUpdateVoucherStart,
    fetchAllVouchersStart,
    fetchDeleteVoucherStart,
    fetchGetAllVoucherUserStart,
    fetchUpdateStatusStart
} from '@/store';
import { useState } from 'react';


export function useVoucher() {
    const dispatch = useDispatch();
    const allVouchers = useSelector(selectAllVoucher);
    const totalVouchers = useSelector(selectTotalVoucher)
    const allVoucherUser = useSelector(selectAllVoucherUser);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const fetchAllVouchers = (page: any, page_size: any, onSuccess: () => void, onFailure: () => void,) => {
        dispatch(fetchAllVouchersStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                page: page,
                page_size: page_size,
            }
        ));
    };
    const fetchAddVoucher = (params: any, onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchAddVoucherStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                ...params,
            }
        ));
    }
    const fetchUpdateVoucher = (params: any, onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchUpdateVoucherStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                ...params,
            }
        ));
    }
    const fetchDeleteVoucher = (voucher_id: any, onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchDeleteVoucherStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                voucher_id: voucher_id,
            }
        ));
    }

    const fetchUpdateStatusVoucher = (params: {
        voucher_id: string;
        status_voucher: boolean
    }, onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchUpdateStatusStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                ...params
            }
        ));
    }

    const fetchGetAllVoucherUser = (onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchGetAllVoucherUserStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
            }
        ));
    }


    return {
        allVouchers,
        totalVouchers,
        fetchAllVouchers,
        fetchAddVoucher,
        fetchUpdateVoucher,
        fetchDeleteVoucher,
        fetchUpdateStatusVoucher,
        allVoucherUser,
        fetchGetAllVoucherUser,
        page,
        setPage,
        pageSize,
        setPageSize
    };
}

