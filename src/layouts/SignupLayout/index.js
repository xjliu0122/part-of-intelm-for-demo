import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Auth from 'services/firebase';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
//react md
import {
    TextField,
    CardActions,
    Button,
    Card,
    CardTitle,
    CardText,
} from 'react-md';

//Constants
import Validators from 'components/Form/validators';
import './styles.scss';

// entities
import UserProfileEntity from 'entities/UserProfile/action';

class SignupLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            touched: {},
        };

        this.signUpUser = this.signUpUser.bind(this);
    }

    handleChange(value, type) {
        this.setState(state => ({
            [type]: value,
            errors: _.omit(state.errors, type),
        }));
    }
    validateFormValues(values, isSubmitting) {
        const fieldErrors = {};

        if (!values.name || Validators.required(values.name)) {
            fieldErrors.FirstName = 'Please enter your name';
        }
        if (!values.email) {
            fieldErrors.email = 'Please enter your email address';
        } else if (Validators.email(values.email)) {
            fieldErrors.email = 'Invalid email address';
        }

        if (!values.password || Validators.required(values.password)) {
            fieldErrors.password = 'Please enter your password';
        }

        if (
            !values.confirmPassword ||
            values.password !== values.confirmPassword
        ) {
            fieldErrors.confirmPassword = 'Your password does not match';
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

    showError(fieldName) {
        let errorText = '';
        if (this.state.errors[fieldName] && this.state.touched[fieldName]) {
            errorText = this.state.errors[fieldName];
        }

        return <div className="fieldError">{errorText}</div>;
    }

    signUpUser() {
        const formValues = { ...this.state };
        delete formValues.errors;
        delete formValues.touched;
        if (!this.validateFormValues(this.state, true)) return;
        this.props.signUpUser(formValues);
    }

    backtoLogin() {
        browserHistory.push('/login');
    }

    render() {
        const { errors } = this.state,
            { signUpUser, backtoLogin } = this;
        return (
            <div className="signup-view">
                <form>
                    <Card className="signup-form-container">
                        <CardTitle title="sign up" />
                        <CardText className="sign-up-fields">
                            <div className="fields-layouts">
                                <TextField
                                    className="md-cell md-cell--12 input-row"
                                    label="Name"
                                    placeholder="Name"
                                    error={errors.name}
                                    errorText={this.showError('name')}
                                    onChange={value =>
                                        this.handleChange(value, 'name')
                                    }
                                />
                                <TextField
                                    className="md-cell md-cell--12"
                                    label="Position"
                                    placeholder="Position"
                                    error={errors.position}
                                    errorText={this.showError('position')}
                                    onChange={value =>
                                        this.handleChange(value, 'position')
                                    }
                                />
                                <TextField
                                    name="Email"
                                    className="md-cell md-cell--12"
                                    label="Email"
                                    placeholder="Email"
                                    error={errors.email}
                                    errorText={this.showError('email')}
                                    onChange={value =>
                                        this.handleChange(value, 'email')
                                    }
                                />

                                <TextField
                                    className="md-cell md-cell--12 password-field"
                                    name="password"
                                    label="password"
                                    placeholder="Enter your password"
                                    type="password"
                                    error={errors.password}
                                    errorText={this.showError('password')}
                                    onChange={value =>
                                        this.handleChange(value, 'password')
                                    }
                                />

                                <TextField
                                    name="confirmpassword"
                                    label="confirm password"
                                    placeholder="confirm your password"
                                    type="password"
                                    className="md-cell md-cell--12 password-field"
                                    error={errors.confirmPassword}
                                    errorText={this.showError('confirmPassword')}
                                    onChange={value =>
                                        this.handleChange(
                                            value,
                                            'confirmPassword',
                                        )
                                    }
                                />
                                <CardActions className="signup-actions">
                                    <p className="legalText">
                                        By signing up, you agree to our{' '}
                                        <a
                                            href="https://app.termly.io/document/terms-of-use-for-saas/34743392-0244-4c10-8d47-a745c3b7b702"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            terms
                                        </a>{' '}
                                        and{' '}
                                        <a
                                            href="https://app.termly.io/document/privacy-policy/389a5a2a-5b5f-4194-ab8f-2a16a9bd3004"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            privacy policy
                                        </a>
                                    </p>
                                    <div className="signup-btn-actions">
                                        <Button
                                            raised
                                            primary
                                            className="btn-signup"
                                            onClick={signUpUser}
                                        >
                                            SIGN UP
                                        </Button>
                                        <Button
                                            raised
                                            primary
                                            className="back-login"
                                            onClick={backtoLogin}
                                        >
                                            BACK TO LOGIN
                                        </Button>
                                    </div>
                                </CardActions>
                            </div>
                        </CardText>
                    </Card>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signUpUser: async formValues => {
            // signup with firebase first.
            const user = await Auth.signUpWithEmailAndPassword(
                formValues.email,
                formValues.password,
            );
            if (user) {
                // Auth.resendVerificationEmail(
                //     formValues.email,
                //     formValues.password,
                // );
                UserProfileEntity.after.create = afterParams => {
                    Auth.signOut();
                    toastMessageHelper.mapSuccessMessage('User registered successfully. Please verify your email before login.');
                };
                dispatch(UserProfileEntity.ui.create({
                    ...formValues,
                    password: null,
                    uid: Auth.getUid(),
                }));
            }
        },
    };
};

export default connect(null, mapDispatchToProps)(SignupLayout);
