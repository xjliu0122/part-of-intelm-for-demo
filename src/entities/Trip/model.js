const _tripsModel = {
    isRequesting: false,
    isUpdating: false,
    trips: [],
    suggests: [],
    tripsForManager: {
        rows: [],
        count: 0,
    },
    signature: {},
};

export const tripsModel = _tripsModel;
