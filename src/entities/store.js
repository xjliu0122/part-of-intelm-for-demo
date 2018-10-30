import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer, {},
    compose(
        applyMiddleware(sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
);

sagaMiddleware.run(rootSaga);
// // output store changes
// let unsubscribe = store.subscribe(() =>
//   console.log('store state: ', store.getState())
// );
store.subscribe(() => console.log('store state: ', store.getState()));
export default store;
