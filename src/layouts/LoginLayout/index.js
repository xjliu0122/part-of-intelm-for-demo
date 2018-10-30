import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
import localStorageHelper from 'clientUtils/localStorageHelper';
import Auth from 'services/firebase';
//react md
import {
    TextField,
    CardActions,
    Button,
    Card,
    CardTitle,
    CardText,
} from 'react-md';

import './styles.scss';

class LoginLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            showEmailVerificationButton: false,
        };
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }
    login() {
        const { email, password } = this.state;
        const that = this;
        if (email && password) {
            this.props.login(email, password, () => {
                that.setState({ showEmailVerificationButton: true });
            });
        }
    }
    resendVerificationEmail() {
        const { email, password } = this.state;

        if (email && password) {
            this.props.resendVerificationEmail(email, password);
        } else {
            toastMessageHelper.mapApiError('Enter Valid Username & password!');
        }
    }
    resetPassword() {
        const { email } = this.state;

        if (email) {
            this.props.resetPassword(email);
        } else {
            toastMessageHelper.mapApiError('Enter Valid Username');
        }
    }
    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }

    getSignup() {
        browserHistory.push('/signup');
    }

    handleKeyPress = event => {
        if (event.key === 'Enter') {
            this.login();
        }
    };

    render() {
        const { showEmailVerificationButton } = this.state,
            { resendVerificationEmail, resetPassword } = this;
        return (
            <div className="login-view-layout">
                <form>
                    <Card className="login-container">
                        <CardTitle title="login to Intelmodal" />
                        <CardText className="login-fields-container">
                            <div className="fields-layout">
                                <div className="login-fields-content">
                                    <TextField
                                        className="md-cell md-cell--12"
                                        label="Email"
                                        placeholder="Email"
                                        required
                                        errorText="Please enter your email"
                                        onChange={value =>
                                            this.handleChange(value, 'email')
                                        }
                                    />

                                    <TextField
                                        className="md-cell md-cell--12 password-field"
                                        label="password"
                                        placeholder="Enter your password"
                                        type="password"
                                        required
                                        errorText="Please enter your password"
                                        onChange={value =>
                                            this.handleChange(value, 'password')
                                        }
                                        onKeyDown={this.handleKeyPress}
                                    />
                                </div>
                                <div className="login-fields-footer">
                                    <div className="password-help">
                                        <a onClick={resetPassword}>
                                            Forgot password?
                                        </a>
                                    </div>
                                    {showEmailVerificationButton && (
                                        <div className="resend-verification">
                                            <a
                                                onClick={
                                                    resendVerificationEmail
                                                }
                                            >
                                                Resend verification email
                                            </a>
                                        </div>
                                    )}
                                    <CardActions className="login-actions">
                                        <Button
                                            raised
                                            primary
                                            className="btn-login"
                                            onClick={this.login}
                                        >
                                            login
                                        </Button>
                                    </CardActions>
                                </div>
                            </div>
                            <div className="info-layout">
                                <div className="login-fields-content">
                                    <h2>Register for FREE</h2>
                                    <ul>
                                        <li>
                                            <i className="material-icons icon-certified-installer">
                                                check_box
                                            </i>
                                            <span>
                                                Shippers: Instant Quote &
                                                Booking
                                            </span>
                                        </li>
                                        <li>
                                            <i className="material-icons icon-certified-installer">
                                                check_box
                                            </i>
                                            <span>
                                                Automate the booking process
                                                through Integration with your
                                                system
                                            </span>
                                        </li>
                                        <li>
                                            <i className="material-icons icon-certified-installer">
                                                check_box
                                            </i>
                                            <span>
                                                Near Real-time Visibility from
                                                Booking to POD
                                            </span>
                                        </li>
                                        <li>
                                            <i className="material-icons icon-certified-installer">
                                                check_box
                                            </i>
                                            <span>
                                                Utilize Virtually Unlimited
                                                Capacity
                                            </span>
                                        </li>
                                        <li>
                                            <i className="material-icons icon-certified-installer">
                                                check_box
                                            </i>
                                            <span>
                                                Complete log of load and
                                                communication history, accurate
                                                charge and billing disclosure
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="login-fields-footer">
                                    <div className="help-contact">
                                        <a href="https://www.intelmodal.com/">
                                            Read more
                                        </a>
                                    </div>
                                    <CardActions className="login-actions">
                                        <Button
                                            raised
                                            primary
                                            className="btn-login"
                                            onClick={this.getSignup}
                                        >
                                            sign me up!
                                        </Button>
                                    </CardActions>
                                </div>
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
        login: (email, password, showEmailVerificationButton) => {
            Auth.signInWithEmailAndPassword(
                email,
                password,
                showEmailVerificationButton,
            );
        },
        resetPassword: email => {
            Auth.resetPassword(email);
        },
        resendVerificationEmail: (email, password) => {
            Auth.resendVerificationEmail(email, password);
        },
    };
};

export default connect(null, mapDispatchToProps)(LoginLayout);
