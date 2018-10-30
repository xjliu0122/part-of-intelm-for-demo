import React, { PropTypes, Component } from 'react';

import Autocomplete from 'react-md/lib/Autocompletes';
import Chip from 'react-md/lib/Chips';
import Avatar from 'react-md/lib/Avatars';
import _ from 'lodash';

import './autocomplete.scss';

const mock = [
    {
        Id: 'testing',
        Label: 'testing for label',
        value: 'da',
    },
    {
        Id: 'bleach',
        Label: 'bleach for label',
        value: 'dada',
    },
];

function _mapPropsToState(props) {
    // Has selectValue prop and value/options are arrays, map value to options
    // Otherwise, use the raw options and value
    const hasOptionsArray =
        props.selectValue &&
        _.isArray(props.options) &&
        props.options.length > 0;
    const optionsMap =
        hasOptionsArray && _.keyBy(props.options, props.selectValue);

    const hasValueArray = props.selectValue && _.isArray(props.value);
    const value =
        hasValueArray && optionsMap
            ? props.value.map(value => optionsMap[value])
            : props.value;

    const source =
        _.sortBy(
            props.selectValue && hasValueArray && value.length > 0
                ? _.differenceBy(props.options, value, props.selectValue)
                : props.options,
            props.selectLabel,
        ) || [];

    //Remove any undefined values
    const newValue = _.filter(value, item => !_.isUndefined(item));

    return {
        selected: _.sortBy(newValue, props.selectLabel) || [],
        source,
    };
}

class AutocompleteField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ..._mapPropsToState(props),
            filterType: Autocomplete.caseInsensitiveFilter,
            text: '',
            _error: false,
            autocompleteOpen: false,
        };

        this.field = null;
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        //this.injectField = this.injectField.bind(this);
        this.setAutocompleteOpen = this.setAutocompleteOpen.bind(this);
    }

    componentWillMount() {
        if (
            this.state.selected.length &&
            this.props.completionType === 'chip'
        ) {
            this.initSourceItemsWithDefaultSelected();
        }
    }

    componentWillReceiveProps(nextProps) {
        const newProps = {
            ...nextProps,
            value: nextProps.value || [],
            options: nextProps.options || [],
        };
        const options = this.props.options || [];
        const value = this.props.value || [];

        // Handle reset or late-load, but not both
        const valueChange = !!newProps.value.length ^ !!value.length;
        const optionsChange = newProps.options.length !== options.length;
        // Also handle option filtering
        if (valueChange || optionsChange) {
            this.setState(_mapPropsToState({
                ...newProps,
                selectLabel: this.props.selectLabel,
            }));
        }
    }

    initSourceItemsWithDefaultSelected() {
        let that = this,
            newSource = this.state.source;

        _.each(this.state.selected, (selectedItem, index) => {
            newSource = _.filter(newSource, sourceItem => {
                return (
                    selectedItem[that.props.selectLabel] !==
                    sourceItem[that.props.selectLabel]
                );
            });
        });

        this.setState({
            source: newSource,
        });
    }
    addSelectedItem(label, matchIndex, matches) {
        const { selectLabel, selectValue } = this.props;

        // Use the original label-based functionality if selectValue is not set and value is a
        if (!selectValue) {
            // Add the item to the chips
            const newItems = [...this.state.selected, matches[matchIndex]];
            // Remove the item from the pool of options
            const newSource = _.filter(
                this.state.source,
                item => item[selectLabel] !== label,
            );

            const uniqueItems = _.uniqBy(
                newItems,
                item => item[this.props.selectLabel],
            );
            this.setState({
                selected: uniqueItems,
                source: newSource,
            });

            this.props.validate('add', uniqueItems);
        } else {
            this.setState(state => {
                const added = _.find(state.source, [
                    selectValue,
                    matches[matchIndex][selectValue],
                ]);
                // Prevent double firing
                if (!added) return;

                // Add the item to the chips
                const selected = _.sortBy(
                    [...state.selected, added],
                    selectLabel,
                );

                // Remove the item from the pool of options
                const source = _.without(state.source, added);

                this.props.validate(
                    'add',
                    _.map(selected, item => item[selectValue]),
                );

                return {
                    selected,
                    source,
                };
            });
        }

        // Manually clear on autocomplete
        this.setState({ text: '' });
    }

    removeSelectedItem(item) {
        // Prevent list pop-in on blur, will hopefully be fixed in react-md 1.1 release
        if (this.field) {
            this.field.setState({
                isOpen: false,
                focus: false,
                manualFocus: true,
            });
        }

        const { selectLabel, selectValue } = this.props;

        if (!selectValue) {
            // WARNING: This mutates state directly
            let removed = _.remove(this.state.selected, { Id: item.Id }),
                newSource;

            if (removed.length) {
                newSource = [...this.state.source, removed[0]];
                newSource = _.sortBy(newSource, selectLabel);
            }

            if (newSource) {
                this.setState({
                    source: newSource,
                });
            }

            this.props.validate('remove', this.state.selected);
        } else {
            this.setState(state => {
                const removed = _.find(state.selected, [
                    selectValue,
                    item[selectValue],
                ]);
                const selected = _.without(state.selected, removed);
                const source = _.sortBy(
                    [...state.source, removed],
                    selectLabel,
                );

                this.props.validate(
                    'remove',
                    _.map(selected, item => item[selectValue]),
                );

                return {
                    selected,
                    source,
                };
            });
        }
    }

    handleChange(text) {
        this.setState({ text });
    }

    handleBlur() {
        // Chip autocomplete needs some extra help for checking the required fiedl
        if (this.field && this.props.required) {
            this.setState({ _error: !this.state.selected.length });
        }
    }
    setAutocompleteOpen() {
        this.setState({
            autocompleteOpen: true,
        });
    }

    render() {
        const {
                name,
                label, //
                defaultValue,
                value,
                required,
                error,
                errorText,
                options,
                selectLabel,
                selectValue,
                className,
                validate,
                completionType,
                placeholder,
                alwaysShowOptions,
                inlineIndicator,
                hasAddIcon,
                avatar,
            } = this.props,
            that = this,
            {
                selected,
                source,
                text,
                filterType,
                autocompleteOpen,
            } = this.state,
            data = alwaysShowOptions
                ? filterType(source, text, selectLabel)
                : source;

        return (
            <div className={`autocomplete ${className || ''}`}>
                {completionType === 'TopChip' &&
                    value && (
                    <div>
                        <div>
                            <div className="selected">
                                {avatar &&
                                        _.map(selected, (item, index) => {
                                            const icon = avatar(item);
                                            return (
                                                <Chip
                                                    key={index}
                                                    label={item[selectLabel]}
                                                    avatar={icon}
                                                    removable
                                                    className="enabled"
                                                    onClick={() =>
                                                        this.removeSelectedItem(item)
                                                    }
                                                >
                                                    remove_circle
                                                </Chip>
                                            );
                                        })}
                                {!avatar &&
                                        _.map(selected, (item, index) => (
                                            <Chip
                                                key={index}
                                                label={item[selectLabel]}
                                                removable
                                                className="enabled"
                                                onClick={() =>
                                                    this.removeSelectedItem(item)
                                                }
                                            >
                                                remove_circle
                                            </Chip>
                                        ))}
                                {!autocompleteOpen &&
                                        hasAddIcon && (
                                    <div
                                        className="add-item"
                                        onClick={
                                            this.setAutocompleteOpen
                                        }
                                    >
                                        <i className="material-icons icon-add-item">
                                                    add
                                        </i>
                                        <label className="sentence">
                                            {hasAddIcon}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                        {(autocompleteOpen || !hasAddIcon) && (
                            <Autocomplete
                                id="topChipForselectedItems"
                                label={label}
                                error={error || this.state._error}
                                errorText={errorText}
                                data={data}
                                dataLabel={selectLabel}
                                dataValue={selectValue}
                                placeholder={placeholder}
                                filter={
                                    alwaysShowOptions ? null : filterType
                                }
                                onAutocomplete={(item, index, list) =>
                                    this.addSelectedItem(item, index, list)
                                }
                                value={text}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                                onFocus={this.handleFocus}
                                deleteKeys={[selectLabel, selectValue]}
                                ref={this.injectField}
                                inlineIndicator={inlineIndicator}
                                listClassName={
                                    alwaysShowOptions &&
                                        data &&
                                        data.length > 0
                                        ? 'results'
                                        : 'no-results'
                                }
                            />
                        )}
                    </div>
                )}
                {!completionType && (
                    <Autocomplete
                        id={name}
                        label={label}
                        required={required}
                        error={error}
                        defaultValue={defaultValue}
                        value={value}
                        errorText={errorText}
                        onBlur={event => validate(event, value)}
                        onChange={(newValue, index, event) =>
                            validate(event, newValue)
                        }
                        data={options}
                        filter={alwaysShowOptions ? null : filterType}
                        dataLabel={selectLabel}
                        className="md-cell md-full-width"
                        placeholder={placeholder}
                        inlineIndicator={inlineIndicator}
                    />
                )}

                {completionType === 'chip' && (
                    <div>
                        <Autocomplete
                            id={name}
                            label={label}
                            error={error || this.state._error}
                            errorText={errorText}
                            data={data}
                            dataLabel={selectLabel}
                            dataValue={selectValue}
                            placeholder={placeholder}
                            filter={filterType}
                            onAutocomplete={(item, index, list) =>
                                this.addSelectedItem(item, index, list)
                            }
                            value={text}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            onFocus={this.handleFocus}
                            deleteKeys={[selectLabel, selectValue]}
                            ref={this.injectField}
                            inlineIndicator={inlineIndicator}
                            listClassName={
                                alwaysShowOptions && data && data.length > 0
                                    ? 'results'
                                    : 'no-results'
                            }
                            // inlineIndicator={<i className='material-icons'>search</i>}
                        />
                        <div className="selected">
                            {avatar &&
                                _.map(selected, (item, index) => {
                                    const icon = avatar(item);
                                    return (
                                        <Chip
                                            key={index}
                                            label={item[selectLabel]}
                                            avatar={icon}
                                            removable
                                            className="enabled"
                                            onClick={() =>
                                                this.removeSelectedItem(item)
                                            }
                                        >
                                            remove_circle
                                        </Chip>
                                    );
                                })}
                            {!avatar &&
                                _.map(selected, (item, index) => (
                                    <Chip
                                        key={index}
                                        label={item[selectLabel]}
                                        removable
                                        className="enabled"
                                        onClick={() =>
                                            this.removeSelectedItem(item)
                                        }
                                    >
                                        remove_circle
                                    </Chip>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default AutocompleteField;
