import managedLocation from 'entities/ManagedLocation/action';
import { managedLocationsModel } from 'entities/ManagedLocation/model';
import formatManagedLocation from 'entities/ManagedLocation/format';
import _ from 'lodash';

export default function managedLocationsReducer(
    state = managedLocationsModel,
    action,
) {
    const format = formatManagedLocation.format;
    let body,
        locations,
        location,
        managedLocations;
    //simplied action object
    if (_.has(action, 'params.params.data')) {
        body = action.params.params.data;
    }
    //if return is an array
    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case 'CLEAR_CLIENT_LOCATIONS':
            return {
                ...state,
                clientLocations: [],
                isRequesting: false,
            };
        case managedLocation.type.list.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case managedLocation.type.list.success:
            locations = format(body);

            return {
                ...state,
                managedLocations: locations,
                isRequesting: false,
            };

        case managedLocation.type.list.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case managedLocation.type.listClient.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case managedLocation.type.listClient.success:
            locations = format(body);

            return {
                ...state,
                clientLocations: locations,
                isRequesting: false,
            };

        case managedLocation.type.listClient.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case managedLocation.type.create.request:
            return {
                ...state,
                isRequesting: true,
            };

        case managedLocation.type.create.success:
            location = formatManagedLocation.formatForSingleRecReturn(body);
            locations = _.cloneDeep(state.managedLocations);
            locations.unshift(location);
            return {
                ...state,
                managedLocations: locations,
                isRequesting: false,
            };

        case managedLocation.type.create.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case managedLocation.type.update.request:
            return {
                ...state,
                isRequesting: true,
            };

        case managedLocation.type.update.success:
            const updatedLocation = formatManagedLocation.formatForSingleRecReturn(body);
            managedLocations = [...state.managedLocations];
            managedLocations.splice(
                _.findIndex(managedLocations, { id: updatedLocation.id }),
                1,
                updatedLocation,
            );

            return {
                ...state,
                managedLocations,
                isRequesting: false,
            };

        case managedLocation.type.update.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case managedLocation.type.delete.request:
            return {
                ...state,
                isRequesting: true,
            };

        case managedLocation.type.delete.success:
            managedLocations = [...state.managedLocations];
            managedLocations.splice(
                _.findIndex(managedLocations, { id: body.id }),
                1,
            );

            return {
                ...state,
                managedLocations,
                isRequesting: false,
            };

        case managedLocation.type.delete.failure:
            return {
                ...state,
                isRequesting: false,
            };
        default:
            return state;
    }
}
