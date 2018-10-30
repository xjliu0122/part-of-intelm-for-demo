import React, { Component } from 'react';
import { SelectField } from 'react-md';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';
import ReportTable from './tableList';
import ReportEntity from 'entities/Report/action';
import './index.scss';

class DashboardView extends Component {
    constructor(props) {
        super(props);
        this.state = { period: 'Today', type: 'All', actionType: 'All' };
        this.search = this.search.bind(this);
    }

    componentWillMount() {
        this.search();
    }
    search(state) {
        let filter = { ...state };
        let fromDate,
            toDate;
        //period
        switch (filter.period) {
            case 'Tomorrow':
                fromDate = moment()
                    .add(1, 'days')
                    .startOf('day')
                    .utc();
                toDate = moment()
                    .add(1, 'days')
                    .endOf('day')
                    .utc();
                break;
            case 'Next 3 days':
                fromDate = moment()
                    .add(1, 'days')
                    .startOf('day')
                    .utc();
                toDate = moment()
                    .add(3, 'days')
                    .endOf('day')
                    .utc();
                break;
            case 'Yesterday':
                fromDate = moment()
                    .subtract(1, 'days')
                    .startOf('day')
                    .utc();
                toDate = moment()
                    .subtract(1, 'days')
                    .endOf('day')
                    .utc();
                break;
            case 'Last 3 days':
                fromDate = moment()
                    .subtract(3, 'days')
                    .startOf('day')
                    .utc();
                toDate = moment()
                    .endOf('day')
                    .utc();
                break;
            default:
                // same as today
                fromDate = moment()
                    .startOf('day')
                    .utc();
                toDate = moment()
                    .endOf('day')
                    .utc();
        }

        filter = _.omit(filter, 'period');
        filter.fromDate = fromDate;
        filter.toDate = toDate;

        //type
        if (filter.type === 'All') {
            filter = { ..._.omit(filter, 'type') };
        }
        //action type
        if (filter.actionType === 'All') {
            filter = { ..._.omit(filter, 'actionType') };
        }
        this.props.getDashboardData(filter);
    }
    render() {
        const { period, actionType, type } = this.state,
            { search } = this;
        return (
            <div className="dash-view-container">
                <div className="row header-row">
                    <div className="col-2 select-option">
                        <SelectField
                            fullWidth
                            id="select-cont-type"
                            label="Trip Scheduled"
                            menuItems={[
                                'Today',
                                'Tomorrow',
                                'Next 3 days',
                                'Yesterday',
                                'Last 3 days',
                            ]}
                            value={period}
                            onChange={value => {
                                this.setState({ period: value });
                                search({ period: value, actionType, type });
                            }}
                            position={SelectField.Positions.BELOW}
                        />
                    </div>
                    <div className="col-2 select-option">
                        <SelectField
                            fullWidth
                            id="select-cont-type"
                            label="Type"
                            menuItems={[
                                'All',
                                'Import',
                                'Export',
                                'Cross Town',
                            ]}
                            value={type}
                            onChange={value => {
                                this.setState({ type: value });
                                search({ period, actionType, type: value });
                            }}
                            position={SelectField.Positions.BELOW}
                        />
                    </div>
                    {/* <div className="col-2 select-option">
                        <SelectField
                            fullWidth
                            id="select-cont-type"
                            label="Action"
                            menuItems={[
                                'All',
                                'drop-off load',
                                'pick-up load',
                                'drop-off empty',
                                'pick-up empty',
                            ]}
                            value={actionType}
                            onChange={value => {
                                this.setState({ actionType: value });
                                search({ period, actionType: value, type });
                            }}
                            position={SelectField.Positions.BELOW}
                        />
                    </div> */}
                </div>
                <div className="row">
                    <div className="col-12">
                        <ReportTable />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getDashboardData: filter => {
            dispatch(ReportEntity.ui.getBCODashboardData(filter));
        },
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        prop: state.prop,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
