import job from './action';
import { jobsModel } from './model';
import formatJobs from './format';
import _ from 'lodash';

export default function jobReducer(state = jobsModel, action) {
    const format = formatJobs.format;
    let body,
        jobsData;
    //simplied action object
    if (_.has(action, 'params.params.data')) {
        body = action.params.params.data;
    }
    //if return is an array
    if (_.has(action, 'params.response')) {
        body = action.params.response;
    }

    switch (action.type) {
        case job.type.get.watch:
            return {
                ...state,
                isRequesting: true,
            };
        case job.type.get.success:
            jobsData = body;

            return {
                ...state,
                ...jobsData,
                isRequesting: false,
            };

        case job.type.get.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case job.type.list.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case job.type.list.success:
            jobsData = format(body);

            return {
                ...state,
                ...jobsData,
                isRequesting: false,
            };

        case job.type.list.failure:
            return {
                ...state,
                isRequesting: false,
            };

        case job.type.create.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case job.type.create.success:
            const newJob = body;
            const updatedJobs = [...state.jobs.items];
            const count = state.jobs.count || 0 + 1;
            updatedJobs.unshift(newJob);
            return {
                ...state,
                jobs: {
                    items: updatedJobs,
                    count,
                },
                isRequesting: false,
            };

        case job.type.create.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case job.type.update.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case job.type.update.success:
            const jobData = body;
            const jobs = _.cloneDeep(state.jobs);
            jobs.items.splice(
                _.findIndex(jobs.items, { name: jobData.name }),
                1,
                {
                    ...jobData,
                },
            );

            return {
                ...state,
                jobs,
                isRequesting: false,
            };

        case job.type.update.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case job.type.invoice.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case job.type.invoice.success:
            const newJobs = _.cloneDeep(state.jobs);
            newJobs.items.splice(
                _.findIndex(newJobs.items, { name: body.name }),
                1,
                {
                    ...body,
                },
            );

            return {
                ...state,
                jobs: newJobs,
                isRequesting: false,
            };

        case job.type.invoice.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case job.type.sendConfirmation.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case job.type.sendConfirmation.success:
            const newJobs2 = _.cloneDeep(state.jobs);
            newJobs2.items.splice(
                _.findIndex(newJobs2.items, { name: body.name }),
                1,
                {
                    ...body,
                },
            );

            return {
                ...state,
                jobs: newJobs2,
                isRequesting: false,
            };

        case job.type.sendConfirmation.failure:
            return {
                ...state,
                isRequesting: false,
            };
        case job.type.markRAStatus.watch:
            return {
                ...state,
                isRequesting: true,
            };

        case job.type.markRAStatus.success:
            const newJobs3 = _.cloneDeep(state.jobs);
            newJobs3.items.splice(
                _.findIndex(newJobs3.items, { name: body.name }),
                1,
                {
                    ...body,
                },
            );

            return {
                ...state,
                jobs: newJobs3,
                isRequesting: false,
            };

        case job.type.markRAStatus.failure:
            return {
                ...state,
                isRequesting: false,
            };

        default:
            return state;
    }
}
