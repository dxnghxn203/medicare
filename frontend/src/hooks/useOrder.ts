import {
    fetchCallWebhookStart, fetchCancelOrderStart, fetchCheckOrderStart,
    fetchCheckShippingFeeStart, fetchGetAllOrderAdminStart,
    fetchGetOrderByUserStart, selectAllOrderAdmin, selectOrdersByUser,
    fetchGetTrackingCodeStart, fetchDownloadInvoiceStart, fetchGetStatistics365DaysStart,
    fetchRequestPrescriptionStart, fetchGetRequestOrderStart, fetchGetApproveRequestOrderStart,
    fetchApproveRequestOrderStart, fetchGetOverviewStatisticsOrderStart,
    fetchGetMonthlyRevenueStatisticsOrderStart, fetchGetCategoryMonthlyRevenueStatisticsOrderStart,
    fetchGetTypeMonthlyRevenueStatisticsOrderStart, fetchGetMonthlyProductSoldStatisticsStart,
    fetchGetMonthlyTopSellingProductStatisticsStart, fetchGetMonthlyCountOrderStatisticsStart,
    selectTotalOrderAdmin,
    selectCountStatusOrder,
    selectTotalRequestOrderApprove,
    selectStatistics365Days,
    selectAllRequestOrder,
    selectAllRequestOrderApprove,
    selectOverviewStatisticOrder,
    fetchCheckFeeApproveRequestOrderStart
} from "@/store/order";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";


export function useOrder() {
    const dispatch = useDispatch();
    const allOrderAdmin = useSelector(selectAllOrderAdmin);
    const totalOrderAdmin = useSelector(selectTotalOrderAdmin);
    const countStatusOrder = useSelector(selectCountStatusOrder);
    const ordersUser = useSelector(selectOrdersByUser);
    const statistics365Days = useSelector(selectStatistics365Days);
    const allRequestOrder = useSelector(selectAllRequestOrder);
    const allRequestOrderApprove = useSelector(selectAllRequestOrderApprove);
    const totalRequestOrderApprove = useSelector(selectTotalRequestOrderApprove);
    const overviewStatisticsOrder = useSelector(selectOverviewStatisticOrder);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getTrackingCode = async (order_id: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchGetTrackingCodeStart({
            order_id: order_id,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const checkOrder = async (data: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchCheckOrderStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const checkShippingFee = async (data: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchCheckShippingFeeStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const cancelOrder = async (order_id: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchCancelOrderStart({
            order_id: order_id,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const getAllOrdersAdmin = async (status: any = undefined) => {
        console.log("status", status)
        const payload: any = {
            page: page,
            page_size: pageSize
        }
        if (status) {
            payload.status = status
        }
        dispatch(fetchGetAllOrderAdminStart(payload))
    };
    const getOrdersByUser = async () => {
        dispatch(fetchGetOrderByUserStart())
    }
    const callWebHook = async (data: any, onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchCallWebhookStart({
            data: data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const downloadInvoice = async (order_id: any, onSuccess: (blob: any) => void, onFailed: () => void) => {
        dispatch(fetchDownloadInvoiceStart({
            order_id,
            onSuccess,
            onFailed,
        }));
    }

    const allStatistics365Days = async (onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchGetStatistics365DaysStart({
            onSuccess,
            onFailed,

        }))
    }

    const fetchRequestPrescription = async (
        data: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        console.log(data, "hook");
        dispatch(fetchRequestPrescriptionStart({
            formData: data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }


    const fetchGetRequestOrder = async (onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetRequestOrderStart({

            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }
    const fetchGetApproveRequestOrder = async (
        data: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void) => {
        dispatch(fetchGetApproveRequestOrderStart({
            data: data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchApproveRequestOrder = async (data: any, onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchApproveRequestOrderStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchCheckFeeApproveRequestOrder = async (data: any, onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchCheckFeeApproveRequestOrderStart({
            body: data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetOverviewSatisticsOrder = async (onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetOverviewStatisticsOrderStart({

            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetMonthlyRevenueStatisticsOrder = async (year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetMonthlyRevenueStatisticsOrderStart({
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetCategoryMonthlyRevenueStatisticsOrder = async (month: number, year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetCategoryMonthlyRevenueStatisticsOrderStart({
            month: month,
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetTypeMonthlyRevenueStatisticsOrder = async (month: number, year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetTypeMonthlyRevenueStatisticsOrderStart({
            month: month,
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetMonthlyProductSoldStatistics = async (year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetMonthlyProductSoldStatisticsStart({
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetMonthlyTopSellingProductStatistics = async (month: number, year: number, top_n: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetMonthlyTopSellingProductStatisticsStart({
            month: month,
            year: year,
            top_n: top_n,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetMonthlyCountOrderProductStatistics = async (year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetMonthlyCountOrderStatisticsStart({
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    return {
        checkOrder,
        getAllOrdersAdmin,
        allOrderAdmin,
        totalOrderAdmin,
        countStatusOrder,
        page,
        setPage,
        pageSize,
        setPageSize,
        ordersUser,
        getOrdersByUser,
        callWebHook,
        checkShippingFee,
        cancelOrder,
        getTrackingCode,
        downloadInvoice,

        allStatistics365Days,
        statistics365Days,
        fetchRequestPrescription,
        fetchGetRequestOrder,
        allRequestOrder,

        fetchGetApproveRequestOrder,
        allRequestOrderApprove,
        totalRequestOrderApprove,
        fetchApproveRequestOrder,
        fetchCheckFeeApproveRequestOrder,

        fetchGetOverviewSatisticsOrder,
        overviewStatisticsOrder,

        fetchGetMonthlyRevenueStatisticsOrder,

        fetchGetCategoryMonthlyRevenueStatisticsOrder,

        fetchGetTypeMonthlyRevenueStatisticsOrder,

        fetchGetMonthlyProductSoldStatistics,

        fetchGetMonthlyTopSellingProductStatistics,

        fetchGetMonthlyCountOrderProductStatistics
    }
}

