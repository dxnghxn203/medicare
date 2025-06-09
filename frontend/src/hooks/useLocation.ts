import { fetchAddLocationStart, fetchGetAllCitiesStart, fetchGetDistrictsByCityIdStart, fetchGetLocationStart, fetchGetWardsByDistrictIdStart, fetchUpdateLocationStart, selectCities, selectDistricts, selectLocationData, selectWards } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export function useLocation() {
    const dispatch = useDispatch();
    const cities = useSelector(selectCities);
    const districts = useSelector(selectDistricts);
    const wards = useSelector(selectWards);
    const allLocation = useSelector(selectLocationData)

    const getCities = async () => {
        dispatch(fetchGetAllCitiesStart());
    }
    const getDistrictsByCityId = async (cityId: string) => {
        dispatch(fetchGetDistrictsByCityIdStart(cityId));
    }
    const getWardsByDistrictId = async (districtId: string) => {
        dispatch(fetchGetWardsByDistrictIdStart(districtId));
    }

    const getAllLocation = async (onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchGetLocationStart({
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const addLocation = async (location: any, onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchAddLocationStart({
            location: location,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }
    const updateLocation = async (
        location_id: any,
        location: any,
        onSuccess: () => void,
        onFailed: () => void) => {
        dispatch(fetchUpdateLocationStart({
            location_id: location_id,
            location: location,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    return {
        cities,
        districts,
        wards,
        getDistrictsByCityId,
        getCities,
        getWardsByDistrictId,
        getAllLocation,
        allLocation,
        addLocation,
        updateLocation
    }
}

