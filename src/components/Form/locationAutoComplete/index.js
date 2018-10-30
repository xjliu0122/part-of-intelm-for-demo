import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Autocomplete from './autoSuggestWrapper';
import EditLocation from 'components/ManagedLocations/edit';

class LocationAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        let datasource = _.uniqBy(
            _.concat(props.clientLocations, props.locations),
            'id',
        );

        if (props.port) {
            datasource = _.filter(datasource, loc => loc.type === 'OCEANPORT');
        }
        this.state = {
            initialText: props.initialText || '',
            dataSource: [...datasource],
        };
        if (!props.port) {
            this.state.dataSource.push({ id: -1, name: 'Add new location' });
        }
        this.handleSelected = this.handleSelected.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    componentWillReceiveProps = nextProps => {
        let datasource = _.uniqBy(
            _.concat(nextProps.clientLocations, nextProps.locations),
            'id',
        );
        if (nextProps.port) {
            datasource = _.filter(datasource, loc => loc.type === 'OCEANPORT');
        }
        if (!nextProps.port) {
            datasource.push({ id: -1, name: 'Add new location' });
        }
        this.setState({
            dataSource: datasource,
        });
    };
    handleSelected(value) {
        if (value.id === -1) {
            this.setState({
                isEditDialogOpen: true,
            });
        } else {
            this.props.handleSelected(value);
        }
    }
    onClose() {
        this.setState({
            isEditDialogOpen: false,
        });
    }
    onChange(value) {
        this.props.onChange(value);
    }
    render() {
        const { initialText, dataSource, isEditDialogOpen } = this.state,
            {
                label,
                placeholder,
                handleSearchTextChange,
                searchText,
                error,
            } = this.props,
            { handleSelected, onClose } = this;
        return (
            <div className="locationAutoCompleteEditDialog">
                <Autocomplete
                    initialText={initialText}
                    searchText={searchText}
                    handleSearchTextChange={handleSearchTextChange}
                    dataSource={dataSource}
                    dataLabel="name"
                    error={error}
                    handleSelected={handleSelected}
                    label={label}
                    placeholder={placeholder}
                />
                <EditLocation
                    isEditDialogOpen={isEditDialogOpen}
                    onClose={onClose}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        locations: state.managedLocationsReducer.managedLocations,
        clientLocations: state.managedLocationsReducer.clientLocations,
    };
};
export default connect(mapStateToProps, null)(LocationAutocomplete);
