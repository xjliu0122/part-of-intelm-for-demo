import { take, put, call, spawn } from 'redux-saga/effects';
// import 'isomorphic-fetch';
import _ from 'lodash';
import axios from 'axios';
// import { errorMessage } from 'entities/error/action';
import localStorageHelper from 'clientUtils/localStorageHelper';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
import { browserHistory } from 'react-router';
import errorHandler from 'clientUtils/errorHandler';
import Auth from 'services/firebase';

const crudVerbs = ['create', 'update', 'delete', 'list', 'get', 'search'];
const phases = ['watch', 'request', 'success', 'failure', 'after'];

const ourApiErrorName = 'ErrorMessage';

export function action(type, payload = {}) {
    return {
        type,
        ...payload,
    };
}

export const createRequestTypes = base =>
    phases.reduce((acc, type) => {
        acc[type] = `${base}_${type}`;
        return acc;
    }, {});

export const createApiActionTypes = (entity, verbs = crudVerbs) => {
    const result = {};
    verbs.forEach(verb => {
        result[verb] = {};
        phases.forEach(phase => {
            result[verb][phase] = `${entity}_${verb}_${phase}`;
        });
    });

    return result;
};

export const createEntityApi = (entity, verbs = crudVerbs) => {
    if (!_.isEqual(verbs, crudVerbs)) {
        verbs = [...verbs, ...crudVerbs];
        verbs = _.uniq(verbs);
    }

    const result = {
        entity,
        type: {}, // Redux type: "auth0_login_request"
        action: {}, // Redux action: {type: "auth0_login_request", params: Object}
        networkFetch: {}, // Saga call to network fetch
        watch: {}, // Saga watcher for specified verbs
        watchThunk: {}, // Saga wrapper which calls a user-defined api parameter setup function
        api: {}, // Empty object to be populated with user-defined api parameter setup functions
        ui: {}, // Functions which return redux actions. To be called from a ui component
        failure: {}, // Empty object to be populated with user-defined function
        failureWatch: {}, // Saga watcher for user-defined function
        after: {}, // Empty object to be populated with user-defined function
        afterWatch: {}, // Saga watcher for user-defined function
    };
    verbs.forEach(verb => {
        result.type[verb] = {};
        result.action[verb] = {};
        phases.forEach(phase => {
            // redux types
            result.type[verb][phase] = `${entity}_${verb}_${phase}`;
        });
        phases.forEach(phase => {
            // redux actions
            switch (phase) {
                case 'request':
                    result.action[verb][phase] = params => {
                        return {
                            type: `${entity}_${verb}_${phase}`,
                            params: {
                                params,
                            },
                        };
                    };
                    break;
                case 'success':
                case 'failure':
                    result.action[verb][phase] = (response, params) => {
                        return {
                            type: `${entity}_${verb}_${phase}`,
                            params: {
                                response,
                                params,
                            },
                        };
                    };
                    break;
                case 'after':
                    result.action[verb][phase] = (response, params) => {
                        return {
                            type: `${entity}_${verb}_${phase}`,
                            params: {
                                response,
                                params,
                            },
                        };
                    };
                    break;
                default:
                    break;
            }
        });
        result.networkFetch[verb] = function* (params) {
            // saga for network fetch
            const token = localStorageHelper.getToken() || params.id_token,
                { response, error } = yield call(networkFetch, {
                    ...params,
                    token,
                });

            yield put(result.action[verb].request(params));

            if (response) {
                yield put(result.action[verb].success(response, params));
                yield put(result.action[verb].after(response, params));
            } else if (!error.ErrorMessage) {
                //if not our api error message

                if (result.failure[verb]) {
                    yield call(result.failure[verb], {
                        response,
                        error,
                        params,
                    });

                    yield put(result.action[verb].failure(
                        {
                            error,
                        },
                        params,
                    ));
                }
                //handle custom error message
                if (params.errorMessage) {
                    errorHandler.toastErrorMessage(params.errorMessage);
                }
                // else {
                //     errorHandler.toastErrorMessage('System error. Please contact Intelmodal.');
                // }
                yield put(result.action[verb].failure(params));
            } else {
                yield put(result.action[verb].failure(params));
            }
        };

        result.watchThunk[verb] = function* (params, watchAsync) {
            // wrapper for user api method
            // expect user to write api[verb] method e.g., result.api.login(params)
            if (result.api[verb] && typeof result.api[verb] === 'function') {
                params = yield call(result.api[verb], params); // yield call to enable generator functions with access to store state
            }
            if (watchAsync) {
                yield spawn(result.networkFetch[verb], params);
            } else {
                yield call(result.networkFetch[verb], params);
            }
        };
        result.watch[verb] = function* () {
            while (true) {
                const { params, watchAsync } = yield take(`${entity}_${verb}_watch`);
                if (watchAsync) {
                    yield spawn(result.watchThunk[verb], params, watchAsync);
                } else {
                    yield spawn(result.watchThunk[verb], params);
                }
            }
        };
        result.ui[verb] = function (params, watchAsync) {
            return action(`${entity}_${verb}_watch`, {
                params,
                watchAsync,
            });
        };
        result.afterWatch[verb] = function* () {
            // watcher for 'after'
            while (true) {
                const { params, response } = yield take(`${entity}_${verb}_after`);
                if (
                    result.after[verb] &&
                    typeof result.after[verb] === 'function'
                ) {
                    yield call(result.after[verb], params); // result.after.login = function() { }
                }
            }
        };
        result.failureWatch[verb] = function* () {
            // watcher for 'failure'
            while (true) {
                const { params, response } = yield take(`${entity}_${verb}_failure`);

                if (
                    result.failure[verb] &&
                    typeof result.failure[verb] === 'function'
                ) {
                    yield call(result.failure[verb], params); // result.failure.login = function() { }
                }
            }
        };
    });
    const watchVerbs = [];
    _.forOwn(result.watch, (value, key) => {
        watchVerbs.push(value);
    });
    _.forOwn(result.afterWatch, (value, key) => {
        watchVerbs.push(value);
    });
    _.forOwn(result.failureWatch, (value, key) => {
        watchVerbs.push(value);
    });
    result.watchVerbs = function* (method) {
        for (let n = 0; n < watchVerbs.length; n++) {
            yield spawn(watchVerbs[n]);
        }
    };
    result.clearAfters = () => {
        _.forOwn(result.after, (value, key) => {
            _.unset(result.after, key);
        });
    };
    result.clearFailures = () => {
        _.forOwn(result.failure, (value, key) => {
            _.unset(result.failure, key);
        });
    };

    return result;
};

// HELPER FUNCTIONS
function status(res) {
    const response = res.response || res;
    let test;
    const httpStatus = response.status;
    if (httpStatus >= '200' && httpStatus <= '299') {
        test = Promise.resolve(response);
    } else {
        test = Promise.reject(response);
    }

    return test;
}

function json(res) {
    const response = res.response || res;
    const { headers } = response;
    let type,
        resolved;
    if (headers) {
        type = headers['content-type'];
    }
    if (type) {
        type = type.toLowerCase();
    }

    if (type && type.indexOf('json') !== -1) {
        resolved = Promise.resolve(JSON.parse(response.data));
    } else {
        resolved = Promise.resolve(response.data || 'OK');
    }

    return resolved;
}

export function networkFetch(params = {}, files = []) {
    const config = setFetchConfig(params, files);
    // refresh token to keep alive

    return axios(config)
        .then(status)
        .then(json)
        .then(response => ({
            response,
        }))
        .catch(apiError => {
            return Promise.resolve(json(apiError))
                .then(error => {
                    let response;
                    if (_.isObject(error)) {
                        if (_.has(error, ourApiErrorName)) {
                            response = {
                                error: {
                                    statusText: error[ourApiErrorName],
                                    status: apiError.status,
                                },
                            };
                        }
                        response = {
                            error: {
                                statusText: error[ourApiErrorName]
                                    ? error[ourApiErrorName]
                                    : apiError.statusText,
                                ...error,
                                ..._.pick(apiError, ['status', 'url']),
                            },
                        };
                    } else {
                        response = {
                            error,
                        };
                    }
                    if (apiError.response && apiError.response.status === 401) {
                       // toastMessageHelper.mapApiError('Your session has expired. Please login again.');
                        browserHistory.push('/login');
                    } else if (apiError.response) {
                        toastMessageHelper.mapApiError(response.error.statusText || '');
                    }
                    return response;
                });
        });
}

function setFetchConfig(params, files) {
    const token = localStorageHelper.getToken();
    //default
    let config = {
        headers: {
            Authorization: token,
            'Content-Type': 'application/json',
        },
        method: 'GET',
        timeout: 20000,
        params: {},
        baseURL: __config.apiUrl,
        transformResponse: [
            function (data) {
                // Do whatever you want to transform the data

                return data;
            },
        ],
        data: {},
    };
    //merge params with default config
    config = {
        ...config,
        ...params,
    };
    if (config.method === 'PUT' || config.method === 'POST') {
        //process file uploads

        if (config.body) {
            config.body = JSON.stringify(config.body);
        }
    }
    return config;
}
