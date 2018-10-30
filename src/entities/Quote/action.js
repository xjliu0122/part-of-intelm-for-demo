import { saga, history } from 'services';

const quote = saga.createEntityApi('quote', ['propose', 'release']);

quote.api.list = function (params) {
    const config = {
        method: 'POST',
        errorMessage: 'Unable to get quotes.',
        url: '/quote/list',
        data: {
            ...params,
        },
    };
    return config;
};
quote.api.create = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/quote',
    };
};
quote.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        url: '/quote',
    };
};
quote.api.propose = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        url: '/quote/propose',
    };
};
quote.api.release = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        url: '/quote/release',
    };
};

export default quote;
