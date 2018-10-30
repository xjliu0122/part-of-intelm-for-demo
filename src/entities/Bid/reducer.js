import bid from 'entities/Bid/action';
import { bidModel } from 'entities/Bid/model';
import format from 'entities/Bid/format';
import _ from 'lodash';

export default function bidReducer(state = bidModel, action) {
    let body;

    //response as array
    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case bid.type.request.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case bid.type.request.success:
            return {
                ...state,
                bids: _.cloneDeep(body),
                isUpdating: false,
            };
        case bid.type.request.failure:
            return {
                ...state,
                isUpdating: false,
            };
        case bid.type.list.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case bid.type.list.success:
            return {
                ...state,
                bids: _.cloneDeep(body),
                isUpdating: false,
            };
        case bid.type.list.failure:
            return {
                ...state,
                isUpdating: false,
            };
        default:
            return state;
    }
}
