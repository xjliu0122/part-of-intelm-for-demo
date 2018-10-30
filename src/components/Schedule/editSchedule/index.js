import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { DialogContainer, Button, CardActions } from 'react-md';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TripEntity from 'entities/Trip/action';
import ScheduleEntity from 'entities/Schedule/action';
import TableForSelectedTrips from './tableForSelectedTrips';
import TableForSuggestions from './tableForSuggestions';
import TableForDrivers from './tableForDrivers';

import './styles.scss';

class ScheduleEditView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTabIndex: 0,
        };
        ['setTab', 'deleteBundle', 'closeWindow'].forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    componentWillMount = () => {
        // if editing existing schedule and the scheule is not loaded yet, load it.
        const schedule = _.find(
            this.props.schedules,
            sh => sh.id === this.props.scheduleId,
        );
        if (!schedule) {
            this.props.getSchedule(this.props.scheduleId);
        } else {
            this.setState({ schedule });
        }
    };

    componentWillReceiveProps = nextProps => {
        const schedule = _.find(
            nextProps.schedules,
            sh => sh.id === this.props.scheduleId,
        );
        if (schedule) {
            this.setState({
                schedule,
            });
        }
    };

    setTab(e, value) {
        this.setState({
            activeTabIndex: value,
        });
    }
    closeWindow() {
        const { schedule } = this.state;
        // delet empty ones on close
        if (schedule.trip && _.size(schedule.trip) === 1) {
            this.deleteBundle();
        }
        this.props.closeWindow();
    }
    deleteBundle() {
        this.props.deleteBundle(this.props.scheduleId);
    }
    render() {
        const { closeWindow } = this;
        const { deleteBundle } = this;
        const { id, schedule, activeTabIndex } = this.state;
        return (
            <DialogContainer
                id="editScheduleForm"
                visible
                focusOnMount={false}
                modal
            >
                <div className="header-title">
                    <h2>
                        {'Edit'} Planning {id ? ` / ${id}` : ''}
                    </h2>

                    <i
                        className="material-icons icon-close"
                        onClick={closeWindow}
                    >
                        close
                    </i>
                </div>
                <div className="scheduleTable">
                    <TableForSelectedTrips schedule={schedule} />
                </div>

                <div className="schedule-tabs-container">
                    <div className="select-tab">
                        <Paper elevation={0}>
                            <Tabs
                                className="tab-header"
                                value={activeTabIndex}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={this.setTab}
                            >
                                <Tab
                                    classes={{ label: 'label' }}
                                    label="Available Trips"
                                />
                                <Tab
                                    classes={{ label: 'label' }}
                                    label="Drivers"
                                />
                            </Tabs>
                        </Paper>

                        <div className="row tab-view-container">
                            <div className="col-12 suggestionTable">
                                {activeTabIndex === 0 && (
                                    <TableForSuggestions schedule={schedule} />
                                )}
                                {activeTabIndex === 1 && (
                                    <TableForDrivers schedule={schedule} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <CardActions className="md-divider-border md-divider-border--top">
                        <Button
                            flat
                            secondary
                            className="float-right"
                            onClick={closeWindow}
                        >
                            Close
                        </Button>
                        <Button
                            flat
                            secondary
                            className="float-right"
                            onClick={deleteBundle}
                        >
                            Delete Bundle
                        </Button>
                    </CardActions>
                </div>
            </DialogContainer>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        schedules: state.scheduleReducer.schedules,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getSchedule: id => {
            dispatch(ScheduleEntity.ui.list({ id }));
        },
        closeWindow: () => {
            dispatch({ type: 'CLOSE_SCHEDULE_VIEW' });
        },
        deleteBundle: id => {
            dispatch(ScheduleEntity.ui.delete(id));
            ScheduleEntity.after.delete = () => {
                dispatch({ type: 'CLOSE_SCHEDULE_VIEW' });
                dispatch({
                    type: 'RemoveScheduleIdFromTripsInManager',
                    payload: { id },
                });
            };
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScheduleEditView);
