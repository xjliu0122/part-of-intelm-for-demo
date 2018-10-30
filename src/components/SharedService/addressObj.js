import _ from 'lodash';
import { Promise } from 'bluebird';

const parseAddressData = data => {
    const parsedData = {};
    _.each(data.address_components, comp => {
        if (_.includes(comp.types, 'locality')) {
            parsedData.city = comp.short_name;
        }
        if (_.includes(comp.types, 'administrative_area_level_1')) {
            parsedData.state = comp.short_name;
        }
        if (_.includes(comp.types, 'postal_code')) {
            parsedData.zipCode = comp.short_name;
        }
    });
    parsedData.lat = data.geometry.location.lat();
    parsedData.lng = data.geometry.location.lng();
    parsedData.address = data.formatted_address;
    return parsedData;
};
export default {
    getAddressObject: addressText => {
        const geoCoderService = new google.maps.Geocoder();

        if (!addressText || !geoCoderService) {
            return null;
        }
        return new Promise((resolve, reject) => {
            geoCoderService.geocode({ address: addressText }, detailData => {
                if (_.size(detailData) > 0) {
                    resolve({
                        ...parseAddressData(detailData[0]),
                        address: addressText,
                    });
                } else {
                    reject(new Error('Address is not valid'));
                }
            });
        });
    },
};
