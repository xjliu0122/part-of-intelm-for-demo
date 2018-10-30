import company from 'entities/Company/action';
import { companyModel } from 'entities/Company/model';
import formatCompany from 'entities/Company/format';
import _ from 'lodash';

export default function companyReducer(state = companyModel, action) {
    const format = formatCompany.format;
    let body,
        companyData,
        Saved;

    //simplied action object
    if (_.has(action, 'params.params.data')) {
        body = action.params.params.data;
    }

    switch (action.type) {
        case company.type.update.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case company.type.update.success:
            return {
                ...state,
                isUpdating: false,
            };
        case company.type.update.failure:
            return {
                ...state,
                isUpdating: false,
            };

        case company.type.create.request:
            return {
                ...state,
                isRequesting: true,
            };

        case company.type.create.success:
            companyData = format(action.params.response);

            return {
                ...state,
                //...companyData,
                isRequesting: false,
            };

        case company.type.create.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case company.type.list.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case company.type.list.success:
            companyData = format(action.params.response, 'bco');
            return {
                ...state,
                ...companyData,
                isUpdating: false,
            };
        case company.type.list.failure:
            return {
                ...state,
                isUpdating: false,
            };
        case company.type.join.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case company.type.join.success:
            return {
                ...state,
                isUpdating: false,
            };
        case company.type.join.failure:
            return {
                ...state,
                isUpdating: false,
            };
        default:
            return state;
    }
}
