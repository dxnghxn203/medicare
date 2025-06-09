import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface OrderState {
    ordersAdmin: any[];
    totalOrderAdmin: number;
    countStatusOrder: any;
    ordersByUser: any[];
    statistics365Days: any[];
    allRequestOrder: any[];
    allRequestOrderApprove: any[];
    totalRequestOrderApprove: number;
    overviewStatisticsOrder: any;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    ordersAdmin: [],
    totalOrderAdmin: 0,
    countStatusOrder: null,
    ordersByUser: [],
    statistics365Days: [],
    allRequestOrder: [],
    allRequestOrderApprove: [],
    totalRequestOrderApprove: 0,
    overviewStatisticsOrder: null,
    loading: false,
    error: null,
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        // check order
        fetchCheckOrderStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCheckOrderSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.error = null;
        },
        fetchCheckOrderFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        //check voucher
        fetchCheckVoucherStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCheckVoucherSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.error = null;
        },
        fetchCheckVoucherFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // 
        fetchGetAllOrderAdminStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetAllOrderAdminSuccess(state, action: PayloadAction<any>) {
            state.ordersAdmin = action.payload.orders;
            state.totalOrderAdmin = action.payload.total_orders;
            state.countStatusOrder = action.payload.status_counts;
            state.loading = false;
        },
        fetchGetAllOrderAdminFailed(state) {
            state.loading = false;
        },
        // get order by user
        fetchGetOrderByUserStart(state) {
            state.loading = true;
        },
        fetchGetOrderByUserSuccess(state, action: PayloadAction<any[]>) {
            state.ordersByUser = action.payload
            state.loading = false;
        },
        fetchGetOrderByUserFailed(state) {
            state.loading = false;
        },
        // call webhook
        fetchCallWebhookStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCallWebhookSuccess(state) {
            state.loading = false;
        },
        fetchCallWebhookFailed(state) {
            state.loading = false;
        },
        // check shipping fee
        fetchCheckShippingFeeStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCheckShippingFeeSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
        },
        fetchCheckShippingFeeFailed(state) {
            state.loading = false;
        },
        //cancel order
        fetchCancelOrderStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCancelOrderSuccess(state) {
            state.loading = false;
        },
        fetchCancelOrderFailed(state) {
            state.loading = false;
        },
        //get tracking code
        fetchGetTrackingCodeStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetTrackingCodeSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
        },
        fetchGetTrackingCodeFailed(state) {
            state.loading = false;
        },

        // download invoice
        fetchDownloadInvoiceStart(state, action: PayloadAction<any>) {
            console.log('fetchDownloadInvoiceStart')
            state.loading = true;
        },
        fetchDownloadInvoiceSuccess(state, action: PayloadAction<any>) {
            console.log('fetchDownloadInvoiceSuccess')
            state.loading = false;
        },
        fetchDownloadInvoiceFailed(state) {
            console.log('fetchDownloadInvoiceFailed')
            state.loading = false;
        },

        // statistics365days
        fetchGetStatistics365DaysStart(state, action: PayloadAction<any>) {
            console.log('fetchGetStatistics365DaysStart')
            state.loading = true;
        },
        fetchGetStatistics365DaysSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetStatistics365DaysSuccess')
            state.statistics365Days = action.payload
            state.loading = false;
        },
        fetchGetStatistics365DaysFailed(state) {
            console.log('fetchGetStatistics365DaysFailed')
            state.loading = false;
        },
        // fetch request prescription
        fetchRequestPrescriptionStart(state, action: PayloadAction<any>) {

            state.loading = true;
        },
        fetchRequestPrescriptionSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
        },
        fetchRequestPrescriptionFailed(state) {
            state.loading = false;
        },
        // fetch get request-order
        fetchGetRequestOrderStart(state, action: PayloadAction<any>) {
            // console.log('fetchGetRequestOrderStart')
            state.loading = true;
        },
        fetchGetRequestOrderSuccess(state, action: PayloadAction<any>) {
            // console.log('fetchGetRequestOrderSuccess')
            state.allRequestOrder = action.payload
            state.loading = false;
        },
        fetchGetRequestOrderFailed(state) {
            // console.log('fetchGetRequestOrderFailed')
            state.loading = false;
        },
        // fetch get approve request-order
        fetchGetApproveRequestOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchGetApproveRequestOrderStart')
            state.loading = true;
        },
        fetchGetApproveRequestOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetApproveRequestOrderSuccess')
            state.allRequestOrderApprove = action.payload.orders;
            state.totalRequestOrderApprove = action.payload.total_orders;
            state.loading = false;
            state.error = null;

        },
        fetchGetApproveRequestOrderFailed(state) {
            console.log('fetchGetApproveRequestOrderFailed')
            state.loading = false;
            state.error = null;
        },
        // fetch approve request-order
        fetchApproveRequestOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchApproveRequestOrderStart')
            state.loading = true;
        },
        fetchApproveRequestOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchApproveRequestOrderSuccess')
            state.loading = false;
            state.error = null;
        },
        fetchApproveRequestOrderFailed(state) {
            console.log('fetchApproveRequestOrderFailed')
            state.loading = false;
            state.error = null;
        },
        // fetch check fee approve request-order
        fetchCheckFeeApproveRequestOrderStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCheckFeeApproveRequestOrderSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.error = null;
        },
        fetchCheckFeeApproveRequestOrderFailed(state) {
            state.loading = false;
            state.error = null;
        },

        // fetch get overview statistics order
        fetchGetOverviewStatisticsOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchGetOverviewStatisticsOrderStart')
            state.loading = true;
        },
        fetchGetOverviewStatisticsOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetOverviewStatisticsOrderSuccess')
            state.overviewStatisticsOrder = action.payload;
            state.loading = false;
            state.error = null;

        },

        fetchGetOverviewStatisticsOrderFailed(state) {
            console.log('fetchGetOverviewStatisticsOrderFailed')
            state.loading = false;
            state.error = null;
        },

        // fetch get monthly revenue statistics order
        fetchGetMonthlyRevenueStatisticsOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyRevenueStatisticsOrderStart')
            state.loading = true;
        },
        fetchGetMonthlyRevenueStatisticsOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyRevenueStatisticsOrderSuccess')
            state.loading = false;
            state.error = null;

        },
        fetchGetMonthlyRevenueStatisticsOrderFailed(state) {
            console.log('fetchGetMonthlyRevenueStatisticsOrderFailed')
            state.loading = false;
            state.error = null;
        },

        // fetch get category monthly revenue statistics order
        fetchGetCategoryMonthlyRevenueStatisticsOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchGetCategoryMonthlyRevenueStatisticsOrderStart')
            state.loading = true;
        },
        fetchGetCategoryMonthlyRevenueStatisticsOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetCategoryMonthlyRevenueStatisticsOrderSuccess')
            state.loading = false;
            state.error = null;

        },
        fetchGetCategoryMonthlyRevenueStatisticsOrderFailed(state) {
            console.log('fetchGetCategoryMonthlyRevenueStatisticsOrderFailed')
            state.loading = false;
            state.error = null;
        },

        // fetch get type monthly revenue statistics order
        fetchGetTypeMonthlyRevenueStatisticsOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchGetTypeMonthlyRevenueStatisticsOrderStart')
            state.loading = true;
        },
        fetchGetTypeMonthlyRevenueStatisticsOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetTypeMonthlyRevenueStatisticsOrderSuccess')
            state.loading = false;
            state.error = null;

        },
        fetchGetTypeMonthlyRevenueStatisticsOrderFailed(state) {
            console.log('fetchGetTypeMonthlyRevenueStatisticsOrderFailed')
            state.loading = false;
            state.error = null;
        },

        // fetch get monthly product sold statistics
        fetchGetMonthlyProductSoldStatisticsStart(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyProductSoldStatisticsStart')
            state.loading = true;
        },
        fetchGetMonthlyProductSoldStatisticsSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyProductSoldStatisticsSuccess')
            state.loading = false;
            state.error = null;

        },
        fetchGetMonthlyProductSoldStatisticsFailed(state) {
            console.log('fetchGetMonthlyProductSoldStatisticsFailed')
            state.loading = false;
            state.error = null;
        },

        // fetch get monthly top selling product statistics
        fetchGetMonthlyTopSellingProductStatisticsStart(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyTopSellingProductStatisticsStart')
            state.loading = true;
        },
        fetchGetMonthlyTopSellingProductStatisticsSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyTopSellingProductStatisticsSuccess')
            state.loading = false;
            state.error = null;

        },
        fetchGetMonthlyTopSellingProductStatisticsFailed(state) {
            console.log('fetchGetMonthlyTopSellingProductStatisticsFailed')
            state.loading = false;
            state.error = null;
        },

        // fetch get monthly count order statistics
        fetchGetMonthlyCountOrderStatisticsStart(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyCountOrderStatisticsStart')
            state.loading = true;
        },
        fetchGetMonthlyCountOrderStatisticsSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetMonthlyCountOrderStatisticsSuccess')
            state.loading = false;
            state.error = null;

        },
        fetchGetMonthlyCountOrderStatisticsFailed(state) {
            console.log('fetchGetMonthlyCountOrderStatisticsFailed')
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    fetchCheckOrderStart,
    fetchCheckOrderSuccess,
    fetchCheckOrderFailed,

    fetchGetAllOrderAdminStart,
    fetchGetAllOrderAdminSuccess,
    fetchGetAllOrderAdminFailed,

    fetchGetOrderByUserStart,
    fetchGetOrderByUserSuccess,
    fetchGetOrderByUserFailed,

    fetchCallWebhookStart,
    fetchCallWebhookSuccess,
    fetchCallWebhookFailed,

    fetchCheckShippingFeeStart,
    fetchCheckShippingFeeSuccess,
    fetchCheckShippingFeeFailed,

    fetchCancelOrderStart,
    fetchCancelOrderSuccess,
    fetchCancelOrderFailed,

    fetchGetTrackingCodeStart,
    fetchGetTrackingCodeSuccess,
    fetchGetTrackingCodeFailed,

    fetchDownloadInvoiceFailed,
    fetchDownloadInvoiceStart,
    fetchDownloadInvoiceSuccess,

    fetchGetStatistics365DaysFailed,
    fetchGetStatistics365DaysStart,
    fetchGetStatistics365DaysSuccess,

    fetchRequestPrescriptionFailed,
    fetchRequestPrescriptionStart,
    fetchRequestPrescriptionSuccess,

    fetchGetRequestOrderFailed,
    fetchGetRequestOrderStart,
    fetchGetRequestOrderSuccess,

    fetchGetApproveRequestOrderFailed,
    fetchGetApproveRequestOrderStart,
    fetchGetApproveRequestOrderSuccess,

    fetchApproveRequestOrderFailed,
    fetchApproveRequestOrderStart,
    fetchApproveRequestOrderSuccess,

    fetchCheckFeeApproveRequestOrderFailed,
    fetchCheckFeeApproveRequestOrderStart,
    fetchCheckFeeApproveRequestOrderSuccess,

    fetchGetOverviewStatisticsOrderFailed,
    fetchGetOverviewStatisticsOrderStart,
    fetchGetOverviewStatisticsOrderSuccess,

    fetchGetMonthlyRevenueStatisticsOrderFailed,
    fetchGetMonthlyRevenueStatisticsOrderStart,
    fetchGetMonthlyRevenueStatisticsOrderSuccess,

    fetchCheckVoucherStart,
    fetchCheckVoucherSuccess,
    fetchCheckVoucherFailed,

    fetchGetCategoryMonthlyRevenueStatisticsOrderFailed,
    fetchGetCategoryMonthlyRevenueStatisticsOrderStart,
    fetchGetCategoryMonthlyRevenueStatisticsOrderSuccess,

    fetchGetTypeMonthlyRevenueStatisticsOrderFailed,
    fetchGetTypeMonthlyRevenueStatisticsOrderStart,
    fetchGetTypeMonthlyRevenueStatisticsOrderSuccess,

    fetchGetMonthlyProductSoldStatisticsFailed,
    fetchGetMonthlyProductSoldStatisticsStart,
    fetchGetMonthlyProductSoldStatisticsSuccess,

    fetchGetMonthlyTopSellingProductStatisticsFailed,
    fetchGetMonthlyTopSellingProductStatisticsStart,
    fetchGetMonthlyTopSellingProductStatisticsSuccess,

    fetchGetMonthlyCountOrderStatisticsFailed,
    fetchGetMonthlyCountOrderStatisticsStart,
    fetchGetMonthlyCountOrderStatisticsSuccess,

} = orderSlice.actions;

export default orderSlice.reducer;


