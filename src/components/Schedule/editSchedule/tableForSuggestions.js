import * as React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import { SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import MapIcon from '@material-ui/icons/Map';
import IconButton from '@material-ui/core/IconButton';
import TripEntity from 'entities/Trip/action';
import ScheduleEntity from 'entities/Schedule/action';
import TripMap from 'components/Maps/tripMapWrapper';
import tripUtil from 'components/SharedService/trip';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';

const getRowId = row => row.id;
const renderCellComponent = props => {
    let contentToDisplay;
    if (props.column.name === 'timeGap') {
        if (props.value < 0) {
            contentToDisplay = <span>({0 - props.value}) Hrs</span>;
        } else {
            contentToDisplay = <span>{props.value} Hrs</span>;
        }
        return <Table.Cell {...props}>{contentToDisplay}</Table.Cell>;
    }
    if (props.column.name === 'distanceGap') {
        contentToDisplay = <span>{props.value} miles</span>;
        return <Table.Cell {...props}>{contentToDisplay}</Table.Cell>;
    }
    return <Table.Cell {...props} />;
};
const renderHeaderCellComponent = props => {
    if (
        ['timeGap', 'distanceGap', 'estimatedStartTime'].indexOf(props.column.name) === -1
    ) {
        return <TableHeaderRow.Cell {...props} sortingEnabled={false} />;
    }
    return <TableHeaderRow.Cell {...props} />;
};
const compareTimeGap = (a, b) => {
    if (Math.abs(a) === Math.abs(b)) {
        return 0;
    }
    return Math.abs(a) < Math.abs(b) ? -1 : 1;
};
class SuggestedTrips extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'estimatedStartTime', title: 'Est Start' },
                { name: 'timeGap', title: 'Time gap' },
                { name: 'distanceGap', title: 'Distance' },
                { name: 'summary', title: 'Summary' },
                { name: 'visualizedRoute', title: ' ' },
                { name: 'job', title: 'Job' },
                { name: 'containter', title: 'Cnt#' },
                { name: 'typeWeight', title: 'Type/Weight' },
                { name: 'fixedAmount', title: 'Fixed Amt' },
                { name: 'assignee', title: 'Assignee' },
                { name: 'actions', title: ' ' },
            ],
            tableColumnExtensions: [
                {
                    columnName: 'estimatedStartTime',
                    width: '150',
                    align: 'left',
                },
                {
                    columnName: 'timeGap',
                    width: '150',
                    align: 'left',
                    compare: compareTimeGap,
                },
                { columnName: 'distanceGap', width: '150', align: 'left' },
                { columnName: 'summary', align: 'left' },
                { columnName: 'visualizedRoute', width: '80', align: 'left' },
                { columnName: 'job', width: '150', align: 'left' },
                { columnName: 'containter', width: '150', align: 'left' },
                { columnName: 'typeWeight', width: '150', align: 'left' },
                { columnName: 'fixedAmount', width: '150', align: 'left' },
                { columnName: 'assignee', width: '150', align: 'left' },
                { columnName: 'actions', width: '90', align: 'left' },
            ],
            rows: [],
        };

        [
            'getCellValue',
            'openGoogleMapForTripRoute',
            'closeGoogleMapForTripRoute',
            'addTrip',
            'getNewSuggestion',
            'handleClickOutside',
            'setStateDistanceGap',
        ].forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    componentWillMount = () => {
        if (this.props.schedule) this.getNewSuggestion(this.props.schedule);
    };

    componentWillReceiveProps = nextProps => {
        if (
            nextProps.schedule &&
            !_.isEqual(nextProps.schedule, this.props.schedule)
        ) {
            this.getNewSuggestion(nextProps.schedule);
        }
        if (!_.isEqual(this.state.rows, nextProps.trips)) {
            const newTrips = _.filter(nextProps.trips, t => {
                return (
                    _.findIndex(
                        nextProps.schedule.trip,
                        obj => obj.id === t.id,
                    ) === -1
                );
            });
            _.map(newTrips, trip => {
                if (_.isNil(trip.distanceGap)) trip.distanceGap = null;
            });
            this.setState(
                {
                    rows: newTrips || [],
                },
                () => {
                    // recalculate distance gaps
                    _.map(newTrips, trip =>
                        tripUtil.getDistanceGap(
                            trip,
                            _.last(_.last(this.props.schedule.trip).stop),
                            this.setStateDistanceGap,
                        ));
                },
            );
        }
    };
    setStateDistanceGap(trip, gap) {
        const trips = this.state.rows;
        const index = _.findIndex(trips, t => t.id === trip.id);
        if (index !== -1) {
            trips.splice(index, 1, {
                ...trip,
                distanceGap: (gap * 0.000621371).toFixed(2), // convert meter to miles
            });
            this.setState({ rows: [...trips] });
        }
    }
    getNewSuggestion(schedule) {
        const filter = {
            scheduleId: schedule.id,
        };

        this.props.getTrips(filter);
    }
    openGoogleMapForTripRoute = row => {
        const lastStop = { ..._.last(_.last(this.props.schedule.trip).stop) };

        this.setState({
            showTripMap: true,
            lastStopForMap: lastStop,
            tripForMap: row,
        });
    };
    closeGoogleMapForTripRoute = () => {
        this.setState({
            showTripMap: false,
            lastStopForMap: null,
            tripForMap: null,
        });
    };
    handleClickOutside() {
        this.closeGoogleMapForTripRoute();
    }
    getCellValue = (row, columnName) => {
        switch (columnName) {
            case 'estimatedStartTime':
                return tripUtil.getFormattedStringFromUTCDateTime(_.get(row, 'estimatedStartTime'));
            case 'estimatedEndTime':
                return tripUtil.getFormattedStringFromUTCDateTime(_.get(row, 'estimatedEndTime'));
            case 'job':
                return (
                    <div
                        className="job-info"
                        onClick={() => {
                            this.props.openJobViewDetail(_.get(row, 'container.job'));
                        }}
                    >
                        {tripUtil.getJobBolBookingClientRef(row)}
                    </div>
                );
            case 'assignee':
                return _.get(row, 'assignee.name');
            case 'containter':
                return _.get(row, 'container.equipmentNo');
            case 'timeGap':
                return tripUtil.getTimeGap(
                    row,
                    _.last(_.last(this.props.schedule.trip).stop),
                );
            case 'typeWeight':
                return tripUtil.getContainerTypeWeight(_.get(row, 'container'));

            case 'visualizedRoute':
                return (
                    <IconButton
                        onClick={() => {
                            this.openGoogleMapForTripRoute(row);
                        }}
                        title="View on map"
                    >
                        <MapIcon />
                    </IconButton>
                );
            case 'summary':
                return (
                    <div className="trip-summary-field">
                        {row.stop.map((s, index) => {
                            return (
                                <div className="stop-item">
                                    <div className="stop-index">
                                        {`${index + 1}:`}
                                    </div>
                                    <div className="stop-name">
                                        <LocationHelpView
                                            location={s.stopLocation}
                                        />
                                    </div>
                                    <div className="stop-time">
                                        @{tripUtil.getFormattedTimeOnlyFromUTCDateTime(s.plannedDateTime)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

            case 'actions':
                return (
                    <IconButton
                        onClick={() => {
                            this.addTrip(row.id);
                        }}
                        title="Add trip"
                    >
                        <AddIcon />
                    </IconButton>
                );
            default:
                return _.get(row, columnName);
        }
    };
    addTrip(id) {
        this.props.updateSchedule({
            id: this.props.schedule.id,
            trips: _.map(this.props.schedule.trip, row => row.id)
                .concat([id]),
        });
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                showTripMap,
                lastStopForMap,
                tripForMap,
            } = this.state,
            { getCellValue, closeGoogleMapForTripRoute } = this;

        return (
            <Paper elevation={0} className="schedule-trip-container">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    getCellValue={getCellValue}
                >
                    <SortingState />
                    <IntegratedSorting
                        columnExtensions={tableColumnExtensions}
                    />
                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCellComponent}
                    />
                    <TableHeaderRow
                        showSortingControls
                        cellComponent={renderHeaderCellComponent}
                    />
                </Grid>
                {showTripMap && (
                    <TripMap
                        lastStop={lastStopForMap}
                        trip={tripForMap}
                        closeWindow={closeGoogleMapForTripRoute}
                    />
                )}
            </Paper>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
        return {
            trips: state.tripReducer.suggests,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getTrips: params => {
                dispatch(TripEntity.ui.suggest(params));
            },
            updateSchedule: params => {
                dispatch(ScheduleEntity.ui.update(params));
            },
            openJobViewDetail: job => {
                dispatch({ type: 'OPEN_JOB_DETAIL_VIEW', params: { ...job } });
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(SuggestedTrips);
