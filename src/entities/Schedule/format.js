import { schedulesModel } from './model';

const format = {
    model: schedulesModel,
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
