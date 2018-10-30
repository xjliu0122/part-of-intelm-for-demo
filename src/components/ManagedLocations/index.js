import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//React MD
import { Button, MenuButton, ListItem } from 'react-md';
import UserProfileEntity from 'entities/UserProfile/action';

import EditDialog from './edit';
import LocationTable from './tableLocationList';

import './index.scss';

class ManagedLocationsView extends Component {
    constructor(props) {
        super(props);
        this.state = { isEditDialogOpen: false, editingLocationId: null };
        this.closeEditDialog = this.closeEditDialog.bind(this);
        this.openEditDialog = this.openEditDialog.bind(this);
    }
    openEditDialog(editingLocationId) {
        this.setState({
            isEditDialogOpen: true,
            editingLocationId,
        });
    }
    closeEditDialog() {
        this.setState({
            isEditDialogOpen: false,
            editingLocationId: null,
        });
    }

    render() {
        const { isEditDialogOpen, editingLocationId } = this.state,
            { closeEditDialog, openEditDialog } = this;
        return (
            <div className="manage-location-view-container">
                <div className="row">
                    <div className="col-12">
                        <LocationTable openEditDialog={openEditDialog} />
                    </div>
                </div>

                {isEditDialogOpen && (
                    <EditDialog
                        locationId={editingLocationId}
                        onClose={closeEditDialog}
                        isEditDialogOpen={isEditDialogOpen}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
        return {
            // user: state.userProfileReducer,
            locations: state.managedLocationsReducer,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getUserProfile: params => {
                dispatch(UserProfileEntity.ui.get({
                    ...params,
                }));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(ManagedLocationsView);
