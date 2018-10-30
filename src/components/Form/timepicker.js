import React, { Component } from 'react';
import _TimePicker from 'react-md/lib/Pickers/TimePickerContainer';
import TimeFormat from 'react-md/lib/utils/DateUtils/formatTime';

class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange(timeString, timeObject, event) {
        return this.props.validate(event, timeObject);
    }
    handleBlur(event) {
        return this.props.validate(event, this.props.value);
    }
    render() {
        const {
            // built-in
            label,
            icon,            
            floating,
            fullWidth,
            displayMode,
            onChange,
            name,
            value,
            rightIcon,
            okPrimary,
            cancelPrimary,
            placeholder,
            error,
            errorText,
            required,
            className,
            defaultValue,

            // custom
            validate
        } = this.props;

        return (
            <_TimePicker
                id={name}
                name={name}
                value={value}
                defaultValue={defaultValue}
                label={label}
                placeholder={placeholder || 'HH:MM'}
                className={className}
                floating={floating}
                fullWidth={fullWidth}
                icon={icon}
                rightIcon={rightIcon}
                okPrimary={okPrimary}
                cancelPrimary={cancelPrimary}
                // onBlur={this.handleBlur}
                onChange={this.handleChange}
                required={required}
                error={error}
                errorText={errorText}                
            />
        );
    }
}

export default TimePicker;