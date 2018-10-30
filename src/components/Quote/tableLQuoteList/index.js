import * as React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    PagingState,
    IntegratedPaging,
    RowDetailState,
} from '@devexpress/dx-react-grid';
import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    Toolbar,
    TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { DialogContainer, Button } from 'react-md';
import QuoteEntity from 'entities/Quote/action';
import QuoteContainerPanel from './quoteContainerPanel';

const getPortFromQuote = quote => {
    return _.get(quote, 'port.name');
};
const getDatesFromQuote = (quote, type) => {
    if (_.get(quote, type)) {
        return (
            <div style={{ width: '100%' }}>
                {' '}
                {moment(_.get(quote, type))
                    .format('MM/DD/YYYY')}
            </div>
        );
    }
    return '';
};

const Cell = props => {
    return <Table.Cell {...props} />;
};

const getRowId = row => row.name;
class QuoteListTable extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            rows: this.props.quotes,
            expandedRowIds: [],
            closeConfirmationOpen: false,
        };

        this.getCellValue = this.getCellValue.bind(this);
        this.setTableColumn = this.setTableColumn.bind(this);
        this.onExpandedRowIdsChange = expandedRowIds =>
            this.setState({
                expandedRowIds: _.difference(
                    expandedRowIds,
                    this.state.expandedRowIds,
                ),
            });
        this.showEditDialog = this.showEditDialog.bind(this);
        this.toggleConfirmWindow = this.toggleConfirmWindow.bind(this);
        this.releaseQuote = this.releaseQuote.bind(this);
    }

    componentWillMount() {
        this.setTableColumn(this.props);
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.quotes !== this.state.rows) {
            this.setState({ rows: nextProps.quotes });
        }
        if (!_.isEqual(this.props.user, nextProps.user)) {
            this.setTableColumn(nextProps);
        }
    };
    setTableColumn(props) {
        this.setState({
            columns: [{ name: 'name', title: '#' }]
                .concat(props.user.role === 'dispatcher'
                    ? [{ name: 'clientName', title: 'Client Name' }]
                    : [{ name: 'quotedAmount', title: 'Quote' }])
                .concat([
                    { name: 'type', title: 'IE' },
                    { name: 'status', title: 'Status' },
                    { name: 'totalNoOfContainers', title: 'Count' },
                    { name: 'port', title: 'Port' },
                    { name: 'actions', title: ' ' },
                ]),

            tableColumnExtensions: [
                { columnName: 'name', width: '80', align: 'left' },

                { columnName: 'clientName', width: '200', align: 'left' },
                { columnName: 'quotedAmount', width: '200', align: 'left' },
                { columnName: 'type', width: '120', align: 'left' },
                { columnName: 'status', width: '100', align: 'left' },
                { columnName: 'port', width: '150', align: 'left' },
                {
                    columnName: 'totalNoOfContainers',
                    width: '100',
                    align: 'left',
                },

                { columnName: 'actions', width: '150', align: 'left' },
            ],
        });
    }
    showEditDialog(row) {
        this.props.showEditDialog(row);
    }
    releaseQuote(id) {
        this.props.releaseQuote(id);
    }
    toggleConfirmWindow(releasingQuoteId) {
        this.setState({
            closeConfirmationOpen: !this.state.closeConfirmationOpen,
            releasingQuoteId,
        });
    }
    getCellValue = (row, columnName) => {
        const role = this.props.user.role;
        switch (columnName) {
            case 'port':
                return getPortFromQuote(row);
            case 'clientName':
                return _.get(row, 'client.name');
            case 'quotedAmount':
                let total = 0;
                _.map(row.container, c => {
                    if (c.quotedAmt) total += parseFloat(c.quotedAmt, 2);
                });
                return total ? `$ ${total}` : null;
            case 'totalNoOfContainers':
                return _.size(row.container);
            case 'pickupDate':
                return getDatesFromQuote(row, 'pickupDate');
            case 'status':
                return (
                    <div className="status-cell" type={_.get(row, 'status')}>
                        {_.get(row, 'status')}
                    </div>
                );
            case 'deliveryDate':
                return getDatesFromQuote(row, 'deliveryDate');
            case 'actions':
                return (
                    <div className="action-buttons">
                        {/* <IconButton title="View Quote">
                            <ViewIcon
                                onClick={() => this.props.showViewDialog(row)}
                            />
                        </IconButton> */}
                        {row.status === 'New' && (
                            <IconButton title="Edit Quote">
                                <EditIcon
                                    onClick={() => this.showEditDialog(row)}
                                />
                            </IconButton>
                        )}
                        {row.status === 'Quoted' && (
                            <IconButton title="Create Job From This Quote">
                                <LocalShippingIcon
                                    onClick={() =>
                                        this.props.openAddJobDialog(row)
                                    }
                                />
                            </IconButton>
                        )}
                        {role === 'dispatcher' && (
                            //&& row.status === 'New'
                            <IconButton title="Release Quote">
                                <DoneAllIcon
                                    onClick={() =>
                                        this.toggleConfirmWindow(row.name)
                                    }
                                />
                            </IconButton>
                        )}
                    </div>
                );
            case 'pickupAddress':
                return _.get(row, 'pickupFromLocation.geoLocation.address');
            case 'deliveryAddress':
                return _.get(row, 'deliverToLocation.geoLocation.address');

            default:
                return _.get(row, columnName);
        }
    };

    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                expandedRowIds,
            } = this.state,
            { onExpandedRowIdsChange, getCellValue } = this,
            actions = [];
        actions.push({
            secondary: true,
            children: 'Cancel',
            onClick: () => this.toggleConfirmWindow(null),
        });
        actions.push(<Button
            flat
            primary
            onClick={() => {
                this.releaseQuote(this.state.releasingQuoteId);
                this.toggleConfirmWindow(null);
            }}
        >
                Confirm
        </Button>);
        return (
            <Paper className="quote-list-container">
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

                    <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                    <IntegratedPaging />

                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={Cell}
                    />

                    <TableRowDetail contentComponent={QuoteContainerPanel} />
                    <PagingPanel />
                    <TableHeaderRow />
                    <Toolbar />
                </Grid>
                <DialogContainer
                    id="confirmation-dialog"
                    titleClassName="confirmation-dialog-title"
                    contentClassName="confirmation-dialog-content"
                    footerClassName="confirmation-dialog-footer"
                    visible={this.state.closeConfirmationOpen}
                    onHide={this.toggleConfirmWindow}
                    actions={actions}
                    title="Attention"
                >
                    You are releasing the quote to client! Email will be sent to
                    client if you proceed. Are you sure?
                </DialogContainer>
            </Paper>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            quotes: state.quoteReducer.quotes,
            user: state.userProfileReducer.profile,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            releaseQuote: id => {
                dispatch(QuoteEntity.ui.release({ id }));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(QuoteListTable);
