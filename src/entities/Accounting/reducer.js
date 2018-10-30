import accounting from 'entities/Accounting/action';
import { accountingModel } from 'entities/Accounting/model';
import _ from 'lodash';

export default function accountingReducer(state = accountingModel, action) {
    let body;

    //response as array
    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case accounting.type.suggestPayee.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case accounting.type.suggestPayee.success:
            return {
                ...state,
                payees: _.cloneDeep(body),
                isUpdating: false,
            };
        case accounting.type.suggestPayee.failure:
            return {
                ...state,
                isUpdating: false,
            };
        case accounting.type.update.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case accounting.type.update.success:
            return {
                ...state,
                items: [],
                payees: [],
                isUpdating: false,
            };
        case accounting.type.update.failure:
            return {
                ...state,
                isUpdating: false,
            };
        case accounting.type.list.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case accounting.type.list.success:
            return {
                ...state,
                items: _.cloneDeep(body),
                isUpdating: false,
            };
        case accounting.type.list.failure:
            return {
                ...state,
                isUpdating: false,
            };
        case accounting.type.sync.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case accounting.type.sync.success:
            return {
                ...state,
                isUpdating: false,
            };
        case accounting.type.sync.failure:
            return {
                ...state,
                isUpdating: false,
            };

        case accounting.type.getContainerInfo.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case accounting.type.getContainerInfo.success:
            return {
                ...state,
                apContainerInfo: body,
                isUpdating: false,
            };
        case accounting.type.getContainerInfo.failure:
            return {
                ...state,
                isUpdating: false,
            };
        default:
            return state;
    }
}
