import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    SelectField,
    DialogContainer,
    CardActions,
    TextField,
} from 'react-md';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import _ from 'lodash';

import PayeeAutocomplete from 'components/Form/payeeAutoComplete';
import Config from 'components/config';
import AccountingEntity from 'entities/Accounting/action';
import Toaster from 'clientUtils/toastMessageHelper';
import './aparFormStyles.scss';

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            head: {
                color: '#424242',
                fontWeight: 'bold',
                fontSize: '0.9rem',
            },
            body: {
                border: 'unset',
            },
        },
    },
});
class ContainerAPAR extends Component {
    constructor(props) {
        super(props);
        //default item.
        this.state = {
            items: [],
            errors: [],
            touched: [],
            containerInfo: {},
            closeConfirmationOpen: false,
        };
        this.addItem = this.addItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.submit = this.submit.bind(this);
        this.getNewPayeeSuggestions = this.getNewPayeeSuggestions.bind(this);
        this.closeEditForm = this.closeEditForm.bind(this);
        this.toggleConfirmWindow = this.toggleConfirmWindow.bind(this);
        // get items
        props.getItems({
            id: _.get(props, 'container.id'),
            type: _.get(props, 'formType'),
        });
        if (props.formType === 'Payable') {
            props.getAuxContainerInfo({ id: _.get(props, 'container.id') });
        }
    }

    componentWillReceiveProps = nextProps => {
        let items = nextProps.items;
        if (!_.isEqual(nextProps.items, this.props.items)) {
            _.map(items, item => {
                item.searchText = _.get(item, 'payee.name');
            });
            items = _.sortBy(items, ['row']);
            this.setState({
                items,
            });
        }

        if (
            nextProps.formType === 'Payable' &&
            _.get(nextProps.containerInfo, 'id') ===
                _.get(this.props, 'container.id') &&
            !_.isEqual(nextProps.containerInfo, this.state.containerInfo)
        ) {
            this.setState({ containerInfo: nextProps.containerInfo });
        }
    };
    validateFormValues(values) {
        const setFieldError = [];
        _.forEach(values.items, item => {
            const fieldErrors = {};

            if (!item.type) {
                fieldErrors.type = true;
            }
            if (!item.amount) {
                fieldErrors.amount = true;
            }
            // if (!item.tripRowNoInContainer) {
            //     fieldErrors.tripRowNoInContainer = true;
            // }
            if (this.props.formType === 'Payable' && !item.id && !item.payee) {
                fieldErrors.payee = true;
            }
            if (!_.isEmpty(fieldErrors)) {
                setFieldError[item.row - 1] = fieldErrors;
            }
        });
        this.setState({
            errors: setFieldError,
        });
        if (_.isEmpty(setFieldError)) {
            return true;
        }
        return false;
    }

    submit() {
        if (!this.validateFormValues(this.state)) return;
        const toSubmit = {};
        const { container, formType } = this.props,
            { items } = this.state;
        if (formType === 'Payable') {
            _.map(items, item => {
                item.payeeId = _.get(item, 'payee.id');
            });
        } else {
            _.map(items, item => {
                const currentjob = _.find(
                    this.props.jobs,
                    job => job.name === container.jobId,
                );
                item.payerId = _.get(currentjob, 'clientId');
            });
        }

        this.props.submit(
            {
                type: formType,
                containerId: container.id,
                items,
            },
            this.closeEditForm,
        );
    }
    addItem() {
        const items = [].concat(this.state.items);
        items.push({
            type: null,
            searchText: '',
            amount: null,
        });
        _.each(items, (item, i) => {
            item.row = i + 1;
        });
        this.setState({
            items,
        });
    }

    removeItem(index) {
        const items = [].concat(this.state.items);
        items.splice(index, 1);
        _.each(items, (item, i) => {
            item.row = i + 1;
        });
        this.setState({
            items,
        });
    }

    handleChange(value, type, index) {
        const items = [].concat(this.state.items);
        const errorFields = this.state.errors;
        if (!_.isEmpty(errorFields[index]) && errorFields[index][type]) {
            errorFields[index][type] = null;
        }
        const singleItem = {
            ...items[index],
            [type]: value,
        };
        if (type === 'payee') {
            singleItem.searchText = _.get(value, 'name');
        }
        items.splice(index, 1, singleItem);
        this.setState({
            items,
            errors: errorFields,
        });
    }
    closeEditForm() {
        this.props.closeWindow();
        this.setState({
            errors: {},
        });
    }
    getNewPayeeSuggestions(value) {
        this.props.getPayeeSuggestions({
            searchText: value,
            containerId: this.props.container.id,
        });
    }
    toggleConfirmWindow(force = false) {
        if (!force) {
            this.setState({
                closeConfirmationOpen: !this.state.closeConfirmationOpen,
            });
        } else {
            this.closeEditForm();
        }
    }
    render() {
        const {
                handleChange,
                addItem,
                removeItem,
                submit,
                getNewPayeeSuggestions,
            } = this,
            { formType, payeeSuggestions, container } = this.props,
            apItems = _.get(this.props, 'container.containerAP'),
            { items, errors, containerInfo } = this.state,
            trips = _.get(containerInfo, 'trip'),
            { toggleConfirmWindow } = this,
            actions = [];
        actions.push({
            secondary: true,
            children: 'Cancel',
            onClick: () => toggleConfirmWindow(),
        });
        actions.push(<Button
            flat
            primary
            onClick={() => {
                toggleConfirmWindow();
                this.closeEditForm();
            }}
        >
                Confirm
                     </Button>);
        return (
            <MuiThemeProvider theme={theme}>
                <DialogContainer
                    id="editAPARDialogue"
                    visible
                    aria-labelledby="view detail"
                    focusOnMount={false}
                    modal
                    fullPage
                >
                    <header className="modal-header">
                        <section>
                            <h2>edit {formType} items</h2>
                        </section>

                        <Button
                            icon
                            primary
                            onClick={() => {
                                toggleConfirmWindow();
                            }}
                        >
                            close
                        </Button>
                    </header>
                    <section>
                        <div className="table-area">
                            <Table>
                                <TableHead>
                                    <TableRow className="table-header-row">
                                        <TableCell className="col-1">
                                            #
                                        </TableCell>
                                        <TableCell className="col-1">
                                            status
                                        </TableCell>
                                        <TableCell className="col-3">
                                            type
                                        </TableCell>
                                        <TableCell className="col-1">
                                            amount
                                        </TableCell>

                                        <TableCell className="col-3">
                                            {formType === 'Payable' && 'payee'}
                                        </TableCell>
                                        <TableCell className="col-1">
                                            {formType === 'Payable' && 'Tr#'}
                                        </TableCell>
                                        <TableCell className="col-2">
                                            <div className="action-buttons">
                                                <IconButton
                                                    onClick={() => {
                                                        addItem();
                                                    }}
                                                    title="Add"
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((
                                        {
                                            row,
                                            status,
                                            type,
                                            searchText,
                                            amount,
                                            qboDocNo,
                                            tripRowNoInContainer,
                                        },
                                        index,
                                    ) => (
                                        <TableRow className="table-row">
                                            <TableCell className="col-1">
                                                {row}
                                            </TableCell>
                                            <TableCell className="col-1">
                                                {status}
                                            </TableCell>
                                            <TableCell className="col-3">
                                                <SelectField
                                                    className="full-width"
                                                    disabled={
                                                        !_.isEmpty(qboDocNo)
                                                    }
                                                    menuItems={
                                                        formType ===
                                                            'Payable'
                                                            ? Config.APTypes
                                                            : Config.ARTypes
                                                    }
                                                    position={
                                                        SelectField
                                                            .Positions.BELOW
                                                    }
                                                    value={type}
                                                    error={
                                                        errors[index] &&
                                                            errors[index].type
                                                    }
                                                    errorText="required"
                                                    sameWidth
                                                    onChange={value =>
                                                        handleChange(
                                                            value,
                                                            'type',
                                                            index,
                                                        )
                                                    }
                                                />
                                            </TableCell>

                                            <TableCell className="col-1">
                                                <TextField
                                                    className="textfields-position"
                                                    disabled={
                                                        !_.isEmpty(qboDocNo)
                                                    }
                                                    type="number"
                                                    value={amount}
                                                    lineDirection="left"
                                                    error={
                                                        errors[index] &&
                                                            errors[index].amount
                                                    }
                                                    errorText="required"
                                                    onChange={value =>
                                                        this.handleChange(
                                                            value,
                                                            'amount',
                                                            index,
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="col-3 suggestion-position">
                                                {formType === 'Payable' && (
                                                    <PayeeAutocomplete
                                                        required
                                                        dataSource={
                                                            payeeSuggestions
                                                        }
                                                        //selected={payee}
                                                        error={
                                                            errors[index] &&
                                                                errors[index]
                                                                    .payee
                                                        }
                                                        errorText="required"
                                                        handleSearchTextChange={value => {
                                                            handleChange(
                                                                null,
                                                                'payee',
                                                                index,
                                                            );
                                                            getNewPayeeSuggestions(value);
                                                        }}
                                                        disabled={
                                                            !_.isEmpty(qboDocNo)
                                                        }
                                                        searchText={
                                                            searchText
                                                        }
                                                        placeholder="Select or Search..."
                                                        handleSelected={value => {
                                                            handleChange(
                                                                value,
                                                                'payee',
                                                                index,
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="col-1">
                                                {formType === 'Payable' && (
                                                    <TextField
                                                        className="trip-no-field"
                                                        disabled={
                                                            !_.isEmpty(qboDocNo)
                                                        }
                                                        value={
                                                            tripRowNoInContainer
                                                        }
                                                        lineDirection="left"
                                                        error={
                                                            errors[index] &&
                                                                errors[index]
                                                                    .tripRowNoInContainer
                                                        }
                                                        onChange={value =>
                                                            this.handleChange(
                                                                value,
                                                                'tripRowNoInContainer',
                                                                index,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="col-2">
                                                {
                                                    <div className="action-buttons">
                                                        <IconButton
                                                            disabled={
                                                                !_.isEmpty(qboDocNo)
                                                            }
                                                            onClick={() => {
                                                                removeItem(index);
                                                            }}
                                                            title="Remove"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="payable-items-for-receivable-editing">
                            {formType === 'Payable' && (
                                <div>
                                    {/* Price/MC Name of bid assigned to MC (either fixed price or bid price)
Communication history in note and email, message etc.
Vendor Invoice from other vendors */}

                                    <div className="title">Trip Info</div>
                                    {_.map(trips, (trip, index) => {
                                        return (
                                            <div className="trip-section">
                                                <div className="row">
                                                    <div className="trip-title">
                                                        # {index + 1}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="label col-6">
                                                        {`MC: ${_.get(
                                                            trip,
                                                            'assignee.name',
                                                        )}`}
                                                    </div>
                                                    <div className="label col-6">
                                                        {`$ ${_.get(
                                                            trip,
                                                            'amount',
                                                        )}`}
                                                    </div>
                                                </div>
                                                {_.get(trip, 'note') && (
                                                    <div>
                                                        <div className="row">
                                                            <div className="note-label">
                                                                Note
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="text-value">
                                                                {_.get(
                                                                    trip,
                                                                    'note',
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {_.get(
                                                    trip,
                                                    'mcInstruction',
                                                ) && (
                                                    <div>
                                                        <div className="row">
                                                            <div className="note-label">
                                                                Instuctions
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="text-value">
                                                                {_.get(
                                                                    trip,
                                                                    'mcInstruction',
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {formType !== 'Payable' && (
                                <div>
                                    <div className="title">
                                        Current payables:
                                    </div>
                                    <div>
                                        {_.map(apItems, item => {
                                            return (
                                                <div className="row">
                                                    <div className="col-8">
                                                        {item.type}
                                                    </div>
                                                    <div className="col-4">
                                                        {item.amount}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="quoted-title">Quoted:</div>
                                    <div>
                                        {_.get(container, 'amount')
                                            ? `$ ${_.get(container, 'amount')}`
                                            : 'N.A'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                    <footer className="form-footer">
                        <CardActions className="md-divider-border md-divider-border--top">
                            <Button flat primary onClick={submit}>
                                save
                            </Button>
                            <Button
                                flat
                                secondary
                                //className="float-right"
                                onClick={() => {
                                    toggleConfirmWindow();
                                }}
                            >
                                Close
                            </Button>
                        </CardActions>
                    </footer>
                </DialogContainer>
                <DialogContainer
                    id="confirmation-dialog"
                    style={{ zIndex: '999' }}
                    titleClassName="confirmation-dialog-title"
                    contentClassName="confirmation-dialog-content"
                    footerClassName="confirmation-dialog-footer"
                    visible={this.state.closeConfirmationOpen}
                    onHide={this.toggleConfirmWindow}
                    actions={actions}
                    title="Attention"
                >
                    Unsaved data will be lost. Do you want to continue?
                </DialogContainer>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            items: state.accountingReducer.items,
            payeeSuggestions: state.accountingReducer.payees,
            jobs: state.jobReducer.jobs.items,
            containerInfo: state.accountingReducer.apContainerInfo,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getItems: params => {
                dispatch(AccountingEntity.ui.list(params));
            },
            getPayeeSuggestions: params => {
                dispatch(AccountingEntity.ui.suggestPayee(params));
            },
            getAuxContainerInfo: params => {
                dispatch(AccountingEntity.ui.getContainerInfo(params));
            },
            submit: (params, closeEditWindow) => {
                dispatch(AccountingEntity.ui.update(params));
                AccountingEntity.after.update = () => {
                    Toaster.mapSuccessMessage('Saved successfully');
                };
                closeEditWindow();
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(ContainerAPAR);
