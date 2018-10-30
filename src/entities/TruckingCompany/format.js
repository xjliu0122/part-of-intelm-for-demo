import { truckingCompanyModel } from 'entities/TruckingCompany/model';

const format = {
    model: truckingCompanyModel,
    format(data) {
        const formattedModel = data;

        return {
            ...format.model,
            truckingCompanies: formattedModel,
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
