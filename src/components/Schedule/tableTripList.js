import * as React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import {
    Grid,
    Table,
    PagingPanel,
    TableRowDetail,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import {
    PagingState,
    CustomPaging,
    RowDetailState,
} from '@devexpress/dx-react-grid';
import Paper from '@material-ui/core/Paper';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';
import MapIcon from '@material-ui/icons/Map';
import IconButton from '@material-ui/core/IconButton';
import { browserHistory } from 'react-router';
import TripMap from 'components/Maps/tripMapWrapper';
import tripUtil from 'components/SharedService/trip';
import ScheduleEditView from 'components/Schedule/editSchedule';
import TripEntity from 'entities/Trip/action';
import ScheduleEntity from 'entities/Schedule/action';
import { MenuButtonColumn } from 'react-md';
import BidsPanel from './bidsPanel';
import TripNote from './noteView.js';

const getRowId = row => row.id;
const renderCellComponent = props => {
    return <Table.Cell {...props} />;
};
const renderHeaderCellComponent = props => {
    if (
        ['estimatedEndTime', 'estimatedStartTime'].indexOf(props.column.name) === -1
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
                { name: 'estimatedStartTime', title: 'Pickup' },
                { name: 'estimatedEndTime', title: 'Delivery' },
                { name: 'status', title: 'Status' },
                { name: 'visualizedRoute', title: ' ' },
                { name: 'job', title: 'Job' },
                { name: 'containter', title: 'Cnt#' },
                { name: 'scheduleId', title: 'Bundle' },
                { name: 'contType', title: 'Type' },
                { name: 'refNo', title: 'Ref#' },
                { name: 'actions', title: ' ' },
            ],
            tableColumnExtensions: [
                {
                    columnName: 'estimatedStartTime',
                    width: '130',
                    align: 'left',
                },
                { columnName: 'estimatedEndTime', width: '130', align: 'left' },
                { columnName: 'summary', width: '300', align: 'left' },
                { columnName: 'scheduleId', width: '80', align: 'left' },
                { columnName: 'status', width: '100', align: 'left' },
                { columnName: 'visualizedRoute', width: '80', align: 'left' },
                { columnName: 'job', width: '150', align: 'left' },
                { columnName: 'containter', width: '150', align: 'left' },
                { columnName: 'contType', align: 'left' },
                { columnName: 'refNo', width: '100', align: 'left' },
                { columnName: 'actions', width: '90', align: 'left' },
            ],
            rows: [],
            expandedRowIds: [],
            total: 0,
            currentPage: 0,
        };
        this.onExpandedRowIdsChange = expandedRowIds =>
            this.setState({
                expandedRowIds: _.difference(
                    expandedRowIds,
                    this.state.expandedRowIds,
                ),
            });

        [
            'getCellValue',
            'openGoogleMapForTripRoute',
            'closeGoogleMapForTripRoute',
            'handleClickOutside',
            'openNoteForTrip',
            'closeNoteForTrip',
        ].forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
        this.createInitialSchedule = this.createInitialSchedule.bind(this);
        this.changeCurrentPage = this.changeCurrentPage.bind(this);
    }
    componentWillMount = () => {
        this.setState({
            rows: this.props.trips,
            expandedRowIds: _.map(this.props.trips, 'id'),
        });
    };

    componentWillReceiveProps = nextProps => {
        // if (
        //     !_.isEqual(nextProps.trips, this.props.trips) ||
        //     nextProps.total !== this.state.total
        // ) {
            this.setState({
                rows: nextProps.trips,
                expandedRowIds: _.map(nextProps.trips, 'id'),
                total: nextProps.total,
            });
      //  }
    };
    changeCurrentPage(currentPage) {
        this.props.getRemoteData({ skip: currentPage * 10 });
        this.setState({
            currentPage,
        });
    }
    openGoogleMapForTripRoute = (row, e) => {
        this.setState({
            showTripMap: true,
            tripForMap: row,
            topOffset: e.currentTarget.offsetTop,
        });
    };
    closeGoogleMapForTripRoute = () => {
        this.setState({
            showTripMap: false,
            tripForMap: null,
        });
    };
    openNoteForTrip = row => {
        this.setState({
            showNoteWindow: true,
            tripForNote: row,
        });
    };
    closeNoteForTrip = () => {
        this.setState({
            showNoteWindow: false,
            tripForNote: null,
        });
    };

    handleClickOutside() {
        this.closeGoogleMapForTripRoute();
    }
    createInitialSchedule(tripId) {
        this.props.createInitialSchedule({ trips: [tripId] });
    }
    findJobForTrip(jobName) {
        browserHistory.push(`/jobs/${jobName}`);
    }
    getCellValue = (row, columnName) => {
        switch (columnName) {
            case 'estimatedStartTime':
                return tripUtil.getFormattedDateOnlyStringFromUTCDateTime(_.get(row, 'estimatedStartTime'));
            case 'estimatedEndTime':
                return tripUtil.getFormattedDateOnlyStringFromUTCDateTime(_.get(row, 'estimatedEndTime'));
            case 'status':
                let statusText = '';
                if (_.get(row, 'warningFlag')) {
                    statusText = `${_.get(row, 'status')} !`;
                } else statusText = _.get(row, 'status');

                if (_.get(row, 'apptFlag')) {
                    statusText += ' Appt. Time !';
                }

                return (
                    <div className="status-cell" type={statusText}>
                        {statusText}
                    </div>
                );
            case 'job':
                return (
                    <a
                        onClick={() => {
                            this.props.openJobViewDetail(_.get(row, 'container.job'));
                        }}
                    >
                        {tripUtil.getJobBolBookingClientRef(row)}
                    </a>
                );
            case 'containter':
                return _.get(row, 'container.equipmentNo');
            case 'contType':
                return _.get(row, 'container.type');

            case 'visualizedRoute':
                return (
                    <IconButton
                        onClick={e => {
                            this.openGoogleMapForTripRoute(row, e);
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
                                        @{_.join(
                                            _.compact([
                                                tripUtil.getFormattedTimeOnlyFromUTCDateTime(s.plannedDateTime),
                                                tripUtil.getFormattedTimeOnlyFromUTCDateTime(s.actualTime),
                                            ]),
                                            ' / ',
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

            case 'actions':
                const menuItems = [
                    {
                        primaryText: 'Note',
                        onClick: () => {
                            this.openNoteForTrip(row);
                        },
                    },
                    {
                        primaryText: 'Find Job',
                        onClick: () => {
                            this.findJobForTrip(_.get(row, 'container.job.name'));
                        },
                    },
                ];
                if (!row.scheduleId) {
                    menuItems.push({
                        primaryText: 'Create New Bundle',
                        onClick: () => {
                            this.createInitialSchedule(row.id);
                        },
                    });
                } else {
                    menuItems.push({
                        primaryText: 'Edit Bundle Planning',
                        onClick: () => {
                            this.props.openDispatchView({
                                scheduleId: row.scheduleId,
                            });
                        },
                    });
                }
                return (
                    <MenuButtonColumn icon menuItems={menuItems}>
                        more_vert
                    </MenuButtonColumn>
                );

            default:
                return _.get(row, columnName);
        }
    };

    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                showTripMap,
                tripForMap,
                expandedRowIds,
                showNoteWindow,
                tripForNote,
                topOffset,
                total,
                currentPage,
            } = this.state,
            { editSchedule } = this.props,
            {
                // onExpandedRowIdsChange,
                getCellValue,
                closeGoogleMapForTripRoute,
                closeNoteForTrip,
            } = this;

        return (
            <Paper elevation={1} className="trip-list-container">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    getCellValue={getCellValue}
                >
                    <RowDetailState
                        expandedRowIds={expandedRowIds}
                        // onExpandedRowIdsChange={onExpandedRowIdsChange}
                    />
                    <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={this.changeCurrentPage}
                        pageSize={10}
                    />

                    <CustomPaging totalCount={total} />

                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCellComponent}
                    />

                    <TableRowDetail contentComponent={BidsPanel} />
                    <TableHeaderRow cellComponent={renderHeaderCellComponent} />
                    <PagingPanel pageSizes={10} />
                </Grid>
                {showTripMap && (
                    <TripMap
                        trip={tripForMap}
                        closeWindow={closeGoogleMapForTripRoute}
                        topOffset={topOffset}
                    />
                )}
                {showNoteWindow && (
                    <TripNote
                        trip={tripForNote}
                        closeWindow={closeNoteForTrip}
                    />
                )}
                {editSchedule && (
                    <ScheduleEditView scheduleId={editSchedule.scheduleId} />
                )}
            </Paper>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
        return {
            trips: state.tripReducer.tripsForManager.rows,
            total: state.tripReducer.tripsForManager.count,
            editSchedule: state.editScheduleViewReducer,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            openJobViewDetail: job => {
                dispatch({ type: 'OPEN_JOB_DETAIL_VIEW', params: { ...job } });
            },
            openDispatchView: schedule => {
                dispatch({
                    type: 'OPEN_SCHEDULE_VIEW',
                    params: { ...schedule },
                });
            },
            createInitialSchedule: params => {
                dispatch(ScheduleEntity.ui.create(params));
                ScheduleEntity.after.create = resParams => {
                    dispatch({
                        type: 'OPEN_SCHEDULE_VIEW',
                        params: { scheduleId: resParams.response.id },
                    });
                    dispatch(TripEntity.ui.fetchSingleForManagementAfterScheduling({
                        tripId: _.get(params, 'trips[0]'),
                    }));
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(TripListTable);
