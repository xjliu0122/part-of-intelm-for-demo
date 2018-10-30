import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import JobEntity from 'entities/Job/action';

import moment from 'moment';
import LocationAutocomplete from 'components/Form/locationAutoComplete/index';
import config from 'components/config';
//React MD
import {
    CardActions,
    Button,
    TextField,
    DatePicker,
    SelectField,
    Autocomplete,
} from 'react-md';
import ContainerTable from './tableContainerForJob';

class EditCrossTown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            touched: {},
            container: [],
            consignee: null,
            shipper: null,
            remarks: '',
            notes: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitJob = this.submitJob.bind(this);
        this.setExistingJobData = this.setExistingJobData.bind(this);
        this.getDataFromQuote = this.getDataFromQuote.bind(this);
        this.validateFormValues = this.validateFormValues.bind(this);
    }
    componentWillMount() {
        this.setExistingJobData(this.props.job);
        this.getDataFromQuote(this.props.quote);
    }
    getDateStringFromUTCDate(date) {
        if (date) {
            return moment(date)
                .format('MM/DD/YYYY');
        }
        return null;
    }
    getDataFromQuote(quote) {
        if (!quote) return;
        const containers = [];
        let index = 0;
        _.map(quote.container, con => {
            index += 1;
            containers.push(_.omit(
                {
                    ...con,
                    rowId: index,
                },
                ['id', 'updatedAt', 'createdAt', 'jobId', 'quoteId'],
            ));
        });
        let data = {
            ...quote,
            
            client: quote.clientId,
            container: containers,
        };
        data = _.omit(data, ['name', 'status']);
        this.setState({
            ...data,
        });
        // if is for client, get client locations
        this.props.getClientLocations({
            id: data.client,
        });
    }
    setExistingJobData(job) {
        if (!job) return;
        const containers = [];
        let index = 0;
        _.map(job.container, con => {
            index += 1;
            containers.push({
                ...con,
                rowId: index,
            });
        });
        const data = {
            ...job,
            client: job.clientId,
            container: containers,
        };

        this.setState({
            ...data,
        });
        // if is for client, get client locations
        this.props.getClientLocations({
            id: data.client,
        });
    }
    handleChange(value, type) {
        this.setState(state => ({
            [type]: value,
            errors: _.omit(state.errors, type),
        }));
    }
    validateFormValues(values, isSubmitting) {
        const fieldErrors = {};
        if (this.props.role === 'dispatcher' && !values.client) {
            fieldErrors.client = true;
        }
        if (!values.clientRefNo) {
            fieldErrors.clientRefNo = true;
        }
        // if (!values.consignee) {
        //     fieldErrors.consignee = true;
        // }
        // if (!values.shipper) {
        //     fieldErrors.shipper = true;
        // }
        if (!values.container.length) {
            fieldErrors.container = true;
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
    getContainersForSubmit(containers) {
        return _.map(containers, (container, index) => {
            return {
                ...container,
                deliverToLocationId: _.get(container, 'deliverToLocation.id'),
                pickupFromLocationId: _.get(container, 'pickupFromLocation.id'),
                seqNo: index + 1,
            };
        });
    }
    submitJob() {
        if (!this.validateFormValues(this.state, true)) return;
        let formValues = { ...this.state };
        if (formValues.consignee) {
            formValues.consigneeId = formValues.consignee.id;
        }
        if (formValues.shipper) formValues.shipperId = formValues.shipper.id;
        if (formValues.client) formValues.clientId = formValues.client;
        formValues.container = this.getContainersForSubmit(formValues.container);
        formValues = _.omit(formValues, [
            'touched',
            'errors',
            'client',
            'shipper',
            'consignee',
        ]);

        formValues = _.omit(formValues, ['containers']);
        formValues.type = 'Cross Town';
        if (this.props.quote) {
            formValues.fromQuote = this.props.quote.name;
        }
        const { closeWindow } = this.props;
        if (formValues.name) {
            this.props.updateJob(formValues, closeWindow);
        } else this.props.createJob(formValues, closeWindow);
    }

    render() {
        const {
                closeWindow,
                role,
                getClientLocations,
                clearClientLocations,
            } = this.props,
            {
                name,
                errors,
                notes,
                consignee,
                client,
                clientRefNo,
                shipper,
                remarks,
                container,
            } = this.state,
            allBCO = _.map(
                this.props.allBCO,
                _.partialRight(_.pick, ['id', 'name']),
            );

        return (
            <div>
                <div className="header-title">
                    <h2>
                        {name ? 'Edit' : 'Add'} Crosstown Job{' '}
                        {name ? ` / ${name}` : ''}
                    </h2>

                    <i
                        className="material-icons icon-close"
                        onClick={() => closeWindow()}
                    >
                        close
                    </i>
                </div>

                <div className="main-edit-workspace">
                    {role === 'dispatcher' && (
                        <div className="row">
                            <div className="col-12">
                                <Autocomplete
                                    id="autoCompForSearchCompany"
                                    label="Client *"
                                    placeholder="Search..."
                                    data={allBCO}
                                    value={_.get(
                                        _.find(allBCO, { id: client }),
                                        'name',
                                    )}
                                    dataLabel="name"
                                    dataValue="id"
                                    error={errors.client}
                                    onChange={() => {
                                        this.handleChange(null, 'client');
                                        clearClientLocations();
                                    }}
                                    onAutocomplete={suggestion => {
                                        this.handleChange(suggestion, 'client');
                                        getClientLocations({ id: suggestion });
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="row">
                        <div className="col-6">
                            <TextField
                                label="Client Reference # *"
                                placeholder=""
                                value={clientRefNo}
                                error={errors.clientRefNo}
                                // errorText={this.showError('clientRefNo')}
                                onChange={value =>
                                    this.handleChange(value, 'clientRefNo')
                                }
                            />
                        </div>
                        <div
                            className={`col-6 consigneefield ${
                                errors.consignee ? 'error' : ''
                            }`}
                        >
                            <LocationAutocomplete
                                label="Consignee"
                                placeholder=""
                                initialText={_.get(consignee, 'name')}
                                // error={errors.consignee}
                                handleSelected={value =>
                                    this.handleChange(value, 'consignee')
                                }
                                handleSearchTextChange={() =>
                                    this.handleChange(null, 'consignee')
                                }
                            />
                        </div>
                        <div className="col-6">
                            <LocationAutocomplete
                                label="Shipper"
                                placeholder=""
                                initialText={_.get(shipper, 'name')}
                                // error={errors.shipper}
                                // errorText={this.showError('shipper')}
                                handleSelected={value =>
                                    this.handleChange(value, 'shipper')
                                }
                                handleSearchTextChange={() =>
                                    this.handleChange(null, 'shipper')
                                }
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <TextField
                                label="Instructions"
                                value={remarks}
                                lineDirection="right"
                                rows={2}
                                onChange={value =>
                                    this.handleChange(value, 'remarks')
                                }
                            />
                        </div>
                        {role === 'dispatcher' && (
                            <div className="col-6">
                                <TextField
                                    label="Notes"
                                    value={notes}
                                    lineDirection="right"
                                    rows={2}
                                    onChange={value =>
                                        this.handleChange(value, 'notes')
                                    }
                                />
                            </div>
                        )}
                    </div>
                    <div className="row container-table">
                        <h4>Containers: {this.state.container.length || 0}</h4>
                    </div>
                    <div className="row container-table">
                        <ContainerTable
                            rows={container}
                            error={errors.container}
                            jobType="Cross Town"
                            handleChange={value =>
                                this.handleChange(value, 'container')
                            }
                        />
                    </div>
                    {errors.container && (
                        <div className="containerError">
                            Please update and save your data before submission.
                        </div>
                    )}
                </div>

                <div className="form-footer">
                    <CardActions className="md-divider-border md-divider-border--top">
                        <Button
                            flat
                            primary
                            className="float-right"
                            onClick={this.submitJob}
                        >
                            submit
                        </Button>
                        <Button
                            flat
                            secondary
                            className="float-right"
                            onClick={() => closeWindow()}
                        >
                            Close
                        </Button>
                    </CardActions>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
        return {
            allBCO: state.companyReducer.bco,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            createJob: (data, closeWindow) => {
                dispatch(JobEntity.ui.create(data));
                JobEntity.after.create = () => {
                    closeWindow(true);
                };
            },
            updateJob: (data, closeWindow) => {
                dispatch(JobEntity.ui.update(data));
                JobEntity.after.update = () => {
                    closeWindow(true);
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(EditCrossTown);
