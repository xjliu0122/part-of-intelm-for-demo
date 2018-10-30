import React, { Component } from 'react';
import _DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
// import isDateEqual from 'react-md/lib/utils/DateUtils/isDateEqual';
import DateFormat from 'components/Form/Date';
import _ from 'lodash';

import './styles.scss';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.injectContainer = this.injectContainer.bind(this);
        this.dateContainer = null;
    }

    handleChange(dateString, dateObject, event) {
        return this.props.validate(event, DateFormat.toUTC(dateObject));
    }

    handleBlur(event) {
        return this.props.validate(event, this.props.value);
    }

    injectContainer(container) {
        if (!container) return;
        this.dateContainer = container;
        let dateFormatString;

        if (_.has(this.props, 'format')) {
            dateFormatString = this.props.format;
        }

        // Intercept methods
        // Prevents infinite recursion on raw date objects and handles text field-only formatting
        function _getFormattedValue(props, state) {
            const value = props.value || state.value;
            if (!value) {
                return '';
            } else {
                return DateFormat.toLocalDate(value, dateFormatString);
            }
        }
        this.dateContainer._getFormattedValue = _getFormattedValue.bind(this.dateContainer);

        // Fix componentWillReceiveProps until public patch is submitted and released
        function componentWillReceiveProps(nextProps) {
            let { value } = nextProps;
            const { defaultValue } = this.props;
            const { minDate, maxDate, initialCalendarDate } = nextProps;
            // const minEqual = isDateEqual(this.props.minDate, minDate);
            // const maxEqual = isDateEqual(this.props.maxDate, maxDate);
            if (this.props.value !== value) {
                let { calendarDate } = this.state;
                if (!!value) {
                    calendarDate = typeof value === 'string' ? new Date(value) : value;
                } else if (defaultValue) {
                    calendarDate = typeof defaultValue === 'string' ? new Date(defaultValue) : defaultValue;
                    value = typeof defaultValue === 'string'
                        ? defaultValue
                        : DateTimeFormat(locales, formatOptions).format(defaultValue);
                } else {
                    calendarDate = new Date();
                }

                calendarDate = this._validateDateRange(calendarDate, minDate, maxDate);

                let calendarTempDate = calendarDate;
                if (typeof initialCalendarDate !== 'undefined' && !value && !defaultValue) {
                    calendarTempDate = typeof initialCalendarDate === 'string'
                        ? new Date(initialCalendarDate)
                        : initialCalendarDate;
                    calendarDate = calendarTempDate;
                } else if (calendarTempDate === null) {
                    calendarTempDate = new Date();
                    calendarDate = new Date();
                }

                if (!isDateEqual(this.state.calendarDate, calendarDate)) {
                    this.setState({ calendarDate, calendarTempDate });
                }
            }
        }
        this.dateContainer.componentWillReceiveProps = componentWillReceiveProps.bind(this.dateContainer);
    }

    render() {
        const {
            // built-in
            label,
            floating,
            onChange,
            name,
            value,
            fullWidth,
            icon,
            rightIcon,
            okPrimary,
            cancelPrimary,
            placeholder,
            error,
            errorText,
            required,
            className,
            minDate,
            maxDate,
            defaultValue,

            // custom
            validate
        } = this.props;

        return (
            <_DatePicker
                id={name}
                name={name}
                value={value}
                defaultValue={defaultValue}
                label={label}
                placeholder={placeholder || 'YYYY-MM-DD'}
                minDate={minDate && new Date(minDate)}
                maxDate={maxDate && new Date(maxDate)}

                className={className}
                floating={floating}
                fullWidth={fullWidth}
                icon={icon}
                rightIcon={rightIcon}
                okPrimary={okPrimary}
                cancelPrimary={cancelPrimary}

                onBlur={this.handleBlur}
                onChange={this.handleChange}

                required={required}
                error={error}
                errorText={errorText}
                ref={this.injectContainer}
            />
        );
    }
}

export default DatePicker;