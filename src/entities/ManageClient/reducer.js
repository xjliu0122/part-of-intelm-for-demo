import _ from 'lodash';
import manageClient from './action';
import model from './model';

export default function manageClientReducer(state = model, action) {
    let data,
        requestData;

    switch (action.type) {
        case manageClient.type.list.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case manageClient.type.list.success:
            data = action.params.response;
            return {
                ...state,
                bcos: data,
                isRequesting: false,
            };
        case manageClient.type.list.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case manageClient.type.update.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case manageClient.type.update.success:
            requestData = action.params.params.data;
            const newBcos = [...state.bcos];
            const toReplace = _.find(newBcos, { id: requestData.id });
            newBcos.splice(_.findIndex(newBcos, { id: requestData.id }), 1, {
                ...toReplace,
                ...requestData,
            });
            return {
                ...state,
                bcos: newBcos,
                isRequesting: false,
            };
        case manageClient.type.update.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case manageClient.type.listUser.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case manageClient.type.listUser.success:
            data = action.params.response;
            return {
                ...state,
                users: data,
                isRequesting: false,
            };
        case manageClient.type.listUser.failure:
            return {
                ...state,
                isRequesting: false,
            };

        default:
            return state;
    }
}
