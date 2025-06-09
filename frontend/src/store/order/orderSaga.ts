import {call, put, takeLatest} from 'redux-saga/effects';
import * as orderService from '@/services/orderService';
import {
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
    fetchGetStatistics365DaysSuccess,
    fetchGetStatistics365DaysFailed,
    fetchGetStatistics365DaysStart,

    fetchRequestPrescriptionStart,
    fetchRequestPrescriptionSuccess,
    fetchRequestPrescriptionFailed,

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

    fetchGetOverviewStatisticsOrderStart,
    fetchGetOverviewStatisticsOrderSuccess,
    fetchGetOverviewStatisticsOrderFailed,

    fetchGetMonthlyRevenueStatisticsOrderStart,
    fetchGetMonthlyRevenueStatisticsOrderSuccess,
    fetchGetMonthlyRevenueStatisticsOrderFailed,

    fetchCheckVoucherStart,
    fetchCheckVoucherSuccess,
    fetchCheckVoucherFailed,

    fetchGetCategoryMonthlyRevenueStatisticsOrderStart,
    fetchGetCategoryMonthlyRevenueStatisticsOrderSuccess,
    fetchGetCategoryMonthlyRevenueStatisticsOrderFailed,

    fetchGetTypeMonthlyRevenueStatisticsOrderStart,
    fetchGetTypeMonthlyRevenueStatisticsOrderSuccess,
    fetchGetTypeMonthlyRevenueStatisticsOrderFailed,

    fetchGetMonthlyProductSoldStatisticsStart,
    fetchGetMonthlyProductSoldStatisticsSuccess,
    fetchGetMonthlyProductSoldStatisticsFailed,

    fetchGetMonthlyTopSellingProductStatisticsStart,
    fetchGetMonthlyTopSellingProductStatisticsSuccess,
    fetchGetMonthlyTopSellingProductStatisticsFailed,

    fetchGetMonthlyCountOrderStatisticsStart,
    fetchGetMonthlyCountOrderStatisticsSuccess,
    fetchGetMonthlyCountOrderStatisticsFailed
} from './orderSlice';
import {getSession, getToken} from '@/utils/cookie';

//check voucher
function* fetchCheckVoucher(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
            orderData
        } = payload;

        const session = getSession();
        const addressInfo = orderData?.addressInfo;
        const ordererInfo = orderData?.ordererInfo;
        const products = () => {
            return orderData?.product.map((item: any) => ({
                product_id: item.product_id,
                price_id: item.price_id,
                quantity: item.quantity,
            }))
        }

        const apiPayload = {
            product: products(),
            pick_from: {
                "name": "medicare",
                "phone_number": "string",
                "email": "string",
                "address": {
                    "address": "string",
                    "ward": "string",
                    "district": "string",
                    "province": "string"
                }
            },
            pick_to: {
                "name": ordererInfo?.fullName || "",
                "phone_number": ordererInfo?.phone || "",
                "email": ordererInfo?.email || "",
                "address": {
                    "address": addressInfo?.address || "",
                    "ward": addressInfo?.ward || "",
                    "district": addressInfo?.district || "",
                    "province": addressInfo?.city || ""
                }
            },
            "sender_province_code": 79,
            "sender_district_code": 765,
            "sender_commune_code": 26914,
            "receiver_province_code": addressInfo?.cityCode || 0,
            "receiver_district_code": addressInfo?.districtCode || 0,
            "receiver_commune_code": addressInfo?.wardCode || 0,
            "delivery_instruction": orderData?.note || "",
            "payment_type": orderData?.paymentMethod,
        };

        const rs = yield call(orderService.checkVoucher, apiPayload);
        if (rs.status_code === 200) {
            yield put(fetchCheckOrderSuccess(rs.data));
            if (rs?.data?.qr_code && rs?.data?.qr_code !== "") {
                onSuccess({
                    "isQR": true,
                    "message": rs.message,
                    "qr_code": rs.data.qr_code,
                    "order_id": rs.data.order_id,
                });
                return;
            }
            onSuccess({
                "isQR": false,
                "message": rs.message,
                "order_id": rs.data.order_id,
            });
            return;
        }
        onFailed(rs.message);
        yield put(fetchCheckVoucherSuccess(""));
        onFailed("test");
    } catch (error) {
        console.log(error);
        yield put(fetchCheckVoucherFailed("Failed to fetch order"));
    }
}

// get tracking code
function* fetchGetTrackingCode(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
            order_id
        } = payload;
        const rs = yield call(orderService.getTrackingOrder, order_id);
        if (rs.status_code === 200) {
            yield put(fetchGetTrackingCodeSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetTrackingCodeFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetTrackingCodeFailed());
    }
}

// cancel order
function* fetchCancelOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
            order_id
        } = payload;
        const rs = yield call(orderService.cancelOrder, order_id);
        if (rs.status_code === 200) {
            yield put(fetchCancelOrderSuccess());
            onSuccess(rs.message);
            return;
        }
        onFailed(rs.message);
        yield put(fetchCancelOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchCancelOrderFailed());
    }
}

// Check shipping fee
function* fetchCheckShippingFee(action: any): Generator<any, void, any> {

    const categorizeProducts = (allProducts: any[], outOfStockItems: { product_id: string; price_id: string }[]) => {
        const outOfStockProducts = allProducts.filter((product: any) =>
            outOfStockItems.some(
                (outOfStockItem) =>
                    outOfStockItem.product_id === product.product_id &&
                    outOfStockItem.price_id === product.price_id
            )
        );

        const availableProducts = allProducts.filter((product: any) =>
            !outOfStockItems.some(
                (outOfStockItem) =>
                    outOfStockItem.product_id === product.product_id &&
                    outOfStockItem.price_id === product.price_id
            )
        );

        return {
            outOfStockProducts,
            availableProducts,
        };
    };
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
            orderData
        } = payload;
        const addressInfo = orderData?.addressInfo;
        const ordererInfo = orderData?.ordererInfo;
        const products = () => {
            return orderData?.product.map((item: any) => ({
                product_id: item.product_id,
                price_id: item.price_id,
                quantity: item.quantity,
            }))
        }

        const apiPayload = {
            product: products(),
            pick_from: {
                "name": "medicare",
                "phone_number": "string",
                "email": "string",
                "address": {
                    "address": "string",
                    "ward": "string",
                    "district": "string",
                    "province": "string"
                }
            },
            pick_to: {
                "name": ordererInfo?.fullName || "",
                "phone_number": ordererInfo?.phone || "",
                "email": ordererInfo?.email || "",
                "address": {
                    "address": addressInfo?.address || "",
                    "ward": addressInfo?.ward || "",
                    "district": addressInfo?.district || "",
                    "province": addressInfo?.city || ""
                }
            },
            "sender_province_code": 79,
            "sender_district_code": 765,
            "sender_commune_code": 26914,
            "receiver_province_code": addressInfo?.cityCode || 0,
            "receiver_district_code": addressInfo?.districtCode || 0,
            "receiver_commune_code": addressInfo?.wardCode || 0,
            "delivery_instruction": orderData?.note || "",
            "payment_type": orderData?.paymentMethod,
            "voucher_order_id": orderData?.voucherOrderId || "",
            "voucher_delivery_id": orderData?.voucherDeliveryId || "",
        };
        const rs = yield call(orderService.checkShippingFee, apiPayload);
        if (rs.status_code === 200) {
            yield put(fetchCheckShippingFeeSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        yield put(fetchCheckShippingFeeFailed());
        let error = {
            ...rs,
            isOutOfStock: rs.status_code === 400

        }
        if (rs.status_code === 400) {
            const outOfStockIds = rs.data.out_of_stock;
            const {outOfStockProducts, availableProducts} = categorizeProducts(
                orderData?.product,
                outOfStockIds
            );

            error.data = {
                outOfStockProducts,
                availableProducts,
            };
        }
        onFailed(error);
    } catch (error) {
        console.log(error);
        yield put(fetchCheckShippingFeeFailed());
    }
}

// Call webhook
function* fetchCallWebhook(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
            data
        } = payload;
        const rs = yield call(orderService.callWebhook, data);
        console.log("🚀 ~ file: orderSaga.ts:40 ~ fetchCallWebhook ~ rs:", rs)
        if (rs.result) {
            onSuccess();
            yield put(fetchCallWebhookSuccess());
            return;
        }
        onFailed();
        yield put(fetchCallWebhookFailed());
    } catch (error) {
        yield put(fetchCallWebhookFailed());
    }
}

// Check order
function* fetchCheckOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
            orderData
        } = payload;

        const session = getSession();
        const addressInfo = orderData?.addressInfo;
        const ordererInfo = orderData?.ordererInfo;
        const products = () => {
            return orderData?.product.map((item: any) => ({
                product_id: item.product_id,
                price_id: item.price_id,
                quantity: item.quantity,
            }))
        }

        const apiPayload = {
            product: products(),
            pick_from: {
                "name": "medicare",
                "phone_number": "string",
                "email": "string",
                "address": {
                    "address": "string",
                    "ward": "string",
                    "district": "string",
                    "province": "string"
                }
            },
            pick_to: {
                "name": ordererInfo?.fullName || "",
                "phone_number": ordererInfo?.phone || "",
                "email": ordererInfo?.email || "",
                "address": {
                    "address": addressInfo?.address || "",
                    "ward": addressInfo?.ward || "",
                    "district": addressInfo?.district || "",
                    "province": addressInfo?.city || ""
                }
            },
            "sender_province_code": 79,
            "sender_district_code": 765,
            "sender_commune_code": 26914,
            "receiver_province_code": addressInfo?.cityCode || 0,
            "receiver_district_code": addressInfo?.districtCode || 0,
            "receiver_commune_code": addressInfo?.wardCode || 0,
            "delivery_instruction": orderData?.note || "",
            "payment_type": orderData?.paymentMethod,
            "voucher_order_id": orderData?.voucherOrderId || "",
            "voucher_delivery_id": orderData?.voucherDeliveryId || "",
        };

        const rs = yield call(orderService.checkOrder, apiPayload, session);
        if (rs.status_code === 200) {
            yield put(fetchCheckOrderSuccess(rs.data));
            if (rs?.data?.qr_code && rs?.data?.qr_code !== "") {
                onSuccess({
                    "isQR": true,
                    "message": rs.message,
                    "qr_code": rs.data.qr_code,
                    "order_id": rs.data.order_id,
                });
                return;
            }
            onSuccess({
                "isQR": false,
                "message": rs.message,
                "order_id": rs.data.order_id,
            });
            return;
        }
        onFailed(rs.message);
        yield put(fetchCheckOrderSuccess(""));
        onFailed("test");
    } catch (error) {
        console.log(error);
        yield put(fetchCheckOrderFailed("Failed to fetch order"));
    }
}

function* fetchGetAllOrderAdmin(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const product = yield call(orderService.getAllOrderAdmin, payload);
        if (product.status_code === 200) {
            yield put(fetchGetAllOrderAdminSuccess(product.data));
            return;
        }
        yield put(fetchGetAllOrderAdminFailed());
    } catch (error) {
        yield put(fetchGetAllOrderAdminFailed());
    }
}

//
// Get order by user
function* fetchGetOrderByUser(action: any): Generator<any, void, any> {
    try {
        const product = yield call(orderService.getOrderByUserId);
        if (product.status_code === 200) {
            yield put(fetchGetOrderByUserSuccess(product.data));
            return;
        }
        yield put(fetchGetOrderByUserFailed());
    } catch (error) {
        yield put(fetchGetOrderByUserFailed());
    }
}

function* fetchDownloadInvoice(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },
            order_id
        } = payload;
        const blob = yield call(orderService.downloadInvoice, order_id);

        if (blob) {
            yield put(fetchDownloadInvoiceSuccess(blob));
            onSuccess(blob); // truyền blob vào success callback
            return;
        }
        onFailed(blob.message);
        yield put(fetchDownloadInvoiceFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchDownloadInvoiceFailed());
    }
}

function* fetchGetStatistics365Days(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailed = () => {
            },

        } = payload;
        const rs = yield call(orderService.getStatistics365Days);
        if (rs.status_code === 200) {
            yield put(fetchGetStatistics365DaysSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetStatistics365DaysFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetStatistics365DaysFailed());
    }
}

function* fetchUserRequestPrescription(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            formData,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        console.log("formData", formData)
        const rs = yield call(orderService.userRequestPrescription, formData);

        if (rs.status_code === 200) {
            yield put(fetchRequestPrescriptionSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchRequestPrescriptionFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchRequestPrescriptionFailed());
    }
}

function* fetchGetRequestOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getRequestOrder);
        if (rs.status_code === 200) {
            yield put(fetchGetRequestOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetRequestOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetRequestOrderFailed());
    }
}

function* fetchGetApproveRequestOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            data,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getApproveRequestOrder, data);
        if (rs.status_code === 200) {
            yield put(fetchGetApproveRequestOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetApproveRequestOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetApproveRequestOrderFailed());
    }
}

function* fetchApproveRequestOrder(action: any): Generator<any, void, any> {
    try {
        // console.log("action", action);
        const {payload} = action;
        const {
            body,
            bodyReject,

            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.approveRequestOrder, body || bodyReject);
        console.log("sagaa", body || bodyReject)
        if (rs.status_code === 200) {
            yield put(fetchApproveRequestOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchApproveRequestOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchApproveRequestOrderFailed());
    }
}

function* fetchCheckFeeApproveRequestOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            body,
            onSuccess = () => {
            },
            onFailed = () => {
            },
        } = payload;
        const rs = yield call(orderService.checkFeeApproveRequestOrder, body);
        console.log("sagaa", body)
        if (rs.status_code === 200) {
            yield put(fetchCheckFeeApproveRequestOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchCheckFeeApproveRequestOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchCheckFeeApproveRequestOrderFailed());
    }
}

function* fetchGetOverviewStatisticsOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getOverviewStatisticsOrder);
        if (rs.status_code === 200) {
            yield put(fetchGetOverviewStatisticsOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetOverviewStatisticsOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetOverviewStatisticsOrderFailed());
    }
}

function* fetchGetMonthlyRevenueStatisticsOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            year,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getMonthlyRevenueStatisticsOrder, year);
        if (rs.status_code === 200) {
            yield put(fetchGetMonthlyRevenueStatisticsOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetMonthlyRevenueStatisticsOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetMonthlyRevenueStatisticsOrderFailed());
    }
}

function* fetchGetCategoryMonthlyRevenueStatisticsOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            month,
            year,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getCategoryMonthlyRevenueStatisticsOrder, month, year);
        if (rs.status_code === 200) {
            yield put(fetchGetCategoryMonthlyRevenueStatisticsOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetCategoryMonthlyRevenueStatisticsOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetCategoryMonthlyRevenueStatisticsOrderFailed());
    }
}

function* fetchGetTypeMonthlyRevenueStatisticsOrder(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            month,
            year,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getTypeMonthlyRevenueStatisticsOrder, month, year);
        if (rs.status_code === 200) {
            yield put(fetchGetTypeMonthlyRevenueStatisticsOrderSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetTypeMonthlyRevenueStatisticsOrderFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetTypeMonthlyRevenueStatisticsOrderFailed());
    }
}

function* fetchGetMonthlyProductSoldStatistics(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            year,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getMonthlyProductSoldStatistics, year);
        if (rs.status_code === 200) {
            yield put(fetchGetMonthlyProductSoldStatisticsSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetMonthlyProductSoldStatisticsFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetMonthlyProductSoldStatisticsFailed());
    }
}

function* fetchGetMonthlyTopSellingProductStatistics(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            month,
            year,
            top_n,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getMonthlyTopSellingProductStatistics, month, year, top_n);
        if (rs.status_code === 200) {
            yield put(fetchGetMonthlyTopSellingProductStatisticsSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetMonthlyTopSellingProductStatisticsFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetMonthlyTopSellingProductStatisticsFailed());
    }
}

function* fetchGetMonthlyCountOrderStatistics(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            year,
            onSuccess = (message: any) => {
            },
            onFailed = (message: any) => {
            },
        } = payload;
        const rs = yield call(orderService.getMonthlyCountOrderStatistics, year);
        if (rs.status_code === 200) {
            yield put(fetchGetMonthlyCountOrderStatisticsSuccess(rs.data));
            onSuccess(rs.data);
            return;
        }
        onFailed(rs.message);
        yield put(fetchGetMonthlyCountOrderStatisticsFailed());
    } catch (error) {
        console.log(error);
        yield put(fetchGetMonthlyCountOrderStatisticsFailed());
    }
}

export function* orderSaga() {
    yield takeLatest(fetchCheckOrderStart.type, fetchCheckOrder);
    yield takeLatest(fetchGetAllOrderAdminStart.type, fetchGetAllOrderAdmin);
    yield takeLatest(fetchGetOrderByUserStart.type, fetchGetOrderByUser);
    yield takeLatest(fetchCallWebhookStart.type, fetchCallWebhook);
    yield takeLatest(fetchCheckShippingFeeStart.type, fetchCheckShippingFee);
    yield takeLatest(fetchCancelOrderStart.type, fetchCancelOrder);
    yield takeLatest(fetchGetTrackingCodeStart.type, fetchGetTrackingCode);
    yield takeLatest(fetchDownloadInvoiceStart.type, fetchDownloadInvoice);
    yield takeLatest(fetchGetStatistics365DaysStart.type, fetchGetStatistics365Days);
    yield takeLatest(fetchRequestPrescriptionStart.type, fetchUserRequestPrescription);
    yield takeLatest(fetchGetRequestOrderStart.type, fetchGetRequestOrder);
    yield takeLatest(fetchGetApproveRequestOrderStart.type, fetchGetApproveRequestOrder);
    yield takeLatest(fetchApproveRequestOrderStart.type, fetchApproveRequestOrder);
    yield takeLatest(fetchCheckFeeApproveRequestOrderStart.type, fetchCheckFeeApproveRequestOrder);
    yield takeLatest(fetchGetOverviewStatisticsOrderStart.type, fetchGetOverviewStatisticsOrder);
    yield takeLatest(fetchGetMonthlyRevenueStatisticsOrderStart.type, fetchGetMonthlyRevenueStatisticsOrder);
    yield takeLatest(fetchGetCategoryMonthlyRevenueStatisticsOrderStart.type, fetchGetCategoryMonthlyRevenueStatisticsOrder);
    yield takeLatest(fetchGetTypeMonthlyRevenueStatisticsOrderStart.type, fetchGetTypeMonthlyRevenueStatisticsOrder);
    yield takeLatest(fetchGetMonthlyProductSoldStatisticsStart.type, fetchGetMonthlyProductSoldStatistics);
    yield takeLatest(fetchGetMonthlyTopSellingProductStatisticsStart.type, fetchGetMonthlyTopSellingProductStatistics);
    yield takeLatest(fetchGetMonthlyCountOrderStatisticsStart.type, fetchGetMonthlyCountOrderStatistics);
}
