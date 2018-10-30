import userProfile from 'entities/UserProfile/action';
import { profileModel } from 'entities/UserProfile/model';
import formatProfile from 'entities/UserProfile/format';
import _ from 'lodash';

export default function userProfileReducer(state = profileModel, action) {
    const format = formatProfile.format;
    let body,
        response,
        profile,
        Saved;

    //simplied action object
    if (_.has(action, 'params.params.body')) {
        body = action.params.params.body;
    }

    if (_.has(action, 'params.response')) {
        response = action.params.response;
    }

    switch (action.type) {
        case userProfile.type.get.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case userProfile.type.get.success:
            profile = format(action.params.response);

            return {
                ...state,
                ...profile,
                isRequesting: false,
            };

        case userProfile.type.get.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case userProfile.type.list.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case userProfile.type.list.success:
            const users = action.params.response;

            return {
                ...state,
                users,
                isRequesting: false,
            };

        case userProfile.type.list.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case userProfile.type.delete.watch:
            return {
                ...state,
                isUpdating: true,
            };

        case userProfile.type.delete.success:
            const deletedId = action.params.response;
            const usersAfterDelete = [...state.users];
            usersAfterDelete.splice(
                _.findIndex(usersAfterDelete, { id: deletedId }),
                1,
            );
            return {
                ...state,
                users: usersAfterDelete,
                isUpdating: false,
            };

        case userProfile.type.delete.failure:
            //Restore saved state
            return {
                ...state,
                isUpdating: false,
            };
        case userProfile.type.update.request:
            return {
                ...state,
                isUpdating: true,
            };
        case userProfile.type.update.success:
            const updatedUser = action.params.response;
            const updatedUsers = [...state.users];
            updatedUsers.splice(
                _.findIndex(updatedUsers, { id: updatedUser.id }),
                1,
                updatedUser,
            );
            return {
                ...state,
                users: updatedUsers,
                isUpdating: false,
            };
        case userProfile.type.update.failure:
            //Restore saved state
            return {
                ...state,
                isUpdating: false,
            };

        case userProfile.type.create.request:
            return {
                ...state,
                isRequesting: true,
            };

        case userProfile.type.create.success:
            profile = format(action.params.response);

            return {
                ...state,
                ...profile,
                isRequesting: false,
            };

        case userProfile.type.create.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case userProfile.type.invite.request:
            return {
                ...state,
                isRequesting: true,
            };

        case userProfile.type.invite.success:
            return {
                ...state,

                isRequesting: false,
            };

        case userProfile.type.invite.failure:
            return {
                ...state,
                isRequesting: false,
            };
        default:
            return state;
    }
}
