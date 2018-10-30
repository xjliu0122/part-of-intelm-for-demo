import _ from 'lodash';
import toastMessageHelper from './toastMessageHelper'
const messages = [
        {
            name: 'duplicate',
            message: 'This name has already been used. Please try another.',
        },
    ],
    errorHandler = {
        get: type => {
            let errorObj = {};
            const found = _.find(messages, item => {
                return item.name === type;
            });
            if (found) {
                errorObj = found;
            }
            return errorObj;
        },
        getMessage: type => {
            let message = '';
            const found = _.find(messages, item => {
                return item.name === type;
            });
            if (found) {
                message = found.message;
            }
            return message;
        },
        getErrorBySearch: message => {
            let errorMessage = '';
            if (message.indexOf('already exists') !== -1) {
                errorMessage = errorHandler.get('duplicate');
            }
            return errorMessage;
        },
        getMessageBySearch: message => {
            let errorMessage = '';
            if (message.indexOf('already exists') !== -1) {
                errorMessage = errorHandler.get('duplicate');
            }
            return errorMessage.message;
        },
        toastErrorMessage: message => {
            toastMessageHelper.mapApiError(message);
        },
    };

export default errorHandler;
