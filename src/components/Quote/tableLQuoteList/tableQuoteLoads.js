import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import AmountEditor from 'components/AmountEditor';
import QuoteEntity from 'entities/Quote/action';
import LoadDetailView from 'components/Quote/loadDetailView';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';

const Cell = props => {
    return <Table.Cell {...props} />;
};
const getRowId = row => row.id;

class QuoteLoadTable extends React.PureComponent {
    constructor(props) {
        super(props);
        let columns = [{ name: 'type', title: 'Type' }];
        if (props.row.type === 'Import') {
            columns = _.concat(columns, [
                { name: 'deliverToLocation', title: 'Deliver to' },
                { name: 'deliveryDate', title: 'Delivery Date' },
            ]);
        }
        if (props.row.type === 'Export') {
            columns = _.concat(columns, [
                { name: 'pickupFromLocation', title: 'Pickup from' },
                { name: 'pickupDate', title: 'Pickup Date' },
            ]);
        }
        columns = _.concat(columns, [
            { name: 'grossWeight', title: 'Weight' },
            { name: 'quotedAmt', title: 'Quoted Amt' },
            { name: 'actions', title: ' ' },
        ]);

        this.state = {
            columns,
            tableColumnExtensions: [
                { name: 'deliverToLocation', width: '200' },
                { name: 'deliveryDate', width: '150' },
                { name: 'pickupFromLocation', width: '200' },
                { name: 'pickupDate', width: '150' },

                { columnName: 'type', width: '200', align: 'left' },
                { columnName: 'grossWeight', width: '200', align: 'left' },
                { columnName: 'charge', width: '150', align: 'left' },
                { columnName: 'actions', align: 'right' },
            ],
            rows: props.row.container,
        };
        this.getCellValue = this.getCellValue.bind(this);
        this.setQuoteLoadAmount = this.setQuoteLoadAmount.bind(this);
        this.closeContainerDetailView = this.closeContainerDetailView.bind(this);
        this.openContainerDetailView = this.openContainerDetailView.bind(this);
        this.renderRowComponent = this.renderRowComponent.bind(this);
        this.renderCellComponent = this.renderCellComponent.bind(this);
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
    setQuoteLoadAmount(row, amount) {
        this.props.proposeForQuote({
            id: row.id,
            amount,
        });
    }
    getCellValue(row, columnName) {
        switch (columnName) {
            case 'grossWeight':
                return _.get(row, 'grossWeight');
            case 'quotedAmt':
                return _.get(row, 'quotedAmt') ? `$ ${_.get(row, 'quotedAmt')}` : '';
            case 'deliverToLocation':
                return _.get(row, 'deliverToLocation.name');
            case 'deliveryDate':
                return _.get(row, 'deliveryDate')
                    ? moment(_.get(row, 'deliveryDate'))
                        .format('MM/DD/YYYY')
                    : '';
            case 'pickupFromLocation':
                return _.get(row, 'pickupFromLocation.name');
            case 'pickupDate':
                return _.get(row, 'pickupDate')
                    ? moment(_.get(row, 'pickupDate'))
                        .format('MM/DD/YYYY')
                    : '';

            case 'actions':
                return (
                    _.get(this.props, 'user.role') === 'dispatcher' && (
                        <AmountEditor
                            onSubmit={amount => {
                                this.setQuoteLoadAmount(row, amount);
                            }}
                        />
                    )
                );
            default:
                return _.get(row, columnName);
        }
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                viewingLoad,
                loadDetailViewOpen,
            } = this.state,
            {
                getCellValue,
                closeContainerDetailView,
                renderCellComponent,
            } = this;

        return (
            <Paper elevation={0} className="quote-loads-container">
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
                        quote={this.props.row}
                        container={viewingLoad}
                        closeView={closeContainerDetailView}
                    />
                )}
            </Paper>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            user: state.userProfileReducer.profile,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            proposeForQuote(params) {
                dispatch(QuoteEntity.ui.propose(params));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(QuoteLoadTable);

