import { companyModel } from 'entities/Company/model';

const format = {
    model: companyModel,
    format(data, type) {
        const formattedModel = data;

        return {
            ...format.model,
            [type]: formattedModel,
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
