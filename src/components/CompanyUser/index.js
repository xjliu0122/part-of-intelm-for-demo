import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompanyEntity from 'entities/Company/action';

//React MD
import {
    TextField,
    CardActions,
    Button,
    Card,
    CardTitle,
    CardText,
    SelectionControlGroup,
    Tab,
    Autocomplete,
    SelectField,
    Checkbox,
    SelectionControl,
} from 'react-md';

// component
import Field from 'components/Form/field';
import AutocompletePlace from 'components/Form/googlePlaceAutoComplete';
import SelectionOptions from 'components/config';
import './styles.scss';

const {
    businessCategoty,
    businessTypeOptions,
    servedArea,
    operationPorts,
} = SelectionOptions;

class CompanyUserView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: 'initialize',
            code: null,
            tabName: 'company',
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
    }

    setTab(value) {
        this.setState({
            tabName: value,
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
        const {
            option,
            code,
            tabName,
            type,
            businessType,
            companyName,
            taxId,
            address,
            phone,
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
        } = this.state;
        const hasError = _.isNil(code) || _.isEmpty(code);
        return (
            <div className="setup-view-container">
                <SelectionControlGroup
                    id="setupOptions"
                    name="setupOptions"
                    type="radio"
                    label="What do you want to do?"
                    defaultChecked={false}
                    controls={[
                        {
                            label: 'Initialize a company',
                            value: 'initialize',
                        },
                        {
                            label: 'Join a company with invitation code',
                            value: 'join',
                        },
                    ]}
                    onChange={value => this.handleChange(value, 'option')}
                />
                {option === 'join' && (
                    <Card className="invitation-container">
                        <CardTitle title="verify to join a company" />
                        <CardText>
                            <TextField
                                id="idVerificationCode"
                                className="md-cell md-cell--6"
                                label="verification code"
                                value={code}
                                required
                                errorText="Please enter your code"
                                onChange={value =>
                                    this.handleChange(value, 'code')
                                }
                            />
                            <CardActions className="login-actions">
                                <Button
                                    raised
                                    primary
                                    className="btn-login"
                                    onClick={this.joinCompany}
                                    disabled={hasError}
                                >
                                    Join
                                </Button>
                            </CardActions>
                        </CardText>
                    </Card>
                )}
                {option === 'initialize' && (
                    <div>
                        <div className="select-tab">
                            <div
                                className={`selected ${
                                    tabName === 'company' ? 'on' : ''
                                }`}
                                onClick={() => this.setTab('company')}
                            >
                                Company
                            </div>
                            <div
                                className={`selected ${
                                    tabName === 'personal' ? 'on' : ''
                                }`}
                                onClick={() => this.setTab('personal')}
                            >
                                My Info
                            </div>
                        </div>
                    </div>
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
            registerCompany: companyData => {
                dispatch(CompanyEntity.ui.create(companyData));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUserView);
