import { saga, history } from 'services';
import _ from 'lodash';

const report = saga.createEntityApi('report', [
    'getConInv',
    'getBCOStatement',
    'getInvoicePDF',
    'getBCODashboardData',
]);

report.api.getConInv = function () {
    return {
        method: 'GET',
        url: '/report/coninv',
    };
};
report.api.getBCOStatement = function ({ qboCompId, fromDate, toDate }) {
    return {
        method: 'POST',
        url: '/report/bcoStatement',
        data: {
            qboCompId,
            fromDate,
            toDate,
        },
    };
};
report.api.getInvoicePDF = function (id) {
    return {
        method: 'GET',
        url: `/report/invoicepdf/${id}`,
    };
};
report.api.getBCODashboardData = function (params) {
    return {
        method: 'POST',
        url: '/report/bcoDashboard',
        data: {
            ...params,
        },
    };
};

export default report;
