import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {all} from "axios";
import {fetchGetAllAdminFailure} from "../user";

const initialState: any = {
    loading: false,
    error: null,
};

export const documentSlice = createSlice({
    name: "document",
    initialState,
    reducers: {
        fetchDocumentByRequestIdStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchDocumentByRequestIdSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
        },
        fetchDocumentByRequestIdFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchDocumentByRequestIdStart,
    fetchDocumentByRequestIdSuccess,
    fetchDocumentByRequestIdFailure,
} = documentSlice.actions;

export default documentSlice.reducer;


