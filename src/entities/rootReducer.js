import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

// Entities
import userProfileReducer from 'entities/UserProfile/reducer';
import companyReducer from 'entities/Company/reducer';
import managedLocationsReducer from 'entities/ManagedLocation/reducer';
import jobReducer from 'entities/Job/reducer';
import tripReducer from 'entities/Trip/reducer';
import scheduleReducer from 'entities/Schedule/reducer';
import jobDetailViewReducer from 'entities/SharedViewReducers/jobDetailViewReducer';
import editScheduleViewReducer from 'entities/SharedViewReducers/editScheduleViewReducer';
import truckingCompanyReducer from 'entities/TruckingCompany/reducer';
import bidReducer from 'entities/Bid/reducer';
import quoteReducer from 'entities/Quote/reducer';
import accountingReducer from 'entities/Accounting/reducer';
import manageClientReducer from 'entities/ManageClient/reducer';
import reportReducer from 'entities/Report/reducer';

const appReducer = combineReducers({
    userProfileReducer,
    companyReducer,
    managedLocationsReducer,
    jobReducer,
    tripReducer,
    scheduleReducer,
    jobDetailViewReducer,
    editScheduleViewReducer,
    truckingCompanyReducer,
    bidReducer,
    quoteReducer,
    accountingReducer,
    manageClientReducer,
    reportReducer,
    toastr: toastrReducer,
});

function rootReducer(state, action) {
    let newState = state;

    if (action.type === 'USER_LOGOUT') {
        newState = {};
    }

    return appReducer(newState, action);
}

export default rootReducer;
