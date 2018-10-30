import React, { Component } from 'react';
import { connect } from 'react-redux';
//React MD
import { TextField, Button, SelectField, DialogContainer } from 'react-md';
import _ from 'lodash';
import Config from 'components/config';
import LocationEntity from 'entities/ManagedLocation/action';
import PhoneNumberUtil from '../SharedService/phoneNo';
import AddressUtil from '../SharedService/addressObj';
import './index.scss';
import toastMessageHelper from '../../util/toastMessageHelper';

class EditLocationDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            addressText: null,
            locationType: null,
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            notes: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveLocation = this.saveLocation.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentWillMount = () => {
        const locations = this.props.locations;

        if (this.props.locationId) {
            const location = _.find(locations, { id: this.props.locationId });
            if (location) {
                this.setState({
                    ...location,
                    addressText: _.get(location, 'address.address'),
                });
            }
        }
    };

    onClose() {
        this.props.onClose();
    }

    handleChange(v, type) {
        let value = v;
        if (type === 'contactPhone') {
            value = PhoneNumberUtil.getValueFromMaskedPhoneNumber(v);
        }
        this.setState({
            [type]: value,
        });
    }
    async saveLocation() {
        const locationData = _.pick(this.state, [
            'name',
            'locationType',
            'contactName',
            'contactPhone',
            'contactEmail',
            'notes',
        ]);
        locationData.address = await AddressUtil.getAddressObject(this.state.addressText);
        if (this.props.locationId) {
            this.props.updateLocation(this.props.locationId, locationData);
        } else {
            this.props.addLocation(locationData);
        }
        this.props.onClose();
    }
    render() {
        const {
                name,
                addressText,
                locationType,
                contactName,
                contactEmail,
                notes,
            } = this.state,
            { locationId, isEditDialogOpen, role } = this.props,
            { onClose, saveLocation, handleChange } = this;

        const contactPhone = PhoneNumberUtil.formatPhoneNumber(this.state.contactPhone);
        const hasError =
            _.isNil(addressText) || _.isNil(locationType) || _.isEmpty(name);
        const locationTypes = [...Config.locationTypes];
        if (role === 'dispatcher') {
            locationTypes.push('OCEANPORT');
        }
        return (
            <DialogContainer
                id="editLocationForm"
                visible={isEditDialogOpen}
                aria-labelledby="manage location"
                focusOnMount={false}
                modal
            >
                <header className="modal-header">
                    {locationId && (
                        <h2 className="montserrat-bold">
                            Edit managed location
                        </h2>
                    )}
                    {!locationId && (
                        <h2 className="montserrat-bold">
                            Add managed location
                        </h2>
                    )}
                    <Button icon primary onClick={() => onClose()}>
                        close
                    </Button>
                </header>
                <section className="content manageLocationFields">
                    <TextField
                        label="Business Name"
                        required
                        errorText="Please enter the business name"
                        value={name}
                        onChange={value => handleChange(value, 'name')}
                    />
                    <TextField
                        label="Address"
                        required
                        value={addressText}
                        errorText="Please enter address"
                        onChange={value =>
                            this.handleChange(value, 'addressText')
                        }
                    />
                    <SelectField
                        required
                        label="Location Type"
                        errorText="Please select a type"
                        menuItems={locationTypes}
                        position={SelectField.Positions.BELOW}
                        value={locationType}
                        sameWidth
                        onChange={value => handleChange(value, 'locationType')}
                    />
                    <TextField
                        label="Contact Name"
                        value={contactName}
                        onChange={value => handleChange(value, 'contactName')}
                    />
                    <TextField
                        label="Contact Phone"
                        value={contactPhone}
                        onChange={value => handleChange(value, 'contactPhone')}
                    />

                    <TextField
                        label="Contact Email"
                        value={contactEmail}
                        onChange={value => handleChange(value, 'contactEmail')}
                    />
                    <TextField
                        label="Notes"
                        value={notes}
                        lineDirection="right"
                        rows={2}
                        onChange={value => handleChange(value, 'notes')}
                    />
                </section>
                <footer className="btn-manage-actions">
                    <Button
                        flat
                        label="cancel"
                        onClick={() => onClose()}
                        className="rounded-button default"
                    />
                    <Button
                        flat
                        label="save"
                        onClick={saveLocation}
                        disabled={hasError}
                        className="rounded-button primary save-btn"
                    />
                </footer>
            </DialogContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        locations: state.managedLocationsReducer.managedLocations,
        role: _.get(state, 'userProfileReducer.profile.role'),
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateLocation: (id, data) => {
            dispatch(LocationEntity.ui.update({
                ...data,
                id,
            }));
        },
        addLocation: data => {
            dispatch(LocationEntity.ui.create({ ...data }));
            // LocationEntity.failure.create = (params) => {
            //     toastMessageHelper.mapApiError('Duplicate name');
            // };
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditLocationDialog);
