import _ from 'lodash';
import schedule from './action';
import { schedulesModel } from './model';
import formatSchedules from './format';

export default function scheduleReducer(state = schedulesModel, action) {
    const format = formatSchedules.format;
    let body,
        updatedSchedule,
        schedulesData;

    //simplied action object
    if (_.has(action, 'params.params.data')) {
        body = action.params.params.data;
    }
    //if return is an array
    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case schedule.type.get.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case schedule.type.get.success:
            return {
                ...state,
                isRequesting: false,
            };

        case schedule.type.get.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case schedule.type.list.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case schedule.type.list.success:
            schedulesData = format(body);

            return {
                ...state,
                schedules: schedulesData,
                isRequesting: false,
            };

        case schedule.type.list.failure:
            return {
                ...state,
                schedules: [],
                isRequesting: false,
            };

        case schedule.type.create.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case schedule.type.create.success:
            const newschedule = body;
            updatedSchedule = [...state.schedules];
            updatedSchedule.push(newschedule);
            return {
                ...state,
                schedules: updatedSchedule,
                isRequesting: false,
            };

        case schedule.type.create.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case schedule.type.update.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case schedule.type.update.success:
            updatedSchedule = body;
            schedulesData = _.cloneDeep(state.schedules);
            schedulesData.splice(
                _.findIndex(schedulesData, { id: updatedSchedule.id }),
                1,
                {
                    ...updatedSchedule,
                },
            );

            return {
                ...state,
                schedules: schedulesData,
                isRequesting: false,
            };

        case schedule.type.update.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case schedule.type.delete.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case schedule.type.delete.success:
            updatedSchedule = body;
            schedulesData = _.cloneDeep(state.schedules);
            schedulesData.splice(
                _.findIndex(schedulesData, { id: updatedSchedule.id }),
                1,
            );

            return {
                ...state,
                schedules: schedulesData,
                isRequesting: false,
            };

        case schedule.type.delete.failure:
            return {
                ...state,
                isRequesting: false,
            };
        default:
            return state;
    }
}
