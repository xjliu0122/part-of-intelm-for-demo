const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');
const qboHandler = require('../qbHelper');
const Config = require('../qbHelper/config');

const Op = models.Sequelize.Op;

module.exports = {
    getAPItemsByFilter: async (req, res, next) => {
        try {
            const user = req.user;
            const filter = { ...req.body };
            const startDate =
                    filter.startDate || moment()
                        .subtract('90', 'days'),
                endDate = filter.endDate || moment();
            const results = await models.ContainerAP.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                    },
                    payeeId: user.companyId,
                },
            });

            res.json(results);
        } catch (err) {
            next(err);
        }
    },
    getContainerDataForAPPage: async (req, res, next) => {
        try {
            const { user } = req;
            const filter = { ...req.body };
            const { id, tripRowNoInContainer } = filter;
            const result = await models.Container.findOne({
                where: {
                    id,
                },
                required: true,
                include: [
                    {
                        model: models.Trip,
                        as: 'trip',
                        where: {
                            assigneeId: user.companyId,
                            rowNo: tripRowNoInContainer,
                        },
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
                        ],
                    },
                ],
            });

            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    getContainerDataForAPForWeb: async (req, res, next) => {
        try {
            const filter = { ...req.body };
            const id = filter.id;
            const result = await models.Container.findOne({
                where: {
                    id,
                },
                order: [[{ model: models.Trip, as: 'trip' }, 'rowNo', 'ASC']],
                include: [
                    {
                        model: models.Trip,
                        as: 'trip',
                        include: ['assignee'],
                    },
                ],
            });

            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    updateItems: async (req, res, next) => {
        const { type, containerId, items } = req.body;
        const tr = await models.sequelize.transaction();
        try {
            let handler;
            if (type === 'Payable') {
                handler = models.ContainerAP;
            } else if (type === 'Receivable') {
                handler = models.ContainerAR;
            } else {
                res.send(400);
            }
            if (handler) {
                // 1st step: delete or update

                const existingItems = await handler.findAll({
                    where: { containerId },
                });
                await Promise.all(_.map(existingItems, async existingItem => {
                    const temp = _.find(items, item => {
                        return item.id === existingItem.id;
                    });
                    if (!temp) {
                        await existingItem.destroy({
                            transaction: tr,
                        });
                    } else {
                        await existingItem.updateAttributes(
                            {
                                ...temp,
                            },
                            {
                                transaction: tr,
                            },
                        );
                    }
                }));

                //2nd step: add new ones.
                await Promise.all(_.map(items, async item => {
                    if (!item.id) {
                        await handler.create(
                            {
                                ...item,
                                containerId,
                            },
                            {
                                transaction: tr,
                            },
                        );
                    }
                }));

                // 3nd step, update container cost and revenue.
                let amount = 0;
                _.map(items, item => {
                    amount += parseFloat(item.amount, 2);
                });
                const toUpdate = {};
                if (type === 'Payable') {
                    toUpdate.charge = amount;
                } else if (type === 'Receivable') {
                    toUpdate.revenue = amount;
                }
                const con = await models.Container.findById(containerId);
                await con.updateAttributes(
                    {
                        ...toUpdate,
                    },
                    { transaction: tr },
                );

                tr.commit();
                res.send(util.successfulResponse(`${type} items maintained successfully`));
            }
        } catch (err) {
            tr.rollback();
            next(err);
        }
    },
    getPayeeBySearchText: async (req, res, next) => {
        const { searchText, containerId } = req.body;

        if (!searchText) return res.json([]);

        // get MC payees
        const trips = await models.Trip.findAll({
            where: { containerId },
            include: [
                {
                    model: models.Company,
                    as: 'assignee',
                    where: { name: { [Op.like]: `%${searchText}%` } },
                },
            ],
        });
        let result = [];
        _.map(trips, trip => {
            result.push({
                type: 'mc',
                id: trip.assigneeId,
                name: _.get(trip, 'assignee.name'),
            });
        });
        // get vendors
        const vendors = await models.Vendor.findAll({
            where: {
                name: { [Op.like]: `%${searchText}%` },
                type: 'qbo',
            },
        });
        _.map(vendors, vendor => {
            result.push({
                type: 'qbo',
                id: vendor.id,
                name: _.get(vendor, 'name'),
            });
        });
        result = _.uniqBy(result, 'id');
        res.json(result);
    },
    getItemsByFilter: async (req, res, next) => {
        const { type, id } = req.body;
        let items;

        if (type === 'Receivable') {
            items = await models.ContainerAR.findAll({
                where: {
                    containerId: id,
                },
            });
        } else if (type === 'Payable') {
            items = await models.ContainerAP.findAll({
                where: {
                    containerId: id,
                },
                include: ['payee'],
            });
        }

        res.json(items);
    },
    syncToQBO: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        const user = req.user;
        const { jobName } = req.body;
        const containers = await models.Container.findAll({
            where: { jobId: jobName },
            include: ['containerAP', 'containerAR'],
        });
        const job = await models.Job.findOne({
            where: { name: jobName },
            include: ['client'],
        });

        // AR Items
        const ARItems = _.flatten(_.map(containers, con => _.get(con, 'containerAR')));
        let qboDocs = _.compact(_.uniq(_.map(ARItems, 'qboDocNo')));
        //current invoices
        await Promise.all(_.map(qboDocs, async qboDocNo => {
            const qboDoc = await qboHandler.getQboInvoiceById(
                qboDocNo,
                user,
            );
            if (!qboDoc) return;
            const qboInvoiceStatus = qboDoc.Balance > 0 ? 'Synced' : 'Paid';
            // update sync items first
            await Promise.all(_.map(ARItems, async item => {
                if (item.qboDocNo === qboDocNo) {
                    const qboDocLine = _.find(qboDoc.Line, {
                        LineNum: parseInt(item.qboDocItemNo, 0),
                    });
                    await item.updateAttributes(
                        {
                            qboSyncToken: qboDoc.SyncToken,
                            amount: _.get(qboDocLine, 'Amount'),
                            status: qboInvoiceStatus,
                        },
                        { transaction: tr },
                    );
                }
            }));
        }));

        //create new invoice for unsynced items.
        const arItemsToCreate = _.compact(_.map(ARItems, itm => {
            if (!itm.qboDocNo) return itm;
            return null;
        }));
        const invoiceLines = [];
        await Promise.all(_.map(arItemsToCreate, async (itm, index) => {
            const containterObj = await itm.getContainer();
            const desc = _.join(
                [`Cnt#:${containterObj.equipmentNo}`, itm.type],
                ' / ',
            );
            const service = await models.QBOProduct.find({
                where: {
                    name: itm.type,
                    type: 'Service',
                },
            });
            if (service) {
                invoiceLines.push({
                    Amount: itm.amount,
                    DetailType: 'SalesItemLineDetail',
                    Description: desc,
                    LineNum: index + 1,
                    SalesItemLineDetail: {
                        ItemRef: {
                            value: service.qboId,
                        },
                    },
                });
            }
        }));
        // get customer ref
        if (_.size(invoiceLines) > 0) {
            const newInvoice = {
                CustomerRef: {
                    value: _.get(job, 'client.qboCompanyId'),
                },
                Line: invoiceLines,
            };

            const newInvoiceResp = await qboHandler.createQboInvoice(
                newInvoice,
                user,
            );
            if (newInvoiceResp) {
                await Promise.all(_.map(arItemsToCreate, async (item, index) => {
                    await item.updateAttributes(
                        {
                            qboDocNo: newInvoiceResp.Id,
                            qboDocItemNo: `${index + 1}`,
                            qboSyncToken: newInvoiceResp.SyncToken,
                            status: 'Synced',
                        },
                        { transaction: tr },
                    );
                }));
            }
        }

        // now comes to AP Items

        const APItems = _.flatten(_.map(containers, con => _.get(con, 'containerAP')));
        qboDocs = _.compact(_.uniq(_.map(APItems, 'qboDocNo')));
        //current payments
        await Promise.all(_.map(qboDocs, async qboDocNo => {
            const qboDoc = await qboHandler.getQboBillById(qboDocNo, user);
            if (!qboDoc) return;
            const qboStatus = qboDoc.Balance > 0 ? 'Synced' : 'Paid';

            // update sync items first
            await Promise.all(_.map(APItems, async item => {
                if (item.qboDocNo === qboDocNo) {
                    const qboDocLine = _.find(qboDoc.Line, {
                        LineNum: parseInt(item.qboDocItemNo, 0),
                    });
                    await item.updateAttributes(
                        {
                            qboSyncToken: qboDoc.SyncToken,
                            amount: _.get(qboDocLine, 'Amount'),
                            status: qboStatus,
                        },
                        { transaction: tr },
                    );
                }
            }));
        }));

        //create new bill for unsynced items by vendor.
        const apItemsToCreate = _.compact(_.map(APItems, itm => {
            if (!itm.qboDocNo) return itm;
            return null;
        }));
        const grouped = _.values(_.groupBy(apItemsToCreate, 'payeeId'));

        await Promise.all(_.map(grouped, async items => {
            const lines = [];
            if (_.size(items) === 0) return;
            const payee = await models.Vendor.findOne({
                where: { id: items[0].payeeId },
            });
            if (!payee) return;
            await Promise.all(_.map(items, async (itm, index) => {
                const containterObj = await itm.getContainer();
                const desc = _.join(
                    [`Cnt#:${containterObj.equipmentNo}`, itm.type],
                    ' / ',
                );
                const cogs = await models.QBOProduct.find({
                    where: {
                        name: itm.type,
                        type: 'COGS',
                    },
                });
                if (cogs) {
                    lines.push({
                        Amount: itm.amount,
                        DetailType: 'AccountBasedExpenseLineDetail',
                        Description: desc,
                        Id: index + 1,
                        AccountBasedExpenseLineDetail: {
                            AccountRef: {
                                value: cogs.qboId,
                            },
                        },
                    });
                }
            }));

            const newObj = {
                VendorRef: {
                    value: payee.qboId,
                },
                Line: lines,
            };
            const resp = await qboHandler.createQboBill(newObj, user);
            if (resp) {
                await Promise.all(_.map(items, async (item, index) => {
                    await item.updateAttributes(
                        {
                            qboDocNo: resp.Id,
                            qboDocItemNo: `${index + 1}`,
                            qboSyncToken: resp.SyncToken,
                            status: 'Synced',
                        },
                        { transaction: tr },
                    );
                }));
            }
        }));

        await tr.commit();
        res.send([]);
    },
};
