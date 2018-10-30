import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

// Monkey-patch addSuffix to prevent adding '*' to required fields
const _addSuffix = require('react-md/lib/utils/StringUtils/addSuffix').default;
require('react-md/lib/utils/StringUtils/addSuffix').default = function (str, suffix) {
    if (suffix === '*') return str;
    return _addSuffix(str, suffix);
};

//Components
import DatePicker from './datepicker';
import ValidateField from './validate';
import TimePicker from './timepicker';
import LocalCurrency from './localCurrency';
import Autocomplete from './autocomplete';
//Styles
import './field.scss';

class Field extends Component {
    constructor(props) {
        super(props);

        this.state = {
            invalid: false,
            fieldValue: props.value || '',
            errorMessage: props.errorText || '',
            apiError: false,
        }

        this.validate = this.validate.bind(this);
        this._validate = _.throttle(this._validate.bind(this), 50);
        this.emptyAutocomplete = this.emptyAutocomplete.bind(this);
    }

    emptyAutocomplete(nextProps) {
        const { type, value, completionType } = (nextProps || this.props);
        return type === 'autocomplete' &&
            completionType === 'chip' &&
            !value.length;
    }

    componentWillMount() {
        if (this.props.type === 'email') {
            this.setErrorMessage('Invalid email address')
        }

        if (this.props.type === 'number') {
            this.setErrorMessage('Please enter only numbers')
        }

        if (this.props.required) {
            const { name, required, type, value, validateOnly } = this.props;

            if (!value || this.emptyAutocomplete()) {
                this.updateFormValues(value, name, true , required, true)
            } else {
                if (required) {
                    if (validateOnly) {
                        this.validate({ type: validateOnly}, value)
                    } else {
                        this.validate({ type: 'change'}, value)
                    }
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.value, this.props.value)) {
            this.setState({
                fieldValue: nextProps.value,
            });
            if (nextProps.validateOnly) {
                this.validate({ type: nextProps.validateOnly }, nextProps.value);
            } else {
                this.validate({ type: 'change' }, nextProps.value);
            }
        }
        if (!_.isEqual(nextProps.formSubmit, this.props.formSubmit)) {
            if (nextProps.required && (!nextProps.value || this.emptyAutocomplete(nextProps))) {
                if (nextProps.validateOnly) {
                    this.validate({ type: nextProps.validateOnly }, '');
                } else {
                    this.validate({ type: 'change' }, '');
                }
            }
        }

        if (_.has(nextProps, 'error.name')) {
            if (this.state.apiError && (!_.isEqual(nextProps.value, this.props.value))) {
                if (_.has(this.props, 'clearAPIError') && this.props.required) {
                    this.props.clearAPIError();
                    this.setState({
                        apiError: false,
                    });
                }
            }

            const name = nextProps.error.name;
            if (_.has(nextProps, [name])) {
                if (_.has(nextProps, 'error.message')) {
                    this.setErrorMessage(nextProps.error.message);
                }
                this.setInvalid(true);
                this.setState({
                    apiError: true,
                });
            }
        } else {
            if (this.props.required && (this.state.errorMessage !== this.props.errorText) && this.state.apiError) {
                this.setErrorMessage(this.props.errorText);
            }
        }
    }

    setInvalid(value) {
        this.setState({
            invalid: value,
        });
    }

    setFieldValue(fieldValue) {
        this.setState({
            fieldValue,
        });
    }

    setErrorMessage(value) {
        this.setState({
            errorMessage: value,
        });
    }

    _validate(event, inputValue) {
        const { name, validateOnly, required, type } = this.props;
        let invalid;

        if (validateOnly) {
            if (validateOnly === event.type) {
                if (required) {
                    invalid = ValidateField(inputValue, type, required);
                    this.setInvalid(invalid);
                }

                this.updateFormValues(inputValue, name, invalid, required);
            }
        } else {
            if (required) {
                invalid = ValidateField(inputValue, type, required);
                this.setInvalid(invalid);
            }

            this.updateFormValues(inputValue, name, invalid, required);
        }
    }

    validate(event, inputValue) {
        this.setFieldValue(inputValue);
        this._validate(event, inputValue);
    }

    updateFormValues(formValue, name, invalid, required, init) {
        const value = _.isString(formValue) ? _.trim(formValue) : formValue;

        if (this.props.type === 'number') {
            if (!value && this.props.errorText) {
                this.setErrorMessage(this.props.errorText);
            } else {
                this.setErrorMessage('Please enter only numbers');
            }
        }

        if (!this.props.displayOnly) {
            this.props.updateForm({
                value,
                name,
                invalid,
                required,
                init,
            });
        }
    }

    render() {
        const { type, optional, required } = this.props;
        const { validate } = this;
        const { invalid, fieldValue, errorMessage } = this.state;
        let { label, placeholder } = this.props;

        if (optional) {
            if (label) {
                label = <span>{label}&nbsp;<span className="optional">- Optional</span></span>;
            }
            if (!label && placeholder) {
                placeholder += ' - Optional';
            }
        }

        return (
            <div className="field">
                { !type &&
                    <TextInput
                        {...this.props}
                        value={fieldValue}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'email' &&
                    <TextInput
                        {...this.props}
                        value={fieldValue}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'number' &&
                    <TextInput
                        {...this.props}
                        value={fieldValue}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'select' &&
                    <SelectInput
                        {...this.props}
                        value={fieldValue}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'autocomplete' &&
                    <Autocomplete
                        {...this.props}
                        value={fieldValue}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'checkbox' &&
                    <Checkbox
                        {...this.props}
                        value={fieldValue}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'switch' &&
                    <Switch
                        {...this.props}
                        value={fieldValue || false}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'radioGroup' &&
                    <RadioGroup
                        {...this.props}
                        value={fieldValue || false}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}
                    />
                }

                { type === 'date' &&
                    <DatePicker
                        {...this.props}
                        value={fieldValue || null}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                        label={label}
                        placeholder={placeholder}

                    />
                }
                { type === 'time' &&
                    <TimePicker
                        {...this.props}
                        value={fieldValue || null}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                    />
                }
                { type === 'currency' &&
                    <LocalCurrency
                        {...this.props}
                        value={fieldValue}
                        error={invalid}
                        errorText={errorMessage}
                        validate={validate}
                    />
                }
            </div>
        );
    }
}

export default Field;
