import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//React MD
import {
    TextField,
    Button,
    SelectField,
    Dialog,
} from 'react-md';

import UserProfileEntity from 'entities/UserProfile/action';
import Auth from 'services/firebase';
import AutocompletePlace from 'components/Form/googlePlaceAutoComplete';
import './index.scss';


const locationTypes = [
    {
        Name: 'Port',
        Id: 1,
    },
    {
        Name: 'Business',
        Id: 2,
    },
    {
        Name: 'Tradeshow',
        Id: 3,
    },
    {
        Name: 'residential',
        Id: 4,
    },
];

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            name: null,
            address: null,
            locationType: 2,
            contactName: null,
            phone: null,
            email: null,
            notes: null,
        }
        this.setOpen = this.setOpen.bind(this); 
        this.handleChange = this.handleChange.bind(this);
        this.addLocation = this.addLocation.bind(this); 
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }
    setOpen(value) {
        this.setState({
            isModalOpen: value,
        });
    }

    handleAddressChange(geoData, name) {
        this.handleChange(geoData, name);
    }

    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }

    addLocation () {
        const { name, address, locationType, contactName, contactPhone, contactEmail, notes } = this.state;

    }

    render() {
        const { isModalOpen, name, address, locationType, contactName, contactPhone, contactEmail, notes } = this.state;
        const hasError = _.isNil(address) || _.isEmpty(name) || _.isNil(name);

        return (
            <div>
                <Button raised primary onClick={() => { this.setOpen(true); }}>
                    Test
                </Button>
                {isModalOpen &&
                    <Dialog
                        id="manageForm"
                        dialogClassName="react-md-modal manageForm"
                        aria-labelledby="manage location"
                        visible={isModalOpen}
                        onHide={() => this.setOpen(false)}
                        focusOnMount={false}
                        modal
                    >
                        <header className="modal-header">
                            <h2 className="montserrat-bold">edit managed location</h2>
                            <i className="material-icons close" role="button" tabIndex="0" onClick={() => this.setOpen(false)}>close</i>
                        </header>
                        <section className="content manageLOcationFields">
                            <TextField
                                label="Business Name"
                                required
                                errorText="Please enter the business name"
                                value={name}
                                onChange={value =>
                                    this.handleChange(
                                        value,
                                        'name',
                                    )
                                }
                            />
                            <AutocompletePlace
                                label="Address"
                                required
                                placeholder="search and select an address..."
                                errorText="Please search and select an address"
                                value={address}
                                onAutocomplete={(
                                    geoData,
                                    searchText,
                                    index,
                                ) => {
                                    this.handleAddressChange(
                                        geoData,
                                        'address',
                                    );
                                }}
                            />                  
                            <SelectField
                                label="Location Type"
                                menuItems={locationTypes}
                                position={
                                    SelectField.Positions.BELOW
                                }
                                value={locationType}
                                itemLabel="Name"
                                itemValue="Id"
                                sameWidth
                                onChange={value =>
                                    this.handleChange(
                                        value,
                                        'locationType',
                                    )
                                }
                            /> 
                            <TextField
                                label="Name"
                                errorText="Please enter the name"
                                value={contactName}
                                onChange={value =>
                                    this.handleChange(
                                        value,
                                        'contactName',
                                    )
                                }
                            />
                            <TextField
                                label="Phone"
                                value={contactPhone}
                                onChange={value =>
                                    this.handleChange(
                                        value,
                                        'contactPhone',
                                    )
                                }
                            />

                            <TextField
                                label="Email"
                                value={contactEmail}
                                onChange={value =>
                                    this.handleChange(
                                        value,
                                        'contactEmail',
                                    )
                                }
                            />
                            <TextField
                                label="Notes"
                                value={notes}
                                lineDirection="right"
                                rows={2}
                                onChange={value =>
                                    this.handleChange(
                                        value,
                                        'notes',
                                    )
                                }
                            />
                                                        
                        </section>
                        <footer className="btn-manage-actions">
                            <Button
                                flat
                                label="cancel"
                                onClick={() => this.setOpen(false)}
                                className="rounded-button default"
                            />
                            <Button
                                flat
                                label="save"
                                onClick={this.addLocation}
                                disabled={hasError}
                                className="rounded-button primary save-btn"
                            />
                        </footer>
                    </Dialog>
                }
            </div>
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
            getUserProfile: params => {
                dispatch(UserProfileEntity.ui.get({
                    ...params,
                }));
            },
            testSignup: () => {

            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
