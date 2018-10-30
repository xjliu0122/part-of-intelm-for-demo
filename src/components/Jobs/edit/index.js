import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { DialogContainer, Button } from 'react-md';
import ManagedLocationEntity from 'entities/ManagedLocation/action';

//React MD
// component
import EditImport from './editImport';
import EditExport from './editExport';
import EditCrossTown from './editCrossTown';

class JobEditView extends Component {
    constructor(props) {
        super(props);
        this.closeWindow = this.closeWindow.bind(this);
        this.toggleConfirmWindow = this.toggleConfirmWindow.bind(this);
        this.state = {
            closeConfirmationOpen: false,
        };
    }

    componentWillMount = () => {
        if (!this.props.clientLocationsFetched) {
            this.props.clearClientLocations();
        }
    };

    handleChange(value, type) {
        this.setState(state => ({
            [type]: value,
            errors: _.omit(state.errors, type),
        }));
    }
    showError(fieldName) {
        let errorText = '';
        if (this.state.errors[fieldName] && this.state.touched[fieldName]) {
            errorText = this.state.errors[fieldName];
        }
        return <div className="fieldError">{errorText}</div>;
    }
    getLocationsByBCO(id) {
        this.props.getLocationsByBCO(id);
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
        const {
                formType,
                role,
                job,
                quote,
                getClientLocations,
                clearClientLocations,
            } = this.props,
            { toggleConfirmWindow } = this,
            actions = [];
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
                    id="editJobForm"
                    visible
                    focusOnMount={false}
                    modal
                >
                    {/* <div className="editJobFormContent"> */}
                    {formType === 'Import' && (
                        <EditImport
                            role={role}
                            job={job}
                            quote={quote}
                            getClientLocations={getClientLocations}
                            clearClientLocations={clearClientLocations}
                            closeWindow={force => toggleConfirmWindow(force)}
                        />
                    )}
                    {formType === 'Export' && (
                        <EditExport
                            role={role}
                            job={job}
                            quote={quote}
                            getClientLocations={getClientLocations}
                            clearClientLocations={clearClientLocations}
                            closeWindow={force => toggleConfirmWindow(force)}
                        />
                    )}
                    {formType === 'Cross Town' && (
                        <EditCrossTown
                            role={role}
                            job={job}
                            quote={quote}
                            getClientLocations={getClientLocations}
                            clearClientLocations={clearClientLocations}
                            closeWindow={force => toggleConfirmWindow(force)}
                        />
                    )}
                </DialogContainer>
                <DialogContainer
                    id="confirmation-dialog"
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
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        clearClientLocations: () => {
            dispatch({ type: 'CLEAR_CLIENT_LOCATIONS' });
        },

        getClientLocations: params => {
            dispatch(ManagedLocationEntity.ui.listClient(params));
        },
    };
};
const mapStateToProps = (state, ownProps) => {
    return {
        clientLocationsFetched:
            _.size(state.managedLocationsReducer.clientLocations) > 0,
        userProfile: state.userProfileReducer.profile,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobEditView);
