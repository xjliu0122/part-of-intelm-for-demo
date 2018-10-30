import * as React from 'react';
import { connect } from 'react-redux';
import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import { DialogContainer, TextField, Button } from 'react-md';
import IconButton from '@material-ui/core/IconButton';
import AdminIcon from '@material-ui/icons/PersonAdd';
import DemoteIcon from '@material-ui/icons/PersonOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
import _ from 'lodash';
import UserEntity from 'entities/UserProfile/action';

import './index.scss';

const getRowId = row => row.id;

class UserTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'name', title: 'Name' },
                { name: 'email', title: 'Email' },
                { name: 'status', title: 'Status' },
                { name: 'isAdmin', title: 'Admin' },
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
            addUserWindowOpen: false,
        };

        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
        this.makeAdministrator = this.makeAdministrator.bind(this);
        this.toogleAddUserWindow = this.toogleAddUserWindow.bind(this);
    }
    componentWillMount() {
        this.props.getUsers();
    }
    componentWillReceiveProps = nextProps => {
        this.setState({
            rows: nextProps.users,
        });
    };

    deleteObject(id) {
        this.props.deactiveUser(id);
    }
    makeAdministrator(id, admin) {
        this.props.updateUser({ id, isAdmin: admin });
    }
    toogleAddUserWindow() {
        this.setState({ addUserWindowOpen: !this.state.addUserWindowOpen });
    }
    inviteUser() {
        const email = this.state.addUserEmail;
        if (!email) {
            toastMessageHelper.mapApiError('Please enter valid email');
        } else {
            this.props.inviteUser(email);
        }
    }
    renderCell(props) {
        if (props.column.name === 'action') {
            return (
                <Table.Cell {...props}>
                    {props.row.isAdmin && (
                        <IconButton
                            onClick={() => {
                                this.makeAdministrator(props.row.id, false);
                            }}
                            title="Demote"
                            disabled={this.props.profile.id === props.row.id}
                        >
                            <DemoteIcon />
                        </IconButton>
                    )}
                    {!props.row.isAdmin && (
                        <IconButton
                            onClick={() => {
                                this.makeAdministrator(props.row.id, true);
                            }}
                            title="Make Administrator"
                        >
                            <AdminIcon />
                        </IconButton>
                    )}
                    {props.row.active && (
                        <IconButton
                            title="Suspend user"
                            disabled={this.props.profile.id === props.row.id}
                            onClick={() => this.deleteObject(props.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                    {!props.row.active && (
                        <IconButton
                            title="Activate user"
                            disabled={this.props.profile.id === props.row.id}
                            onClick={() =>
                                this.props.activateUser(props.row.id)
                            }
                        >
                            <AddIcon />
                        </IconButton>
                    )}
                </Table.Cell>
            );
        }
        if (props.column.name === 'isAdmin') {
            return (
                <Table.Cell {...props}>
                    {props.row.isAdmin && <DoneIcon />}
                </Table.Cell>
            );
        }
        if (props.column.name === 'status') {
            return (
                <Table.Cell {...props}>
                    {props.row.active ? 'Active' : 'Suspended'}
                </Table.Cell>
            );
        }
        return <Table.Cell {...props} />;
    }
    renderHeaderCell(props) {
        if (props.column.name === 'action') {
            return (
                <Table.Cell {...props}>
                    <IconButton
                        onClick={() => {
                            this.toogleAddUserWindow();
                        }}
                        title="Invite New User"
                    >
                        <AddIcon>Add</AddIcon>
                    </IconButton>
                </Table.Cell>
            );
        }
        return (
            <Table.Cell {...props}>
                <div className="mui-table-header-cell-fontsize">
                    {props.column.title}
                </div>
            </Table.Cell>
        );
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                addUserWindowOpen,
                addUserEmail,
            } = this.state,
            { renderCell, renderHeaderCell } = this;

        return (
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

                <DialogContainer
                    id="addUserForm"
                    visible={addUserWindowOpen}
                    focusOnMount={false}
                    modal
                >
                    <div className="row wrapper">
                        <div className="col-12">
                            <TextField
                                label="Email*"
                                placeholder="Email of new user"
                                required
                                value={addUserEmail}
                                type="email"
                                onChange={value =>
                                    this.setState({ addUserEmail: value })
                                }
                            />
                        </div>
                        <div className="col-12">
                            <Button
                                flat
                                secondary
                                className="float-right"
                                onClick={() => this.toogleAddUserWindow()}
                            >
                                close
                            </Button>
                            <Button
                                flat
                                primary
                                className="float-right"
                                onClick={() => {
                                    this.inviteUser();
                                    this.toogleAddUserWindow();
                                }}
                            >
                                Invite
                            </Button>
                        </div>
                    </div>
                </DialogContainer>
            </Paper>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getUsers: () => {
            dispatch(UserEntity.ui.list({}));
        },
        inviteUser: email => {
            dispatch(UserEntity.ui.invite({ email }));
            UserEntity.after.invite = () => {
                toastMessageHelper.mapSuccessMessage(`Invited ${email}`);
            };
        },
        deactiveUser: id => {
            dispatch(UserEntity.ui.update({ id, active: false }));
        },
        updateUser: params => {
            dispatch(UserEntity.ui.update(params));
        },
        activateUser: id => {
            dispatch(UserEntity.ui.update({ id, active: true }));
        },
    };
};

const mapStateToProps = state => {
    return {
        profile: state.userProfileReducer.profile,
        users: state.userProfileReducer.users,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
