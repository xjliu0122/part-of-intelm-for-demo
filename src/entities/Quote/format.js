import { quotesModel } from './model';

const format = {
    model: quotesModel,
    format(data) {
        const formattedModel = data;

        return {
            ...format.model,
            quotes: formattedModel,
        };
    },
    getModel() {
        return format.model;
    },

    setModel(model) {
        this.model = model;
    },
};

export default format;
