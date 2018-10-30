import { saga, history } from 'services';

const truckingCompany = saga.createEntityApi('truckingCompany', [
    'requestBids',
    'getAll',
    'searchTCByText',
]);

truckingCompany.api.list = function (params) {
    return {
        method: 'POST',
        url: '/tc/list',
        data: {
            ...params,
        },
    };
};

truckingCompany.api.requestBids = function (params) {
    return {
        method: 'POST',
        url: '/tc/requestBids',
        data: {
            ...params,
        },
    };
};
truckingCompany.api.searchTCByText = function (value) {
    return {
        method: 'POST',
        url: '/tc/searchByText',
        data: {
            searchText: value,
        },
    };
};

// truckingCompany.api.getAll = function (params) {
//     return {
//         method: 'GET',
//         url: '/tc',
//     };
// };
export default truckingCompany;
