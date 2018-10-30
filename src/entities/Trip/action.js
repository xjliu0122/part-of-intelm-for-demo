import { saga, history } from 'services';

const trip = saga.createEntityApi('trip', [
    'suggest',
    'searchForManagement',
    'fetchSingleForManagementAfterScheduling',
    'assign',
    'getSignatureOrPOD',
    'adjustTripOrder',
]);

trip.api.list = function (params) {
    const config = {
        method: 'POST',
        //errorMessage: 'Unable to get trip.',
        url: '/trip/list',
        data: {
            ...params,
        },
    };
    return config;
};

trip.api.suggest = function (params) {
    const config = {
        method: 'POST',
        url: '/trip/findsuggestions',
        data: {
            ...params,
        },
    };
    return config;
};

trip.api.searchForManagement = function (params) {
    const config = {
        method: 'POST',
        url: '/trip/search',
        data: {
            ...params,
        },
    };
    return config;
};
trip.api.fetchSingleForManagementAfterScheduling = function (params) {
    const config = {
        method: 'GET',
        url: `/trip/${params.tripId}`,
    };
    return config;
};
trip.api.create = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/trip',
    };
};
trip.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        url: '/trip',
    };
};
trip.api.adjustTripOrder = function (params) {
    return {
        method: 'PUT',
        data: [...params],
        url: '/trip/adjustTripOrder',
    };
};
trip.api.delete = function (params) {
    return {
        method: 'DELETE',
        url: `/trip/${params.id}`,
    };
};
trip.api.assign = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/trip/assign',
    };
};
trip.api.getSignatureOrPOD = function (params) {
    return {
        method: 'GET',
        url: `/trip/getSignatureOrPOD/${params.id}`,
    };
};

export default trip;
