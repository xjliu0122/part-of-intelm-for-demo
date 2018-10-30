import trip from './action';
import { tripsModel } from './model';
import formatJobs from './format';
import _ from 'lodash';

export default function tripReducer(state = tripsModel, action) {
    const format = formatJobs.format;
    let body,
        tripsData;
    let updatedTrip,
        tripsForManager;

    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case 'RemoveScheduleIdFromTripsInManager':
            const newTripForManagerData = _.get(state, 'tripsForManager');
            const newTrips = [..._.get(state, 'tripsForManager.rows')];

            _.map(newTrips, (t, index) => {
                if (t.scheduleId === action.payload.id) {
                    newTrips.splice(index, 1, { ...t, scheduleId: null });
                }
            });
            return {
                ...state,
                tripsForManager: { ...newTripForManagerData, rows: newTrips },
            };
        case trip.type.get.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case trip.type.get.success:
            return {
                ...state,
                isRequesting: false,
            };

        case trip.type.get.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case trip.type.list.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.list.success:
            tripsData = format(body);

            return {
                ...state,
                trips: tripsData,
                isRequesting: false,
            };

        case trip.type.list.failure:
            return {
                ...state,
                trips: [],
                isRequesting: false,
            };
        case trip.type.suggest.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.suggest.success:
            tripsData = format(body);

            return {
                ...state,
                suggests: tripsData,
                isRequesting: false,
            };

        case trip.type.suggest.failure:
            return {
                ...state,
                suggests: [],
                isRequesting: false,
            };
        case trip.type.searchForManagement.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.searchForManagement.success:
            tripsData = format(body);

            return {
                ...state,
                tripsForManager: tripsData,
                isRequesting: false,
            };

        case trip.type.searchForManagement.failure:
            return {
                ...state,
                tripsForManager: {
                    rows: [],
                    count: 0,
                },
                isRequesting: false,
            };
        case trip.type.create.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.create.success:
            const newTrip = body;
            const updatedTrips = [...state.trips];
            updatedTrips.push(newTrip);
            return {
                ...state,
                trips: updatedTrips,
                isRequesting: false,
            };

        case trip.type.create.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case trip.type.delete.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.delete.success:
            return {
                ...state,
                trips: _.filter([...state.trips], t => t.id !== body.id),
                isRequesting: false,
            };

        case trip.type.delete.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case trip.type.update.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.update.success:
            updatedTrip = body;
            tripsData = _.cloneDeep(state.trips);
            if (
                _.size(tripsData) > 0 &&
                _.findIndex(tripsData, { id: updatedTrip.id }) !== -1
            ) {
                tripsData.splice(
                    _.findIndex(tripsData, { id: updatedTrip.id }),
                    1,
                    {
                        ...updatedTrip,
                    },
                );
            }
            tripsForManager = _.cloneDeep(state.tripsForManager);
            if (
                _.size(tripsForManager.rows) > 0 &&
                _.findIndex(tripsForManager.rows, { id: updatedTrip.id }) !== -1
            ) {
                tripsForManager.rows.splice(
                    _.findIndex(tripsForManager.rows, { id: updatedTrip.id }),
                    1,
                    {
                        ...updatedTrip,
                    },
                );
            }

            return {
                ...state,
                trips: tripsData,
                tripsForManager,
                isRequesting: false,
            };

        case trip.type.update.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case trip.type.adjustTripOrder.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.adjustTripOrder.success:
            return {
                ...state,
                isRequesting: false,
            };

        case trip.type.adjustTripOrder.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case trip.type.assign.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.assign.success:
            updatedTrip = body;
            tripsForManager = _.cloneDeep(state.tripsForManager);
            if (
                _.size(tripsForManager.rows) > 0 &&
                _.findIndex(tripsForManager.rows, { id: updatedTrip.id }) !== -1
            ) {
                tripsForManager.rows.splice(
                    _.findIndex(tripsForManager.rows, { id: updatedTrip.id }),
                    1,
                    {
                        ...updatedTrip,
                    },
                );
            }

            return {
                ...state,
                tripsForManager,
                isRequesting: false,
            };

        case trip.type.assign.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case trip.type.getSignatureOrPOD.watch:
            return {
                ...state,
                signature: {},
                isRequesting: true,
            };

        case trip.type.getSignatureOrPOD.success:
            const signature = body;
            return {
                ...state,
                signature,
                isRequesting: false,
            };

        case trip.type.getSignatureOrPOD.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case trip.type.fetchSingleForManagementAfterScheduling.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case trip.type.fetchSingleForManagementAfterScheduling.success:
            updatedTrip = body;
            tripsForManager = _.cloneDeep(state.tripsForManager);
            if (
                _.size(tripsForManager.rows) > 0 &&
                _.findIndex(tripsForManager.rows, { id: updatedTrip.id }) !== -1
            ) {
                tripsForManager.rows.splice(
                    _.findIndex(tripsForManager.rows, { id: updatedTrip.id }),
                    1,
                    {
                        ...updatedTrip,
                    },
                );
            }

            return {
                ...state,
                tripsForManager,
                isRequesting: false,
            };

        case trip.type.fetchSingleForManagementAfterScheduling.failure:
            return {
                ...state,
                isRequesting: false,
            };

        default:
            return state;
    }
}
