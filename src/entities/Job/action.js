import { saga, history } from 'services';

const job = saga.createEntityApi('job', [
    'invoice',
    'sendConfirmation',
    'markRAStatus',
]);

job.api.list = function (params) {
    const config = {
        method: 'POST',
        errorMessage: 'Unable to get jobs.',
        url: '/job/list',
        data: {
            ...params,
        },
    };
    return config;
};
job.api.create = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/job',
    };
};
job.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        url: '/job',
    };
};
job.api.invoice = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/job/invoice',
    };
};
job.api.sendConfirmation = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/job/sendconfirmation',
    };
};
job.api.markRAStatus = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/job/markRAStatus',
    };
};
export default job;
