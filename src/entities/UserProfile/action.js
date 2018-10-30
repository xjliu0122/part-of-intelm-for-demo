import { saga, history } from 'services';

const userProfile = saga.createEntityApi('userProfile', ['list', 'invite']);

userProfile.api.get = function (params) {
    const config = {
        method: 'GET',
        errorMessage: 'Unable to get your user profile.',
        url: '/user',
    };
    return config;
};
userProfile.api.create = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        errorMessage: 'Unable to create user',
        url: '/user',
    };
};
userProfile.api.update = function (params) {
    return {
        method: 'PUT',
        data: {
            ...params,
        },
        errorMessage: 'Unable to update user',
        url: '/user',
    };
};
userProfile.api.list = function () {
    // this is for managing users
    const config = {
        method: 'GET',
        errorMessage: 'Unable to get users',
        url: '/user/list',
    };
    return config;
};
userProfile.api.delete = function (id) {
    // this is for managing users
    const config = {
        method: 'DELETE',
        errorMessage: 'Unable to delete user',
        url: `/user/${id}`,
    };
    return config;
};
userProfile.api.invite = function (params) {
    return {
        method: 'POST',
        data: {
            ...params,
        },
        errorMessage: 'Unable to add new user',
        url: '/user/invite',
    };
};
export default userProfile;
