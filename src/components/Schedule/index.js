import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { browserHistory } from 'react-router';
import TripEntity from 'entities/Trip/action';
import TruckingCompanyEntity from 'entities/TruckingCompany/action';
import LocationAutocomplete from 'components/Form/locationAutoComplete/index';

//React MD
import {
    Paper,
    Button,
    FontIcon,
    SelectField,
    TextField,
    Autocomplete,
    DatePicker,
} from 'react-md';
import Config from 'components/config';
import PaperMui from '@material-ui/core/Paper';

// component
import TripListTable from './tableTripList';
import './styles.scss';

class TripManagementView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customFilter: {
                //status: 'Active',
            },
            customFilterOpen: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.getRemoteData = this.getRemoteData.bind(this);
        this.toggleCustomFilterOpen = this.toggleCustomFilterOpen.bind(this);
        this.searchWithCustomFilter = this.searchWithCustomFilter.bind(this);
        this.getNewAssignedDriverSuggestions = this.getNewAssignedDriverSuggestions.bind(this);
    }
    componentWillMount = () => {
        const { params } = this.props;
        if (params.id) {
            this.setState({
                customFilter: {
                    id: params.id,
                },
            });
            this.searchByTripId(params.id);
            browserHistory.push('/dispatch');
        } else {
            this.searchWithCustomFilter();
        }
    };
    toggleCustomFilterOpen() {
        this.setState({
            customFilterOpen: !this.state.customFilterOpen,
        });
    }
    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }
    searchWithCustomFilter(oDataParams = {}) {
        const cust = this.state.customFilter;
        this.props.getTripsWithFilter({
            ...cust,
            fromDate: this.getUtcDayStartTimeStampFromDate(cust.fromDate),
            toDate: this.getUtcDayEndTimeStampFromDate(cust.toDate),
            ...oDataParams,
        });
    }
    getRemoteData(params) {
        this.searchWithCustomFilter(params);
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
    searchByTripId(id) {
        const cust = { id };
        this.props.getTripsWithFilter({
            ...cust,
        });
    }
    getNewAssignedDriverSuggestions(value) {
        this.props.getNewAssignedDriverSuggestions(value);
    }
    render() {
        const {
                toggleCustomFilterOpen,
                searchWithCustomFilter,
                getRemoteData,
                getNewAssignedDriverSuggestions,
            } = this,
            { allBCO, allLocations, driverSuggestions } = this.props,
            { customFilterOpen, customFilter } = this.state;
        let selectedClient = '';
        let selectedPort = '';
        let selectedAssignedDriver = '';
        if (customFilter.clientId) {
            selectedClient = _.get(
                _.find(allBCO, { id: customFilter.clientId }),
                'name',
            );
        }
        if (customFilter.assigneeId) {
            selectedAssignedDriver = _.get(
                _.find(driverSuggestions, { id: customFilter.assigneeId }),
                'name',
            );
        }

        if (customFilter.port) {
            selectedPort = _.get(
                _.find(allLocations, { id: customFilter.port }),
                'name',
            );
        }
        return (
            <div className="trip-management-view-container">
                <Paper className="top-level-card" zDepth={0}>
                    <div className="header-row">
                        <Button
                            icon
                            className="job-filter-btn"
                            primary
                            iconClassName="fa fa-filter"
                            onClick={toggleCustomFilterOpen}
                        />
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
                                            Config.TripStatusSelectionCriteria
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
                            </div>

                            <div className="row">
                                <div className="col-2">
                                    <Autocomplete
                                        id="idFilterClient"
                                        label="Client"
                                        placeholder="Search..."
                                        data={allBCO}
                                        value={selectedClient}
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

                                <div className="col-4">
                                    <LocationAutocomplete
                                        label="Port"
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
                                        searchText={selectedPort}
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
                                <div className="col-3">
                                    <Autocomplete
                                        id="idFilterAssignedDriver"
                                        label="Assigned Driver"
                                        placeholder="Search..."
                                        data={driverSuggestions}
                                        value={selectedAssignedDriver}
                                        dataLabel="name"
                                        dataValue="id"
                                        onChange={value => {
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    assigneeId: null,
                                                },
                                                'customFilter',
                                            );
                                            getNewAssignedDriverSuggestions(value);
                                        }}
                                        onAutocomplete={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    assigneeId: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <TextField
                                        label="Shipper"
                                        value={customFilter.shipper}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    shipper: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>

                                <div className="col-3">
                                    <TextField
                                        label="Consingee"
                                        value={customFilter.consingee}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    consingee: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-3">
                                    <TextField
                                        label="Stop"
                                        value={customFilter.stop}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    stop: value,
                                                },
                                                'customFilter',
                                            )
                                        }
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
                    <TripListTable getRemoteData={getRemoteData} />
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            allBCO: state.companyReducer.bco,
            allLocations: state.managedLocationsReducer.managedLocations,
            driverSuggestions:
                state.truckingCompanyReducer.assignedDriverSearchSuggestions,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getTripsWithFilter: filter => {
                dispatch(TripEntity.ui.searchForManagement(filter));
            },
            openJobViewDetail: job => {
                dispatch({ type: 'OPEN_JOB_DETAIL_VIEW', params: { ...job } });
            },
            getNewAssignedDriverSuggestions: value => {
                dispatch(TruckingCompanyEntity.ui.searchTCByText(value));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(TripManagementView);
