const Validators = {
    required(value) {
        return !/^\S/i.test(value);
    },
    email(value) {
        return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    },
    date(value) {
        return !/^\d{4}-\d{2}-\d{2}$/.test(value);
    },
    password(value) {
        let errors = {};

        if ((/[A-Z]/g).test(value)) {
            errors.capital = true;
        }

        if ((/\d/g).test(value)) {
            errors.number = true;
        }

        if ((/^\S{8,}$/g).test(value)) {
            errors.length = true;
        }

        return errors;
    },
    number(value) {
        return !/^\d+$/.test(value);
    },
    numberOrFloat(value) {
        return !/^\d+\.\d+|^\d+$/.test(value);
    }
}

export default Validators;
