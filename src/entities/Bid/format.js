import { bidModel } from 'entities/Bid/model';

const format = {
    model: bidModel,
    format(data) {
        const formattedModel = data;

        return {
            ...format.model,
            bids: formattedModel,
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
