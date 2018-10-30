const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');
const StatusController = require('../status');
const emailHelper = require('../emailHelper');

const Op = models.Sequelize.Op;
const mainIncludeOptions = [
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
            'containerAP',
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
];
const getExpandedJobById = async id => {
    const job = await models.Job.findById(id, {
        include: mainIncludeOptions,
    });
    return job.dataValues;
};

module.exports = {
    getExpandedJobById,
    mainIncludeOptions,
    getJobsByFilter: async (req, res, next) => {
        try {
            const user = req.user;
            let skip = 0;
            let filter = { ...req.body };
            let usingDate = false;
            if (user.role !== 'dispatcher') {
                filter = {
                    ...filter,
                    clientId: user.companyId,
                };
            }
            if (filter.skip) {
                skip = filter.skip;
            }
            // preprocessing filters
            if (filter.fromDate || filter.toDate || filter.days) {
                usingDate = true;
            }
            if (!filter.fromDate) filter.fromDate = '1900-01-01';
            if (!filter.toDate) filter.toDate = '2500-12-31';
            // if (filter.toDate) {
            //     filter.toDate = moment(filter.toDate)
            //         .toDate();
            // }
            const importConds = {},
                exportConds = {},
                jobConds = {};

            //never fetch all jobs. upper limit set to 90 days.
            jobConds.createdAt = {
                [Op.gte]: moment()
                    .subtract(190, 'Days'),
            };

            let importWhere,
                exportWhere,
                containerWhere;
            // prepare where condition
            if (filter.clientId) jobConds.clientId = filter.clientId;
            if (filter.clientRefNo) jobConds.clientRefNo = filter.clientRefNo;
            if (filter.booking) exportConds.booking = filter.booking;
            if (filter.bol) importConds.billOfLading = filter.bol;

            if (filter.status) {
                jobConds.status = filter.status;
            }
            if (filter.port) {
                jobConds.portId = filter.port;
            }
            if (filter.jobType) {
                jobConds.type = filter.jobType;
            }
            if (filter.name) {
                jobConds.name = filter.name;
            }

            if (!_.isEmpty(importConds)) {
                importWhere = { where: importConds };
            }
            if (!_.isEmpty(exportConds)) {
                exportWhere = { where: exportConds };
            }
            const containerConds = {};

            if (filter.container) {
                containerConds.equipmentNo = filter.container;
            }

            if (!_.isEmpty(containerConds)) {
                containerWhere = { where: containerConds };
            }

            let tripWhere = {};
            if (usingDate) {
                tripWhere = {
                    where: {
                        estimatedStartTime: {
                            [Op.and]: [
                                { [Op.gte]: filter.fromDate },
                                { [Op.lte]: filter.toDate },
                            ],
                        },
                    },
                };
            }
            const includeForSearch = [
                {
                    model: models.Container,
                    as: 'container',
                    required: usingDate || containerWhere !== {},
                    include: [
                        {
                            model: models.Trip,
                            as: 'trip',
                            attributes: ['id'],
                            ...tripWhere,
                        },
                        'containerAR',
                        'containerAP',
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
                    ...containerWhere,
                },
                {
                    model: models.JobImportDetail,
                    as: 'jobImportDetail',
                    ...importWhere,
                },
                {
                    model: models.JobExportDetail,
                    as: 'jobExportDetail',
                    ...exportWhere,
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
            ];
            const count = await models.Job.count({
                where: jobConds,
                order: [['name', 'DESC']],
                distinct: 'name',
                include: includeForSearch,
            });
            const jobs = await models.Job.findAll({
                where: jobConds,
                order: [
                    ['name', 'DESC'],
                    [
                        { model: models.Container, as: 'container' },
                        'seqNo',
                        'ASC',
                    ],
                ],
                distinct: 'name',
                offset: skip,
                limit: 10,
                include: includeForSearch,
            });

            const result = _.map(jobs, job => job.dataValues);
            res.json({ items: result, count });
        } catch (err) {
            next(err);
        }
    },
    createJob: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let job;
            if (user.role === 'bco') {
                body.clientId = user.companyId;
            }
            if (['bco', 'dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to create job');
            } else {
                job = await models.Job.create(
                    {
                        ...body,
                        createdById: user.id,
                        status: 'New',
                    },
                    {
                        transaction: tr,
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
                            },
                        ],
                    },
                );
            }

            // if job is from quote, update the quote status to Job Created

            if (body.fromQuote) {
                await models.Quote.update(
                    {
                        status: 'Booked',
                    },
                    {
                        where: { name: body.fromQuote },
                        transaction: tr,
                    },
                );
            }

            await tr.commit();
            const resp = await getExpandedJobById(job.name);
            res.json(resp);
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    updateJob: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let job;
            if (user.role === 'bco') {
                body.clientId = user.companyId;
            }
            if (['bco', 'dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update job');
            } else {
                job = await models.Job.findById(body.name);
                await job.updateAttributes(body, {
                    transaction: tr,
                });
                switch (job.type) {
                    case 'Import':
                        const jobImportDetail = await job.getJobImportDetail();
                        job.jobImportDetail = await jobImportDetail.updateAttributes(
                            {
                                ...body.jobImportDetail,
                            },
                            {
                                transaction: tr,
                            },
                        );
                        break;
                    case 'Export':
                        const jobExportDetail = await job.getJobExportDetail();
                        job.jobExportDetail = await jobExportDetail.updateAttributes(
                            {
                                ...body.jobExportDetail,
                            },
                            {
                                transaction: tr,
                            },
                        );
                        break;
                    default:
                        break;
                }
                // import details.

                // containers
                const containers = await job.getContainer();
                // 1st step: delete or update
                await Promise.all(_.map(containers, async handler => {
                    const temp = _.find(body.container, con => {
                        return con.id === handler.id;
                    });
                    if (!temp) {
                        await handler.destroy({
                            transaction: tr,
                        });
                    } else {
                        await handler.updateAttributes(
                            {
                                ...temp,
                                ...temp.dimensions,
                            },
                            {
                                transaction: tr,
                            },
                        );
                    }
                }));

                //2nd step: add new ones.
                await Promise.all(_.map(body.container, async con => {
                    if (!con.id) {
                        const handler = await models.Container.create(
                            {
                                ...con,
                                ...con.dimensions,
                            },
                            {
                                transaction: tr,
                            },
                        );
                        await job.addContainer(handler, {
                            transaction: tr,
                        });
                    }
                }));
                // determine job status

                const status = await StatusController.setStatusForJob(
                    job,
                    user,
                );
                if (
                    status.status !== job.status ||
                    status.warningFlag !== job.warningFlag
                ) {
                    await job.updateAttributes(
                        { ...status },
                        { transaction: tr },
                    );
                }
                await tr.commit();
                const resp = await getExpandedJobById(job.name);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    invoiceJob: async (req, res, next) => {
        // this is not currently used!
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let job;
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update job');
            } else {
                job = await models.Job.findById(body.name);
                await job.updateAttributes(
                    {
                        status: 'invoiced',
                    },
                    {
                        transaction: tr,
                    },
                );
                // create invoice
                let amount = 0;
                const containers = await job.getContainer();
                _.map(containers, cont => {
                    amount += cont.charge || 0;
                });

                await models.Invoice.create(
                    {
                        jobId: job.name,
                        amount,
                    },
                    { transaction: tr },
                );
                await tr.commit();
                const resp = await getExpandedJobById(job.name);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    sendConfirmation: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let job;
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update job');
            } else {
                job = await models.Job.findById(body.jobName);
                await job.updateAttributes(
                    {
                        confirmationMailSent: true,
                    },
                    {
                        transaction: tr,
                    },
                );
                await tr.commit();
                // send mail
                const resp = await getExpandedJobById(job.name);
                const emailObj = {};
                emailObj.jobName = resp.name;
                emailObj.instruction = resp.remarks;
                emailObj.client = _.get(resp, 'client.name');
                emailObj.jobType = _.get(resp, 'type');
                emailObj.port = _.get(resp, 'port.name');
                switch (emailObj.jobType) {
                    case 'Import':
                        emailObj.oceanCarrier = _.get(
                            resp,
                            'jobImportDetail.marineCarrier',
                        );
                        emailObj.voyage = _.get(
                            resp,
                            'jobImportDetail.voyageNumber',
                        );
                        emailObj.etaETD = _.get(resp, 'jobImportDetail.etaDate')
                            ? moment(_.get(resp, 'jobImportDetail.etaDate'))
                                .format('MM/DD/YYYY')
                            : '';
                        emailObj.blBKNo = _.get(
                            resp,
                            'jobImportDetail.billOfLading',
                        );
                        emailObj.vessel = _.get(
                            resp,
                            'jobImportDetail.vesselName',
                        );
                        break;
                    case 'Export':
                        emailObj.oceanCarrier = _.get(
                            resp,
                            'jobExportDetail.marineCarrier',
                        );
                        emailObj.voyage = _.get(
                            resp,
                            'jobExportDetail.voyageNumber',
                        );
                        emailObj.etaETD = _.get(
                            resp,
                            'jobExportDetail.dateOfDeparture',
                        )
                            ? moment(_.get(
                                resp,
                                'jobExportDetail.dateOfDeparture',
                            ))
                                .format('MM/DD/YYYY')
                            : '';
                        emailObj.blBKNo = _.get(
                            resp,
                            'jobExportDetail.booking',
                        );
                        emailObj.vessel = _.get(
                            resp,
                            'jobExportDetail.vesselName',
                        );
                        break;
                    case 'Cross Town':
                        break;
                    default:
                }

                emailObj.containers = [];

                _.map(resp.container, con => {
                    const container = {
                        containerSeqNo: con.seqNo,
                        delvDate: moment(con.deliveryDate)
                            .format('MM/DD/YYYY'),
                        pickupFrom: _.get(con, 'pickupFromLocation.name'),
                        deliverTo: _.get(con, 'deliverToLocation.name'),
                        containerType: con.type,
                        options: 'haz',
                        grossWeight: con.grossWeight,
                        containerNo: con.equipmentNo,
                    };

                    emailObj.containers.push(container);
                });
                console.log(emailObj);
                emailHelper.sendBookingConfirmation(
                    _.get(resp, 'client.email'),
                    emailObj,
                );
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    markRAStatus: async (req, res, next) => {
        // this is not currently used!
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let job;
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update job');
            } else {
                job = await models.Job.findById(body.name);
                await job.updateAttributes(
                    {
                        ..._.omit(body, 'name'),
                    },
                    {
                        transaction: tr,
                    },
                );
                await tr.commit();
                const resp = await getExpandedJobById(job.name);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
};
