import _ from 'lodash';
import report from './action';
import model from './model';

export default function reportReducer(state = model, action) {
    let data;

    switch (action.type) {
        case report.type.getConInv.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case report.type.getConInv.success:
            data = action.params.response;
            return {
                ...state,
                inventory: data,
                isRequesting: false,
            };
        case report.type.getConInv.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case report.type.getInvoicePDF.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case report.type.getInvoicePDF.success:
            data = action.params.response;
            return {
                ...state,
                invoicePdfData: data,
                isRequesting: false,
            };
        case report.type.getInvoicePDF.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case report.type.getBCOStatement.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case report.type.getBCOStatement.success:
            data = action.params.response;
            return {
                ...state,
                bcoStatement: data,
                isRequesting: false,
            };
        case report.type.getBCOStatement.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case report.type.getBCODashboardData.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case report.type.getBCODashboardData.success:
            data = action.params.response;
            return {
                ...state,
                bcoDashboard: data,
                isRequesting: false,
            };
        case report.type.getBCODashboardData.failure:
            return {
                ...state,
                isRequesting: false,
            };
        default:
            return state;
    }
}
