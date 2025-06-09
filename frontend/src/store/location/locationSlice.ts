import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    cities: any[];
    districts: any[];
    wards: any[];
    location: any[];
    loading: boolean;
    error: string | null;
}

const initialState: LocationState = {
    cities: [],
    districts: [],
    location: [],
    wards: [],
    loading: false,
    error: null,
};

export const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        fetchGetAllCitiesStart(state) {
            state.loading = true;
        },
        fetchGetAllCitiesSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.cities = action.payload;
        }
        ,
        fetchGetAllCitiesFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
        ,
        fetchGetDistrictsByCityIdStart(state, action: PayloadAction<string>) {
            state.loading = true;
        },
        fetchGetDistrictsByCityIdSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.districts = action.payload;
        }
        ,
        fetchGetDistrictsByCityIdFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
        ,
        fetchGetWardsByDistrictIdStart(state, action: PayloadAction<string>) {
            state.loading = true;
        }
        ,
        fetchGetWardsByDistrictIdSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.wards = action.payload;
        }
        ,
        fetchGetWardsByDistrictIdFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        //get location
        fetchGetLocationStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },  
        fetchGetLocationSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.location = action.payload;
        },
        fetchGetLocationFailed(state) {
            state.loading = false;
        },
        // add location
        fetchAddLocationStart(state, action: PayloadAction<any>) {
            state.loading = true;
        }
        ,
        fetchAddLocationSuccess(state) {
            state.loading = false;
        }
        ,
        fetchAddLocationFailed(state) {
            state.loading = false;
        }
        // update location
        ,
        fetchUpdateLocationStart(state, action: PayloadAction<any>) {
            state.loading = true;
        }
        ,
        fetchUpdateLocationSuccess(state) {
            state.loading = false;
        }
        ,
        fetchUpdateLocationFailed(state) {
            state.loading = false;
        }
        // delete location
        ,
        fetchDeleteLocationStart(state, action: PayloadAction<any>) {
            state.loading = true;
        }
        ,
        fetchDeleteLocationSuccess(state) {
            state.loading = false;
        }
        ,
        fetchDeleteLocationFailed(state) {
            state.loading = false;
        }
    }
});

export const {
    fetchGetAllCitiesStart,
    fetchGetAllCitiesSuccess,
    fetchGetAllCitiesFailed,
    fetchGetDistrictsByCityIdStart,
    fetchGetDistrictsByCityIdSuccess,
    fetchGetDistrictsByCityIdFailed,
    fetchGetWardsByDistrictIdStart,
    fetchGetWardsByDistrictIdSuccess,
    fetchGetWardsByDistrictIdFailed,

    fetchGetLocationStart,
    fetchGetLocationSuccess,
    fetchGetLocationFailed,
    fetchAddLocationStart,
    fetchAddLocationSuccess,
    fetchAddLocationFailed,
    fetchUpdateLocationStart,
    fetchUpdateLocationSuccess,
    fetchUpdateLocationFailed,
    fetchDeleteLocationStart,
    fetchDeleteLocationSuccess,
    fetchDeleteLocationFailed,
} = locationSlice.actions;

export default locationSlice.reducer;


