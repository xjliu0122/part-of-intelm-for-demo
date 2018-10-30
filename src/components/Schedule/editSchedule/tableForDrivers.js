import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import {
    SortingState,
    IntegratedSorting,
    IntegratedPaging,
    PagingState,
} from '@devexpress/dx-react-grid';
import Paper from '@material-ui/core/Paper';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import tripUtil from 'components/SharedService/trip';
import TCEntity from 'entities/TruckingCompany/action';
import BidEntity from 'entities/Bid/action';
import CompanyTooltip from 'components/CompanyTooltip/companyTooltip';

import { SelectField } from 'react-md';

const getRowId = row => row.id;
const renderCellComponent = props => {
    let contentToDisplay;
    if (props.column.name === 'distanceGap') {
        contentToDisplay = <span>{props.value} miles</span>;
        return <Table.Cell {...props}>{contentToDisplay}</Table.Cell>;
    }
    return <Table.Cell {...props} />;
};
const renderHeaderCellComponent = props => {
    if (['homeZip', 'distanceGap'].indexOf(props.column.name) === -1) {
        return <TableHeaderRow.Cell {...props} sortingEnabled={false} />;
    }
    return <TableHeaderRow.Cell {...props} />;
};

class DriverSelections extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'name', title: 'Company' },
                { name: 'driverName', title: 'Driver' },
                { name: 'driverOption', title: 'Endorsement' },
                { name: 'distanceGap', title: 'Distance' },
                { name: 'availableBids', title: 'Bids' },
                { name: 'actions', title: ' ' },
            ],
            tableColumnExtensions: [
                {
                    columnName: 'name',
                    width: '250',
                    align: 'left',
                },
                {
                    columnName: 'driverName',
                    width: '250',
                    align: 'left',
                },
                {
                    columnName: 'driverOption',
                    width: '150',
                    align: 'left',
                },

                { columnName: 'distanceGap', width: '150', align: 'left' },
                { columnName: 'actions', width: '90', align: 'left' },
            ],
            rows: [],
        };

        ['getCellValue', 'getDrivers', 'requestBids'].forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    componentWillMount = () => {
        if (this.props.schedule) this.getDrivers(this.props.schedule);
    };

    componentWillReceiveProps = nextProps => {
        if (
            nextProps.schedule &&
            !_.isEqual(nextProps.schedule, this.props.schedule)
        ) {
            this.getDrivers(nextProps.schedule);
        }
        if (!_.isEqual(this.state.rows, nextProps.tcs)) {
            const newTcs = [...nextProps.tcs];
            _.map(newTcs, tc => {
                if (_.isNil(tc.distanceGap)) tc.distanceGap = null;
            });
            this.setState({
                rows: newTcs || [],
            });
            // () => {
            //     // recalculate distance gaps
            //     _.map(newTrips, trip =>
            //         tripUtil.getDistanceGap(
            //             trip,
            //             _.last(_.last(this.props.schedule.trip).stop),
            //             this.setStateDistanceGap,
            //         ));
            // },
        }
    };
    getDrivers(schedule) {
        const filter = {
            coordinates: [..._.get(schedule, 'startLocation.coordinates')],
            distance: 60,
            tripIds: _.map(schedule.trip, 'id'),
            portId: _.get(schedule.trip, '[0].portId'),
        };
        this.props.getTruckingCompanies(filter);
    }
    requestBids(driverCompanyId, trips) {
        const that = this;
        this.props.requestBids(
            { driverCompanyId, trips: _.map(trips, 'id') },
            () => {
                that.getDrivers(that.props.schedule);
            },
        );
    }
    getCellValue = (row, columnName) => {
        const user = _.get(row, 'user[0]');
        const carrierInfo = _.get(row, 'carrierInfo');
        switch (columnName) {
            case 'name':
                return <CompanyTooltip company={row} />;
            case 'actions':
                const temp = [...this.props.schedule.trip];
                _.map(row.bids, bid => {
                    const ind = _.find(temp, { id: bid.tripId });
                    if (ind !== -1 || temp.status === 'New') {
                        temp.splice(ind, 1);
                    }
                });
                return (
                    <IconButton
                        onClick={() => {
                            this.requestBids(row.id, this.props.schedule.trip);
                        }}
                        title="Request bids"
                        disabled={temp.length === 0}
                    >
                        <SendIcon />
                    </IconButton>
                );
            case 'driverName':
                return _.get(user, 'name');
            case 'driverOption':
                let options = '';
                if (_.get(carrierInfo, 'serviceTypeTankDrayage')) {
                    options += 'N';
                }
                if (_.get(carrierInfo, 'serviceTypeHazmat')) options += 'H';
                if (
                    _.get(carrierInfo, 'serviceTypeHazmat') &&
                    _.get(carrierInfo, 'serviceTypeTankDrayage')
                ) {
                    options += 'X';
                }

                return options;
            case 'distanceGap':
                return _.get(row, 'geoLocation.distance');
            case 'availableBids':
                const trips = [...this.props.schedule.trip];
                const bids = _.map(trips, (t, index) => {
                    const ind = index + 1;
                    const amount = _.get(
                        _.find(row.bids, { tripId: t.id }),
                        'amount',
                    );
                    return (
                        <div className="driver-bid-items">
                            <div className="driver-bid-items-no">{ind}:</div>
                            <div className="driver-bid-item-amount">
                                {amount ? `$${amount}` : 'N/A'}
                            </div>
                        </div>
                    );
                });

                return <div className="driver-bid"> {bids} </div>;

            default:
                return _.get(row, columnName);
        }
    };
    render() {
        const { rows, columns, tableColumnExtensions } = this.state,
            { getCellValue } = this;

        return (
            <Paper elevation={0} className="driver-selection-container">
                {/* <div className="driver-table-header-bar">
                    <div className="select-input-port">
                        <SelectField
                            id="idBusinessCategory"
                            label="Business Category *"
                            menuItems={['1', '2']}
                            position={SelectField.Positions.BELOW}
                            value="1"
                            sameWidth
                            //onChange={value => this.handleChange(value, 'type')}
                        />
                    </div>
                    <div className="float-right">text2</div>
                </div> */}
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    getCellValue={getCellValue}
                >
                    <SortingState />
                    <PagingState defaultCurrentPage={0} pageSize={8} />
                    <IntegratedSorting
                        columnExtensions={tableColumnExtensions}
                    />
                    <IntegratedPaging />
                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCellComponent}
                    />
                    <TableHeaderRow
                        showSortingControls
                        cellComponent={renderHeaderCellComponent}
                    />
                    <PagingPanel />
                </Grid>
            </Paper>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
        return {
            tcs: state.truckingCompanyReducer.truckingCompanies,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getTruckingCompanies: params => {
                dispatch(TCEntity.ui.list(params));
            },
            requestBids: (params, callback) => {
                dispatch(BidEntity.ui.request(params));
                BidEntity.after.request = () => {
                    callback();
                };
            },
            // updateSchedule: params => {
            //     dispatch(ScheduleEntity.ui.update(params));
            // },
            // openJobViewDetail: name => {
            //     dispatch({ type: 'OPEN_JOB_DETAIL_VIEW', params: { name } });
            // },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(DriverSelections);
