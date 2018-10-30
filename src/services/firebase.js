import * as firebase from 'firebase';
import localStorageHelper from 'clientUtils/localStorageHelper';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
import { browserHistory } from 'react-router';
import _ from 'lodash';

if (!firebase.apps.length) {
    firebase.initializeApp(__config);
}
const authService = firebase.auth();

authService.onAuthStateChanged(user => {
    if (user) {
        localStorageHelper.setUid(user.uid);
        user.getIdToken(true)
            .then(token => {
                localStorageHelper.setAuthToken(token);
            });
    }
});
authService.onIdTokenChanged(user => {
    if (user) {
        localStorageHelper.setUid(user.uid);
        user.getIdToken()
            .then(token => {
                localStorageHelper.setAuthToken(token);
            });
    }
});
const getIdToken = async (force = false) => {
    const idToken =
        authService.currentUser &&
        (await authService.currentUser.getIdToken(force));
    localStorageHelper.setAuthToken(idToken);
    return idToken;
};
const getUid = () => {
    return localStorageHelper.getUid();
};
export default {
    signOut: () => {
        authService.signOut();
        // browserHistory.push('/');
    },
    heartbeat: () => {
        getIdToken(true);
    },
    changePassword: newPassword => {
        const user = firebase.auth().currentUser;

        user
            .updatePassword(newPassword)
            .then(() => {
                toastMessageHelper.mapSuccessMessage('Password updated successfully');
            })
            .catch(error => {
                toastMessageHelper.mapFirebaseError(error);
            });
    },
    signUpWithEmailAndPassword: async (email, password) => {
        try {
            const user = await authService.createUserWithEmailAndPassword(
                email,
                password,
            );
            await user.sendEmailVerification();
            return user;
        } catch (error) {
            toastMessageHelper.mapFirebaseError(error);
        }
    },
    signInWithEmailAndPassword: async (
        email,
        password,
        showEmailVerificationButton,
    ) => {
        try {
            await authService.setPersistence(firebase.auth.Auth.Persistence.SESSION);
            const user = await authService.signInWithEmailAndPassword(
                email,
                password,
            );
            if (!_.get(user, 'emailVerified')) {
                showEmailVerificationButton();
                toastMessageHelper.mapApiError('Verify your email before login: check your email');
            } else {
                const token = await getIdToken();
                localStorageHelper.setAuthToken(token);
                browserHistory.push('/');
            }
            return user;
        } catch (error) {
            toastMessageHelper.mapFirebaseError(error);
        }
    },
    resendVerificationEmail: async (email, password) => {
        try {
            await authService.setPersistence(firebase.auth.Auth.Persistence.SESSION);
            await authService.signInWithEmailAndPassword(email, password);
            const user = firebase.auth().currentUser;
            await user.sendEmailVerification();
            toastMessageHelper.mapSuccessMessage('Verification email sent');
        } catch (error) {
            toastMessageHelper.mapFirebaseError(error);
        }
    },

    resetPassword: async email => {
        try {
            firebase.auth()
                .sendPasswordResetEmail(email);
            toastMessageHelper.mapSuccessMessage('Password reset email sent');
        } catch (error) {
            toastMessageHelper.mapFirebaseError(error);
        }
    },

    getUid,
    getIdToken,
    authService,
};
