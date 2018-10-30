export default function viewReducer(state = null, action) {
    switch (action.type) {
        case 'OPEN_JOB_DETAIL_VIEW':
            return {
                ...action.params,
            };
        case 'CLOSE_JOB_DETAIL_VIEW':
            return null;

        default:
            return state;
    }
}
