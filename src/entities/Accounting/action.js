import { saga } from 'services';

const accounting = saga.createEntityApi('accounting', [
    'suggestPayee',
    'sync',
    'getContainerInfo',
]);

accounting.api.list = function (params) {
    return {
        method: 'POST',
        url: '/accounting/list',
        data: {
            ...params,
        },
    };
};
accounting.api.update = function (params) {
    return {
        method: 'POST',
        url: '/accounting/submit',
        data: {
            ...params,
        },
    };
};
accounting.api.getContainerInfo = function (params) {
    return {
        method: 'POST',
        url: '/accounting/ap/getContainerInfoWeb',
        data: {
            ...params,
        },
    };
};
accounting.api.suggestPayee = function (params) {
    return {
        method: 'POST',
        url: '/accounting/searchPayee',
        data: {
            ...params,
        },
    };
};
accounting.api.sync = function (params) {
    return {
        method: 'POST',
        url: '/accounting/sync',
        data: {
            ...params,
        },
    };
};

export default accounting;
