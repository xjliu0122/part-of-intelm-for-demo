import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompanyEntity from 'entities/Company/action';
import UserProfileEntity from 'entities/UserProfile/action';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
//React MD
import {
    TextField,
    CardActions,
    Button,
    SelectField,
    Checkbox,
} from 'react-md';

// component
import Field from 'components/Form/field';
import AutocompletePlace from 'components/Form/googlePlaceAutoComplete';
import SelectionOptions from 'components/config';
import PhoneNumberUtil from '../SharedService/phoneNo';
import AddressObjUtil from '../SharedService/addressObj';

import './styles.scss';

const {
    businessCategoty,
    businessTypeOptions,
    servedArea,
    operationPorts,
} = SelectionOptions;

class CompanyView extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            addressSearchText: null,
            errors: {},
            touched: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.updateServedArea = this.updateServedArea.bind(this);
        this.updateOperationPorts = this.updateOperationPorts.bind(this);
        this.updateCompany = this.updateCompany.bind(this);
        this.getCompanyData = this.getCompanyData.bind(this);
        this.createCompany = this.createCompany.bind(this);
        this.setExistingCompanyInfo = this.setExistingCompanyInfo.bind(this);
    }
    componentWillMount() {
        this.setExistingCompanyInfo(this.props);
    }
    componentWillReceiveProps = nextProps => {
        this.setExistingCompanyInfo(nextProps);
    };

    setExistingCompanyInfo(props) {
        const company = props.user.company;
        if (company) {
            const { carrierInfo } = company;
            // update mode.
            let newState;
            newState = {
                ...company,
                address: null,
                addressText: company.address,
                companyName: company.name,
            };
            if (carrierInfo) {
                newState = {
                    ...newState,
                    mc: carrierInfo.mc,
                    dot: carrierInfo.dot,
                    haz: carrierInfo.hazmat,
                    oversize: carrierInfo.oversize,
                    overweight: carrierInfo.overweight,
                    ocean: carrierInfo.serviceTypeDrayage,
                    rail: carrierInfo.serviceTypeRailDrayage,
                    iso: carrierInfo.serviceTypeTankDrayage,
                    oog: carrierInfo.serviceTypeOversize,
                    hazardous: carrierInfo.serviceTypeHazmat,
                    customs: carrierInfo.serviceTypeBondedWarehouse,
                    stateServed: _.map(
                        _.filter(company.operationStateArea, val => {
                            return val.type === 'state';
                        }),
                        'name',
                    ),
                    operationArea: _.map(
                        _.filter(company.operationStateArea, val => {
                            return val.type === 'area';
                        }),
                        'name',
                    ),
                };
            }
            this.setState(newState);
        }
    }
    handleChange(v, type) {
        let value = v;
        if (type === 'phone') {
            value = PhoneNumberUtil.getValueFromMaskedPhoneNumber(v);
        }
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
    updateOperationPorts({ name, value }) {
        this.setState({
            operationArea: value,
        });
    }
    validateFormValues(values, isSubmitting) {
        const fieldErrors = {};

        if (!values.companyName) {
            fieldErrors.companyName = 'Please enter the company name';
        }
        if (!values.businessType) {
            fieldErrors.businessType = 'Please select the business type';
        }
        if (!values.type) {
            fieldErrors.type = 'Please select the type';
        }
        if (values.businessType === 'Sole Proprietor' && !values.taxId) {
            fieldErrors.taxId = 'Please enter your ssn';
        }
        if (
            values.businessType &&
            values.businessType !== 'Sole Proprietor' &&
            !values.taxId
        ) {
            fieldErrors.taxId = 'Please enter your tax Id';
        }
        if (!values.addressText) {
            fieldErrors.addressText = 'Please enter your address';
        }
        if (!values.phone) {
            fieldErrors.phone = 'Please enter your phone number';
        }
        if (!values.email) {
            fieldErrors.email = 'Please enter your email';
        }

        if (
            (values.type === 'Owner Operator' ||
                values.type === 'Trucking Company') &&
            !values.dot
        ) {
            fieldErrors.dot = 'Please enter your DOT #';
        }

        this.setState({
            errors: fieldErrors,
        });

        //set all error fields to touched
        if (isSubmitting) {
            const touchedFields = this.state.touched;

            _.each(fieldErrors, (value, key, list) => {
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

    showError(fieldName) {
        let errorText = '';
        if (this.state.errors[fieldName] && this.state.touched[fieldName]) {
            errorText = this.state.errors[fieldName];
        }

        return <div className="fieldError">{errorText}</div>;
    }

    async getCompanyData() {
        const input = this.state;
        const companyData = _.pick(input, [
            'id',
            'phone',
            'email',
            'businessType',
            'SCAC',
            'type',
            'notes',
            'taxId',
        ]);
        // see if we need to rebuild the address object.
        const oldAddress = _.get(this.props, 'user.company.address');
        if (input.addressText !== oldAddress) {
            // seems new address entered. need to rebuild address object
            companyData.address = await AddressObjUtil.getAddressObject(input.addressText);
        }
        companyData.name = input.companyName;
        //input.address = input.address.address;
        companyData.carrierInfo = {
            mc: input.mc,
            dot: input.dot,
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
        companyData.operationArea = this.state.operationArea;
        return companyData;
    }
    async createCompany() {
        if (!this.validateFormValues(this.state, true)) return;
        const companyData = await this.getCompanyData();
        this.props.createCompany(companyData);
    }
    async updateCompany() {
        if (!this.validateFormValues(this.state, true)) return;
        const companyData = await this.getCompanyData();
        this.props.updateCompany(companyData);
    }

    render() {
        const {
                type,
                businessType,
                companyName,
                taxId,
                addressText,
                email,
                SCAC,
                mc,
                dot,
                haz,
                oversize,
                overweight,
                notes,
                stateServed,
                operationArea,
                ocean,
                rail,
                iso,
                customs,
                oog,
                hazardous,
                errors,
            } = this.state,
            mode = _.get(this.props, 'user.company') ? 'update' : 'create',
            phone = PhoneNumberUtil.formatPhoneNumber(this.state.phone);
        // const hasError = _.isNil(code) || _.isEmpty(code);
        return (
            <div className="company-view-container">
                <div className="company-fields">
                    <TextField
                        // className="md-cell md-cell--5"
                        id="idCompanyName"
                        label="Company Name *"
                        error={errors.companyName}
                        errorText={this.showError('companyName')}
                        value={companyName}
                        onChange={value =>
                            this.handleChange(value, 'companyName')
                        }
                    />
                    <SelectField
                        id="idBusinessCategory"
                        label="Business Category *"
                        menuItems={businessCategoty}
                        position={SelectField.Positions.BELOW}
                        value={type}
                        disabled={mode === 'update'}
                        itemLabel="Name"
                        itemValue="Name"
                        sameWidth
                        error={errors.type}
                        errorText={this.showError('type')}
                        onChange={value => this.handleChange(value, 'type')}
                    />
                    <SelectField
                        id="idBusinessEntityType"
                        label="Business Entity Type"
                        menuItems={businessTypeOptions}
                        position={SelectField.Positions.BELOW}
                        value={businessType}
                        itemLabel="Name"
                        itemValue="Name"
                        sameWidth
                        error={errors.businessType}
                        errorText={this.showError('businessType')}
                        onChange={value =>
                            this.handleChange(value, 'businessType')
                        }
                    />

                    <TextField
                        label="Tax ID (or Social Security # if Sole Proprietor)"
                        required
                        value={taxId}
                        error={errors.taxId}
                        errorText={this.showError('taxId')}
                        onChange={value => this.handleChange(value, 'taxId')}
                    />

                    {/* <AutocompletePlace
                        label="Address"
                        initialText={addressSearchText}
                        required
                        error={errors.address}
                        errorText={this.showError('address')}
                        value={address}
                        onAutocomplete={(geoData, searchText, index) => {
                            this.handleAddressChange(geoData, 'address');
                        }}
                    /> */}
                    <TextField
                        label="Address"
                        required
                        value={addressText}
                        error={errors.addressText}
                        errorText={this.showError('addressText')}
                        onChange={value =>
                            this.handleChange(value, 'addressText')
                        }
                    />
                    <TextField
                        label="Phone Number"
                        required
                        value={phone}
                        error={errors.phone}
                        errorText={this.showError('phone')}
                        onChange={value => this.handleChange(value, 'phone')}
                    />

                    <TextField
                        label="Billing Email"
                        required
                        value={email}
                        error={errors.email}
                        errorText={this.showError('email')}
                        onChange={value => this.handleChange(value, 'email')}
                    />

                    <TextField
                        label="SCAC# (If Applicable)"
                        value={SCAC}
                        errorText="Please enter the SCAC#"
                        onChange={value => this.handleChange(value, 'SCAC')}
                    />
                    {(type === 'Owner Operator' ||
                        type === 'Trucking Company') && (
                        <TextField
                            // className="md-cell md-cell--5"
                            label="DOT#"
                            value={dot}
                            error={errors.dot}
                            errorText={this.showError('dot')}
                            onChange={value => this.handleChange(value, 'dot')}
                        />
                    )}
                    {(type === 'Owner Operator' ||
                        type === 'Trucking Company') && (
                        <TextField
                            // className="md-cell md-cell--5"
                            label="MC#"
                            value={mc}
                            errorText="Please enter the MC#"
                            onChange={value => this.handleChange(value, 'mc')}
                        />
                    )}

                    {(type === 'Owner Operator' ||
                        type === 'Trucking Company') && (
                        <div className="selected-fields-group">
                            <div className="permit-group">
                                <label className="permit-title">Permits</label>
                                <Checkbox
                                    id="Hazmat"
                                    label="Hazmat"
                                    checked={haz}
                                    onChange={value =>
                                        this.handleChange(value, 'haz')
                                    }
                                />
                                <Checkbox
                                    id="Oversize"
                                    label="Oversize"
                                    checked={oversize}
                                    onChange={value =>
                                        this.handleChange(value, 'oversize')
                                    }
                                />
                                <Checkbox
                                    id="Overweight"
                                    label="Overweight"
                                    checked={overweight}
                                    onChange={value =>
                                        this.handleChange(value, 'overweight')
                                    }
                                />
                            </div>
                            <TextField
                                // className="md-cell md-cell--5"
                                label="Notes"
                                value={notes}
                                lineDirection="right"
                                rows={2}
                                onChange={value =>
                                    this.handleChange(value, 'notes')
                                }
                            />
                            <Field
                                name="stateServed"
                                label="States Served"
                                placeholder="Select states..."
                                type="autocomplete"
                                value={stateServed}
                                options={servedArea}
                                completionType="chip"
                                selectLabel="Name"
                                selectValue="Name"
                                updateForm={params =>
                                    this.updateServedArea(params)
                                }
                                alwaysShowOptions
                            />
                            <Field
                                name="areasOfOperation"
                                label="Areas of Operation"
                                placeholder="Select port..."
                                type="autocomplete"
                                value={operationArea}
                                options={operationPorts}
                                completionType="chip"
                                selectLabel="Name"
                                selectValue="Name"
                                updateForm={params =>
                                    this.updateOperationPorts(params)
                                }
                                alwaysShowOptions
                            />
                            {/* <SelectField
                                label="Areas of Operation"
                                menuItems={operationPorts}
                                position={SelectField.Positions.BELOW}
                                value={operationArea}
                                itemLabel="Name"
                                itemValue="Name"
                                sameWidth
                                onChange={value =>
                                    this.handleChange(value, 'operationArea')
                                }
                            /> */}
                            <div className="service-group">
                                <label className="service-title">
                                    services provided
                                </label>
                                <Checkbox
                                    id="Ocean Port"
                                    label="Ocean Port Drayage"
                                    checked={ocean}
                                    onChange={value =>
                                        this.handleChange(value, 'ocean')
                                    }
                                />
                                <Checkbox
                                    id="RailRamp"
                                    label="Rail Ramp Drayage"
                                    checked={rail}
                                    onChange={value =>
                                        this.handleChange(value, 'rail')
                                    }
                                />
                                <Checkbox
                                    id="ISO"
                                    label="ISO Tank Drayage"
                                    checked={iso}
                                    onChange={value =>
                                        this.handleChange(value, 'iso')
                                    }
                                />
                                <Checkbox
                                    id="oog"
                                    label="Out Of Gage (OOG, Oversize)"
                                    checked={oog}
                                    onChange={value =>
                                        this.handleChange(value, 'oog')
                                    }
                                />
                                <Checkbox
                                    id="Hazardous"
                                    label="Hazardous Material"
                                    checked={hazardous}
                                    onChange={value =>
                                        this.handleChange(value, 'hazardous')
                                    }
                                />
                                <Checkbox
                                    id="Customs"
                                    label="Customs Bonded"
                                    checked={customs}
                                    onChange={value =>
                                        this.handleChange(value, 'customs')
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <CardActions className="register-actions">
                        <Button
                            raised
                            primary
                            className="btn-register"
                            onClick={
                                mode === 'update'
                                    ? this.updateCompany
                                    : this.createCompany
                            }
                            // disabled={hasError}
                        >
                            update company
                        </Button>
                    </CardActions>
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
            updateCompany: companyData => {
                dispatch(CompanyEntity.ui.update(companyData));
                CompanyEntity.after.update = () => {
                    toastMessageHelper.mapSuccessMessage('Company updated successfully');
                    dispatch(UserProfileEntity.ui.get());
                };
            },
            createCompany: companyData => {
                dispatch(CompanyEntity.ui.create(companyData));
                CompanyEntity.after.create = () => {
                    //dispatch(UserProfileEntity.ui.get());
                    window.location = window.location.origin;
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(CompanyView);
