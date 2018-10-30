import { saga, history } from 'services';
import _ from 'lodash';

const manageClient = saga.createEntityApi('manageClient', ['listUser']);

manageClient.api.list = function (params) {
    return {
        method: 'POST',
        url: '/company/searchClients',
        data: {
            term: params.term,
            type: params.type,
        },
    };
};
manageClient.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        url: '/company',
    };
};
manageClient.api.listUser = function (id) {
    return {
        method: 'GET',
        url: `/company/${id}/listUser`,
    };
};

export default manageClient;
