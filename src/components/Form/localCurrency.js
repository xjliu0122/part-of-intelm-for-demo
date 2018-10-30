import React, { PropTypes, Component } from 'react';
import TextField from 'react-md/lib/TextFields';

class LocalCurrency extends Component {
    static escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    static removeLeadingZero(numStr) {
    //remove leading zeros
        return numStr.replace(/^0+/,'') || '0';
    }
    static limitToPrecision(numStr, precision) {
        let str = '';
        for (let i = 0; i <= precision - 1; i++) {
            str += numStr[i] || '0';
        }
        return str;
    }
    static removePrefixAndSuffix(va, props) {
        let val = va,
            suffixLastIndex;
        const {
            format,
            prefix,
            suffix,
        } = props;


        //remove prefix and suffix
        if (!format && val) {
            const isNegative = val[0] === '-';

            //remove negation sign
            if (isNegative) {
                val = val.substring(1, val.length);
            }
            //remove prefix
            val = prefix && val.indexOf(prefix) === 0
                ? val.substring(prefix.length, val.length)
                : val;

            //remove suffix
            suffixLastIndex = val.lastIndexOf(suffix);
            val = suffix && suffixLastIndex !== -1 && suffixLastIndex === val.length - suffix.length
                ? val.substring(0, suffixLastIndex)
                : val;

            //add negation sign back
            if (isNegative) {
                val = '-' + val;
            }
        }

        return val;
    }    
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.injectField = this.injectField.bind(this);
        this.formatInput = this.formatInput.bind(this);
        this.formatWithPattern = this.formatWithPattern.bind(this);
        this.getFloatString = this.getFloatString.bind(this);
        this.getFloatValue = this.getFloatValue.bind(this);
        this.getSeparators = this.getSeparators.bind(this);
        this.getNumberRegex = this.getNumberRegex.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.focused, this.props.focused) && this._field.focus) {
            let component = this;

            setTimeout(function() {
                component._field.focus();
            }, 100);
        }
    }
    getFloatString(num, props) {
        props = props || this.props;
        const {decimalSeparator, thousandSeparator} = this.getSeparators(props);
        return (num || '').replace(new RegExp(LocalCurrency.escapeRegExp(thousandSeparator || ''), 'g'), '').replace(decimalSeparator, '.');
    }

    getFloatValue(num, props) {
        props = props || this.props;
        return parseFloat(this.getFloatString(num, props)) || 0;
    }
    getSeparators(prps) {
        const props = prps || this.props;
        let { thousandSeparator, decimalSeparator } = props;
        if (!thousandSeparator || !decimalSeparator) {
            thousandSeparator = ',';
            decimalSeparator = '.';
        }
        // dev time exception. 
        if (decimalSeparator === thousandSeparator) {
            throw new Error(`
                Decimal separator can\'t be same as thousand separator.\n
                thousandSeparator: ${thousandSeparator} (thousandSeparator = {true} is same as thousandSeparator = ",")
                decimalSeparator: ${decimalSeparator} (default value for decimalSeparator is .)
            `);
        }

        return { decimalSeparator, thousandSeparator };
    }

    getNumberRegex(g, ignoreDecimalSeparator) {
        const { format, decimalPrecision } = this.props,
            { decimalSeparator } = this.getSeparators();
        return new RegExp('\\d' + (decimalSeparator && decimalPrecision !== 0 && !ignoreDecimalSeparator && !format
            ? '|' + LocalCurrency.escapeRegExp(decimalSeparator)
            : ''), g
            ? 'g'
            : undefined);
    }
    formatWithPattern(str) {
        const {format, mask} = this.props;
        if (!format) {
            return str;
        }  
        const hashCount = format
            .split('#')
            .length - 1;
        let hashIdx = 0,
            frmtdStr = format;

        for (let i = 0, ln = str.length; i < ln; i++) {
            if (i < hashCount) {
                hashIdx = frmtdStr.indexOf('#');
                frmtdStr = frmtdStr.replace('#', str[i]);
            }
        }

        const lastIdx = frmtdStr.lastIndexOf('#');

        if (mask) {
            return frmtdStr.replace(/#/g, mask);
        }
        return frmtdStr.substring(0, hashIdx + 1) + (lastIdx !== -1
            ? frmtdStr.substring(lastIdx + 1, frmtdStr.length)
            : '');
    }
    formatInput(va) {
        let val = va,
            hasNegative,
            formattedValue,
            removeNegative,
            num = null,
            valMatch = null;
        const { props } = this,
            {
                prefix,
                suffix,
                mask,
                format,
                allowNegative,
                decimalPrecision,
            } = props,
            negativeRegex = new RegExp('(-)'),
            doubleNegativeRegex = new RegExp('(-)(.)*(-)'),
            numRegex = this.getNumberRegex(true),
            { thousandSeparator, decimalSeparator } = this.getSeparators(),
            maskPattern = format && typeof format === 'string' && !!mask;


        //change val to string if its number
        if (typeof val === 'number') {
            val += '';
        }

        //check if it has negative numbers
        if (allowNegative && !format) {
            // Check number has '-' value
            hasNegative = negativeRegex.test(val);
            // Check number has 2 or more '-' values
            removeNegative = doubleNegativeRegex.test(val);
        }
        //remove prefix and suffix
        val = LocalCurrency.removePrefixAndSuffix(val, props);
        valMatch = val && val.match(numRegex);
        if (!valMatch && removeNegative) {
            return {
                value: '',
                formattedValue: '',
            };
        } else if (!valMatch && hasNegative) {
            return {
                value: '',
                formattedValue: '-',
            };
        } else if (!valMatch) {
            return {
                value: '',
                formattedValue: (maskPattern
                    ? ''
                    : ''),
            };
        }

        num = val
            .match(numRegex)
            .join('');

        formattedValue = num;

        if (format) {
            if (typeof format === 'string') {
                formattedValue = this.formatWithPattern(formattedValue);
            } else if (typeof format === 'function') {
                formattedValue = format(formattedValue);
            }
        } else {
            const hasDecimalSeparator = formattedValue.indexOf(decimalSeparator) !== -1 || decimalPrecision,
                parts = formattedValue.split(decimalSeparator);
            let beforeDecimal = parts[0],
                afterDecimal = parts[1] || '';

            //remove leading zeros from number before decimal
            beforeDecimal = LocalCurrency.removeLeadingZero(beforeDecimal);

            //apply decimal precision if its defined
            if (decimalPrecision !== undefined) {
                afterDecimal = LocalCurrency.limitToPrecision(afterDecimal, decimalPrecision);
            }
            if (thousandSeparator) {
                beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
            }
            //add prefix and suffix
            if (prefix) {
                beforeDecimal = prefix + beforeDecimal;
            }
            if (suffix) {
                afterDecimal += suffix;
            }
            if (hasNegative && !removeNegative) {
                beforeDecimal = '-' + beforeDecimal;
            }
            formattedValue = beforeDecimal + (hasDecimalSeparator && decimalSeparator || '') + afterDecimal;
        }

        return {
            value: (hasNegative && !removeNegative
                ? '-'
                : '') + LocalCurrency.removePrefixAndSuffix(formattedValue, props)
                .match(numRegex)
                .join(''),
            formattedValue,
        };
    }
    handleChange(inputValue, event) {
        const newValue = this.formatInput(inputValue);
        this.props.validate(event, newValue.value);
    }

    handleBlur(event) {
        const newValue = this.formatInput(event.target.value);
        this.props.validate(event, newValue.value);
    }

    injectField(field) {
        this._field = field;
    }
    render() {
        const { name, label, value, required, error, errorText, className, validate, placeholder, floating, helpText, onKeyUp, rows, inlineIndicator, currLabel } = this.props,
            { setLibRef } = this;
        let formattedValue = '';
        formattedValue = this.formatInput(value);
        if (formattedValue) {
            formattedValue = formattedValue.formattedValue;
        }
        return (
            <div className={'textField ' + ((className) ? className : '')}>
                <TextField
                    id={name}
                    label={label}
                    required={required}
                    value={formattedValue}
                    error={error}
                    errorText={errorText}
                    floating={floating}
                    placeholder={placeholder}
                    helpText={helpText}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    autoComplete="off"
                    className="md-cell md-cell--bottom"
                    type="text"
                    onKeyUp={onKeyUp}
                    ref={this.injectField}
                    rows={rows}
                    inlineIndicator={inlineIndicator}
                    rightIcon={<div>{currLabel}</div>}
                />
            </div>
        );
    }
}

export default LocalCurrency;
