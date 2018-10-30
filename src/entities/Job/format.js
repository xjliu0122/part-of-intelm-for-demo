import { jobsModel } from './model';

const format = {
    model: jobsModel,
    format(data) {
        const formattedModel = data;

        return {
            ...format.model,
            jobs: formattedModel,
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
