import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompanyEntity from 'entities/Company/action';
import UserProfileEntity from 'entities/UserProfile/action';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
//React MD
import { TextField, Button, SelectionControl } from 'react-md';

// component
import AutocompletePlace from 'components/Form/googlePlaceAutoComplete';

import './styles.scss';

class BillingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sameAsCompany: true,
            name: null,
            fax: null,
            address: null,
            phone: null,
            email: null,
            addressSearchText: null,
            errors: {},
            touched: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.setExistingCompanyInfo = this.setExistingCompanyInfo.bind(this);
        this.pullInfoFromCompany = this.pullInfoFromCompany.bind(this);
        this.updateAddressInfo = this.updateAddressInfo.bind(this);
    }

    componentWillMount() {
        this.setExistingCompanyInfo(this.props);
    }
    componentWillReceiveProps = nextProps => {
        this.setExistingCompanyInfo(nextProps);
    };
    pullInfoFromCompany(props) {
        const company = props.user.company;
        if (company) {
            this.setState({
                name: company.name,
                fax: company.fax,
                address: company.address,
                phone: company.phone,
                email: company.email,
                addressSearchText: company.address,
            });
        }
    }
    setExistingCompanyInfo(props) {
        const company = props.user.company;
        if (company) {
            this.setState({
                id: _.get(company, `${props.selectedView}Address.id`),
                sameAsCompany: _.get(
                    company,
                    `${props.selectedView}Address.sameAsCompany`,
                ),
                name: _.get(company, `${props.selectedView}Address.name`),
                fax: _.get(company, `${props.selectedView}Address.fax`),
                address: _.get(company, `${props.selectedView}Address.address`),
                phone: _.get(company, `${props.selectedView}Address.phone`),
                email: _.get(company, `${props.selectedView}Address.email`),
                addressSearchText: _.get(
                    company,
                    `${props.selectedView}Address.address`,
                ),
            });
        }
    }
    validateFormValues(values, isSubmitting) {
        const fieldErrors = {};

        if (!values.name) {
            fieldErrors.name = true;
        }
        if (!values.addressSearchText) {
            fieldErrors.address = true;
        }
        if (!values.phone) {
            fieldErrors.phone = true;
        }
        if (!values.email) {
            fieldErrors.email = true;
        }

        this.setState({
            errors: fieldErrors,
        });

        //set all error fields to touched
        if (isSubmitting) {
            const touchedFields = this.state.touched;

            _.each(fieldErrors, (value, key) => {
                touchedFields[key] = 'true';
            });

            this.setState({
                touched: touchedFields,
            });

            if (_.isEmpty(fieldErrors)) {
                return true;
            }
            return false;
        }
    }

    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
        if (type === 'sameAsCompany' && value) {
            this.pullInfoFromCompany(this.props);
        }
    }
    handleAddressChange(geoData, name) {
        this.handleChange(geoData, name);
    }

    updateAddressInfo() {
        if (!this.validateFormValues(this.state, true)) return;
        this.props.updateAddressInfo(_.omit(this.state, 'addressSearchText'));
    }

    render() {
        const {
                sameAsCompany,
                name,
                address,
                phone,
                email,
                fax,
                addressSearchText,
                errors,
            } = this.state,
            { selectedView, user } = this.props;
        // const hasError = _.isNil(code) || _.isEmpty(code);
        return (
            <div className="billing-view-container">
                <div className="update">
                    <SelectionControl
                        id="switch-company"
                        type="switch"
                        label="same as company"
                        labelBefore
                        checked={sameAsCompany}
                        onChange={value =>
                            this.handleChange(value, 'sameAsCompany')
                        }
                    />
                </div>
                {sameAsCompany &&
                    _.has(user, 'company') && (
                    <section className="company-info">
                        <div className="row">
                            <div className="col-6">
                                <div className="label-name">Name</div>
                                <div>{user.company.name}</div>
                            </div>
                            <div className="col-6">
                                <div className="label-name">Address</div>
                                <div>{user.company.address}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="label-name">
                                        Phone Number
                                </div>
                                <div>{user.company.phone}</div>
                            </div>
                            <div className="col-6">
                                <div className="label-name">Fax</div>
                                <div>{user.company.fax}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="label-name">Email</div>
                                <div>{user.company.email}</div>
                            </div>
                        </div>
                        {selectedView === 'billing' && (
                            <Button
                                raised
                                primary
                                className="btn-update"
                                onClick={this.updateBillingInfo}
                            >
                                    update company billing info
                            </Button>
                        )}
                        {selectedView === 'payment' && (
                            <Button
                                raised
                                primary
                                className="btn-update"
                                onClick={this.updatePaymentInfo}
                            >
                                    update company payment info
                            </Button>
                        )}
                    </section>
                )}
                {!sameAsCompany && (
                    <section className="update-group-field">
                        <div className="row">
                            <div className="col-6">
                                <TextField
                                    id="idCompanyName"
                                    label="Name *"
                                    error={errors.name}
                                    value={name}
                                    onChange={value =>
                                        this.handleChange(value, 'name')
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <AutocompletePlace
                                    label="Address *"
                                    initialText={addressSearchText}
                                    value={address}
                                    error={errors.address}
                                    // errorText={this.showError('address')}
                                    onAutocomplete={(
                                        geoData,
                                        searchText,
                                        index,
                                    ) => {
                                        this.handleAddressChange(
                                            geoData,
                                            'address',
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <TextField
                                    label="Phone Number *"
                                    value={phone}
                                    error={errors.phone}
                                    // errorText={this.showError('phone')}
                                    onChange={value =>
                                        this.handleChange(value, 'phone')
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <TextField
                                    label="FAX"
                                    value={fax}
                                    onChange={value =>
                                        this.handleChange(value, 'fax')
                                    }
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <TextField
                                    label="Email *"
                                    value={email}
                                    error={errors.email}
                                    // errorText={this.showError('email')}
                                    onChange={value =>
                                        this.handleChange(value, 'email')
                                    }
                                />
                            </div>
                        </div>

                        {selectedView === 'billing' && (
                            <Button
                                raised
                                primary
                                className="btn-update"
                                onClick={this.updateAddressInfo}
                            >
                                update company billing info
                            </Button>
                        )}
                        {selectedView === 'payment' && (
                            <Button
                                raised
                                primary
                                className="btn-update"
                                onClick={this.updateAddressInfo}
                            >
                                update company payment info
                            </Button>
                        )}
                    </section>
                )}
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
            updateAddressInfo: addressData => {
                dispatch(CompanyEntity.ui.updateAddressInfo(addressData));
                CompanyEntity.after.updateAddressInfo = () => {
                    toastMessageHelper.mapSuccessMessage('Address updated successfully');
                    dispatch(UserProfileEntity.ui.get());
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(BillingView);
