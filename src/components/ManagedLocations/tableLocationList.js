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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddLocationIcon from '@material-ui/icons/Add';

import _ from 'lodash';
import LocationEntity from 'entities/ManagedLocation/action';
import PhoneNumberUtil from '../SharedService/phoneNo';

import './index.scss';

const getRowId = row => row.id;

class LocationTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'name', title: 'Name' },
                { name: 'contact', title: 'Contact' },
                { name: 'address', title: 'Address' },
                { name: 'type', title: 'Type' },
                { name: 'notes', title: 'Notes' },
                { name: 'createdBy', title: 'Created By' },
                { name: 'action', title: ' ' },
            ],
            tableColumnExtensions: [
                { columnName: 'action', align: 'center', width: 120 },
                { columnName: 'name', width: 150 },
                { columnName: 'contact', width: 320 },
                { columnName: 'address', width: 400 },
                { columnName: 'type', width: 100 },
                // { columnName: 'notes'  },
                { columnName: 'createdBy', width: 150 },
            ],
            rows: [],
        };

        this.renderCell = this.renderCell.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.deleteLocation = this.deleteLocation.bind(this);
    }
    componentWillMount() {
        this.props.getManagedLocations();
    }
    componentWillReceiveProps = nextProps => {
        this.setState({
            rows: this.parseLocation(nextProps.locations),
        });
    };

    deleteLocation(id) {
        this.props.deleteLocation({ id });
    }
    showLocationEditDialog(id) {
        this.props.openEditDialog(id);
    }
    parseLocation(locations) {
        const parsed = [];
        locations.forEach(location => {
            parsed.push({
                ...location,
                contact: _.join(
                    [
                        location.contactName || '--',
                        PhoneNumberUtil.formatPhoneNumber(location.contactPhone) || '--',
                        location.contactEmail || '--',
                    ],
                    ', ',
                ),
                address: _.get(location, ['geoLocation', 'address']),
                createdBy:
                    location.createdBy.role === 'dispatcher'
                        ? 'IM'
                        : location.createdBy.name,
            });
        });
        return parsed;
    }
    renderCell(props) {
        if (
            this.props.user.companyId === props.row.managedByCompanyId &&
            props.column.name === 'action'
        ) {
            return (
                <Table.Cell {...props}>
                    <IconButton
                        onClick={() => {
                            this.showLocationEditDialog(props.row.id);
                        }}
                        title="Edit row"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        title="Delete row"
                        onClick={() => this.deleteLocation(props.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Table.Cell>
            );
        }
        if (
            this.props.user.companyId === props.row.managedByCompanyId &&
            props.column.name === 'name'
        ) {
            return (
                <Table.Cell
                    {...props}
                    onClick={() => {
                        this.showLocationEditDialog(props.row.id);
                    }}
                >
                    <a className="clickable-link">{props.row.name}</a>
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
                            this.showLocationEditDialog();
                        }}
                        title="Add Location"
                    >
                        <AddLocationIcon>Add</AddLocationIcon>
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
        const { rows, columns, tableColumnExtensions } = this.state,
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
            </Paper>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getManagedLocations: () => {
            dispatch(LocationEntity.ui.list({}));
        },
        deleteLocation: params => {
            dispatch(LocationEntity.ui.delete(params));
        },
    };
};

const mapStateToProps = state => {
    return {
        user: state.userProfileReducer.profile,
        locations: _.filter(
            state.managedLocationsReducer.managedLocations,
            loc => {
                return (
                    loc.managedByCompanyId ===
                    _.get(state, 'userProfileReducer.profile.companyId')
                );
            },
        ),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(LocationTable);
