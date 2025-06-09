
export const selectLocation = (state: any) => state.location;
export const selectCities = (state: any) => state.location.cities;
export const selectDistricts = (state: any) => state.location.districts;
export const selectWards = (state: any) => state.location.wards;
export const selectLoading = (state: any) => state.location.loading;
export const selectError = (state: any) => state.location.error;
export const selectLocationData = (state: any) => state.location.location;