const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');

const Op = models.Sequelize.Op;
const mainIncludeOptions = [
    {
        model: models.Trip,
        as: 'trip',
        include: [
            {
                model: models.Stop,
                as: 'stop',
                include: [
                    {
                        model: models.Location,
                        as: 'stopLocation',
                        include: ['geoLocation'],
                    },
                ],
            },
            {
                model: models.Container,
                as: 'container',
                include: [
                    {
                        model: models.Job,
                        as: 'job',
                        include: [
                            {
                                model: models.JobImportDetail,
                                as: 'jobImportDetail',
                            },
                            {
                                model: models.JobExportDetail,
                                as: 'jobExportDetail',
                            },
                            {
                                model: models.Container,
                                as: 'container',
                                include: [
                                    'containerAR',
                                    {
                                        model: models.Location,
                                        as: 'deliverToLocation',
                                        include: ['geoLocation'],
                                    },
                                    {
                                        model: models.Location,
                                        as: 'pickupFromLocation',
                                        include: ['geoLocation'],
                                    },
                                ],
                            },
                            {
                                model: models.Location,
                                as: 'shipper',
                                include: ['geoLocation'],
                            },
                            {
                                model: models.Location,
                                as: 'consignee',
                                include: ['geoLocation'],
                            },
                            {
                                model: models.Location,
                                as: 'port',
                                include: ['geoLocation'],
                            },
                            {
                                model: models.Company,
                                as: 'billTo',
                            },
                            {
                                model: models.User,
                                as: 'createdBy',
                            },
                            {
                                model: models.Company,
                                as: 'client',
                                include: ['geoLocation'],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
const getSchedule = async id => {
    const schedule = await models.Schedule.findOne({
        where: { id },
        order: [
            [{ model: models.Trip, as: 'trip' }, 'scheduleRowNo', 'ASC'],
            [
                { model: models.Trip, as: 'trip' },
                { model: models.Stop, as: 'stop' },
                'stopNo',
                'ASC',
            ],
        ],
        include: mainIncludeOptions,
    });
    return schedule.dataValues;
};
const determineLocationTime = async (trips, schedule, tr) => {
    const size = _.size(trips);
    if (!size) return;

    const firstTrip = trips[0];
    const lastTrip = trips[size - 1];

    const toUpdate = {
        startLocation: _.get(firstTrip, 'startLocation'),
        endLocation: _.get(lastTrip, 'endLocation'),
        estimatedStartTime: _.get(firstTrip, 'estimatedStartTime'),
        estimatedEndTime: _.get(lastTrip, 'estimatedEndTime'),
        actualStartTime: _.get(firstTrip, 'actualStartTime'),
        actualEndTime: _.get(lastTrip, 'actualEndTime'),
    };
    await schedule.updateAttributes(toUpdate, { transaction: tr });
};
module.exports = {
    getSchedulesByFilter: async (req, res, next) => {
        try {
            const { body, user } = req;
            let filter = {
                ...body,
            };

            if (user.role !== 'dispatcher') {
                filter = {
                    ...filter,
                    assigneeId: user.companyId,
                };
            }

            const schedules = await models.Schedule.findAll({
                where: filter,
                order: [
                    [
                        { model: models.Trip, as: 'trip' },
                        'scheduleRowNo',
                        'ASC',
                    ],
                    [
                        { model: models.Trip, as: 'trip' },
                        { model: models.Stop, as: 'stop' },
                        'stopNo',
                        'ASC',
                    ],
                ],
                include: mainIncludeOptions,
            });
            const result = _.map(schedules, schedule => schedule.dataValues);

            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    createSchedule: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;

            const data = { ...body };
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to edit trip schedules');
            } else {
                // create shedule
                const schedule = await models.Schedule.create(
                    {
                        createdById: user.id,
                    },
                    { transaction: tr },
                );

                // load all trips
                const tripHandlers = await Promise.all(_.map(data.trips, async (trip, index) => {
                    const tripInstance = await models.Trip.findById(trip);
                    if (tripInstance.scheduleId) {
                        util.throwApiException(`Trip ${
                            tripInstance.rowNo
                        } is already dispatched.`);
                    }
                    await tripInstance.updateAttributes(
                        {
                            scheduleRowNo: index + 1,
                        },
                        { transaction: tr },
                    );
                    return tripInstance;
                }));

                // assign schedule and rowNo.
                await schedule.setTrip(tripHandlers, { transaction: tr });

                // determine location and times
                await determineLocationTime(tripHandlers, schedule, tr);
                await tr.commit();
                const resp = await getSchedule(schedule.id);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    updateSchedule: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            const scheduleId = req.params.id;
            const data = { ...body };
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to edit trip schedules');
            } else {
                // get the shedule
                const schedule = await models.Schedule.findById(scheduleId, {
                    include: ['trip'],
                });
                //delete trips if applicable.
                await Promise.all(_.map(schedule.trip, async t => {
                    if (!_.find(data.trips, tripId => tripId === t.id)) {
                        await t.updateAttributes(
                            {
                                scheduleRowNo: null,
                                scheduleId: null,
                                amount: null,
                                assigneeId: null,
                            },
                            {
                                transaction: tr,
                            },
                        );
                    }
                }));

                // load all trips
                const tripHandlers = await Promise.all(_.map(data.trips, async (trip, index) => {
                    const tripInstance = await models.Trip.findById(trip);
                    await tripInstance.updateAttributes(
                        {
                            scheduleRowNo: index + 1,
                        },
                        { transaction: tr },
                    );
                    return tripInstance;
                }));

                // assign schedule and rowNo.
                await schedule.setTrip(tripHandlers, { transaction: tr });

                // determine location and times
                await determineLocationTime(tripHandlers, schedule, tr);
                await tr.commit();
                const resp = await getSchedule(schedule.id);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    deleteSchedule: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const user = req.user;
            const scheduleId = req.params.id;

            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to edit trip schedules');
            } else {
                // get the shedule
                const schedule = await models.Schedule.findById(scheduleId, {
                    include: ['trip'],
                });
                //set trips to not bundled
                await Promise.all(_.map(schedule.trip, async t => {
                    await t.updateAttributes(
                        {
                            scheduleRowNo: null,
                            scheduleId: null,
                        },
                        {
                            transaction: tr,
                        },
                    );
                }));

                await schedule.destroy({ transaction: tr });

                await tr.commit();
                res.json({ id: scheduleId });
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
};
