import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
import CompanyEntity from 'entities/Company/action';
import localStorageHelper from 'clientUtils/localStorageHelper';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// component
import BillingView from 'components/Billing';
import ManagedLocations from 'components/ManagedLocations';
import PersonalInfo from 'components/MyInfo';
import CompanyView from 'components/Company';
import ManageUserView from 'components/ManageUser';
import './styles.scss';

class QBOAuthView extends Component {
    authQBO() {
        const token = localStorageHelper.getToken();
        //default
        const config = {
            headers: {
                Authorization: token,
            },
            method: 'GET',
            timeout: 20000,
            url: `${__config.apiUrl}/qbo/getAuthUrl`,
        };

        axios(config)
            .then(response => {
                const authUrl = response.data.url;
                window.open(authUrl);
            });
    }
    render() {
        return (
            <div
                className="qbo-auth-viewReducer"
                onClick={() => this.authQBO()}
            >
                <img
                    src="https://d7uddx54veb4a.cloudfront.net/wp-content/uploads/2016/11/logo-qb.png"
                    alt="qboAuthBtn"
                />
            </div>
        );
    }
}
class SettingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'Info',
            option: 'initialize',
            code: null,
            type: null,
            businessType: null,
            stateServed: null,
            companyName: null,
            taxId: null,
            address: null,
            phone: null,
            email: null,
            SCAC: null,
            mc: null,
            dot: null,
            haz: null,
            oversize: null,
            overweight: null,
            notes: null,
            operationArea: null,
            ocean: null,
            rail: null,
            customs: null,
            iso: null,
            oog: null,
            hazardous: null,
        };
        this.joinCompany = this.joinCompany.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateServedArea = this.updateServedArea.bind(this);
        this.registerCompany = this.registerCompany.bind(this);
        this.setTab = this.setTab.bind(this);
    }

    setTab(e, value) {
        this.setState({
            activeTab: value,
        });
    }
    joinCompany() {
        const { bl } = this.state,
            params = {
                Id: 5454,
                body: {
                    // refId: formValues.refNum,
                },
            };
        // this.props.createNewImportjob(params);
    }
    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }
    handleAddressChange(geoData, name) {
        this.handleChange(geoData, name);
    }

    updateServedArea({ name, value }) {
        this.setState({
            stateServed: value,
        });
    }

    registerCompany() {
        const input = this.state;
        const companyData = _.pick(input, [
            'address',
            'type',
            'phone',
            'email',
            'businessType',
            'SCAC',
            'type',
            'notes',
            'taxId',
        ]);
        companyData.name = input.companyName;
        //input.address = input.address.address;
        companyData.carrierInfo = {
            mcNumber: input.mc,
            DOT: input.dot,
            //publicLiabilityinsuranceProvider: input. ,
            //cargoInsuranceProvider: input. ,
            ownerOperator: input.type === 'Owner Operator',
            //twic: input. ,
            hazmat: input.haz || false,
            oversize: input.oversize || false,
            overweight: input.overweight || false,
            serviceTypeDrayage: input.ocean || false,
            serviceTypeRailDrayage: input.rail || false,
            serviceTypeTankDrayage: input.iso || false,
            serviceTypeOversize: input.oog || false,
            serviceTypeHazmat: input.hazardous || false,
            serviceTypeBondedWarehouse: input.customs || false,
        };
        companyData.stateServed = this.state.stateServed;
        companyData.operationArea = [this.state.operationArea];

        this.props.registerCompany(companyData);
    }

    render() {
        const { code, activeTab } = this.state,
            { user } = this.props;
        const hasError = _.isNil(code) || _.isEmpty(code);
        return (
            <div className="setting-view-container">
                <div className="select-tab">
                    <div className="row">
                        <div className="col-12">
                            <Paper elevation={1}>
                                <Tabs
                                    className="tab-header"
                                    value={activeTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.setTab}
                                >
                                    <Tab label="My Info" value="Info" />
                                    {user.isAdmin && (
                                        <Tab label="Company" value="Company" />
                                    )}
                                    {user.isAdmin && (
                                        <Tab label="Users" value="Users" />
                                    )}
                                    {/* <Tab label="Billing Address" />
                                    <Tab label="Payment Address" /> */}
                                    <Tab
                                        label="Managed Locations"
                                        value="Locations"
                                    />

                                    {user.role === 'dispatcher' && (
                                        <Tab label="QBO Connect" value="QBO" />
                                    )}
                                </Tabs>
                            </Paper>
                        </div>
                    </div>

                    <div className="row tab-view-container">
                        <div
                            className={`col-12 ${
                                activeTab === 2 || activeTab === 3
                                    ? 'billing'
                                    : ''
                            }`}
                        >
                            {activeTab === 'Company' && <CompanyView />}
                            {activeTab === 'Users' && <ManageUserView />}

                            {/* {activeTab === 2 && (
                                <BillingView selectedView="billing" />
                            )}
                            {activeTab === 3 && (
                                <BillingView selectedView="payment" />
                            )} */}
                            {activeTab === 'Locations' && <ManagedLocations />}
                            {activeTab === 'Info' && <PersonalInfo />}
                            {activeTab === 'QBO' && <QBOAuthView />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            user: state.userProfileReducer.profile,
            // requiredFields: state.formFieldReducer.fields,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            registerCompany: companyData => {
                dispatch(CompanyEntity.ui.create(companyData));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(SettingView);
