// main layouts
import MainAppLayout from 'layouts/MainAppLayout';
import LoginLayout from 'layouts/LoginLayout';
import NotFoundPageLayout from 'layouts/NotFoundPageLayout';

import Home from 'components/Home';
import SignupLayout from 'layouts/SignupLayout';
import JobView from 'components/Jobs';
import QuoteView from 'components/Quote';
import ScheduleView from 'components/Schedule';
import SetupUserView from 'components/Setup';
import ManagedLocationsView from 'components/ManagedLocations';
import ManageClientView from 'components/ManageClient';
import InventoryReport from 'components/InventoryReport';
import SettingView from 'components/Setting';
import BCOStatement from 'components/BCOStatement';
import BCODashboard from 'components/BCODashboard';

import React from 'react';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

//Components

import browser from 'detect-browser';
import localStorageHelper from 'clientUtils/localStorageHelper';

function isIE(nextState, replace) {
    if (browser.name === 'ie') {
        return true;
    }

    return false;
}

function logPageView() {
    // ReactGA.set({ page: window.location.pathname });
    // ReactGA.pageview(window.location.pathname);
    // const profile = localStorageHelper.getUserProfile();
    // if (profile && profile.Id) {
    //     ReactGA.set({
    //         userId: profile.Id,
    //     });
    // }
}

const Routes = {};

// if (isIE()) {
//     Routes.Pages = () => (
//         <Router onUpdate={logPageView}>
//             <Route path="*" component={IEPage} />
//         </Router>
//     );
// } else {
//All paths and routes should require auth except not found and logout
Routes.Pages = () => {
    return (
        <Router history={browserHistory}>
            <Route path="/login" component={LoginLayout} />
            <Route path="/logout" component={LoginLayout} />
            <Route
                path="/signup"
                component={SignupLayout}
                onEnter={logPageView}
                onUpdate={logPageView}
            />
            <Route path="/" component={MainAppLayout}>
                <Route
                    path="setup"
                    component={SetupUserView}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
                <Route
                    path="setting"
                    component={SettingView}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
                <Route
                    path="jobs"
                    component={JobView}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                >
                    <Route
                        path=":jobName"
                        component={JobView}
                        onEnter={logPageView}
                    />
                </Route>
                <Route
                    path="quotes"
                    component={QuoteView}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
                <Route
                    path="manageclient"
                    component={ManageClientView}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
                <Route
                    path="locations"
                    component={ManagedLocationsView}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
                <Route
                    path="dispatch"
                    component={ScheduleView}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                >
                    <Route
                        path=":id"
                        component={ScheduleView}
                        onEnter={logPageView}
                    />
                </Route>
                <Route
                    path="invreport"
                    component={InventoryReport}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
                <Route
                    path="bcostatement"
                    component={BCOStatement}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
                <Route
                    path="dashboard"
                    component={BCODashboard}
                    onEnter={logPageView}
                    onUpdate={logPageView}
                />
            </Route>
        </Router>
    );
};
// }
export default Routes.Pages();
