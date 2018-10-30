import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import ScheduleEditView from 'components/Schedule/editSchedule';
import { MenuButtonColumn } from 'react-md';
import LoadDetailView from '../loadDetailView';
import ContainerAPAR from './containerAPAR';

const getRowId = row => row.id;

class JobLoadTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'seqNo', title: '#' },
                { name: 'type', title: 'Type' },
                { name: 'equipmentNo', title: 'Cont#' },
                { name: 'status', title: 'Load Status' },
                { name: 'quotedAmt', title: 'Quoted Amount' },
            ],
            tableColumnExtensions: [
                { columnName: 'seqNo', width: '70', align: 'left' },
                { columnName: 'status', width: '150', align: 'left' },
                { columnName: 'toDoActions', align: 'left' },
                { columnName: 'equipmentNo', width: '150', align: 'left' },
                { columnName: 'type', width: '200', align: 'left' },
                { columnName: 'quotedAmt', width: '100', align: 'left' },
                { columnName: 'charge', width: '100', align: 'left' },
                { columnName: 'revenue', width: '100', align: 'left' },
                { columnName: 'actions', width: '100', align: 'right' },
            ],
            rows: props.row.container,
        };
        if (props.user.role === 'dispatcher') {
            this.state.columns.push({
                name: 'toDoActions',
                title: 'To-do Actions',
            });
            this.state.columns.push({ name: 'charge', title: 'Charge' });
            this.state.columns.push({ name: 'revenue', title: 'Revenue' });
            this.state.columns.push({ name: 'actions', title: ' ' });
        } else if (props.user.role === 'bco') {
            this.state.columns.push({ name: 'revenue', title: 'Charge' });
        }
        this.renderRowComponent = this.renderRowComponent.bind(this);
        this.closeContainerDetailView = this.closeContainerDetailView.bind(this);
        this.openContainerDetailView = this.openContainerDetailView.bind(this);
        this.openExtraAmounts = this.openExtraAmounts.bind(this);
        this.closeExtraAmounts = this.closeExtraAmounts.bind(this);
        this.getCellValue = this.getCellValue.bind(this);
    }
    componentWillReceiveProps = nextProps => {
        if (nextProps.row.container !== this.state.rows) {
            this.setState({ rows: nextProps.row.container });
        }
    };
    renderRowComponent = props => {
        return (
            <Table.Row
                {...props}
                className="job-loads-container-row"
                onClick={() => this.openContainerDetailView(props.row)}
            />
        );
    };
    renderCellComponent = props => {
        if (props.column.name !== 'actions') {
            return (
                <Table.Cell
                    {...props}
                    className="job-loads-container-row"
                    onClick={() => this.openContainerDetailView(props.row)}
                />
            );
        }

        return <Table.Cell {...props} />;
    };
    openContainerDetailView(row) {
        this.setState({
            viewingLoad: row,
            loadDetailViewOpen: true,
        });
    }
    closeContainerDetailView() {
        this.setState({
            viewingLoad: null,
            loadDetailViewOpen: false,
        });
    }
    openExtraAmounts(row, type) {
        this.setState({
            viewingLoad: row,
            editingExtraAmountType: type,
            extraAmountViewOpen: true,
        });
    }
    closeExtraAmounts() {
        this.setState({
            viewingLoad: null,
            editingExtraAmountType: null,
            extraAmountViewOpen: false,
        });
    }
    getCellValue(row, columnName) {
        const role = _.get(this.props, 'user.role');
        switch (columnName) {
            case 'actions':
                const menuItems = [
                    {
                        primaryText: 'Edit Receivables',
                        onClick: event => {
                            event.stopPropagation();
                            event.nativeEvent.stopImmediatePropagation();
                            this.openExtraAmounts(row, 'Receivable');
                        },
                    },
                    {
                        primaryText: 'Edit Payables',
                        onClick: event => {
                            event.stopPropagation();
                            event.nativeEvent.stopImmediatePropagation();
                            this.openExtraAmounts(row, 'Payable');
                        },
                    },
                ];
                return (
                    <MenuButtonColumn icon menuItems={menuItems}>
                        more_vert
                    </MenuButtonColumn>
                );
            case 'status':
                let statusText = '';
                if (role === 'dispatcher' && _.get(row, 'warningFlag')) {
                    statusText = `${_.get(row, 'status')} !`;
                } else statusText = _.get(row, 'status');
                if (role === 'bco') {
                    if (_.get(row, 'status') === 'No Trips') {
                        statusText = 'Scheduling';
                    }
                    if (_.get(row, 'status') === 'Active') {
                        statusText = 'Scheduled';
                    }
                }
                return (
                    <div className="status-cell" type={statusText}>
                        {statusText}
                    </div>
                );

            default:
                return _.get(row, columnName);
        }
    }
    render() {
        const {
                closeContainerDetailView,
                getCellValue,
                renderCellComponent,
                closeExtraAmounts,
            } = this,
            { editSchedule } = this.props,
            {
                rows,
                columns,
                tableColumnExtensions,
                viewingLoad,
                loadDetailViewOpen,

                editingExtraAmountType,
                extraAmountViewOpen,
            } = this.state;

        return (
            <Paper elevation={0} className="job-loads-container">
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
                {loadDetailViewOpen && (
                    <LoadDetailView
                        container={viewingLoad}
                        closeView={closeContainerDetailView}
                    />
                )}
                {editSchedule && (
                    <ScheduleEditView scheduleId={editSchedule.scheduleId} />
                )}
                {extraAmountViewOpen &&
                    editingExtraAmountType === 'Receivable' && (
                    <ContainerAPAR
                        container={viewingLoad}
                        closeWindow={closeExtraAmounts}
                        formType={editingExtraAmountType}
                    />
                )}
                {extraAmountViewOpen &&
                    editingExtraAmountType === 'Payable' && (
                    <ContainerAPAR
                        container={viewingLoad}
                        closeWindow={closeExtraAmounts}
                        formType={editingExtraAmountType}
                    />
                )}
            </Paper>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            editSchedule: state.editScheduleViewReducer,
            user: state.userProfileReducer.profile,
        };
    },
    mapDispatchToProps = dispatch => {
        return {};
    };

export default connect(mapStateToProps, mapDispatchToProps)(JobLoadTable);
