/* global google*/

import React from 'react';
import { Autocomplete } from 'react-md';
import PropTypes from 'prop-types';
import _ from 'lodash';

class GooglePlaceAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.autocompleteService = new google.maps.places.AutocompleteService();
        this.geoCoderService = new google.maps.Geocoder();
        this.state = {
            dataSource: [],
            data: [],
            searchText: props.initialText || '',
            selected: false,
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onAutocomplete = this.onAutocomplete.bind(this);
    }
    componentWillReceiveProps = nextProps => {
        if (
            !this.state.searchText &&
            !this.state.selected &&
            nextProps.initialText
        ) {
            this.setState({
                searchText: nextProps.initialText,
            });
        }
    };

    onUpdateInput(searchText) {
        if (!searchText.length || !this.autocompleteService) {
            return false;
        }

        const request = {
            input: searchText,
            // location: new google.maps.LatLng(
            //     this.props.location.lat,
            //     this.props.location.lng,
            // ),
            // radius: this.props.radius,
            types: ['address'],
            //bounds: this.getBounds(),
        };

        if (this.props.restrictions) {
            request.componentRestrictions = { country: 'us' };
        }

        this.autocompleteService.getPlacePredictions(request, data =>
            this.updateDatasource(data));
    }

    onAutocomplete(suggestion, suggestionIndex, matches) {
        // The index in dataSource of the list item selected, or -1 if enter is pressed in the TextField
        if (suggestionIndex === -1) {
            return false;
        }
        const selectedPlace = this.state.data[suggestionIndex];
        this.geoCoderService.geocode(
            { placeId: selectedPlace.place_id },
            detailData => {
                this.setState({
                    searchText: detailData[0].description,
                    selected: true,
                });
                this.props.onAutocomplete(
                    this.parseAddressData(detailData[0]),
                    detailData[0].description,
                    suggestionIndex,
                );
            },
        );
    }

    onInputChange(searchText, event) {
        if (this.state.searchText !== searchText) {
            this.onUpdateInput(searchText);
            this.setState({ searchText });
        }
        this.props.onAutocomplete(null);
    }

    getBounds() {
        if (
            !this.props.bounds ||
            (!this.props.bounds.ne && !this.props.bounds.south)
        ) {
            return undefined;
        }

        if (this.props.bounds.ne && this.props.bounds.sw) {
            return new google.maps.LatLngBounds(
                this.props.bounds.sw,
                this.props.bounds.ne,
            );
        }

        return {
            ...this.props.bounds,
        };
    }
    parseAddressData(data) {
        const parsedData = {};
        _.each(data.address_components, comp => {
            if (_.includes(comp.types, 'locality')) {
                parsedData.city = comp.short_name;
            }
            if (_.includes(comp.types, 'administrative_area_level_1')) {
                parsedData.state = comp.short_name;
            }
            if (_.includes(comp.types, 'postal_code')) {
                parsedData.zipCode = comp.short_name;
            }
        });
        parsedData.lat = data.geometry.location.lat();
        parsedData.lng = data.geometry.location.lng();
        parsedData.address = data.formatted_address;
        return parsedData;
    }
    updateDatasource(data) {
        if (!data || !data.length) {
            return false;
        }

        if (this.state.data) {
            this.previousData = { ...this.state.data };
        }
        this.setState({
            dataSource: data.map(place => place.description),
            data,
        });
    }

    render() {
        const { label } = this.props,
            { onInputChange, onAutocomplete } = this,
            { searchText } = this.state;
        return (
            <Autocomplete
                menuId="AutocompleteMenuId"
                id="AutocompleteId"
                required
                label={label}
                filter={null}
                onChange={onInputChange}
                value={searchText}
                data={this.state.dataSource}
                onAutocomplete={onAutocomplete}
            />
        );
    }
}

// Example

/* <AutocompletePlace
    label="Address"
    required
    errorText="Please search and select an address"
    onAutocomplete={(geoData, searchText, index) => {
        this.handleAddressChange(geoData, 'address');
    }}
/>; */

GooglePlaceAutocomplete.defaultProps = {
    location: { lat: 0, lng: 0 },
    radius: 0,
    filter: null,
};

export default GooglePlaceAutocomplete;
