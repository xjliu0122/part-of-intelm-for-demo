import * as React from 'react';
import { connect } from 'react-redux';
import {
    SearchState,
    PagingState,
    IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { browserHistory } from 'react-router';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import ViewJobIcon from '@material-ui/icons/Assignment';

import _ from 'lodash';

import './index.scss';

const getRowId = row => row.id;

class ReportTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'invoiceNo', title: 'Inv #' },
                { name: 'tx_date', title: 'Invoice Date' },
                { name: 'due_date', title: 'Due Date' },
                { name: 'subt_nat_amount', title: 'Total' },
                { name: 'nat_open_bal', title: 'Balance' },
                { name: 'link', title: ' ' },
            ],
            tableColumnExtensions: [{ columnName: 'link', align: 'right' }],
            rows: [],
        };

        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.data) {
            this.setState({
                rows: nextProps.data,
            });
        }
    };
    openPDFView(id) {
        this.props.openPDFView(id);
    }
    navToJob(id) {
        browserHistory.push(`/jobs/${id}`);
    }
    renderCell(props) {
        if (props.column.name === 'invoiceNo') {
            return (
                <Table.Cell {...props}>
                    {_.get(props.row, 'txn_type.id')}
                </Table.Cell>
            );
        }
        if (props.column.name === 'link') {
            return (
                <Table.Cell {...props}>
                    <SearchIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                            this.openPDFView(_.get(props.row, 'txn_type.id'))
                        }
                    />
                    <ViewJobIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.navToJob(props.row.jobId)}
                    />
                </Table.Cell>
            );
        }
        return (
            <Table.Cell {...props}>{_.get(props.value, 'value')}</Table.Cell>
        );
    }
    renderHeaderCell(props) {
        return (
            <Table.Cell {...props}>
                <div className="mui-table-header-cell-fontsize">
                    {props.column.title}
                </div>
            </Table.Cell>
        );
    }
    render() {
        const { rows, columns, tableColumnExtensions } = this.state,
            { renderCell, renderHeaderCell, searchBCOs } = this;

        return (
            <Paper elevation={1}>
                <Grid rows={rows} columns={columns} getRowId={getRowId}>
                    <PagingState defaultCurrentPage={0} pageSize={10} />
                    <SearchState onValueChange={v => searchBCOs(v)} />
                    <IntegratedPaging />

                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCell}
                    />

                    <TableHeaderRow
                        showSortingControls={false}
                        cellComponent={renderHeaderCell}
                    />
                    <PagingPanel />
                </Grid>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        profile: state.userProfileReducer.profile,
        data: state.reportReducer.bcoStatement,
    };
};
export default connect(mapStateToProps, null)(ReportTable);
