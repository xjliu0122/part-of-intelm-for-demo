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
import _ from 'lodash';
import tripUtil from 'components/SharedService/trip';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';
import { browserHistory } from 'react-router';
import Paper from '@material-ui/core/Paper';

import './index.scss';

const getRowId = row => row.id;

class ReportTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'ref', title: 'Ref #' },
                { name: 'contType', title: 'Container Type' },
                { name: 'contNo', title: 'Container #' },
                { name: 'type', title: 'Type' },
                { name: 'stops', title: 'Trip' },
                { name: 'status', title: 'Status' },
            ],
            tableColumnExtensions: [
                { columnName: 'ref', width: '150' },
                { columnName: 'contType', width: '150' },
                { columnName: 'contNo', width: '150' },
                { columnName: 'type', width: '150' },
                { columnName: 'status', width: '150' },
            ],
            rows: [],
        };

        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
    }

    componentWillReceiveProps = nextProps => {
        this.setState({
            rows: nextProps.data,
        });
    };
    navToJob(name) {
        browserHistory.push(`/jobs/${name}`);
    }
    renderCell(props) {
        if (props.column.name === 'ref') {
            return (
                <Table.Cell
                    {...props}
                    onClick={() => this.navToJob(props.row.jobNo)}
                    style={{ cursor: 'pointer', color: '#3f51b5' }}
                >
                    {props.row.ref}
                </Table.Cell>
            );
        }
        if (props.column.name === 'stops') {
            return (
                <Table.Cell {...props}>
                    <div className="trip-summary-field">
                        {props.row.stops.map((s, index) => {
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
                                        {s.actualTime && (
                                            <div className="actual-time">
                                                {tripUtil.getFormattedTimeOnlyFromUTCDateTime(s.actualTime)}
                                            </div>
                                        )}
                                        {!s.actualTime &&
                                            tripUtil.getFormattedTimeOnlyFromUTCDateTime(s.plannedDateTime)}
                                    </div>
                                    {/* {s.status === 'Completed' && (
                                    <div className="stop-signature">
                                        <SigIcon
                                            onClick={() => {
                                                this.toggleSignatureModal(s.id);
                                            }}
                                        />
                                    </div>
                                )} */}
                                </div>
                            );
                        })}
                    </div>
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

const mapStateToProps = state => {
    return {
        data: state.reportReducer.bcoDashboard,
    };
};
export default connect(mapStateToProps, null)(ReportTable);
