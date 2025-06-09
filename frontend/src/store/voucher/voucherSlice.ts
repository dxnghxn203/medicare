import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: any = {
    allVouchers: [],
    totalVouchers: 0,
    allVoucherUser: [],
    loading: false,
    error: null,
};

export const voucherSlice = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        fetchAllVouchersStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchAllVouchersSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.allVouchers = action.payload.vouchers;
            state.totalVouchers = action.payload.total_vouchers;
        },
        fetchAllVouchersFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // add Voucher 
        fetchAddVoucherStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchAddVoucherSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
        },
        fetchAddVoucherFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // update Voucher 
        fetchUpdateVoucherStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchUpdateVoucherSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
        },
        fetchUpdateVoucherFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // delete Voucher
        fetchDeleteVoucherStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchDeleteVoucherSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
        },
        fetchDeleteVoucherFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // update status
        fetchUpdateStatusStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchUpdateStatusSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
        },
        fetchUpdateStatusFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // fetch get all voucher user
        fetchGetAllVoucherUserStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchGetAllVoucherUserSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.allVoucherUser = action.payload;
        },
        fetchGetAllVoucherUserFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

    },
});

export const {
    fetchAllVouchersStart,
    fetchAllVouchersSuccess,
    fetchAllVouchersFailure,

    fetchAddVoucherStart,
    fetchAddVoucherSuccess,
    fetchAddVoucherFailure,

    fetchUpdateVoucherStart,
    fetchUpdateVoucherSuccess,
    fetchUpdateVoucherFailure,

    fetchDeleteVoucherStart,
    fetchDeleteVoucherSuccess,
    fetchDeleteVoucherFailure,

    fetchUpdateStatusFailure,
    fetchUpdateStatusSuccess,
    fetchUpdateStatusStart,

    fetchGetAllVoucherUserStart,
    fetchGetAllVoucherUserSuccess,
    fetchGetAllVoucherUserFailure,

} = voucherSlice.actions;

export default voucherSlice.reducer;


