import { browserHistory, Link } from 'react-router';
import _ from 'lodash';
import Auth from 'services/firebase';

// Storage Mock
function storageMock() {
    const storage = {};

    return {
        setItem: (key, value) => {
            storage[key] = value || '';
        },
        getItem: key => {
            return key in storage ? storage[key] : null;
        },
        removeItem: key => {
            delete storage[key];
        },
        getlength() {
            return Object.keys(storage).length;
        },
        key: i => {
            const keys = Object.keys(storage);
            return keys[i] || null;
        },
    };
}

// Memoized results of parsing localStorage items
let _profile = null,
    _permissions = null;

const localStorage =
    typeof window !== 'undefined' ? window.localStorage : storageMock();

export default {
    // Clears memoized results and localStorage items
    clear() {
        localStorage.clear();
        Auth.signOut();
    },

    removeItem(key) {
        localStorage.removeItem(key);
    },
    getUid() {
        return localStorage.getItem('uid');
    },
    getToken() {
        return localStorage.getItem('token');
    },
    setAuthToken: async token => {
        try {
            if (token) localStorage.setItem('token', token);
        } catch (e) {
            console.log('Unable to save token expiration');
        }
    },
    setUid: async uid => {
        try {
            localStorage.setItem('uid', uid);
        } catch (e) {
            console.log('Unable to save token expiration');
        }
    },
};
