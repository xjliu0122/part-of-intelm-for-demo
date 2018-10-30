import { saga, history } from 'services';

const managedLocation = saga.createEntityApi('managedLocation', ['listClient']);

managedLocation.api.list = function (params) {
    const config = {
        method: 'GET',
        url: '/location',
    };
    return config;
};
managedLocation.api.listClient = function (params) {
    const config = {
        method: 'GET',
        url: `/location/${params.id}`,
    };
    return config;
};

managedLocation.api.create = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        errorMessage: 'Unable to create location',
        url: '/location',
    };
};
managedLocation.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        //errorMessage: 'Update successful.',
        url: '/location',
    };
};
managedLocation.api.delete = function (params) {
    return {
        method: 'DELETE',
        data: {
            ...params,
        },
        //errorMessage: 'Update successful.',
        url: '/location',
    };
};
export default managedLocation;
