/* eslint-disable no-constant-condition */
import { takeEvery, takeLatest, delay } from 'redux-saga';
import { take, put, call, fork, select, spawn } from 'redux-saga/effects';

//Entities
import UserProfile from 'entities/UserProfile/action';
import Company from 'entities/Company/action';
import ManagedLocation from 'entities/ManagedLocation/action';
import Job from 'entities/Job/action';
import Trip from 'entities/Trip/action';
import Schedule from 'entities/Schedule/action';
import TruckingCompany from 'entities/TruckingCompany/action';
import Bid from 'entities/Bid/action';
import Quote from 'entities/Quote/action';
import Accounting from 'entities/Accounting/action';
import ManageClient from 'entities/ManageClient/action';
import Report from 'entities/Report/action';

export default function* rootSaga() {
    yield [
        spawn(UserProfile.watchVerbs),
        spawn(Company.watchVerbs),
        spawn(ManagedLocation.watchVerbs),
        spawn(Job.watchVerbs),
        spawn(Trip.watchVerbs),
        spawn(Schedule.watchVerbs),
        spawn(TruckingCompany.watchVerbs),
        spawn(Bid.watchVerbs),
        spawn(Quote.watchVerbs),
        spawn(Accounting.watchVerbs),
        spawn(ManageClient.watchVerbs),
        spawn(Report.watchVerbs),
    ];
}
