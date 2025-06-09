

export const getLocationDefault = (default_location: string, locations: any) => {
    if (locations && locations.length > 0) {
        const locationDefaultItem = locations.find((location: any) => location.location_id === default_location);
        if (locationDefaultItem) {
            return locationDefaultItem;
        }
    }
    return null;
}