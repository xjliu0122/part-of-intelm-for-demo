import React, { Component } from 'react';
import PhoneNumberUtil from '../SharedService/phoneNo';

//Styles
import './companyTooltip.scss';

class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        //openSetting
        this.state = {
            condition: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    handleClick() {
        if (!this.state.condition) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener(
                'click',
                this.handleOutsideClick,
                false,
            );
        }
        this.setState({
            condition: !this.state.condition,
        });
    }
    handleOutsideClick() {
        this.handleClick();
    }

    render() {
        const { company } = this.props;
        return (
            company && (
                <div className="help-text" onClick={() => this.handleClick()}>
                    <label>{company.name}</label>

                    <ul className={this.state.condition ? 'info open' : 'info'}>
                        <li>
                            <label>phone</label>
                            <div>
                                {PhoneNumberUtil.formatPhoneNumber(company.phone)}
                            </div>
                        </li>
                        <li>
                            <label>email</label>
                            <div>{company.email}</div>
                        </li>
                        <li>
                            <label>address</label>
                            <div>{company.address}</div>
                        </li>
                    </ul>
                </div>
            )
        );
    }
}

export default CompanyInfo;
