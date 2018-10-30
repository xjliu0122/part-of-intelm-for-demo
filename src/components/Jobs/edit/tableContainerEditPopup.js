import * as React from 'react';
import { connect } from 'react-redux';
import SelectOptions from 'components/config';
import _ from 'lodash';
import moment from 'moment';
import ContainerValidator from 'container-validator';

import LocationAutocomplete from 'components/Form/locationAutoComplete';
import {
    CardActions,
    Button,
    TextField,
    DatePicker,
    Checkbox,
    SelectField,
    DialogContainer,
} from 'react-md';

const getDateStringFromUTCDate = date => {
    if (date) {
        return moment(date)
            .format('MM/DD/YYYY');
    }
    return null;
};
class ContainerEditPopupView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            equipmentNo: null,
            grossWeight: null,
            loadingOptions: 'Live',
            hazmat: null,
            overweight: null,
            oversize: null,
            pickupDate: null, //,all
            deliveryDate: null, //all
            emptyRequestDate: null, // export only
            lfdEmptyReturnDate: null, // import only
            emptyReadyDate: null, // import only
            pickupFromLocation: null,
            deliverToLocation: null,
            loadReadyDate: null,
            errors: {},
            touched: {},
        };
        this.closeWindow = this.closeWindow.bind(this);
        this.submitCont = this.submitCont.bind(this);
        this.setExistingData = this.setExistingData.bind(this);
        this.validateFormValues = this.validateFormValues.bind(this);
    }
    componentWillMount() {
        const { editingRow } = this.props;
        if (editingRow) {
            // this is for edit
            this.setExistingData(editingRow);
        }
    }
    setExistingData(row) {
        this.setState({
            ...this.state,
            ...row,
            pickupDate: getDateStringFromUTCDate(row.pickupDate),
            deliveryDate: getDateStringFromUTCDate(row.deliveryDate), //all
            emptyRequestDate: getDateStringFromUTCDate(row.emptyRequestDate), // export only
            lfdEmptyReturnDate: getDateStringFromUTCDate(row.lfdEmptyReturnDate), // import only
            emptyReadyDate: getDateStringFromUTCDate(row.emptyReadyDate), // import only
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
        // if (!values.pickupFromLocation) {
        //     fieldErrors.pickupFromLocation = true;
        // }
        if (!values.type) {
            fieldErrors.type = true;
        }
        if (this.props.jobType === 'Import' && !values.equipmentNo) {
            fieldErrors.equipmentNo = true;
        }
        if (values.equipmentNo) {
            // check digit logic for container no.
            const conVal = new ContainerValidator();
            if (!conVal.isValid(values.equipmentNo.trim())) {
                fieldErrors.equipmentNo = true;
            }
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
    submitCont() {
        if (!this.validateFormValues(this.state, true)) return;
        this.props.updateContRow(
            {
                ..._.omit(this.state, ['errors', 'touched']),
            },
            _.isNil(this.props.editingRow),
        );
    }
    closeWindow() {
        this.props.closeWindow();
    }

    render() {
        const { role } = this.props.user,
            { jobType } = this.props,
            {
                errors,
                type,
                length,
                width,
                height,
                unit,
                equipmentNo,
                grossWeight,
                description,
                loadingOptions,
                hazmat,
                overweight,
                oversize,
                pickupDate, //,all
                deliveryDate, //all
                emptyRequestDate, // export only
                lfdEmptyReturnDate, // import only
                emptyReadyDate, // import only
                pickupFromLocation,
                deliverToLocation,
                loadReadyDate,
            } = this.state;

        return (
            <DialogContainer
                id="editContForm"
                visible
                focusOnMount={false}
                fullPage
            >
                <div className="header-title">
                    <h2>Container</h2>
                </div>
                <div className="main-edit-workspace">
                    <div className="row">
                        <div className="col-6">
                            <SelectField
                                id="idContTypeSelect"
                                label="Type *"
                                menuItems={SelectOptions.ContainerTypes}
                                position={SelectField.Positions.BELOW}
                                error={errors.type}
                                itemLabel="description"
                                itemValue="code"
                                value={type}
                                simplifiedMenu
                                onChange={value =>
                                    this.handleChange(value, 'type')
                                }
                            />
                        </div>
                        <div className="col-6">
                            {(jobType === 'Export' ||
                                jobType === 'Cross Town') && (
                                <TextField
                                    label="Container#"
                                    value={equipmentNo}
                                    error={errors.equipmentNo}
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'equipmentNo')
                                    }
                                />
                            )}
                            {jobType === 'Import' && (
                                <TextField
                                    label="Container# *"
                                    value={equipmentNo}
                                    error={errors.equipmentNo}
                                    errorText="Use correct container #"
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'equipmentNo')
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <TextField
                                label="Description"
                                value={description}
                                placeholder=""
                                onChange={value =>
                                    this.handleChange(value, 'description')
                                }
                            />
                        </div>
                    </div>
                    {jobType === 'Export' && (
                        <div className="row">
                            <div className="col-6">
                                <DatePicker
                                    label="Empty Request Date"
                                    autoOk
                                    inline
                                    fullWidth
                                    readonly={false}
                                    value={emptyRequestDate}
                                    onChange={value =>
                                        this.handleChange(
                                            moment(value)
                                                .toDate(),
                                            'emptyRequestDate',
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {// role === 'dispatcher' &&
                        (jobType === 'Export' || jobType === 'Cross Town') && (
                            <div className="row">
                                <div className="col-6">
                                    <DatePicker
                                        label="Pickup Date *"
                                        autoOk
                                        inline
                                        fullWidth={false}
                                        readonly={false}
                                        value={pickupDate}
                                        error={errors.pickupDate}
                                        maxDate={moment(deliveryDate)
                                            .toDate()}
                                        onChange={value =>
                                            this.handleChange(
                                                moment(value)
                                                    .toDate(),
                                                'pickupDate',
                                            )
                                        }
                                    />
                                </div>
                                <div
                                    className={`col-6 ${
                                        errors.pickupFromLocation ? 'error' : ''
                                    }`}
                                >
                                    <LocationAutocomplete
                                        label="Pickup Address *"
                                        placeholder=""
                                        initialText={_.get(
                                            pickupFromLocation,
                                            'name',
                                        )}
                                        error={errors.pickupFromLocation}
                                        handleSelected={value =>
                                            this.handleChange(
                                                value,
                                                'pickupFromLocation',
                                            )
                                        }
                                        onChange={() =>
                                            this.handleChange(
                                                null,
                                                'pickupFromLocation',
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    {//(role === 'dispatcher' &&
                        (jobType === 'Import' || jobType === 'Cross Town') && (
                            <div className="row">
                                <div className="col-6">
                                    <DatePicker
                                        label="Requested Delivery Date"
                                        autoOk
                                        inline
                                        fullWidth={false}
                                        readonly={false}
                                        value={deliveryDate}
                                        // error={errors.deliveryDate}
                                        minDate={moment(pickupDate)
                                            .toDate()}
                                        onChange={value =>
                                            this.handleChange(
                                                moment(value)
                                                    .toDate(),
                                                'deliveryDate',
                                            )
                                        }
                                    />
                                </div>

                                <div
                                    className={`col-6 ${
                                        errors.deliverToLocation ? 'error' : ''
                                    }`}
                                >
                                    <LocationAutocomplete
                                        label="Deliver Address"
                                        placeholder=""
                                        initialText={_.get(
                                            deliverToLocation,
                                            'name',
                                        )}
                                        // error={errors.deliverToLocation}
                                        // errorText={this.showError('deliverToLocation')}
                                        handleSelected={value =>
                                            this.handleChange(
                                                value,
                                                'deliverToLocation',
                                            )
                                        }
                                        onChange={() =>
                                            this.handleChange(
                                                null,
                                                'deliverToLocation',
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    <div className="row">
                        <div className="col-6">
                            <SelectField
                                label="Options"
                                menuItems={SelectOptions.loadingOptions}
                                position={SelectField.Positions.BELOW}
                                value={loadingOptions}
                                sameWidth
                                onChange={value =>
                                    this.handleChange(value, 'loadingOptions')
                                }
                            />
                        </div>
                        <div className="col-3">
                            <TextField
                                label="Gross Weight"
                                value={grossWeight}
                                placeholder=""
                                onChange={value =>
                                    this.handleChange(value, 'grossWeight')
                                }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 options-group">
                            <Checkbox
                                id="Hazmat"
                                label="Hazmat"
                                checked={hazmat}
                                onChange={value =>
                                    this.handleChange(value, 'hazmat')
                                }
                            />
                            <Checkbox
                                id="oversize"
                                label="Over size"
                                checked={oversize}
                                onChange={value =>
                                    this.handleChange(value, 'oversize')
                                }
                            />
                            <Checkbox
                                id="Overweight"
                                label="Over weight"
                                checked={overweight}
                                onChange={value =>
                                    this.handleChange(value, 'overweight')
                                }
                            />
                        </div>
                    </div>
                    {oversize && (
                        <div className="row">
                            <div className="col-3">
                                <TextField
                                    label="Length"
                                    value={length}
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'length')
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <TextField
                                    label="Width"
                                    value={width}
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'width')
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <TextField
                                    label="Height"
                                    value={height}
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'height')
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <SelectField
                                    id="idContUnitSelect"
                                    label="Unit"
                                    menuItems={
                                        SelectOptions.ContainerUnitOptions
                                    }
                                    position={SelectField.Positions.BELOW}
                                    error={errors.unit}
                                    value={unit}
                                    simplifiedMenu
                                    onChange={value =>
                                        this.handleChange(value, 'unit')
                                    }
                                />
                            </div>
                        </div>
                    )}
                    <div className="row">
                        {jobType === 'Import' &&
                            role === 'dispatcher' && (
                            <div className="col-6">
                                <DatePicker
                                    label="LFD Return Port"
                                    autoOk
                                    inline
                                    fullWidth={false}
                                    readonly={false}
                                    value={lfdEmptyReturnDate}
                                    onChange={value =>
                                        this.handleChange(
                                            moment(value)
                                                .toDate(),
                                            'lfdEmptyReturnDate',
                                        )
                                    }
                                />
                            </div>
                        )}

                        {jobType === 'Export' &&
                            role === 'dispatcher' && (
                            <div className="col-6">
                                <DatePicker
                                    label="Load Ready Date"
                                    autoOk
                                    inline
                                    fullWidth={false}
                                    readonly={false}
                                    value={loadReadyDate}
                                    onChange={value =>
                                        this.handleChange(
                                            moment(value)
                                                .toDate(),
                                            'loadReadyDate',
                                        )
                                    }
                                />
                            </div>
                        )}
                        {jobType === 'Import' &&
                            role === 'dispatcher' && (
                            <div className="col-6">
                                <DatePicker
                                    label="Empty Ready Date"
                                    autoOk
                                    inline
                                    fullWidth={false}
                                    readonly={false}
                                    value={emptyReadyDate}
                                    onChange={value =>
                                        this.handleChange(
                                            moment(value)
                                                .toDate(),
                                            'emptyReadyDate',
                                        )
                                    }
                                />
                            </div>
                        )}
                        {/* {role === 'dispatcher' && (
                            <div className="col-6">
                                <TextField
                                    label="Chassis Type"
                                    value={chassisType}
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'chassisType')
                                    }
                                />
                            </div>
                        )}
                        {role === 'dispatcher' && (
                            <div className="col-6">
                                <TextField
                                    label="Chassis No"
                                    value={chassisNo}
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'chassisNo')
                                    }
                                />
                            </div>
                        )}
                        {role === 'dispatcher' && (
                            <div className="col-6">
                                <TextField
                                    label="Seal"
                                    value={seal}
                                    placeholder=""
                                    onChange={value =>
                                        this.handleChange(value, 'seal')
                                    }
                                />
                            </div>
                        )} */}
                    </div>
                </div>
                <div className="form-footer">
                    <CardActions className="md-divider-border md-divider-border--top">
                        <Button
                            flat
                            primary
                            className="float-right"
                            onClick={this.submitCont}
                        >
                            save
                        </Button>
                        <Button
                            flat
                            secondary
                            className="float-right"
                            onClick={this.closeWindow}
                        >
                            Close
                        </Button>
                    </CardActions>
                </div>
            </DialogContainer>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch1: () => {},
    };
};
const mapStateToProps = (state, ownProps) => {
    return {
        user: state.userProfileReducer.profile,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContainerEditPopupView);
