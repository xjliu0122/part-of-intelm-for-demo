import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import JobEntity from 'entities/Job/action';
import moment from 'moment';
import { browserHistory } from 'react-router';
import LocationAutocomplete from 'components/Form/locationAutoComplete/index';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
//React MD
import {
    Paper,
    DropdownMenu,
    Button,
    FontIcon,
    AccessibleFakeButton,
    TextField,
    DatePicker,
    Autocomplete,
    SelectField,
} from 'react-md';
import PaperMui from '@material-ui/core/Paper';
import Config from 'components/config';
// component
import Edit from './edit';
import JobListTable from './tableJobList';
import './styles.scss';

class JobView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'list',
            formType: null,
            isEditDialogOpen: false,
            customFilterOpen: false,
            customFilter: {
                //status: 'Active',
            },
        };
        if (_.get(props, 'userProfile.role') === 'bco') {
            this.state.customFilter = {};
        }
        this.handleChange = this.handleChange.bind(this);
        this.setMode = this.setMode.bind(this);
        this.getRemoteData = this.getRemoteData.bind(this);
        this.closeDialogWindow = this.closeDialogWindow.bind(this);
        this.toggleCustomFilterOpen = this.toggleCustomFilterOpen.bind(this);
        this.createSimilarJob = this.createSimilarJob.bind(this);
        this.searchWithCustomFilter = this.searchWithCustomFilter.bind(this);
    }
    componentWillMount = () => {
        const { params } = this.props;
        if (params.jobName) {
            this.setState({
                customFilter: {
                    name: params.jobName,
                },
            });
            this.searchByJobName(params.jobName);
            browserHistory.push('/jobs');
        } else if (
            _.get(this.props, 'userProfile.role') &&
            _.get(this.props, 'userProfile.role') !== 'bco'
        ) {
            this.searchWithCustomFilter();
        } else if (_.get(this.props, 'userProfile.role')) {
            this.searchWithCustomFilter(null, {});
        }
    };
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.userProfile, this.props.userProfile)) {
            if (_.get(nextProps, 'userProfile.role') !== 'bco') {
                this.searchWithCustomFilter();
            } else {
                this.setState({ customFilter: {} });
                this.searchWithCustomFilter(null, {});
            }
        }
    }

    setMode(mode, formAction, formType, job = null) {
        const userrole = _.get(this.props.userProfile, 'role'),
            companySuspended = _.get(
                this.props.userProfile,
                'company.suspended',
            );
        if (userrole === 'bco' && companySuspended) {
            toastMessageHelper.mapApiError('Your account is pending approval.');
        } else {
            this.setState({
                mode,
                formType,
                editingJob: job,
                isEditDialogOpen: mode !== 'list',
            });
        }
    }

    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }
    closeDialogWindow() {
        this.setState({
            isEditDialogOpen: false,
            mode: 'list',
            formType: null,
        });
    }
    toggleCustomFilterOpen() {
        this.setState({
            customFilterOpen: !this.state.customFilterOpen,
        });
    }
    getRemoteData(params) {
        this.searchWithCustomFilter(params);
    }
    searchWithCustomFilter(oDataParams = {}, initialBCOFilter) {
        const cust = initialBCOFilter || { ...this.state.customFilter };
        if (cust.fromDate) {
            cust.fromDate = this.getUtcDayStartTimeStampFromDate(cust.fromDate);
        }
        if (cust.toDate) {
            cust.toDate = this.getUtcDayEndTimeStampFromDate(cust.toDate);
        }
        this.props.getJobsWithFilter({
            ...cust,
            ...oDataParams,
        });
    }
    searchByJobName(name) {
        const cust = { name };
        this.props.getJobsWithFilter({
            ...cust,
        });
    }

    getUtcDayStartTimeStampFromDate(date) {
        if (!date) return null;
        return moment.utc(moment(date)
            .startOf('day'))
            .format();
    }
    getUtcDayEndTimeStampFromDate(date) {
        if (!date) return null;
        return moment.utc(moment(date)
            .endOf('day'))
            .format();
    }
    clearFilterDateValue(e, name) {
        e.stopPropagation();
        const newFilter = { ...this.state.customFilter };
        newFilter[name] = null;
        this.setState({
            customFilter: newFilter,
        });
    }
    createSimilarJob(job) {
        let newJob = _.cloneDeep(job);
        newJob = _.pick(newJob, [
            'clientId',
            'type',
            'portId',
            'shipperId',
            'consigneeId',
            'notes',
            'remarks',
            'jobImportDetail',
            'jobExportDetail',
            'container',
            'client',
            'port',
            'shipper',
            'consignee',
        ]);
        if (newJob.jobImportDetail) {
            newJob.jobImportDetail = _.pick(newJob.jobImportDetail, [
                'shipper',
                'marineCarrier',
                'terminal',
                'vesselName',
                'voyageNumber',
            ]);
        }
        if (newJob.jobExportDetail) {
            newJob.jobExportDetail = _.pick(newJob.jobExportDetail, [
                'consignee',
                'marineCarrier',
                'terminal',
                'vesselName',
                'voyageNumber',
            ]);
        }
        if (newJob.container) {
            newJob.container = _.map(newJob.container, con =>
                _.pick(con, [
                    'type',
                    'description',
                    'grossWeight',
                    'length',
                    'width',
                    'height',
                    'seqNo',
                    'unit',
                    'loadingOptions',
                    'hazmat',
                    'overweight',
                    'oversize',
                    'pickupFromLocationId',
                    'pickupFromLocation',
                    'deliverToLocationId',
                    'deliverToLocation',
                ]));
        }
        this.setMode('add', 'job', job.type, newJob);
    }
    render() {
        const {
                setMode,
                closeDialogWindow,
                toggleCustomFilterOpen,
                searchWithCustomFilter,
                getRemoteData,
                createSimilarJob,
            } = this,
            { allBCO } = this.props,
            {
                mode,
                isEditDialogOpen,
                formType,
                editingJob,
                customFilterOpen,
                customFilter,
                copyRefJob,
            } = this.state;
        return (
            <div className="job-view-container">
                <Paper className="top-level-card" zDepth={0}>
                    <div className="header-row">
                        <Button
                            icon
                            className="job-filter-btn"
                            primary
                            iconClassName="fa fa-filter"
                            onClick={toggleCustomFilterOpen}
                        />
                        <div className="float-right">
                            <DropdownMenu
                                className="header-row-menu"
                                menuItems={[
                                    {
                                        primaryText: 'Import',
                                        onClick: () =>
                                            setMode('add', 'job', 'Import'),
                                    },
                                    { divider: true },
                                    {
                                        primaryText: 'Export',
                                        onClick: () =>
                                            setMode('add', 'job', 'Export'), // if edit, add should be edit.
                                    },
                                    { divider: true },
                                    {
                                        primaryText: 'Cross Town',
                                        onClick: () =>
                                            setMode('add', 'job', 'Cross Town'),
                                    },
                                ]}
                                anchor={{
                                    x:
                                        DropdownMenu.HorizontalAnchors
                                            .INNER_RIGHT,
                                    y: DropdownMenu.VerticalAnchors.BOTTOM,
                                }}
                                position={DropdownMenu.Positions.TOP_LEFT}
                                animationPosition="below"
                                sameWidth
                                simplifiedMenu={false}
                            >
                                <AccessibleFakeButton
                                    className="no-padding-left-right"
                                    component={Button}
                                    iconBefore
                                    label={
                                        <Button
                                            raised
                                            primary
                                            className="dropdown-btn"
                                        >
                                            add Jobs
                                            <FontIcon>arrow_drop_down</FontIcon>
                                        </Button>
                                    }
                                />
                            </DropdownMenu>
                        </div>
                    </div>
                    {customFilterOpen && (
                        <PaperMui className="custom-filter-container">
                            <div className="row">
                                <div className="col-2">
                                    <DatePicker
                                        label="Trip Date From"
                                        autoOk
                                        inline
                                        readonly={false}
                                        value={customFilter.fromDate}
                                        maxDate={moment(customFilter.toDate || '2050-12-31')
                                            .toDate()}
                                        rightIcon={
                                            <FontIcon
                                                onClick={e =>
                                                    this.clearFilterDateValue(
                                                        e,
                                                        'fromDate',
                                                    )
                                                }
                                            >
                                                close
                                            </FontIcon>
                                        }
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    fromDate: moment(value)
                                                        .toDate(),
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-2">
                                    <DatePicker
                                        label="To"
                                        autoOk
                                        inline
                                        fullWidth={false}
                                        icon={null}
                                        readonly={false}
                                        value={customFilter.toDate}
                                        minDate={moment(customFilter.fromDate ||
                                                '2000-01-01')
                                            .toDate()}
                                        rightIcon={
                                            <FontIcon
                                                onClick={e =>
                                                    this.clearFilterDateValue(
                                                        e,
                                                        'toDate',
                                                    )
                                                }
                                            >
                                                close
                                            </FontIcon>
                                        }
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    toDate: moment(value)
                                                        .toDate(),
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>

                                <div className="col-2">
                                    <SelectField
                                        fullWidth
                                        id="select-job-status"
                                        placeholder="Status"
                                        menuItems={
                                            Config.JobStatusSelectionCriteria
                                        }
                                        value={customFilter.status}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    status: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                        position={SelectField.Positions.BELOW}
                                    />
                                </div>
                                <div className="col-2">
                                    <SelectField
                                        fullWidth
                                        id="select-job-type"
                                        placeholder="Job Type"
                                        menuItems={
                                            Config.JobTypeSelectionCriteria
                                        }
                                        value={customFilter.jobType}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    jobType: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                        position={SelectField.Positions.BELOW}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <TextField
                                        label="Client Reference #"
                                        value={customFilter.clientRefNo}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    clientRefNo: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-2">
                                    <TextField
                                        label="Container #"
                                        value={customFilter.container}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    container: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-2">
                                    <TextField
                                        label="Ocean Carrier Booking #"
                                        value={customFilter.booking}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    booking: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-2">
                                    <TextField
                                        label="Bill Of Lading  #"
                                        value={customFilter.bol}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    bol: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <TextField
                                        label="Job#"
                                        value={customFilter.name}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    name: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                                {this.props.userProfile.role ===
                                    'dispatcher' && (
                                    <div className="col-2">
                                        <Autocomplete
                                            id="idFilterClient"
                                            label="Client"
                                            placeholder="Search..."
                                            data={allBCO}
                                            dataLabel="name"
                                            dataValue="id"
                                            onChange={() =>
                                                this.handleChange(
                                                    {
                                                        ...customFilter,
                                                        clientId: null,
                                                    },
                                                    'customFilter',
                                                )
                                            }
                                            onAutocomplete={value =>
                                                this.handleChange(
                                                    {
                                                        ...customFilter,
                                                        clientId: value,
                                                    },
                                                    'customFilter',
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                <div className="col-4">
                                    <LocationAutocomplete
                                        label="Port*"
                                        port
                                        placeholder="Select or Search..."
                                        handleSelected={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    port: value.id,
                                                },
                                                'customFilter',
                                            )
                                        }
                                        handleSearchTextChange={() => {
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    port: null,
                                                },
                                                'customFilter',
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Button
                                        raised
                                        primary
                                        className="search-button"
                                        onClick={() => {
                                            searchWithCustomFilter();
                                            toggleCustomFilterOpen();
                                        }}
                                    >
                                        search
                                    </Button>

                                    <Button
                                        raised
                                        secondary
                                        onClick={toggleCustomFilterOpen}
                                    >
                                        close
                                    </Button>
                                </div>
                            </div>
                        </PaperMui>
                    )}
                    {mode !== 'list' && (
                        <Edit
                            closeWindow={closeDialogWindow}
                            formType={formType}
                            isEditDialogOpen={isEditDialogOpen}
                            role={this.props.userProfile.role}
                            copyRefJob={copyRefJob}
                            job={editingJob}
                        />
                    )}

                    <JobListTable
                        setEditMode={setMode}
                        getRemoteData={getRemoteData}
                        createSimilarJob={createSimilarJob}
                    />
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            userProfile: state.userProfileReducer.profile,
            allBCO: state.companyReducer.bco,
            allLocations: state.managedLocationsReducer.managedLocations,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getJobsWithFilter: filter => {
                dispatch(JobEntity.ui.list(filter));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(JobView);
