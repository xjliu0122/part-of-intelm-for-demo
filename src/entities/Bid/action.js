import { saga, history } from 'services';

const bid = saga.createEntityApi('bid', ['request']);

bid.api.list = function (params) {
    return {
        method: 'POST',
        url: '/bid/list',
        data: {
            ...params,
        },
    };
};

bid.api.request = function (params) {
    return {
        method: 'POST',
        url: '/bid/request',
        data: {
            ...params,
        },
    };
};

export default bid;
