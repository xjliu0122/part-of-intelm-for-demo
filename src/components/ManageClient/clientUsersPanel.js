import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import { TextField, Button } from 'react-md';
import ManageClientEntity from 'entities/ManageClient/action';

const getRowId = row => row.id;

class ClientUserPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'name', title: 'Name' },
                { name: 'position', title: 'Position' },
                { name: 'email', title: 'Email' },
                { name: 'phone', title: 'Phone' },
                { name: 'status', title: 'Status' },
            ],
            tableColumnExtensions: [
                { columnName: 'name', width: 200 },
                { columnName: 'email', width: 320 },
                { columnName: 'position', width: 150 },
                { columnName: 'status', width: 150 },
            ],
            rows: [],
            notes: props.row.notes,
        };

        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.submitClientNote = this.submitClientNote.bind(this);
    }
    componentWillMount = () => {
        this.props.getClientUsers(_.get(this.props.row, 'id'));
    };
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.rows, nextProps.users)) {
            this.setState({
                rows: nextProps.users,
            });
        }
    }
    handleNoteChange(notes) {
        this.setState({ notes });
    }
    renderCell(props) {
        if (props.column.name === 'status') {
            return (
                <Table.Cell {...props}>
                    {_.join(
                        _.compact([
                            props.row.active ? 'Active' : 'Inactive',
                            props.row.isAdmin ? 'Admin' : null,
                        ]),
                        '/',
                    )}
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
    submitClientNote() {
        this.props.submitClientNotes({
            id: this.props.row.id,
            notes: this.state.notes,
        });
    }
    render() {
        const {
                rows, columns, tableColumnExtensions, notes,
            } = this.state,
            {
                renderCell,
                renderHeaderCell,
                searchBCOs,
                submitClientNote,
            } = this;
        return (
            <div className="client-details-Panel ">
                <div className="panel-tile ">Users:</div>
                <Paper elevation={0}>
                    <Grid rows={rows} columns={columns} getRowId={getRowId}>
                        <PagingState defaultCurrentPage={0} pageSize={10} />
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
                <TextField
                    className="client-note-field"
                    label="Notes"
                    placeholder=""
                    rows="5"
                    value={notes}
                    onChange={value => this.handleNoteChange(value)}
                />
                <Button raised primary onClick={submitClientNote}>
                    save
                </Button>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getClientUsers: id => {
            dispatch(ManageClientEntity.ui.listUser(id));
        },
        submitClientNotes: params => {
            dispatch(ManageClientEntity.ui.update(params));
        },
    };
};
const mapStateToProps = (state, ownProps) => {
    return {
        users: state.manageClientReducer.users,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientUserPanel);
