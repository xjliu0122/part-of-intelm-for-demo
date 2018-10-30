import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    Button,
    SelectField,
    DialogContainer,
    CardActions,
    Checkbox,
    TextField,
} from 'react-md';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { DateTimePicker } from 'material-ui-pickers';
import moment from 'moment';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import _ from 'lodash';

import LocationAutocomplete from 'components/Form/locationAutoComplete/index';
import Config from 'components/config';
import TripEntity from 'entities/Trip/action';
import ScheduleEntity from 'entities/Schedule/action';
import './editTrip.scss';

const materialTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
    },
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: '#3f51b5',
            },
        },
        MuiPickersCalendarHeader: {
            switchHeader: {
                // backgroundColor: lightBlue.A200,
                // color: 'white',
            },
        },
        MuiPickerDTTabs: {
            tabs: {
                backgroundColor: '#3f51b5',
            },
        },
        MuiPickersDay: {
            day: {
                color: '#3f51b5',
            },
            selected: {
                backgroundColor: '#3f51b5',
            },
            current: {
                color: '#3f51b5',
            },
        },
        MuiPickersModal: {
            dialogAction: {
                '& > button': {
                    color: '#3f51b5',
                },
            },
        },
        MuiFormControl: {
            root: {
                width: '100%',
                // bottom: '0.2rem',
            },
        },
        MuiMenuItem: {
            root: {
                display: 'flex',
                flexDirection: 'column',
                height: '36px',
            },
        },
        MuiInput: {
            underline: {
                '&:before': {
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                },
            },
        },
    },
});
// const formatDateTimeString = date => {
//     moment(date)
//         .format('MM/DD/YYYY HH:MM');
// };
class AddTripView extends Component {
    constructor(props) {
        super(props);
        //default trip.
        this.state = {
            stops: [
                {
                    stopNo: 1,
                    plannedDateTime: moment()
                        .startOf('Day'),
                    type: null,
                    needAppointment: null,
                    action: null,
                    searchText: '',
                },
            ],
            errors: [],
            touched: [],
            closeConfirmationOpen: false,
        };
        this.addStop = this.addStop.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.removeStop = this.removeStop.bind(this);
        this.submitTrip = this.submitTrip.bind(this);
        this.toggleConfirmWindow = this.toggleConfirmWindow.bind(this);
    }
    componentWillReceiveProps = nextProps => {
        let stops,
            fixedAmount,
            mcInstruction,
            trip;

        if (!_.isEmpty(nextProps.trips) && _.get(nextProps, 'editingTripId')) {
            trip = _.find(
                nextProps.trips,
                t => t.id === _.get(nextProps, 'editingTripId'),
            );
            stops = trip.stop;
            fixedAmount = trip.fixedAmount;
            mcInstruction = trip.mcInstruction;
            _.map(stops, stop => {
                stop.searchText = stop.stopLocation.name;
            });
        }
        if (_.get(nextProps, 'editingTripFromScheduleView')) {
            trip = nextProps.editingTripFromScheduleView;
            stops = trip.stop;
            fixedAmount = trip.fixedAmount;
            mcInstruction = trip.mcInstruction;
            _.map(stops, stop => {
                stop.searchText = stop.stopLocation.name;
            });
        }

        if (_.isEmpty(stops)) {
            stops = [
                {
                    stopNo: 1,
                    // plannedDateTime: moment()
                    //     .startOf('Day'),
                    plannedDateTime: null,
                    type: null,
                    needAppointment: null,
                    action: null,
                    searchText: '',
                },
            ];
        }
        this.setState({
            stops,
            fixedAmount,
            mcInstruction,
            editingTrip: trip,
        });
    };
    validateFormValues(values) {
        const setFieldError = [];
        const fieldErrors = {};
        _.forEach(values.stops, stop => {
            // if (!stop.plannedDateTime) {
            //     fieldErrors.plannedDateTime = 'Please select date and time';
            // }
            if (!stop.type) {
                fieldErrors.type = true;
            }
            if (!stop.action) {
                fieldErrors.action = true;
            }
            if (!stop.searchText) {
                fieldErrors.searchText = true;
            }
            if (!_.isEmpty(fieldErrors)) {
                setFieldError[stop.stopNo - 1] = fieldErrors;
            }
        });
        if (values.stops.length < 2) {
            fieldErrors.stopNumber = true;
        }
        this.setState({
            errors: setFieldError,
        });
        if (_.isEmpty(setFieldError)) {
            return true;
        }
        return false;
    }

    submitTrip() {
        if (!this.validateFormValues(this.state)) return;
        let tripToSubmit = {};
        const { containerId, currentTripsSize } = this.props,
            {
                editingTrip, stops, fixedAmount, mcInstruction,
            } = this.state;
        _.map(stops, stop => {
            stop.stopLocationId = _.get(stop, 'stopLocation.id');
        });
        let refNo;
        const tripRowNo = currentTripsSize || 0;
        if (!this.props.editingTripFromScheduleView) {
            if (editingTrip) {
                refNo = _.join(
                    [
                        _.get(this.props, 'job.name'),
                        _.get(this.props, 'container.seqNo'),
                        editingTrip.rowNo,
                    ],
                    '-',
                );
            } else {
                refNo = _.join(
                    [
                        _.get(this.props, 'job.name'),
                        _.get(this.props, 'container.seqNo'),
                        tripRowNo + 1,
                    ],
                    '-',
                );
            }
        }

        if (!editingTrip) {
            // new trip
            tripToSubmit = {
                rowNo: currentTripsSize + 1,
                containerId,
                fixedAmount,
                mcInstruction,
                stop: stops,
            };
            if (refNo) tripToSubmit.refNo = refNo;
            this.props.createTrip(tripToSubmit, this.props.openEditTrip);
        } else {
            // update existing trip
            tripToSubmit = {
                ...editingTrip,
                fixedAmount,
                mcInstruction,
                stop: stops,
            };
            if (refNo) tripToSubmit.refNo = refNo;
            //if this is called from Scehdule Planning View, need to retrieve updated info for a couple of other reducers.
            const loadOther = !_.isNil(_.get(this.props, 'editingTripFromScheduleView'));
            const scheduleViewloadParams = _.get(
                this.props,
                'scheduleViewloadParams',
            );
            this.props.updateTrip(
                tripToSubmit,
                this.props.openEditTrip,
                loadOther,
                scheduleViewloadParams,
            );
        }
    }
    addStop(index) {
        const stops = [].concat(this.state.stops);
        stops.splice(index + 1, 0, {
            plannedDateTime: null,
            type: null,
            needAppointment: null,
            action: null,
            searchText: '',
        });
        _.each(stops, (item, i) => {
            item.stopNo = i + 1;
        });
        this.setState({
            stops,
        });
    }

    removeStop(index) {
        const stops = [].concat(this.state.stops);
        stops.splice(index, 1);
        _.each(stops, (item, i) => {
            item.stopNo = i + 1;
        });
        this.setState({
            stops,
        });
    }

    handleChange(value, type, index) {
        const stops = [].concat(this.state.stops);
        const errorFields = this.state.errors;
        if (!_.isEmpty(errorFields[index]) && errorFields[index][type]) {
            errorFields[index][type] = null;
        }
        const singleStop = {
            ...stops[index],
            [type]: value,
        };
        if (type === 'stopLocation') {
            singleStop.searchText = value.name;
        }
        stops.splice(index, 1, singleStop);
        this.setState({
            stops,
            errors: errorFields,
        });
    }
    handleFixedAmountChange(value) {
        this.setState({ fixedAmount: value });
    }
    handlemcInstructionChange(value) {
        this.setState({ mcInstruction: value });
    }
    closeEditTrip() {
        this.props.openEditTrip(false);
        this.setState({
            errors: {},
        });
    }
    toggleConfirmWindow(force = false) {
        if (!force) {
            this.setState({
                closeConfirmationOpen: !this.state.closeConfirmationOpen,
            });
        } else {
            this.closeEditTrip();
        }
    }
    render() {
        const {
            handleChange, addStop, removeStop, submitTrip,
        } = this;
        const {
            stops,
            errors,
            fixedAmount,
            editingTrip,
            mcInstruction,
        } = this.state;
        const { isOpen, openEditTrip } = this.props,
            { toggleConfirmWindow } = this,
            actions = [];
        actions.push({
            secondary: true,
            children: 'Cancel',
            onClick: () => toggleConfirmWindow(),
        });
        actions.push(<Button
            flat
            primary
            onClick={() => {
                toggleConfirmWindow();
                this.closeEditTrip();
            }}
        >
                Confirm
        </Button>);
        return (
            <MuiThemeProvider theme={materialTheme}>
                <DialogContainer
                    id="editTripDialogue"
                    contentClassName="editTripDialogueContent"
                    visible={isOpen}
                    aria-labelledby="view detail"
                    focusOnMount={false}
                    //modal
                    fullPage
                >
                    <header className="modal-header">
                        <section>
                            <h2>edit trip</h2>
                        </section>

                        <Button
                            icon
                            primary
                            onClick={() => {
                                toggleConfirmWindow();
                            }}
                        >
                            close
                        </Button>
                    </header>
                    <div className="row trip-area">
                        <div className="trip-table-area col-9">
                            <DataTable plain>
                                <TableHeader>
                                    <TableRow className="row trip-table-header-row">
                                        <TableColumn className="col-1">
                                            stop
                                        </TableColumn>
                                        <TableColumn className="col-1">
                                            status
                                        </TableColumn>
                                        <TableColumn className="col-2">
                                            date/time
                                        </TableColumn>
                                        <TableColumn className="col-1">
                                            type
                                        </TableColumn>
                                        <TableColumn className="col-3">
                                            stop at
                                        </TableColumn>
                                        <TableColumn className="col-1">
                                            Action
                                        </TableColumn>
                                        <TableColumn className="col-1">
                                            Apmt?
                                        </TableColumn>
                                        <TableColumn className="col-1">
                                            Apmt#
                                        </TableColumn>
                                        <TableColumn className="col-1" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stops.map((
                                        {
                                            stopNo,
                                            status,
                                            plannedDateTime,
                                            type,
                                            stopLocation,
                                            searchText,
                                            action,
                                            needAppointment,
                                            appointmentNo,
                                        },
                                        index,
                                    ) => (
                                        <TableRow
                                            className="row trip-table-row"
                                            // key={`trip-table-row-${stopNo}`}
                                        >
                                            <TableColumn className="col-1">
                                                {stopNo}
                                            </TableColumn>
                                            <TableColumn className="col-1">
                                                {status}
                                            </TableColumn>
                                            <TableColumn className="col-2">
                                                <MuiPickersUtilsProvider
                                                    utils={DateFnsUtils}
                                                >
                                                    <DateTimePicker
                                                        value={
                                                            plannedDateTime
                                                        }
                                                        onChange={value =>
                                                            handleChange(
                                                                value,
                                                                'plannedDateTime',
                                                                index,
                                                            )
                                                        }
                                                        format="MM/DD/YYYY HH:mm"
                                                        showTodayButton
                                                        clearable
                                                    />
                                                </MuiPickersUtilsProvider>

                                                {errors[index] &&
                                                        errors[index]
                                                            .plannedDateTime && (
                                                    <label className="error-message">
                                                                please select
                                                                the time
                                                    </label>
                                                )}
                                            </TableColumn>
                                            <TableColumn className="col-1 type">
                                                <SelectField
                                                    // errorText="*required"
                                                    menuItems={
                                                        Config.TripTypeOptions
                                                    }
                                                    position={
                                                        SelectField
                                                            .Positions.BELOW
                                                    }
                                                    value={type}
                                                    error={
                                                        errors[index] &&
                                                            errors[index].type
                                                    }
                                                    sameWidth
                                                    onChange={value =>
                                                        handleChange(
                                                            value,
                                                            'type',
                                                            index,
                                                        )
                                                    }
                                                />
                                                {errors[index] &&
                                                        errors[index].type && (
                                                    <label className="error-message">
                                                                please select
                                                                the type
                                                    </label>
                                                )}
                                            </TableColumn>
                                            <TableColumn className="col-3 location">
                                                <LocationAutocomplete
                                                    // label="Stops at"
                                                    required
                                                    searchText={searchText}
                                                    selected={stopLocation}
                                                    // error={errors[index] && errors[index].searchText}
                                                    handleSearchTextChange={value =>
                                                        handleChange(
                                                            value,
                                                            'searchText',
                                                            index,
                                                        )
                                                    }
                                                    initialText=""
                                                    placeholder="Select or Search..."
                                                    handleSelected={value => {
                                                        handleChange(
                                                            value,
                                                            'stopLocation',
                                                            index,
                                                        );
                                                    }}
                                                />
                                                {errors[index] &&
                                                        errors[index]
                                                            .searchText && (
                                                    <div className="error-address">
                                                        <label className="error-message address">
                                                                    please
                                                                    select an
                                                                    address
                                                        </label>
                                                    </div>
                                                )}
                                            </TableColumn>
                                            <TableColumn className="col-1 type">
                                                <SelectField
                                                    // required
                                                    // errorText="*required"
                                                    menuItems={
                                                        Config.TripActionOptions
                                                    }
                                                    position={
                                                        SelectField
                                                            .Positions.BELOW
                                                    }
                                                    value={action}
                                                    error={
                                                        errors[index] &&
                                                            errors[index]
                                                                .searchText
                                                    }
                                                    onChange={value =>
                                                        handleChange(
                                                            value,
                                                            'action',
                                                            index,
                                                        )
                                                    }
                                                />
                                                {errors[index] &&
                                                        errors[index]
                                                            .action && (
                                                    <label className="error-message">
                                                                please select
                                                                the action
                                                    </label>
                                                )}
                                            </TableColumn>
                                            <TableColumn className="col-1 type">
                                                <Checkbox
                                                    id={`chkNeedAppointment${index}`}
                                                    className="checkBoxInRow"
                                                    checked={
                                                        needAppointment
                                                    }
                                                    onChange={value =>
                                                        handleChange(
                                                            value,
                                                            'needAppointment',
                                                            index,
                                                        )
                                                    }
                                                />
                                            </TableColumn>
                                            <TableColumn className="col-1 type">
                                                <TextField
                                                    className="aptNoField"
                                                    placeholder=""
                                                    value={appointmentNo}
                                                    onChange={value =>
                                                        handleChange(
                                                            value,
                                                            'appointmentNo',
                                                            index,
                                                        )
                                                    }
                                                />
                                            </TableColumn>
                                            <TableColumn className="col-1">
                                                {
                                                    <div className="trip-action-buttons">
                                                        <IconButton
                                                            onClick={() => {
                                                                addStop(index);
                                                            }}
                                                            title="Add additonal stop"
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            disabled={
                                                                _.size(stops) < 2
                                                            }
                                                            onClick={() => {
                                                                removeStop(index);
                                                            }}
                                                            title="Remove stop"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                }
                                            </TableColumn>
                                        </TableRow>
                                    ))}
                                    <TableRow className="row trip-table-row">
                                        {errors[0] &&
                                            errors[0].stopNumber && (
                                            <label className="error-message">
                                                    please add at least two
                                                    stops
                                            </label>
                                        )}
                                    </TableRow>
                                </TableBody>
                            </DataTable>
                        </div>
                        <div className="information-area col-3">
                            <div className="job-info">
                                <TextField
                                    className="fixedAmoutField"
                                    label="Fixed Amount"
                                    placeholder=""
                                    value={fixedAmount}
                                    onChange={value =>
                                        this.handleFixedAmountChange(value)
                                    }
                                />

                                <TextField
                                    className="mcInstructionField"
                                    label="MC Instructions"
                                    placeholder=""
                                    rows="5"
                                    value={mcInstruction}
                                    onChange={value =>
                                        this.handlemcInstructionChange(value)
                                    }
                                />
                                <h2>Aux Info</h2>

                                <div className="row">
                                    <label className="label">Port</label>
                                    <div className="text-value">
                                        {_.get(this.props, 'job.port.name')}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">
                                        Ocean Carrier
                                    </label>
                                    <div className="text-value">
                                        {_.get(
                                            this.props,
                                            'job.jobExportDetail.marineCarrier',
                                        ) ||
                                            _.get(
                                                this.props,
                                                'job.jobImportDetail.marineCarrier',
                                            )}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">Vessel Name</label>
                                    <div className="text-value">
                                        {_.get(
                                            this.props,
                                            'job.jobExportDetail.vesselName',
                                        ) ||
                                            _.get(
                                                this.props,
                                                'job.jobImportDetail.vesselName',
                                            )}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">Voyage #</label>
                                    <div className="text-value">
                                        {_.get(
                                            this.props,
                                            'job.jobExportDetail.voyageNumber',
                                        ) ||
                                            _.get(
                                                this.props,
                                                'job.jobImportDetail.voyageNumber',
                                            )}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">Terminal</label>
                                    <div className="text-value">
                                        {_.get(
                                            this.props,
                                            'job.jobExportDetail.terminal',
                                        ) ||
                                            _.get(
                                                this.props,
                                                'job.jobImportDetail.terminal',
                                            )}
                                    </div>
                                </div>
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">ETD</label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'job.jobExportDetail.dateOfDeparture',
                                            )
                                                ? moment(this.props.job
                                                    .jobExportDetail
                                                    .dateOfDeparture)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">
                                            Empty Requested Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.emptyRequestDate',
                                            )
                                                ? moment(this.props.container
                                                    .emptyRequestDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">
                                            Load Ready Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.loadReadyDate',
                                            )
                                                ? moment(this.props.container
                                                    .loadReadyDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">
                                            Req. PU. Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.pickupDate',
                                            )
                                                ? moment(this.props.container
                                                    .pickupDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">
                                            PU. Address
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.pickupFromLocation.address',
                                            ) || ''}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">
                                            Empty Start Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'job.jobExportDetail.emptyStartDate',
                                            )
                                                ? moment(this.props.job
                                                    .jobExportDetail
                                                    .emptyStartDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">
                                            Full Start Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'job.jobExportDetail.fullStartDate',
                                            )
                                                ? moment(this.props.job
                                                    .jobExportDetail
                                                    .fullStartDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Export' && (
                                    <div className="row">
                                        <label className="label">
                                            Cut Off Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'job.jobExportDetail.cutOffDate',
                                            )
                                                ? moment(this.props.job
                                                    .jobExportDetail
                                                    .cutOffDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}

                                {_.get(this.props, 'job.type') === 'Import' && (
                                    <div className="row">
                                        <label className="label">ETA</label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'job.jobImportDetail.etaDate',
                                            )
                                                ? moment(this.props.job
                                                    .jobImportDetail
                                                    .etaDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Import' && (
                                    <div className="row">
                                        <label className="label">
                                            LFD PU Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'job.jobImportDetail.lastFreeDate',
                                            )
                                                ? moment(this.props.job
                                                    .jobImportDetail
                                                    .lastFreeDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Import' && (
                                    <div className="row">
                                        <label className="label">
                                            MT Ready Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.emptyReadyDate',
                                            )
                                                ? moment(this.props.container
                                                    .emptyReadyDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Import' && (
                                    <div className="row">
                                        <label className="label">
                                            LFD Return Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.lfdEmptyReturnDate',
                                            )
                                                ? moment(this.props.job
                                                    .jobImportDetail
                                                    .etaDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Import' && (
                                    <div className="row">
                                        <label className="label">
                                            Req. Del. Date
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.deliveryDate',
                                            )
                                                ? moment(this.props.container
                                                    .deliveryDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                )}
                                {_.get(this.props, 'job.type') === 'Import' && (
                                    <div className="row">
                                        <label className="label">
                                            Del. Address
                                        </label>
                                        <div>
                                            {_.get(
                                                this.props,
                                                'container.deliverToLocation.address',
                                            ) || ''}
                                        </div>
                                    </div>
                                )}

                                <div className="row">
                                    <label className="label">Shipper</label>
                                    <div className="text-value">
                                        {_.get(
                                            this.props,
                                            'job.jobImportDetail.shipper',
                                        ) ||
                                            _.get(
                                                this.props,
                                                'job.shipper.name',
                                            )}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">Consignee</label>
                                    <div className="text-value">
                                        {_.get(
                                            this.props,
                                            'job.jobExportDetail.consignee',
                                        ) ||
                                            _.get(
                                                this.props,
                                                'job.consignee.name',
                                            )}
                                    </div>
                                </div>
                                {_.get(
                                    this.props,
                                    'job.jobImportDetail.released',
                                ) && (
                                    <div className="row">
                                        <label className="label">
                                            Release Date
                                        </label>
                                        <div className="text-value">
                                            {moment(_.get(
                                                this.props,
                                                'job.jobImportDetail.released',
                                            ))
                                                .format('MM/DD/YYYY')}
                                        </div>
                                    </div>
                                )}
                                <div className="row">
                                    <label className="label">Port</label>
                                    <div className="text-value">
                                        {_.get(this.props, 'job.port.name')}
                                    </div>
                                </div>

                                <div className="row">
                                    <label className="label">Note</label>
                                    <div className="text-value">
                                        {_.get(this.props, 'job.notes')}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">
                                        Instructions
                                    </label>
                                    <div className="text-value">
                                        {_.get(this.props, 'job.remarks')}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">
                                        Container Type
                                    </label>
                                    <div className="text-value">
                                        {_.get(this.props, 'container.type')}
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="label">
                                        Options / Cargo Class
                                    </label>
                                    <div className="text-value">
                                        {_.get(
                                            this.props,
                                            'container.oversize',
                                        ) && 'Oversize'}{' '}
                                        {_.get(
                                            this.props,
                                            'container.overweight',
                                        ) && 'Overweight'}{' '}
                                        {_.get(
                                            this.props,
                                            'container.hazmat',
                                        ) && 'Hazmat'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="form-footer">
                        <CardActions className="md-divider-border md-divider-border--top">
                            <Button flat primary onClick={submitTrip}>
                                save
                            </Button>
                            <Button
                                flat
                                secondary
                                //className="float-right"
                                onClick={() => {
                                    toggleConfirmWindow();
                                }}
                            >
                                Close
                            </Button>
                        </CardActions>
                    </footer>
                </DialogContainer>
                <DialogContainer
                    id="confirmation-dialog"
                    style={{ zIndex: '999' }}
                    titleClassName="confirmation-dialog-title"
                    contentClassName="confirmation-dialog-content"
                    footerClassName="confirmation-dialog-footer"
                    visible={this.state.closeConfirmationOpen}
                    onHide={this.toggleConfirmWindow}
                    actions={actions}
                    title="Attention"
                >
                    Unsaved data will be lost. Do you want to continue?
                </DialogContainer>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            trips: state.tripReducer.trips,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            createTrip: (params, closeEditWindow) => {
                dispatch(TripEntity.ui.create(params));
                TripEntity.after.create = () => {
                    closeEditWindow(false);
                };
            },
            updateTrip: (
                params,
                closeEditWindow,
                loadOthers,
                scheduleViewloadParams,
            ) => {
                dispatch(TripEntity.ui.update(params));
                TripEntity.after.update = () => {
                    //do not reload for current trip when the window is opened from  main job view
                    if (!loadOthers) {
                        closeEditWindow(false);
                    } else {
                        // load objects for other things.
                        if (scheduleViewloadParams.scheduleId) {
                            // should always be true anyway
                            dispatch(ScheduleEntity.ui.list({
                                id: scheduleViewloadParams.scheduleId,
                            }));
                        }
                        closeEditWindow(false);
                    }
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(AddTripView);
