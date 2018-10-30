import React, { Component } from 'react';
import PhoneNumberUtil from '../SharedService/phoneNo';

//Styles
import './locationTooltip.scss';

class LocationInfo extends Component {
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
        const { location } = this.props;
        return (
            location && (
                <div className="help-text" onClick={() => this.handleClick()}>
                    <label>{location.name}</label>

                    <ul className={this.state.condition ? 'info open' : 'info'}>
                        <li>
                            <label>contact</label>
                            <div>{location.contactName}</div>
                        </li>
                        <li>
                            <label>phone</label>
                            <div>
                                {PhoneNumberUtil.formatPhoneNumber(location.contactPhone)}
                            </div>
                        </li>
                        <li>
                            <label>email</label>
                            <div>{location.contactEmail}</div>
                        </li>
                        <li>
                            <label>address</label>
                            <div>{location.geoLocation.address}</div>
                        </li>
                    </ul>
                </div>
            )
        );
    }
}

export default LocationInfo;
