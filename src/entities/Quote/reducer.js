import quote from './action';
import { quotesModel } from './model';
import formatQuote from './format';
import _ from 'lodash';

export default function quoteReducer(state = quotesModel, action) {
    const format = formatQuote.format;
    let body,
        quotesData,
        quoteData,
        quotes;
    //if return is an array
    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case quote.type.get.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case quote.type.get.success:
            quotesData = body;

            return {
                ...state,
                ...quotesData,
                isRequesting: false,
            };

        case quote.type.get.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case quote.type.list.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case quote.type.list.success:
            quotesData = format(body);

            return {
                ...state,
                ...quotesData,
                isRequesting: false,
            };

        case quote.type.list.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case quote.type.create.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case quote.type.create.success:
            const newQuote = body;
            const updatedQuotes = [...state.quotes];
            updatedQuotes.unshift(newQuote);
            return {
                ...state,
                quotes: updatedQuotes,
                isRequesting: false,
            };

        case quote.type.create.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case quote.type.update.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case quote.type.update.success:
            quoteData = body;
            quotes = _.cloneDeep(state.quotes);
            quotes.splice(_.findIndex(quotes, { name: quoteData.name }), 1, {
                ...quoteData,
            });

            return {
                ...state,
                quotes,
                isRequesting: false,
            };

        case quote.type.update.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case quote.type.propose.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case quote.type.propose.success:
            quoteData = body;
            quotes = _.cloneDeep(state.quotes);
            quotes.splice(_.findIndex(quotes, { name: quoteData.name }), 1, {
                ...quoteData,
            });

            return {
                ...state,
                quotes,
                isRequesting: false,
            };

        case quote.type.propose.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case quote.type.release.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case quote.type.release.success:
            quoteData = body;
            quotes = _.cloneDeep(state.quotes);
            quotes.splice(_.findIndex(quotes, { name: quoteData.name }), 1, {
                ...quoteData,
            });

            return {
                ...state,
                quotes,
                isRequesting: false,
            };

        case quote.type.release.failure:
            return {
                ...state,
                isRequesting: false,
            };
        default:
            return state;
    }
}
