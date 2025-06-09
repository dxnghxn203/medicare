import { call, put, takeLatest } from 'redux-saga/effects';
import * as locationService from '@/services/locationService';
import {
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
} from './locationSlice';

function* fetchGetAllCities(action: any): Generator<any, void, any> {
    try {
        const response = yield call(locationService.getAllCities);
        yield put(fetchGetAllCitiesSuccess(response));

    } catch (error) {
        yield put(fetchGetAllCitiesFailed("Failed to fetch cities"));
    }
}
function* fetchGetDistrictsByCityId(action: any): Generator<any, void, any> {
    try {
        const response = yield call(locationService.getDistrictsByCityId, action.payload);
        yield put(fetchGetDistrictsByCityIdSuccess(response));
    } catch (error) {
        yield put(fetchGetDistrictsByCityIdFailed("Failed to fetch districts"));
    }
}
function* fetchGetWardsByDistrictId(action: any): Generator<any, void, any> {
    try {
        const response = yield call(locationService.getWardsByDistrictId, action.payload);
        yield put(fetchGetWardsByDistrictIdSuccess(response));
    } catch (error) {   
        yield put(fetchGetWardsByDistrictIdFailed("Failed to fetch wards"));
    }
}
function* fetchGetLocation(action: any): Generator<any, void, any> {
    try {
        const {
            onSuccess =() => {},
            onFailed =() => {},
        } = action.payload;
        const response = yield call(locationService.getAllLocations);
        if (response.status_code === 200) {
            yield put(fetchGetLocationSuccess(response.data));
            onSuccess(response);
        }
        else {
            yield put(fetchGetLocationFailed());
            onFailed(response);
        }
    } catch (error) {
        yield put(fetchGetLocationFailed());
    }
}
function* fetchAddLocation(action: any): Generator<any, void, any> {
    try {
        const {
            location,
            onSuccess =() => {},
            onFailed =() => {},
        } = action.payload;

        const response = yield call(locationService.addLocation,location);
        if (response.status_code === 200) {
            yield put(fetchAddLocationSuccess(response));
            onSuccess();
        }
        else {
            yield put(fetchAddLocationFailed());
            onFailed(response);
        }
    } catch (error) {
        yield put(fetchAddLocationFailed());
    }
}
function* fetchUpdateLocation(action: any): Generator<any, void, any> {
    try {
        const {
            location,
            location_id,
            onSuccess =() => {},
            onFailed =() => {},
        } = action.payload;

        const response = yield call(locationService.updateLocation, location_id, location);
        if (response.status_code === 200) {
            yield put(fetchUpdateLocationSuccess(response));
            onSuccess(response);
        }
        else {
            yield put(fetchUpdateLocationFailed());
            onFailed(response);
        }
    } catch (error) {
        yield put(fetchUpdateLocationFailed());
    }
}
function* fetchDeleteLocation(action: any): Generator<any, void, any> {
    try {
        const {
            location_id,
            onSuccess =() => {},
            onFailed =() => {},
        } = action.payload;
        const response = yield call(locationService.deleteLocation, location_id);
        if (response.status_code === 200) {
            yield put(fetchDeleteLocationSuccess(response));
            onSuccess(response);
        }
        else {
            yield put(fetchDeleteLocationFailed());
            onFailed(response);
        }
    } catch (error) {
        yield put(fetchDeleteLocationFailed());
    }
}
export function* locationSaga() {
    yield takeLatest(fetchGetAllCitiesStart.type, fetchGetAllCities);
    yield takeLatest(fetchGetDistrictsByCityIdStart.type, fetchGetDistrictsByCityId);
    yield takeLatest(fetchGetWardsByDistrictIdStart.type, fetchGetWardsByDistrictId);
    yield takeLatest(fetchGetLocationStart.type, fetchGetLocation);
    yield takeLatest(fetchAddLocationStart.type, fetchAddLocation);
    yield takeLatest(fetchUpdateLocationStart.type, fetchUpdateLocation);
    yield takeLatest(fetchDeleteLocationStart.type, fetchDeleteLocation);
}
