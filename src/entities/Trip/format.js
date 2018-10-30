import { tripsModel } from './model';

const format = {
    model: tripsModel,
    format(data) {
        return data;
    },
    getModel() {
        return format.model;
    },

    setModel(model) {
        this.model = model;
    },
};

export default format;
