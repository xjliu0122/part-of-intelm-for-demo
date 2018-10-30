import { saga, history } from 'services';
import _ from 'lodash';

const schedule = saga.createEntityApi('schedule', ['removeTrip']);

schedule.api.list = function (params) {
    const config = {
        method: 'POST',
        //errorMessage: 'Unable to get trip.',
        url: '/schedule/list',
        data: {
            ...params,
        },
    };
    return config;
};

schedule.api.create = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        url: '/schedule',
    };
};
schedule.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ..._.omit(params, 'id'),
        },
        url: `/schedule/${params.id}`,
    };
};
schedule.api.delete = function (id) {
    return {
        method: 'DELETE',
        url: `/schedule/${id}`,
    };
};
export default schedule;
