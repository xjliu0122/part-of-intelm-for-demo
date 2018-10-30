// IntelModal
//Calc status
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const models = require('../models');
const Util = require('./util');
const moment = require('moment');

const Controller = require(`${global.appRoot}/controllers/status`);
const Op = models.Sequelize.Op;

const doWork = async () => {
    // 1st. decide Job status
    try {
        let jobs = await models.Job.findAll({
            where: {
                createdAt: {
                    [Op.gte]: moment()
                        .subtract(90, 'day'),
                },
                status: {
                    [Op.ne]: 'Complete',
                },
            },
        });
        await Promise.all(_.map(jobs, async job => {
            const status = await Controller.setStatusForJob(job);
            if (
                status.status !== job.status ||
                    status.warningFlag !== job.warningFlag
            ) {
                await job.updateAttributes({ ...status });
            }
        }));

        // 2nd do containers
        const containers = await models.Container.findAll({
            where: {
                createdAt: {
                    [Op.gte]: moment()
                        .subtract(90, 'day'),
                },
                status: {
                    [Op.ne]: 'Complete',
                },
            },
        });
        await Promise.all(_.map(containers, async con => {
            const trips = await con.getTrip();
            await Controller.setStatusForTrips(trips);
            await Controller.setStatusForContainer(con);
        }));
        // do the job again.
        jobs = await models.Job.findAll({
            where: {
                createdAt: {
                    [Op.gte]: moment()
                        .subtract(90, 'day'),
                },
                status: {
                    [Op.ne]: 'Complete',
                },
            },
        });
        await Promise.all(_.map(jobs, async job => {
            const status = await Controller.setStatusForJob(job);
            if (
                status.status !== job.status ||
                    status.warningFlag !== job.warningFlag
            ) {
                await job.updateAttributes({ ...status });
            }
        }));

        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};

setTimeout(doWork, 10000);
