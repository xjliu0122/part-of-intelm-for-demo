import React from 'react';
import _ from 'lodash';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { TextField } from 'react-md';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import './styles.scss';

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div className="locationSuggestionName">
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)}>{part.text}</span>
                    ) : (
                        <strong key={String(index)}>{part.text}</strong>
                    );
                })}
            </div>
            <div className="locationSuggestionAddress">
                {suggestion.address && suggestion.address.address}
            </div>
        </MenuItem>
    );
}

function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
        //height: 250,
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 10,
        overflow: 'auto',
        //marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
        maxHeight: '300px',
        marginTop: '0px',
    },
    suggestion: {},
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
});

class _AutosuggestSingle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: props.initialText || props.searchText || '',
            suggestions: props.dataSource || [],
        };
        this.getSuggestions = this.getSuggestions.bind(this);
        this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
        this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this);
        this.renderInput = this.renderInput.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (
            !_.isNil(nextProps.searchText) &&
            this.state.searchText !== nextProps.searchText
        ) {
            this.setState({ searchText: nextProps.searchText });
        }
    }
    renderInput(inputProps) {
        return <TextField fullWidth {...inputProps} error={this.props.error} />;
    }
    getSuggestions(searchText) {
        const { dataLabel, dataSource } = this.props;
        const inputValue = _.trim(searchText)
            .toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0
            ? dataSource
            : dataSource.filter(suggestion => {
                return (
                    suggestion.id === -1 ||
                      suggestion[dataLabel]
                          .toLowerCase()
                          .indexOf(inputValue) !== -1
                );
            });
    }
    getSuggestionValue(suggestion) {
        if (suggestion.id !== -1) {
            return suggestion[this.props.dataLabel];
        }
        return '';
    }
    handleSuggestionsFetchRequested = obj => {
        this.setState({
            suggestions: this.getSuggestions(obj.value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: this.props.dataSource || [],
        });
    };
    handleSuggestionSelected = (event, { suggestion }) => {
        this.props.handleSelected(suggestion);
    };
    handleChange = (event, { newValue }) => {
        this.setState({
            searchText: newValue,
        });
        if (this.props.handleSearchTextChange) {
            this.props.handleSearchTextChange(newValue);
        }
    };

    render() {
        const { classes } = this.props,
            { renderInput } = this;

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={
                    this.handleSuggestionsFetchRequested
                }
                onSuggestionsClearRequested={
                    this.handleSuggestionsClearRequested
                }
                shouldRenderSuggestions={() => true}
                onSuggestionSelected={this.handleSuggestionSelected}
                renderSuggestionsContainer={renderSuggestionsContainer}
                renderSuggestion={renderSuggestion}
                getSuggestionValue={this.getSuggestionValue}
                inputProps={{
                    classes,
                    placeholder: this.props.placeholder,
                    value: this.props.searchText || this.state.searchText,
                    onChange: this.handleChange,
                    label: this.props.label,
                }}
            />
        );
    }
}

export default withStyles(styles)(_AutosuggestSingle);
