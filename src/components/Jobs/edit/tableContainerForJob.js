import * as React from 'react';
import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SelectOptions from 'components/config';
import EditPopup from './tableContainerEditPopup';

const ContainerTypeCell = ({ value }) => (
    <Table.Cell>
        {_.get(
            SelectOptions.ContainerTypes.filter(o => o.code === value)[0],
            'description',
        )}
    </Table.Cell>
);
const getRowId = row => row.rowId;

class ContainerGrid extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'actions', title: ' ' },
                { name: 'type', title: 'Type' },
                { name: 'equipmentNo', title: 'Equipment #' },
                { name: 'grossWeight', title: 'Cargo Gross Weight' },
            ],
            tableColumnExtensions: [
                { columnName: 'actions', width: '200', align: 'left' },
                { columnName: 'type', width: '200', align: 'left' },
            ],
            rows: [...props.rows],
        };
        _.map(this.state.rows, (row, index) => _.extend(row, { rowId: index }));
        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.addContainer = this.addContainer.bind(this);
        this.editContainer = this.editContainer.bind(this);
        this.deleteContainer = this.deleteContainer.bind(this);
        this.closeEditContainerPopup = this.closeEditContainerPopup.bind(this);
        this.updateOrAddContRow = this.updateOrAddContRow.bind(this);
    }
    componentWillReceiveProps = nextProps => {
        // if (!_.isEqual(this.props.rows, nextProps.rows)) {
        //     this.setState({
        //         rows: nextProps.rows,
        //     });
        // }
    };

    renderCell = props => {
        if (props.column.name === 'type') {
            return <ContainerTypeCell {...props} />;
        }
        if (props.column.name === 'actions') {
            return (
                <TableCell>
                    <div className="container-table-actions">
                        <IconButton
                            onClick={() => this.editContainer(props.row)}
                            title="Edit row"
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => this.deleteContainer(props.row)}
                            title="Delete row"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </TableCell>
            );
        }
        return <Table.Cell {...props} />;
    };
    renderHeaderCell(props) {
        if (props.column.name === 'actions') {
            return (
                <Table.Cell {...props}>
                    <IconButton
                        color="primary"
                        children={<i className="material-icons">add</i>}
                        onClick={() => {
                            this.addContainer();
                        }}
                        title="Add new container"
                    />
                </Table.Cell>
            );
        }
        return <Table.Cell {...props}>{props.column.title}</Table.Cell>;
    }
    //mui-table-header-cell-fontsize
    editContainer(row) {
        this.setState({
            showEditPopup: true,
            editingRow: row,
        });
    }
    addContainer() {
        this.setState({
            showEditPopup: true,
            editingRow: null,
        });
    }
    updateOrAddContRow(row) {
        let rows = [...this.state.rows];

        if (!_.isNil(row.rowId)) {
            // existing line
            rows = rows.map(currentRow =>
                (currentRow.rowId === row.rowId
                    ? { ...currentRow, ...row }
                    : currentRow));
        } else {
            // new line
            rows.push(row);
        }
        // reorganize rowId
        _.map(rows, (r, index) => _.extend(r, { rowId: index }));
        this.setState({
            rows,
        });
        this.props.handleChange(rows);
        this.closeEditContainerPopup();
    }
    closeEditContainerPopup() {
        this.setState({
            showEditPopup: false,
            editingRow: null,
        });
    }
    deleteContainer(row) {
        const newRows = _.filter(this.state.rows, r => r.rowId !== row.rowId);
        this.setState({
            rows: newRows,
        });
        this.props.handleChange(newRows);
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                showEditPopup,
                editingRow,
            } = this.state,
            { jobType } = this.props,
            {
                renderCell,
                renderHeaderCell,
                closeEditContainerPopup,
                updateOrAddContRow,
            } = this;

        return (
            <Paper elevation={1}>
                <Grid rows={rows} columns={columns} getRowId={getRowId}>
                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCell}
                    />

                    <TableHeaderRow cellComponent={renderHeaderCell} />
                </Grid>
                {showEditPopup && (
                    <EditPopup
                        jobType={jobType}
                        closeWindow={closeEditContainerPopup}
                        editingRow={editingRow}
                        updateContRow={updateOrAddContRow}
                    />
                )}
            </Paper>
        );
    }
}

export default ContainerGrid;
