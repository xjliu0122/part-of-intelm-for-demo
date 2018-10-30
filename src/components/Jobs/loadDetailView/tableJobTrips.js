import * as React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import { Button, MenuButtonColumn } from 'react-md';
import { browserHistory } from 'react-router';
import TripEntity from 'entities/Trip/action';
import ScheduleEntity from 'entities/Schedule/action';
import tripUtil from 'components/SharedService/trip';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';
import SigIcon from '@material-ui/icons/Assignment';
import SignatureView from 'components/Schedule/signatureModal';

import EditTrip from '../editTrip';

const getRowId = row => row.rowNo;

class JobTripsTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tableColumnExtensions: [
                { columnName: 'rowNo', width: '50', align: 'left' },
                { columnName: 'status', width: '100', align: 'left' },
                { columnName: 'routes', align: 'left' },
                { columnName: 'assigneeName', width: '150', align: 'left' },
                { columnName: 'amount', width: '100', align: 'left' },
                //  { columnName: 'revenue', width: '100', align: 'left' },
                { columnName: 'actions', width: '100', align: 'left' },
            ],
            rows: [],
            iseditTripOpen: false,
            showSignatureModal: false,
            showSignatureId: null,
        };
        if (props.user.role === 'dispatcher') {
            this.state.columns = [
                { name: 'rowNo', title: '#' },
                { name: 'status', title: 'Status' },
                { name: 'routes', title: 'Stops' },
                { name: 'assigneeName', title: 'Assignee' },
                { name: 'amount', title: 'Cost' },
                // { name: 'revenue', title: 'Revenue' },
                { name: 'actions', title: ' ' },
            ];
        } else {
            this.state.columns = [
                { name: 'rowNo', title: '#' },
                { name: 'status', title: 'Status' },
                { name: 'routes', title: 'Stops' },
            ];
        }

        // get trips for current container
        props.getTrips({
            containerId: props.containerId,
        });
        [
            'renderCellComponent',
            'openEditTrip',
            'createInitialSchedule',
            'toggleSignatureModal',
        ].forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    componentWillReceiveProps = nextProps => {
        if (nextProps.trips !== this.state.trips) {
            this.setState({ rows: nextProps.trips });
        }
    };
    openEditTrip(value, tripId = null) {
        this.setState({
            iseditTripOpen: value,
            editingTripId: tripId,
        });
    }
    deleteTrip(tripId) {
        this.props.deleteTrip({ id: tripId });
    }
    navToTripManagement(id) {
        browserHistory.push(`/dispatch/${id}`);
    }
    createInitialSchedule(tripId) {
        this.props.createInitialSchedule(
            { trips: [tripId] },
            this.props.containerId,
            this.props.closeLoadDetailView,
        );
    }
    moveTripUp(tripId) {
        const { rows } = this.state;
        const index = _.findIndex(rows, row => row.id === tripId);
        const newIndex = index - 1;
        const otherTrip = rows[newIndex];
        this.props.adjustTripOrder(
            [
                {
                    id: tripId,
                    rowNo: newIndex + 1,
                    refNo: _.join(
                        [
                            _.get(this.props, 'job.name'),
                            _.get(this.props, 'container.seqNo'),
                            newIndex + 1,
                        ],
                        '-',
                    ),
                },
                {
                    id: otherTrip.id,
                    rowNo: otherTrip.rowNo + 1,
                    refNo: _.join(
                        [
                            _.get(this.props, 'job.name'),
                            _.get(this.props, 'container.seqNo'),
                            otherTrip.rowNo + 1,
                        ],
                        '-',
                    ),
                },
            ],
            this.props.containerId,
        );
    }
    moveTripDown(tripId) {
        const { rows } = this.state;
        const index = _.findIndex(rows, row => row.id === tripId);
        const newIndex = index + 1;
        const otherTrip = rows[newIndex];
        this.props.adjustTripOrder(
            [
                {
                    id: tripId,
                    rowNo: newIndex + 1,
                    refNo: _.join(
                        [
                            _.get(this.props, 'job.name'),
                            _.get(this.props, 'container.seqNo'),
                            newIndex + 1,
                        ],
                        '-',
                    ),
                },
                {
                    id: otherTrip.id,
                    rowNo: otherTrip.rowNo - 1,
                    refNo: _.join(
                        [
                            _.get(this.props, 'job.name'),
                            _.get(this.props, 'container.seqNo'),
                            otherTrip.rowNo - 1,
                        ],
                        '-',
                    ),
                },
            ],
            this.props.containerId,
        );
    }
    renderCellComponent = props => {
        const { toggleSignatureModal } = this;
        const role = _.get(this.props, 'user.role');

        switch (props.column.name) {
            case 'actions': {
                const menuItems = [
                    {
                        primaryText: 'Edit',
                        //disabled: props.row.status !== 'created',
                        onClick: () => this.openEditTrip('true', props.row.id),
                    },
                    {
                        primaryText: 'Find in Trip Management',
                        //disabled: props.row.status !== 'created',
                        onClick: () => this.navToTripManagement(props.row.id),
                    },
                    {
                        primaryText: 'Delete',
                        //disabled: props.row.status !== 'created',
                        onClick: () => this.deleteTrip(props.row.id),
                    },
                ];
                if (!props.row.scheduleId) {
                    menuItems.push({
                        primaryText: 'Create New Bundle',
                        onClick: () => {
                            this.createInitialSchedule(
                                props.row.id,
                                props.row.containerId,
                            );
                        },
                    });
                } else {
                    menuItems.push({
                        primaryText: 'Edit Bundle Planning',
                        onClick: () => {
                            this.props.openEditSchedule(
                                props.row.scheduleId,
                                this.props.closeLoadDetailView,
                            );
                        },
                    });
                }
                menuItems.push({
                    primaryText: 'Move Up',
                    disabled: props.row.rowNo === 1,
                    onClick: () => this.moveTripUp(props.row.id),
                });
                menuItems.push({
                    primaryText: 'Move Down',
                    disabled: props.row.rowNo === _.size(this.state.rows),
                    onClick: () => this.moveTripDown(props.row.id),
                });

                return (
                    <Table.Cell {...props}>
                        <MenuButtonColumn icon menuItems={menuItems}>
                            more_vert
                        </MenuButtonColumn>
                    </Table.Cell>
                );
            }

            case 'routes':
                return (
                    <Table.Cell {...props}>
                        <div className="trip-summary-field">
                            {props.row.stop.map((s, index) => {
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
                                        {s.status === 'Completed' && (
                                            <div className="stop-signature">
                                                <SigIcon
                                                    onClick={() => {
                                                        toggleSignatureModal(s.id);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Table.Cell>
                );
            case 'assigneeName':
                return (
                    <Table.Cell {...props}>
                        {_.get(props.row, 'assignee.name')}
                    </Table.Cell>
                );
            case 'status':
                let statusText = '';
                if (role === 'dispatcher') {
                    if (_.get(props.row, 'warningFlag')) {
                        statusText = `${_.get(props.row, 'status')} !`;
                    } else statusText = _.get(props.row, 'status');

                    if (_.get(props.row, 'apptFlag')) {
                        statusText += ' Appt. Time !';
                    }
                } else {
                    // for bco
                    statusText =
                        _.get(props.row, 'status') === 'Complete'
                            ? 'Complete'
                            : 'Active';
                }
                return (
                    <Table.Cell {...props}>
                        <div className="status-cell" type={statusText}>
                            {statusText}
                        </div>
                    </Table.Cell>
                );

            default:
                return <Table.Cell {...props} />;
        }
    };
    toggleSignatureModal(id = null) {
        this.setState({
            showSignatureModal: !this.state.showSignatureModal,
            showSignatureId: id,
        });
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                iseditTripOpen,
                editingTripId,
                showSignatureModal,
                showSignatureId,
            } = this.state,
            {
                containerId, container, job, user,
            } = this.props,
            { renderCellComponent, openEditTrip, toggleSignatureModal } = this;

        return (
            <Paper elevation={0} className="job-trip-container">
                {user.role === 'dispatcher' && (
                    <Button
                        flat
                        primary
                        iconChildren="add"
                        onClick={() => openEditTrip(true)}
                    >
                        Add Trip
                    </Button>
                )}
                <Grid rows={rows} columns={columns} getRowId={getRowId}>
                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCellComponent}
                    />
                    <TableHeaderRow />
                </Grid>
                <EditTrip
                    container={container}
                    job={job}
                    isOpen={iseditTripOpen}
                    openEditTrip={openEditTrip}
                    editingTripId={editingTripId}
                    containerId={containerId} // container id
                    currentTripsSize={rows.length}
                />
                {showSignatureModal && (
                    <SignatureView
                        closeWindow={toggleSignatureModal}
                        id={showSignatureId}
                    />
                )}
            </Paper>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            trips: state.tripReducer.trips,
            user: state.userProfileReducer.profile,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getTrips: params => {
                dispatch(TripEntity.ui.list(params));

                ScheduleEntity.after.update = () => {
                    dispatch(TripEntity.ui.list(params));
                };
            },
            createInitialSchedule: (
                params,
                containerId,
                closeLoadDetailView,
            ) => {
                dispatch(ScheduleEntity.ui.create(params));
                ScheduleEntity.after.create = resParams => {
                    dispatch({
                        type: 'OPEN_SCHEDULE_VIEW',
                        params: { scheduleId: resParams.response.id },
                    });
                    closeLoadDetailView();
                    dispatch(TripEntity.ui.list({
                        containerId,
                    }));
                };
            },
            deleteTrip: params => {
                dispatch(TripEntity.ui.delete(params));
            },
            openEditSchedule: (scheduleId, closeLoadDetailView) => {
                dispatch({
                    type: 'OPEN_SCHEDULE_VIEW',
                    params: { scheduleId },
                });
                closeLoadDetailView();
            },
            updateTrip: params => {
                dispatch(TripEntity.ui.update(params));
            },
            adjustTripOrder: (trips, conId) => {
                dispatch(TripEntity.ui.adjustTripOrder(trips));
                TripEntity.after.adjustTripOrder = () => {
                    dispatch(TripEntity.ui.list({ containerId: conId }));
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(JobTripsTable);
