import truckingCompany from 'entities/TruckingCompany/action';
import { truckingCompanyModel } from 'entities/TruckingCompany/model';
import _ from 'lodash';

export default function truckingCompanyReducer(
    state = truckingCompanyModel,
    action,
) {
    let body,
        companyData;

    //response as array
    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case truckingCompany.type.list.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case truckingCompany.type.list.success:
            companyData = body;
            return {
                ...state,
                truckingCompanies: _.cloneDeep(companyData),
                isUpdating: false,
            };
        case truckingCompany.type.list.failure:
            return {
                ...state,
                isUpdating: false,
            };
        case truckingCompany.type.searchTCByText.watch:
            return {
                ...state,
                isUpdating: true,
            };
        case truckingCompany.type.searchTCByText.success:
            companyData = body;
            return {
                ...state,
                assignedDriverSearchSuggestions: _.cloneDeep(companyData),
                isUpdating: false,
            };
        case truckingCompany.type.searchTCByText.failure:
            return {
                ...state,
                isUpdating: false,
            };
        default:
            return state;
    }
}
