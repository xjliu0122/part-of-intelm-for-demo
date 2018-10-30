import * as React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    PagingState,
    IntegratedPaging,
    TableColumnVisibility,
    RowDetailState,
    CustomPaging,
} from '@devexpress/dx-react-grid';
import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    ColumnChooser,
    Toolbar,
    TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
import { MenuButtonColumn } from 'react-md';
import Paper from '@material-ui/core/Paper';
import AccountingEntity from 'entities/Accounting/action';
import JobEntity from 'entities/Job/action';
import JobDetailPanel from './jobDetailPanel';
import Toaster from 'clientUtils/toastMessageHelper';
import CompanyTooltip from 'components/CompanyTooltip/companyTooltip';

const getBlBookingOrRefFromJob = job => {
    const arr = [];
    arr.push(_.get(job, 'clientRefNo'));
    arr.push(_.get(job, 'jobExportDetail.booking'));
    arr.push(_.get(job, 'jobImportDetail.billOfLading'));
    return <div style={{ width: '100%' }}> {_.join(_.compact(arr), '/')}</div>;
};
const getPortFromJob = job => {
    return _.get(job, 'port.name');
};
const Cell = props => {
    const row = props.row;
    return <Table.Cell {...props} />;
};
const getDateStringFromUTCDate = date => {
    if (date) {
        return moment(date)
            .format('MM/DD/YYYY');
    }
    return null;
};
const getUserSavedLayout = () => {};
const getRowId = row => row.name;
// switch (props.column.name) {
class JobListTable extends React.PureComponent {
    constructor(props) {
        super(props);
        const role = _.get(props, 'user.role');
        let columns = [
            role === 'dispatcher'
                ? { name: 'clientName', title: 'Client Name' }
                : null,
            { name: 'type', title: 'IE' },
            { name: 'RA', title: 'R/A' },
            { name: 'status', title: 'Job Status' },
            { name: 'blBookingOrRef', title: 'BL/Booking/Ref#' },
            { name: 'port', title: 'Port' },
            { name: 'emptyRequestDate', title: 'EmpReqDate(Exp)' },
            { name: 'etaOrEtd', title: 'ETA/ETD' },
            { name: 'marineCarrier', title: 'Ocean Carrier' },
            { name: 'vesselName', title: 'Vessel' },
            { name: 'voyageNumber', title: 'Voyage' },
            { name: 'actions', title: ' ' },
        ];
        columns = _.compact(columns);
        this.state = {
            columns,
            tableColumnExtensions: [
                { columnName: 'clientName', width: '180', align: 'left' },
                { columnName: 'type', width: '80', align: 'left' },
                { columnName: 'RA', width: '80', align: 'left' },
                { columnName: 'status', width: '130', align: 'left' },
                { columnName: 'blBookingOrRef', align: 'left' },
                { columnName: 'port', width: '150', align: 'left' },
                {
                    columnName: 'emptyRequestDate',
                    width: '120',
                    align: 'left',
                },
                {
                    columnName: 'etaOrEtd',
                    width: '120',
                    align: 'left',
                },
                { columnName: 'marineCarrier', width: '150', align: 'left' },
                { columnName: 'vesselName', width: '120', align: 'left' },
                { columnName: 'voyageNumber', width: '100', align: 'left' },
                { columnName: 'actions', width: '80', align: 'left' },
            ],
            rows: this.props.jobs,
            expandedRowIds: [],
            total: 0,
            currentPage: 0,
        };

        this.changeCurrentPage = this.changeCurrentPage.bind(this);
        this.getCellValue = this.getCellValue.bind(this);
        this.markRAStatus = this.markRAStatus.bind(this);
        this.changeSorting = sorting => this.setState({ sorting });
        this.onExpandedRowIdsChange = expandedRowIds =>
            this.setState({
                expandedRowIds: _.difference(
                    expandedRowIds,
                    this.state.expandedRowIds,
                ),
            });
    }
    componentWillReceiveProps = nextProps => {
        if (
            nextProps.jobs !== this.state.rows ||
            nextProps.total !== this.state.total
        ) {
            this.setState({ rows: nextProps.jobs, total: nextProps.total });
        }
        if (nextProps.user.role === 'dispatcher') {
            if (!_.find(this.state.columns, { name: 'actions' })) {
                this.setState({
                    columns: [
                        ...this.state.columns,
                        { name: 'actions', title: ' ' },
                    ],
                });
            }
        }
    };
    syncQBOForJob(name) {
        this.props.syncQBOForJob({ jobName: name });
    }
    sendConfirmationForJob(name) {
        this.props.sendConfirmationForJob({ jobName: name });
    }
    CheckNotAllowingBCOEditJob(job) {
        let noTrip = true;
        _.map(job.container, c => {
            if (_.size(c.trip) > 0) noTrip = false;
        });
        return !noTrip;
    }
    getCellValue = (row, columnName) => {
        const role = _.get(this.props, 'user.role'),
            isAdmin = _.get(this.props, 'user.isAdmin'),
            { createSimilarJob } = this.props;
        switch (columnName) {
            case 'clientName':
                return <CompanyTooltip company={_.get(row, 'client')} />;
            case 'RA':
                const rstatus = _.get(row, 'rmark') ? 'R' : '';
                const astatus = _.get(row, 'amark') ? 'A' : '';
                return rstatus + astatus;

            case 'etaOrEtd':
                return getDateStringFromUTCDate(_.get(row, 'jobImportDetail.etaDate') ||
                        _.get(row, 'jobExportDetail.etdDate'));
            case 'emptyRequestDate':
                if (row.type !== 'Export') return 'N/A';
                return getDateStringFromUTCDate(_.min(_.compact(_.map(row.container, con => con.emptyRequestDate))));
            case 'blBookingOrRef':
                return (
                    <a
                        onClick={() => {
                            if (
                                this.props.user.role !== 'dispatcher' &&
                                this.CheckNotAllowingBCOEditJob(row)
                            ) {
                                this.props.openJobViewDetail(row);
                            } else {
                                this.props.setEditMode(
                                    'edit',
                                    'job',
                                    row.type,
                                    row,
                                );
                            }
                        }}
                    >
                        {getBlBookingOrRefFromJob(row)}
                    </a>
                );
            case 'status':
                let statusText = '';
                if (role === 'dispatcher' && _.get(row, 'warningFlag')) {
                    statusText = `${_.get(row, 'status')} !`;
                } else statusText = _.get(row, 'status');
                return (
                    <div className="status-cell" type={statusText}>
                        {statusText}
                    </div>
                );
            case 'port':
                return getPortFromJob(row);
            case 'marineCarrier':
                return _.get(
                    row.jobExportDetail || row.jobImportDetail,
                    'marineCarrier',
                );
            case 'vesselName':
                return _.get(
                    row.jobExportDetail || row.jobImportDetail,
                    'vesselName',
                );
            case 'voyageNumber':
                return _.get(
                    row.jobExportDetail || row.jobImportDetail,
                    'voyageNumber',
                );

            case 'actions':
                const menuItems = [
                    {
                        primaryText: 'Create Similar Job Like This',
                        onClick: () => {
                            createSimilarJob(row);
                        },
                    },
                ];
                if (role === 'dispatcher') {
                    menuItems.push({
                        primaryText: 'Edit',
                        onClick: () => {
                            this.props.setEditMode(
                                'edit',
                                'job',
                                row.type,
                                row,
                            );
                        },
                    });
                    menuItems.push({
                        primaryText: 'Sync',
                        onClick: () => {
                            this.syncQBOForJob(row.name);
                        },
                    });
                    menuItems.push({
                        primaryText: 'Send Confirmation',
                        disabled: row.confirmationMailSent,
                        onClick: () => {
                            this.sendConfirmationForJob(row.name);
                        },
                    });
                    if (!row.rmark) {
                        menuItems.push({
                            primaryText: 'Mark RFV',
                            hide: row.rmark,
                            onClick: () => {
                                this.markRAStatus(row.name, 'R', true);
                            },
                        });
                    }
                    if (row.rmark) {
                        menuItems.push({
                            primaryText: 'Remove RFV',
                            hide: !row.rmark,
                            onClick: () => {
                                this.markRAStatus(row.name, 'R', false);
                            },
                        });
                    }
                    if (isAdmin && !row.amark) {
                        menuItems.push({
                            primaryText: 'Mark ANC',
                            onClick: () => {
                                this.markRAStatus(row.name, 'A', true);
                            },
                        });
                    }
                    if (isAdmin && row.amark) {
                        menuItems.push({
                            primaryText: 'Remove ANC',
                            onClick: () => {
                                this.markRAStatus(row.name, 'A', false);
                            },
                        });
                    }
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
    changeCurrentPage(currentPage) {
        this.props.getRemoteData({ skip: currentPage * 10 });
        this.setState({
            currentPage,
        });
    }
    markRAStatus(jobName, status, isTrue) {
        const { markRAStatus } = this.props;
        switch (status) {
            case 'R':
                markRAStatus({ name: jobName, rmark: isTrue });
                break;
            case 'A':
                markRAStatus({ name: jobName, amark: isTrue });
                break;
            default:
                break;
        }
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                expandedRowIds,
                currentPage,
                total,
            } = this.state,
            { onExpandedRowIdsChange, getCellValue } = this;

        return (
            <Paper className="job-list-container">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    getCellValue={getCellValue}
                >
                    <RowDetailState
                        expandedRowIds={expandedRowIds}
                        onExpandedRowIdsChange={onExpandedRowIdsChange}
                    />

                    <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={this.changeCurrentPage}
                        pageSize={10}
                    />

                    {/* <IntegratedPaging /> */}
                    <CustomPaging totalCount={total} />
                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={Cell}
                    />

                    <TableRowDetail contentComponent={JobDetailPanel} />
                    <TableColumnVisibility />

                    <PagingPanel pageSizes={10} />
                    <TableHeaderRow />
                    <Toolbar />

                    <ColumnChooser />
                </Grid>
            </Paper>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            jobs: state.jobReducer.jobs.items,
            total: state.jobReducer.jobs.count,
            user: state.userProfileReducer.profile,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            openJobViewDetail: job => {
                dispatch({ type: 'OPEN_JOB_DETAIL_VIEW', params: { ...job } });
            },
            syncQBOForJob: params => {
                dispatch(AccountingEntity.ui.sync(params));
                AccountingEntity.after.sync = () => {
                    Toaster.mapSuccessMessage('Synced to QBO successfully');
                };
            },
            sendConfirmationForJob: params => {
                dispatch(JobEntity.ui.sendConfirmation(params));
                JobEntity.after.sendConfirmation = () => {
                    Toaster.mapSuccessMessage('Confirmation sent successfully');
                };
            },
            markRAStatus: params => {
                dispatch(JobEntity.ui.markRAStatus(params));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(JobListTable);
