import { browserHistory } from 'react-router';
import * as _saga from './saga';
import * as _config from './config';
import * as _firebase from './firebase';

export const history = browserHistory;
export const saga = _saga;
export const config = _config;
export const firebase = _firebase;
