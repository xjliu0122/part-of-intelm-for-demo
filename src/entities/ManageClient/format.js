import { manageClientModel } from './model';

const format = {
    model: manageClientModel,
    getModel() {
        return format.model;
    },
};

export default format;
