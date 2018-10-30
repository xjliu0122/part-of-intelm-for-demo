import {
    withGoogleMap,
    GoogleMap,
    DirectionsRenderer,
} from 'react-google-maps';
import React, { Component } from 'react';

import _ from 'lodash';

const {
    MarkerWithLabel,
} = require('react-google-maps/lib/components/addons/MarkerWithLabel');

const getObjectFromStop = stop => {
    if (!stop) return null;
    return {
        lat: _.get(stop, 'stopLocation.geoLocation.coordinates.coordinates[0]'),
        lng: _.get(stop, 'stopLocation.geoLocation.coordinates.coordinates[1]'),
        name: _.get(stop, 'stopLocation.name'),
    };
};

class TripMap extends Component {
    componentWillMount = () => {
        this.setState({
            ...this.getRoutesFromTripAndLastStop(
                this.props.trip,
                this.props.lastStop,
            ),
        });
        this.fitMapBound = this.fitMapBound.bind(this);
        this.getRoutesFromTripAndLastStop = this.getRoutesFromTripAndLastStop.bind(this);
    };

    componentWillReceiveProps = nextProps => {
        if (
            !_.isEqual(nextProps.trip, this.props.trip) ||
            !_.isEqual(nextProps.lastStop, this.props.lastStop)
        ) {
            this.setState({
                ...this.getRoutesFromTripAndLastStop(
                    nextProps.trip,
                    nextProps.lastStop,
                ),
            });
        }
    };

    fitMapBound() {
        this.map && this.map.fitBounds(this.state.bounds);
    }
    getRoutesFromTripAndLastStop = (trip, lastStop = null) => {
        const bounds = new google.maps.LatLngBounds();

        const DirectionsService = new google.maps.DirectionsService();
        const stops = _.concat(
            lastStop ? [getObjectFromStop(lastStop)] : [],
            _.map(trip.stop, s => getObjectFromStop(s)),
        );
        const size = stops.length,
            wayPoints = [],
            routes = [];

        for (let i = 1; i < size - 1; i++) {
            wayPoints.push({
                location: new google.maps.LatLng(stops[i].lat, stops[i].lng),
            });
        }

        DirectionsService.route(
            {
                origin: new google.maps.LatLng(stops[0].lat, stops[0].lng),
                destination: new google.maps.LatLng(
                    stops[size - 1].lat,
                    stops[size - 1].lng,
                ),
                waypoints: wayPoints,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({ routes: result });
                }
            },
        );

        // calc bounds.
        _.map(stops, stop => {
            bounds.extend(new google.maps.LatLng(stop.lat, stop.lng));
        });

        return {
            bounds,
            stops,
        };
    };

    render() {
        const { stops, routes } = this.state,
            { fitMapBound } = this;
        return (
            <GoogleMap
                defaultZoom={8}
                onIdle={fitMapBound}
                ref={node => {
                    this.map = node;
                }}
            >
                {stops &&
                    stops.map(mark => (
                        <MarkerWithLabel
                            position={{ lat: mark.lat, lng: mark.lng }}
                            labelAnchor={new google.maps.Point(0, 0)}
                            labelStyle={{
                                backgroundColor: 'white',
                                fontSize: '13px',
                                padding: '5px',
                            }}
                        >
                            <div>{mark.name}</div>
                        </MarkerWithLabel>
                    ))}
                {routes && <DirectionsRenderer directions={routes} />}
            </GoogleMap>
        );
    }
}

export default withGoogleMap(TripMap);
