import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import TripMap from './tripMap';

class TripMapWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: '',
            distance: '',
        };
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    handleClickOutside() {
        this.props.closeWindow();
    }
    render() {
        const { duration, distance } = this.state,
            { topOffset } = this.props;
        return (
            <div style={{ top: topOffset }} className="trip-map-container">
                <div className="header-section">
                    <h2>{duration}</h2>
                    <h2>{distance}</h2>
                </div>
                <TripMap
                    {...this.props}
                    containerElement={<div className="trip-map-section" />}
                    mapElement={
                        <div style={{ weight: '100%', height: '100%' }} />
                    }
                />
            </div>
        );
    }
}

export default enhanceWithClickOutside(TripMapWrapper);
