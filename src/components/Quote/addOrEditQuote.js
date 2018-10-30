import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import QuoteEntity from 'entities/Quote/action';
import LocationAutocomplete from 'components/Form/locationAutoComplete/index';
//React MD
import {
    CardActions,
    Button,
    TextField,
    SelectField,
    DialogContainer,
} from 'react-md';
import ContainerTable from 'components/Jobs/edit/tableContainerForJob';

class QuoteEditView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            touched: {},
            container: [],
            type: 'Import',
            portId: null,
            remarks: '',
            notes: '',
            closeConfirmationOpen: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitQuote = this.submitQuote.bind(this);
        this.setExistingQuoteData = this.setExistingQuoteData.bind(this);
        this.closeWindow = this.closeWindow.bind(this);
        this.toggleConfirmWindow = this.toggleConfirmWindow.bind(this);
        this.validateFormValues = this.validateFormValues.bind(this);
    }
    componentWillMount() {
        this.setExistingQuoteData(this.props.quote);
    }
    setExistingQuoteData(quote) {
        if (!quote) return;
        const container = [];
        let index = 0;
        _.map(quote.container, con => {
            index += 1;
            container.push({
                ...con,
                rowId: index,
            });
        });
        const data = {
            ...quote,
            container,
        };
        this.setState({
            ...data,
        });
    }
    handleChange(value, type) {
        this.setState(state => ({
            [type]: value,
            errors: _.omit(state.errors, type),
        }));
    }
    validateFormValues(values, isSubmitting) {
        const fieldErrors = {};

        if (!values.type) {
            fieldErrors.type = true;
        }
        if (!values.container.length) {
            fieldErrors.container = true;
        }
        this.setState({
            errors: fieldErrors,
        });

        //set all error fields to touched
        if (isSubmitting) {
            const touchedFields = this.state.touched;
            _.each(fieldErrors, (value, key) => {
                touchedFields[key] = 'true';
            });
            this.setState({
                touched: touchedFields,
            });
            if (_.isEmpty(fieldErrors)) {
                return true;
            }
            return false;
        }
    }

    getContainersForSubmit(containers) {
        return _.map(containers, (container, index) => {
            return {
                ...container,
                deliverToLocationId: _.get(container, 'deliverToLocation.id'),
                pickupFromLocationId: _.get(container, 'pickupFromLocation.id'),
                seqNo: index + 1,
            };
        });
    }
    submitQuote() {
        if (!this.validateFormValues(this.state, true)) return;
        let formValues = { ...this.state };
        formValues.container = this.getContainersForSubmit(formValues.container);
        formValues = _.omit(formValues, ['touched', 'errors']);
        const { closeWindow } = this.props;
        if (formValues.name) {
            this.props.updateQuote(formValues, closeWindow);
        } else this.props.createQuote(formValues, closeWindow);
    }
    closeWindow() {
        this.props.closeWindow();
    }
    toggleConfirmWindow(force = false) {
        if (!force) {
            this.setState({
                closeConfirmationOpen: !this.state.closeConfirmationOpen,
            });
        } else {
            this.closeWindow();
        }
    }
    render() {
        const { closeWindow, toggleConfirmWindow } = this,
            actions = [],
            {
                errors, type, notes, remarks, container, port,
            } = this.state;
        actions.push({
            secondary: true,
            children: 'Cancel',
            onClick: () => this.toggleConfirmWindow(),
        });
        actions.push(<Button
            flat
            primary
            onClick={() => {
                this.toggleConfirmWindow();
                this.closeWindow();
            }}
        >
                Confirm
        </Button>);
        return (
            <div>
                <DialogContainer
                    id="editQuoteForm"
                    visible
                    focusOnMount={false}
                    modal
                >
                    <div className="header-title">
                        <h2>Request for Quote </h2>

                        <i
                            className="material-icons icon-close"
                            onClick={() => toggleConfirmWindow()}
                        >
                            close
                        </i>
                    </div>

                    <div className="main-edit-workspace">
                        <div className="row">
                            <div className="col-6">
                                <SelectField
                                    id="idQuoteTypeRadios"
                                    label="Type"
                                    menuItems={[
                                        'Import',
                                        'Export',
                                        'Cross Town',
                                    ]}
                                    position={SelectField.Positions.BELOW}
                                    error={errors.type}
                                    value={type}
                                    simplifiedMenu
                                    onChange={value =>
                                        this.handleChange(value, 'type')
                                    }
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <LocationAutocomplete
                                    label="Port"
                                    initialText={_.get(port, 'name')}
                                    port
                                    placeholder="Select or Search..."
                                    handleSelected={value =>
                                        this.handleChange(value.id, 'portId')
                                    }
                                    handleSearchTextChange={() => {
                                        this.handleChange(null, 'portId');
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row container-table">
                            <h4>
                                Containers: {this.state.container.length || 0}
                            </h4>
                        </div>
                        <div className="row container-table">
                            <ContainerTable
                                rows={container}
                                error={errors.container}
                                jobType={type}
                                handleChange={value =>
                                    this.handleChange(value, 'container')
                                }
                                onRef={f => {
                                    this.containerControl = f;
                                }}
                            />
                        </div>
                        {errors.container && (
                            <div className="containerError">
                                Please update and save your data before
                                submission.
                            </div>
                        )}
                        <div className="row">
                            <div className="col-6">
                                <TextField
                                    label="Instructions"
                                    value={remarks}
                                    lineDirection="right"
                                    rows={2}
                                    onChange={value =>
                                        this.handleChange(value, 'remarks')
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <TextField
                                    label="Notes"
                                    value={notes}
                                    lineDirection="right"
                                    rows={2}
                                    onChange={value =>
                                        this.handleChange(value, 'notes')
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <CardActions className="md-divider-border md-divider-border--top">
                            <Button
                                flat
                                primary
                                className="float-right"
                                onClick={this.submitQuote}
                            >
                                submit
                            </Button>
                            <Button
                                flat
                                secondary
                                className="float-right"
                                onClick={() => toggleConfirmWindow()}
                            >
                                Close
                            </Button>
                        </CardActions>
                    </div>
                </DialogContainer>
                <DialogContainer
                    id="confirmation-dialog"
                    titleClassName="confirmation-dialog-title"
                    contentClassName="confirmation-dialog-content"
                    footerClassName="confirmation-dialog-footer"
                    visible={this.state.closeConfirmationOpen}
                    onHide={() => this.toggleConfirmWindow()}
                    actions={actions}
                    title="Attention"
                >
                    Unsaved data will be lost. Do you want to continue?
                </DialogContainer>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
        return {
            locations: state.managedLocationsReducer.managedLocations,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            createQuote: (data, closeWindow) => {
                dispatch(QuoteEntity.ui.create(data));
                QuoteEntity.after.create = () => {
                    closeWindow(true);
                };
            },
            updateQuote: (data, closeWindow) => {
                dispatch(QuoteEntity.ui.update(data));
                QuoteEntity.after.update = () => {
                    closeWindow(true);
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(QuoteEditView);
