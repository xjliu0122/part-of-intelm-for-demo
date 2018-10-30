import { saga, history } from 'services';

const company = saga.createEntityApi('company', ['updateAddressInfo', 'join']);

company.api.create = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        errorMessage: 'Unable to create company',
        url: '/company',
    };
};
company.api.list = function () {
    return {
        method: 'GET',
        url: '/company/bco',
    };
};
company.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        //errorMessage: 'Unable to create company',
        url: '/company',
    };
};
company.api.join = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/company/join',
    };
};
company.api.updateAddressInfo = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        //errorMessage: 'Unable to create company',
        url: '/company/addressInfo',
    };
};

export default company;
