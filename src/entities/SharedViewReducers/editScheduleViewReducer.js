export default function viewReducer(state = null, action) {
    switch (action.type) {
        case 'OPEN_SCHEDULE_VIEW':
            return {
                ...action.params,
            };
        case 'CLOSE_SCHEDULE_VIEW':
            return null;
        default:
            return state;
    }
}
