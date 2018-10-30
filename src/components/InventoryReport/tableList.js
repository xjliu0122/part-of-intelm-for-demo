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
import _ from 'lodash';
import ReportEntity from 'entities/Report/action';

import './index.scss';

const getRowId = row => row.id;

class ReportTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'marineCarrier', title: 'Ocean Carrier Name' },
                { name: 'type', title: 'Container Type' },
                { name: 'equipmentNo', title: 'Container #' },
                { name: 'chassisNo', title: 'Chassis #' },
                { name: 'jobNo', title: 'Job #' },
            ],
            tableColumnExtensions: [
                // { columnName: 'action', align: 'right' },
            ],
            rows: [],
        };

        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
    }
    componentWillMount() {
        this.props.getContainerInventoryReport();
    }
    componentWillReceiveProps = nextProps => {
        if (nextProps.data) {
            this.setState({
                rows: nextProps.data,
            });
        }
    };
    navToJob(name) {
        browserHistory.push(`/jobs/${name}`);
    }
    renderCell(props) {
        if (props.column.name === 'jobNo') {
            return (
                <Table.Cell
                    {...props}
                    onClick={() => this.navToJob(props.row.jobNo)}
                    style={{ cursor: 'pointer' }}
                >
                    {props.row.name}
                </Table.Cell>
            );
        }
        return <Table.Cell {...props} />;
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
const mapDispatchToProps = dispatch => {
    return {
        getContainerInventoryReport: () => {
            dispatch(ReportEntity.ui.getConInv());
        },
    };
};

const mapStateToProps = state => {
    return {
        data: state.reportReducer.inventory,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ReportTable);
