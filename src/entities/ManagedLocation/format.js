import { managedLocationsModel } from 'entities/ManagedLocation/model';

const format = {
    model: managedLocationsModel,
    format(data) {
        const newData = [];
        data.forEach(location => {
            newData.push({
                ...location,
                address: format.getAddressObjFromGeoLocation(location.geoLocation),
                locationType: location.type,
            });
        });
        const formattedModel = newData;
        return formattedModel;
    },
    formatForSingleRecReturn(data) {
        return {
            ...data,
            address: format.getAddressObjFromGeoLocation(data.geoLocation),
            locationType: data.type,
        };
    },
    getModel() {
        return format.model;
    },

    setModel(model) {
        this.model = model;
    },
    getAddressObjFromGeoLocation(geoLocation) {
        if (geoLocation) {
            return {
                ...geoLocation,
                address: geoLocation.address,
                lat: geoLocation.coordinates.coordinates[0],
                lng: geoLocation.coordinates.coordinates[1],
            };
        }
        return null;
    },
};

export default format;
