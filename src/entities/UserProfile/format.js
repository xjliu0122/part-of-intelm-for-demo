import { profileModel } from 'entities/UserProfile/model';

const format = {
    model: profileModel,
    format(profile) {
        const formattedProfile = profile;

        // if (formattedProfile.company) {
        //     formattedProfile.company.stateServed = _.map(
        //         _.filter(profile.company.operationStateArea, sa => {
        //             return sa.type === 'state';
        //         }),
        //         o => o.name,
        //     );
        //     formattedProfile.Company.operationArea = _.map(
        //         _.filter(profile.company.operationStateArea, sa => {
        //             return sa.type === 'area';
        //         }),
        //         o => o.name,
        //     );
        // }
        return {
            ...format.model,
            profile: formattedProfile,
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
