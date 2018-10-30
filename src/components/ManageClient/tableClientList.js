import * as React from 'react';
import { connect } from 'react-redux';
import {
    SearchState,
    PagingState,
    IntegratedPaging,
    RowDetailState,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    SearchPanel,
    Toolbar,
    TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
import _ from 'lodash';
import { SelectionControlGroup } from 'react-md';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ResumeIcon from '@material-ui/icons/Done';
import SuspendIcon from '@material-ui/icons/PanTool';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ComapnyDetailView from 'components/Company/CompanyDetails';
import ManageClientEntity from 'entities/ManageClient/action';
import ClientDetailView from './clientUsersPanel';

import './index.scss';

const getRowId = row => row.id;

class ClientTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'name', title: 'Name' },
                { name: 'email', title: 'Email' },
                { name: 'phone', title: 'Phone' },
                { name: 'status', title: 'Status' },
                { name: 'action', title: ' ' },
            ],
            tableColumnExtensions: [
                { columnName: 'action', align: 'right' },
                { columnName: 'name', width: 200 },
                { columnName: 'email', width: 320 },
                { columnName: 'status', width: 150 },
                { columnName: 'isAdmin', width: 100 },
            ],
            rows: [],
            expandedRowIds: [],
            selectedClientType: 'BCO',
            companyDetailViewOpen: false,
            viewingCompany: null,
        };
        this.onExpandedRowIdsChange = expandedRowIds =>
            this.setState({
                expandedRowIds: _.difference(
                    expandedRowIds,
                    this.state.expandedRowIds,
                ),
            });
        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.updateObject = this.updateObject.bind(this);
        this.searchClients = this.searchClients.bind(this);
        this.setSelctedClientType = this.setSelctedClientType.bind(this);
        this.toggleCompanyDetailPopup = this.toggleCompanyDetailPopup.bind(this);
    }
    componentWillMount() {
        this.props.searchClients('', this.state.selectedClientType);
    }
    componentWillReceiveProps = nextProps => {
        this.setState({
            rows: nextProps.bcos,
        });
    };
    searchClients(term, type) {
        this.props.searchClients(term, type);
    }
    updateObject(params) {
        this.props.updateCompany(params);
    }
    toggleCompanyDetailPopup(viewingCompany = null) {
        this.setState({
            companyDetailViewOpen: !this.state.companyDetailViewOpen,
            viewingCompany,
        });
    }
    renderCell(props) {
        const profile = this.props.profile;
        if (props.column.name === 'action') {
            return (
                <Table.Cell {...props}>
                    {profile.isAdmin &&
                        !props.row.suspended && (
                        <IconButton
                            title="Suspend Client"
                            onClick={() =>
                                this.updateObject({
                                    id: props.row.id,
                                    suspended: true,
                                })
                            }
                        >
                            <SuspendIcon />
                        </IconButton>
                    )}

                    {profile.isAdmin &&
                        props.row.suspended && (
                        <IconButton
                            title="Resume Client"
                            onClick={() =>
                                this.updateObject({
                                    id: props.row.id,
                                    suspended: false,
                                })
                            }
                        >
                            <ResumeIcon />
                        </IconButton>
                    )}
                    {props.row.active && (
                        <IconButton
                            title="Deactivate Client"
                            disabled={this.props.profile.id === props.row.id}
                            onClick={() =>
                                this.updateObject({
                                    id: props.row.id,
                                    active: false,
                                })
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                    {!props.row.active && (
                        <IconButton
                            title="Activate Client"
                            disabled={this.props.profile.id === props.row.id}
                            onClick={() =>
                                this.updateObject({
                                    id: props.row.id,
                                    active: true,
                                })
                            }
                        >
                            <AddIcon />
                        </IconButton>
                    )}
                </Table.Cell>
            );
        }

        if (props.column.name === 'status') {
            return (
                <Table.Cell {...props}>
                    {_.join(
                        _.compact([
                            props.row.active ? 'Active' : 'Inactive',
                            props.row.suspended ? 'Suspended' : null,
                        ]),
                        '/',
                    )}
                </Table.Cell>
            );
        }
        if (props.column.name === 'name') {
            return (
                <Table.Cell
                    {...props}
                    className="client-name-cell"
                    onClick={() => this.toggleCompanyDetailPopup(props.row)}
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
    setSelctedClientType(value) {
        this.setState({ selectedClientType: value });
        this.searchClients('', value);
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                expandedRowIds,
                selectedClientType,
                companyDetailViewOpen,
                viewingCompany,
            } = this.state,
            {
                renderCell,
                renderHeaderCell,
                searchClients,
                onExpandedRowIdsChange,
                setSelctedClientType,
                toggleCompanyDetailPopup,
            } = this;

        return (
            <Paper className="manage-client-container" elevation={1}>
                <div className="row client-type-radio-group">
                    <SelectionControlGroup
                        inline
                        id="client-type-radio-group"
                        name="radio-client"
                        type="radio"
                        value={selectedClientType}
                        controls={[
                            {
                                label: 'BCO',
                                value: 'BCO',
                            },
                            {
                                label: 'MC',
                                value: 'MC',
                            },
                        ]}
                        onChange={value => setSelctedClientType(value)}
                    />
                </div>
                <Grid rows={rows} columns={columns} getRowId={getRowId}>
                    <PagingState defaultCurrentPage={0} pageSize={10} />
                    <SearchState
                        onValueChange={v =>
                            searchClients(v, selectedClientType)
                        }
                    />
                    <IntegratedPaging />
                    <RowDetailState
                        expandedRowIds={expandedRowIds}
                        onExpandedRowIdsChange={onExpandedRowIdsChange}
                    />
                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={renderCell}
                    />

                    <TableHeaderRow
                        showSortingControls={false}
                        cellComponent={renderHeaderCell}
                    />
                    <TableRowDetail contentComponent={ClientDetailView} />
                    <Toolbar />
                    <SearchPanel />
                    <PagingPanel />
                </Grid>
                {companyDetailViewOpen && (
                    <ComapnyDetailView
                        company={viewingCompany}
                        closeView={() => toggleCompanyDetailPopup()}
                    />
                )}
            </Paper>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateCompany: params => {
            dispatch(ManageClientEntity.ui.update(params));
        },
        searchClients: (term, type) => {
            dispatch(ManageClientEntity.ui.list({ term, type }));
        },
    };
};

const mapStateToProps = state => {
    return {
        profile: state.userProfileReducer.profile,
        bcos: state.manageClientReducer.bcos,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientTable);
