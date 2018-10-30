// THIS IS ONLY A TEMPLATE. IT IS NOT USED ANYWHERE ELSE
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
class TripListTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'estimatedStartTime', title: 'Est Start' },
                { name: 'summary', title: 'Summary' },
                { name: 'visualizedRoute', title: ' ' },
                { name: 'job', title: 'Job' },
                { name: 'containter', title: 'Cnt#' },
                { name: 'typeWeight', title: 'Type/Weight' },
                { name: 'actions', title: ' ' },
            ],
            tableColumnExtensions: [
                {
                    columnName: 'estimatedStartTime',
                    width: '150',
                    align: 'left',
                },
                { columnName: 'summary', align: 'left' },
                { columnName: 'visualizedRoute', width: '80', align: 'left' },
                { columnName: 'job', width: '150', align: 'left' },
                { columnName: 'containter', width: '150', align: 'left' },
                { columnName: 'typeWeight', width: '150', align: 'left' },
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

            this.setState({
                rows: newTrips || [],
            });
        }
    };
    getNewSuggestion(schedule) {
        const filter = {
            anchorTime: schedule.estimatedEndTime,
            status: 'created',
        };
        //filter.
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
            case 'containter':
                return _.get(row, 'container.equipmentNo');
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
            <Paper elevation={1} className="trip-list-container">
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
            openJobViewDetail: job => {
                dispatch({ type: 'OPEN_JOB_DETAIL_VIEW', params: { ...job } });
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(TripListTable);
