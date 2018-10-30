import React from 'react';
import _ from 'lodash';
import Autocomplete from './autoSuggestWrapper';

class PayeeAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = _.get(props, 'dataSource');
        this.state = {
            initialText: props.initialText || '',
            dataSource: [...dataSource],
        };
        this.handleSelected = this.handleSelected.bind(this);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    }
    componentWillReceiveProps = nextProps => {
        const dataSource = _.get(nextProps, 'dataSource');
        this.setState({
            dataSource,
        });
    };
    handleSelected(value) {
        this.props.handleSelected(value);
    }
    handleSearchTextChange(searchText) {
        this.props.handleSearchTextChange(searchText);
    }
    render() {
        const { initialText, dataSource } = this.state,
            {
                label, placeholder, error, searchText, errorText,
            } = this.props,
            { handleSelected, handleSearchTextChange } = this;
        return (
            <Autocomplete
                initialText={initialText}
                searchText={searchText}
                handleSearchTextChange={handleSearchTextChange}
                dataSource={dataSource}
                dataLabel="name"
                error={error}
                errorText={errorText}
                handleSelected={handleSelected}
                label={label}
                placeholder={placeholder}
            />
        );
    }
}

export default PayeeAutoComplete;
