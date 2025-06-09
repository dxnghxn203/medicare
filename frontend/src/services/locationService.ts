import axiosClient from "@/utils/configs/axiosClient";

export const getAllCities = async () => {
    const response = await axiosClient.get(`/v1/location/cities`);
    return response.data;
}

export const getDistrictsByCityId = async (cityId: string) => {
    const response = await axiosClient.get(`/v1/location/districts/${cityId}`);
    return response.data;
}

export const getWardsByDistrictId = async (districtId: string) => {
    const response = await axiosClient.get(`/v1/location/wards/${districtId}`);
    return response.data;
}

export const getAllLocations = async () => {
    try{
        const response = await axiosClient.get(`/v1/location/`);
        return response;
    } catch (error) {
        return {
            error: "Failed to fetch locations",
        }
    }
}

export const addLocation = async (location: any) => {   
    try{
        const response = await axiosClient.post(`/v1/location/add`, location);
        return response;
    } catch (error) {
        return {
            error: "Failed to add location",
        }
    }
}

export const updateLocation = async (locationId: string, location: any) => {
    try{
        const response = await axiosClient.put(`/v1/location/update/${locationId}`, location);
        return response;
    } catch (error) {
        return {
            error: "Failed to update location",
        }
    }
}

export const deleteLocation = async (locationId: string) => {
    try{
        const response = await axiosClient.delete(`/v1/location/delete/${locationId}`);
        return response;
    } catch (error) {
        return {
            error: "Failed to delete location",
        }
    }
}

