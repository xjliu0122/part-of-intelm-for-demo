import Validators from './validators';

export default function(value, type, required) {
    let invalid;

    if (required) {
        invalid = (Validators.required(value) || !value)
    }

    if (type === 'email') {
        invalid = Validators.email(value);
    }

    if (type === 'number') {
        invalid = Validators.number(value);
    }

    return invalid;
}
