import { toastr } from 'react-redux-toastr';

export default {
    mapFirebaseError: error => {
        const errorCode = error.code;
        let errorMessage = error.message;
        switch (errorCode) {
            case 'auth/weak-password':
                errorMessage = 'The password is too weak.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'The email address is not valid.';
                break;
            case 'auth/email-already-in-use':
                errorMessage =
                    'The provided email is already registered. Please login in.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'The provided account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'The provided account does not exist.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Wrong email or password';
                break;
            default:
                break;
        }

        toastr.error('', errorMessage);
    },
    mapSuccessMessage: message => {
        toastr.success('', message);
    },
    mapApiError: message => {
        toastr.error('', message, { timeOut: 5000 });
    },
};
