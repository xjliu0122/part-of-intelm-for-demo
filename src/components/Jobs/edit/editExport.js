import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
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

import JobEntity from 'entities/Job/action';

// entities
// import UserProfileEntity from 'entities/UserProfile/action';

class EditExport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            touched: {},
            container: [],
            billOfLading: null,
            marineCarrier: '',
            terminal: '',
            vesselName: '',
            voyageNumber: '',
            lastFreeDate: null,
            port: null,
            cutOffDate: null,
            remarks: '',
            notes: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitJob = this.submitJob.bind(this);
        this.setExistingJobData = this.setExistingJobData.bind(this);
        this.validateFormValues = this.validateFormValues.bind(this);
        this.getDataFromQuote = this.getDataFromQuote.bind(this);
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
            //jobdetails
            ..._.omit(job.jobExportDetail, ['id', 'miscFields']),
            dateOfDeparture: this.getDateStringFromUTCDate(job.jobExportDetail.dateOfDeparture),
            emptyStartDate: this.getDateStringFromUTCDate(job.jobExportDetail.emptyStartDate),
            fullStartDate: this.getDateStringFromUTCDate(job.jobExportDetail.fullStartDate),
            cutOffDate: this.getDateStringFromUTCDate(job.jobExportDetail.cutOffDate),
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
        if (!values.booking) {
            fieldErrors.booking = true;
        }
        if (this.props.role === 'dispatcher' && !values.consignee) {
            fieldErrors.consignee = true;
        }
        if (!values.shipper) {
            fieldErrors.shipper = true;
        }
        if (!values.port) {
            fieldErrors.port = true;
        }
        if (!values.container.length) {
            fieldErrors.container = true;
        }
        if (!values.dateOfDeparture) {
            fieldErrors.dateOfDeparture = true;
        }
        if (!values.marineCarrier) {
            fieldErrors.marineCarrier = true;
        }
        if (this.props.role === 'dispatcher' && !values.cutOffDate) {
            fieldErrors.cutOffDate = true;
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

        if (formValues.shipper) formValues.shipperId = formValues.shipper.id;
        if (formValues.port) formValues.portId = formValues.port.id;
        if (formValues.client) formValues.clientId = formValues.client;
        formValues.container = this.getContainersForSubmit(formValues.container);
        formValues = _.omit(formValues, [
            'touched',
            'errors',
            'client',
            'shipper',
        ]);

        const jobExportDetail = _.pick(formValues, [
            'booking',
            'dateOfDeparture',
            'marineCarrier',
            'terminal',
            'vesselName',
            'voyageNumber',
            'emptyStartDate',
            'fullStartDate',
            'cutOffDate',
            'consignee',
        ]);
        formValues = _.omit(formValues, [
            'booking',
            'dateOfDeparture',
            'marineCarrier',
            'terminal',
            'vesselName',
            'voyageNumber',
            'emptyStartDate',
            'fullStartDate',
            'cutOffDate',
            'consignee',
        ]);
        formValues.jobExportDetail = jobExportDetail;
        formValues.type = 'Export';
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
                dateOfDeparture,
                notes,
                port,
                terminal,
                emptyStartDate,
                fullStartDate,
                vesselName,
                voyageNumber,
                consignee,
                client,
                clientRefNo,
                booking,
                shipper,
                marineCarrier,
                remarks,
                container,
                cutOffDate,
            } = this.state,
            allBCO = _.map(
                this.props.allBCO,
                _.partialRight(_.pick, ['id', 'name']),
            );
        return (
            <div>
                <div className="header-title">
                    <h2>{name ? 'Edit' : 'Add'} Export Job</h2>
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
                                    // errorText={this.showError('client')}
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
                                label="Client Reference #"
                                placeholder=""
                                value={clientRefNo}
                                error={errors.clientRefNo}
                                // errorText={this.showError('clientRefNo')}
                                onChange={value =>
                                    this.handleChange(value, 'clientRefNo')
                                }
                            />
                        </div>
                        <div className="col-6">
                            <TextField
                                label="Ocean Carrier Booking# *"
                                value={booking}
                                placeholder=""
                                error={errors.booking}
                                // errorText={this.showError('booking')}
                                onChange={value =>
                                    this.handleChange(value, 'booking')
                                }
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 consigneefield">
                            <TextField
                                label={
                                    role === 'bco' ? 'Consignee' : 'Consignee *'
                                }
                                value={consignee}
                                placeholder=""
                                error={errors.consignee}
                                onChange={value =>
                                    this.handleChange(value, 'consignee')
                                }
                            />
                        </div>

                        <div
                            className={`col-6 ${errors.shipper ? 'error' : ''}`}
                        >
                            <LocationAutocomplete
                                label="Shipper *"
                                placeholder=""
                                initialText={_.get(shipper, 'name')}
                                error={errors.shipper}
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
                        <div
                            className={`col-6 dischargeField ${
                                errors.deliverToLocation ? 'error' : ''
                            }`}
                        >
                            <LocationAutocomplete
                                label="Port *"
                                error={errors.port}
                                port
                                initialText={_.get(port, 'name')}
                                placeholder="Select or Search..."
                                handleSelected={value =>
                                    this.handleChange(value, 'port')
                                }
                                handleSearchTextChange={() =>
                                    this.handleChange(null, 'port')
                                }
                            />
                        </div>
                        <div className="col-6">
                            <TextField
                                label="Terminal"
                                placeholder=""
                                value={terminal}
                                onChange={value =>
                                    this.handleChange(value, 'terminal')
                                }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <TextField
                                label="Marine Carrier Name *"
                                placeholder=""
                                value={marineCarrier}
                                error={errors.marineCarrier}
                                // errorText={this.showError('marineCarrier')}
                                onChange={value =>
                                    this.handleChange(value, 'marineCarrier')
                                }
                            />
                        </div>
                        <div className="col-6">
                            <DatePicker
                                label="ETD *"
                                autoOk
                                inline
                                fullWidth={false}
                                readonly={false}
                                value={dateOfDeparture}
                                error={errors.dateOfDeparture}
                                // errorText={this.showError('dateOfDeparture')}
                                onChange={value =>
                                    this.handleChange(
                                        moment(value)
                                            .toDate(),
                                        'dateOfDeparture',
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <TextField
                                label="Vessel Name"
                                placeholder=""
                                value={vesselName}
                                onChange={value =>
                                    this.handleChange(value, 'vesselName')
                                }
                            />
                        </div>
                        <div className="col-6">
                            <TextField
                                label="Voyage #"
                                placeholder=""
                                value={voyageNumber}
                                onChange={value =>
                                    this.handleChange(value, 'voyageNumber')
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
                    {role === 'dispatcher' && (
                        <div className="row">
                            <div className="col-6">
                                <DatePicker
                                    label="Empty Start Date"
                                    autoOk
                                    inline
                                    fullWidth={false}
                                    readonly={false}
                                    value={emptyStartDate}
                                    onChange={value =>
                                        this.handleChange(
                                            moment(value)
                                                .toDate(),
                                            'emptyStartDate',
                                        )
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <DatePicker
                                    label="Full Start Date"
                                    autoOk
                                    inline
                                    fullWidth={false}
                                    readonly={false}
                                    value={fullStartDate}
                                    onChange={value =>
                                        this.handleChange(
                                            moment(value)
                                                .toDate(),
                                            'fullStartDate',
                                        )
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <DatePicker
                                    label="Cut-off Date *"
                                    autoOk
                                    inline
                                    fullWidth={false}
                                    readonly={false}
                                    value={cutOffDate}
                                    error={errors.cutOffDate}
                                    // errorText={this.showError('cutOffDate')}
                                    onChange={value =>
                                        this.handleChange(
                                            moment(value)
                                                .toDate(),
                                            'cutOffDate',
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}
                    <div className="row container-table">
                        <h4>Containers: {this.state.container.length || 0}</h4>
                    </div>
                    <div className="row container-table">
                        <ContainerTable
                            rows={container}
                            error={errors.container}
                            handleChange={value =>
                                this.handleChange(value, 'container')
                            }
                            jobType="Export"
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

export default connect(mapStateToProps, mapDispatchToProps)(EditExport);
