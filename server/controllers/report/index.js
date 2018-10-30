const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');
const qboHandler = require('../qbHelper');
const uuid = require('uuid');

const Op = models.Sequelize.Op;
// i. Container Inventory Report (For Street Turn/To prevent dem./det. Chg.)
// Job Type == Import, Last Stop Type of the Trip == terminal, Action Type ==
// Dropoff empty, Trip Status is not “Complete”
// POD received for the stop  which has  Stop Type==consignee,  Stop Action==drop-off load.
// Ocean Carrier Name, Container Type, Container Number, Chassis Number
module.exports = {
    getConInvReport: async (req, res, next) => {
        try {
            const trips = await models.Trip.findAll({
                where: {
                    status: {
                        [Op.ne]: 'Complete', // trip status
                    },
                },
                order: [[{ model: models.Stop, as: 'stop' }, 'stopNo', 'ASC']],
                include: [
                    {
                        model: models.Container,
                        as: 'container',
                        required: true,
                        include: [
                            {
                                model: models.Job,
                                as: 'job',
                                required: true,
                                where: {
                                    type: 'Import',
                                },
                                include: ['jobImportDetail'],
                            },
                        ],
                    },
                    'stop',
                ],
            });

            // now filter by stop conditions.
            const result = [];

            _.map(trips, trip => {
                // frist check if POD received for the stop  which has  Stop Type==consignee,  Stop Action==drop-off load.
                let stop = _.find(trip.stop, s => {
                    return (
                        s.type === 'consignee' &&
                        _.toLower(s.action) === 'drop-off load'
                    );
                });

                if (!stop || !stop.signature) return;
                stop = _.last(trip.stop);
                if (
                    stop.type === 'terminal' &&
                    _.toLower(stop.action) === 'drop-off empty'
                ) {
                    result.push({
                        id: uuid(),
                        marineCarrier: _.get(
                            trip,
                            'container.job.jobImportDetail.marineCarrier',
                        ),
                        type: _.get(trip, 'container.type'),
                        equipmentNo: _.get(trip, 'container.equipmentNo'),
                        chassisNo: _.get(trip, 'container.chassisNo'),
                        jobNo: _.get(trip, 'container.job.name'),
                    });
                }
            });
            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    getBCOStatement: async (req, res, next) => {
        try {
            const { body } = req;
            const qboUser = await models.User.findOne({
                where: {
                    role: 'dispatcher',
                    isAdmin: true,
                    miscFields: {
                        [Op.ne]: {},
                    },
                },
            });
            let result = [];
            if (body.qboCompId) {
                result = await qboHandler.getQBOStatement({
                    user: qboUser,
                    qboCompId: body.qboCompId,
                    from: body.fromDate,
                    to: body.toDate,
                });
            }

            await Promise.all(_.map(result, async inv => {
                // get job id per invoice no.

                const job = await models.Job.findOne({
                    required: true,
                    include: [
                        {
                            model: models.Container,
                            as: 'container',
                            required: true,
                            include: [
                                {
                                    model: models.ContainerAR,
                                    as: 'containerAR',
                                    required: true,
                                    where: {
                                        qboDocNo: _.get(inv, 'txn_type.id'),
                                    },
                                },
                            ],
                        },
                    ],
                });
                inv.jobId = _.get(job, 'name');
            }));
            res.json(result || []);
        } catch (err) {
            next(err);
        }
    },
    getBCODashboardData: async (req, res, next) => {
        try {
            const { body, user } = req;
            const { actionType, type } = body;
            let { fromDate, toDate } = body;
            if (!fromDate || !toDate) {
                throw new Error('Need from and/or To Date');
            }
            // trip date
            fromDate = moment(fromDate);
            toDate = moment(toDate);
            const jobCond = { clientId: user.companyId };
            if (type) {
                jobCond.type = type;
            }
            const trips = await models.Trip.findAll({
                where: {
                    estimatedStartTime: {
                        [Op.gte]: fromDate,
                        [Op.lte]: toDate,
                    },
                },
                order: [[{ model: models.Stop, as: 'stop' }, 'stopNo', 'ASC']],
                required: true,
                include: [
                    {
                        model: models.Container,
                        as: 'container',
                        required: true,
                        include: [
                            {
                                model: models.Job,
                                as: 'job',
                                include: ['jobImportDetail', 'jobExportDetail'],
                                where: { ...jobCond },
                            },
                        ],
                    },
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
                ],
            });
            // now filter base on action type
            const results = [];

            _.map(trips, trip => {
                let found = false;
                if (actionType) {
                    _.map(trip.stop, s => {
                        if (s.action === actionType) found = true;
                    });
                }
                if (!actionType || found) {
                    const refs = [];
                    refs.push(_.get(trip, 'container.job.clientRefNo'));
                    refs.push(_.get(
                        trip,
                        'container.job.jobImportDetail.billOfLading',
                    ));
                    refs.push(_.get(trip, 'container.job.jobExportDetail.booking'));

                    results.push({
                        id: trip.id,
                        ref: _.join(_.compact(refs), '/'),
                        jobNo: _.get(trip, 'container.job.name'),
                        contType: _.get(trip, 'container.type'),
                        contNo: _.get(trip, 'container.equipmentNo'),
                        type: _.get(trip, 'container.job.type'),
                        stops: _.cloneDeep(trip.stop),
                        status: _.get(trip, 'container.status'),
                    });
                }
            });

            res.json(results);
        } catch (err) {
            next(err);
        }
    },
    getQBOInvoicePDF: async (req, res, next) => {
        try {
            const { params } = req;
            const qboUser = await models.User.findOne({
                where: {
                    role: 'dispatcher',
                    isAdmin: true,
                    miscFields: {
                        [Op.ne]: {},
                    },
                },
            });
            const result = await qboHandler.getQBOInvoicePDF(
                params.id,
                qboUser,
            );
            const buffer = new Buffer(result, 'binary');
            res.send(buffer.toString('base64'));
        } catch (err) {
            next(err);
        }
    },
};
