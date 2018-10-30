import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//React MD
import { TextField, Button } from 'react-md';

import UserProfileEntity from 'entities/UserProfile/action';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
import Auth from 'services/firebase';
import './styles.scss';

class UserInfoView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            position: null,
            phone: null,
            email: null,
            errors: {},
            password: null,
            repeatPassword: null,
            touched: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.setExsitingInfo = this.setExsitingInfo.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.updatePersonalInfo = this.updatePersonalInfo.bind(this);
    }

    componentWillMount = () => {
        this.setExsitingInfo(this.props);
    };
    componentWillReceiveProps = nextProps => {
        this.setExsitingInfo(nextProps);
    };

    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }
    setExsitingInfo(props) {
        this.setState(_.pick(props.user, ['name', 'position', 'phone', 'email']));
    }
    validateFormValues(values, isSubmitting, type) {
        const fieldErrors = {};
        if (type === 'password') {
            if (!values.password) {
                fieldErrors.password = true;
            }
            if (!values.repeatPassword) {
                fieldErrors.repeatPassword = true;
            }
            if (values.password !== values.repeatPassword) {
                fieldErrors.password = true;
                fieldErrors.repeatPassword = true;
            }
        } else {
            if (!values.name) {
                fieldErrors.name = true;
            }
            if (!values.phone) {
                fieldErrors.phone = true;
            }
            if (!values.email) {
                fieldErrors.email = true;
            }
        }

        this.setState({
            errors: fieldErrors,
        });

        //set all error fields to touched
        if (isSubmitting) {
            const touchedFields = this.state.touched;

            _.each(fieldErrors, (value, key, list) => {
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

    updatePersonalInfo() {
        if (!this.validateFormValues(this.state, true)) return;
        this.props.updateUserInfo(_.pick(this.state, ['name', 'position', 'phone', 'email']));
    }

    changePassword() {
        if (!this.validateFormValues(this.state, true, 'password')) return;
        Auth.changePassword(this.state.password);
    }

    render() {
        const {
            name,
            position,
            phone,
            email,
            errors,
            password,
            repeatPassword,
        } = this.state;

        return (
            <div className="info-view-fields">
                <TextField
                    label="Name *"
                    placeholder="Name"
                    error={errors.name}
                    value={name}
                    onChange={value => this.handleChange(value, 'name')}
                />

                <TextField
                    label="Position"
                    value={position}
                    onChange={value => this.handleChange(value, 'position')}
                />

                <TextField
                    label="Phone Number *"
                    error={errors.phone}
                    value={phone}
                    onChange={value => this.handleChange(value, 'phone')}
                />

                <TextField
                    label="Email *"
                    error={errors.email}
                    value={email}
                    disabled
                    onChange={value => this.handleChange(value, 'email')}
                />
                <footer className="btn-update-actions">
                    <Button
                        raised
                        primary
                        label="update your information"
                        onClick={() => this.updatePersonalInfo()}
                    />
                </footer>
                <div className="row">
                    <div className="info-view-fields">
                        <TextField
                            label="New Password *"
                            error={errors.password}
                            type="password"
                            value={password}
                            onChange={value =>
                                this.handleChange(value, 'password')
                            }
                        />
                        <TextField
                            label="Repeat *"
                            error={errors.repeatPassword}
                            value={repeatPassword}
                            type="password"
                            onChange={value =>
                                this.handleChange(value, 'repeatPassword')
                            }
                        />
                        <footer className="btn-update-actions">
                            <Button
                                raised
                                secondary
                                label="change password"
                                onClick={this.changePassword}
                                // disabled={hasError}
                                className="updatePassword-btn"
                            />
                        </footer>
                    </div>
                </div>
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
            updateUserInfo: params => {
                dispatch(UserProfileEntity.ui.update(params));
                UserProfileEntity.after.update = () => {
                    toastMessageHelper.mapSuccessMessage('Profile updated successfully');
                    dispatch(UserProfileEntity.ui.get());
                };
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoView);
