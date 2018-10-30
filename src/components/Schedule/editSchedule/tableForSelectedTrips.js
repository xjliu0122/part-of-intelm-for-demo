import * as React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MapIcon from '@material-ui/icons/Map';
import IconButton from '@material-ui/core/IconButton';
import ScheduleEntity from 'entities/Schedule/action';
import tripUtil from 'components/SharedService/trip';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';
import EditTripView from 'components/Jobs/editTrip';

const getRowId = row => row.scheduleRowNo;
const renderCellComponent = props => {
    return <Table.Cell {...props} />;
};
class SelectedTrips extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'scheduleRowNo', title: '#' },
                { name: 'estimatedStartTime', title: 'Est Start' },
                { name: 'estimatedEndTime', title: 'Est End' },
                { name: 'summary', title: 'Summary' },
                { name: 'job', title: 'Job' },
                { name: 'containter', title: 'Cnt#' },
                { name: 'typeWeight', title: 'Type/Weight' },
                { name: 'fixedAmount', title: 'Fixed Amt' },
                { name: 'actions', title: ' ' },
            ],
            tableColumnExtensions: [
                { columnName: 'scheduleRowNo', width: '50', align: 'left' },
                {
                    columnName: 'estimatedStartTime',
                    width: '150',
                    align: 'left',
                },
                { columnName: 'estimatedEndTime', width: '150', align: 'left' },
                { columnName: 'summary', align: 'left' },
                { columnName: 'job', width: '150', align: 'left' },
                { columnName: 'containter', width: '150', align: 'left' },
                { columnName: 'typeWeight', width: '150', align: 'left' },
                { columnName: 'fixedAmount', width: '150', align: 'left' },
                { columnName: 'actions', width: '90', align: 'left' },
            ],
            rows: [],
            iseditTripOpen: false,
            editingTrip: null,
        };
        ['getCellValue', 'removeTrip', 'openEditTrip'].forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    componentWillMount = () => {
        this.setState({
            rows: _.get(this.props.schedule, 'trip') || [],
        });
    };

    componentWillReceiveProps = nextProps => {
        if (!_.isEqual(nextProps.schedule, this.props.schedule)) {
            this.setState({
                rows: _.get(nextProps.schedule, 'trip') || [],
            });
        }
    };
    openEditTrip(value, trip = null) {
        this.setState({
            iseditTripOpen: value,
            editingTrip: trip,
        });
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
                    <div>
                        <IconButton
                            onClick={() => {
                                this.openEditTrip(true, row);
                            }}
                            // disabled={this.state.rows.length <= 1}
                            title="Edit trip"
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                this.removeTrip(row.id);
                            }}
                            disabled={this.state.rows.length <= 1}
                            title="Remove trip"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                );
            default:
                return _.get(row, columnName);
        }
    };
    removeTrip(id) {
        this.props.updateSchedule({
            id: this.props.schedule.id,
            trips: _.pull(_.map(this.props.schedule.trip, row => row.id), id),
        });
    }

    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                iseditTripOpen,
                editingTrip,
            } = this.state,
            { schedule } = this.props,
            { getCellValue, openEditTrip } = this;

        return (
            <Paper elevation={0} className="schedule-trip-container">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    getCellValue={getCellValue}
                >
                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCellComponent}
                    />
                    <TableHeaderRow />
                </Grid>
                <EditTripView
                    isOpen={iseditTripOpen}
                    openEditTrip={openEditTrip}
                    editingTripFromScheduleView={editingTrip}
                    scheduleViewloadParams={{
                        scheduleId: _.get(schedule, 'id'),
                    }}
                />
            </Paper>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            // trips: state.tripReducer.suggests,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            updateSchedule: params => {
                dispatch(ScheduleEntity.ui.update(params));
            },
            openJobViewDetail: job => {
                dispatch({ type: 'OPEN_JOB_DETAIL_VIEW', params: { ...job } });
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTrips);
