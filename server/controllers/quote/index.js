const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');
const emailHelper = require('../emailHelper');

const Op = models.Sequelize.Op;
const mainIncludeOptions = [
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
        model: models.User,
        as: 'createdBy',
    },
    {
        model: models.Company,
        as: 'client',
        include: ['geoLocation'],
    },
    'port',
];
const getExpandedQuoteById = async id => {
    const quote = await models.Quote.findById(id, {
        include: mainIncludeOptions,
    });
    return quote.dataValues;
};
module.exports = {
    getExpandedQuoteById,
    mainIncludeOptions,
    getQuotesByFilter: async (req, res, next) => {
        try {
            const user = req.user;
            const filter = { ...req.body };
            const quoteConds = {};
            if (user.role !== 'dispatcher') {
                quoteConds.clientId = user.companyId;
            }

            let required = false;
            const includeOptions = _.cloneDeep(mainIncludeOptions);
            if (filter.containerType) {
                // this is for sub level condition for container.
                required = true;
                includeOptions[0].where = {
                    type: _.get(filter, 'containerType'),
                };
            }

            if (filter.port) quoteConds.portId = _.get(filter, 'port');
            if (filter.quoteType) quoteConds.type = _.get(filter, 'quoteType');
            if (filter.status) quoteConds.status = _.get(filter, 'status');

            quoteConds.createdAt = {
                [Op.gte]: moment()
                    .subtract(60, 'Days'),
            };

            const quotes = await models.Quote.findAll({
                where: quoteConds,
                order: [['name', 'DESC']],
                required,
                include: includeOptions,
            });
            const result = _.map(quotes, quote => quote.dataValues);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    createQuote: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let quote;
            if (user.role === 'bco') {
                body.clientId = user.companyId;
            }
            if (['bco', 'dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to create quote');
            } else {
                quote = await models.Quote.create(
                    {
                        ...body,
                        createdById: user.id,
                    },
                    {
                        transaction: tr,
                        include: [
                            {
                                model: models.Container,
                                as: 'container',
                            },
                        ],
                    },
                );
            }
            await tr.commit();
            const resp = await getExpandedQuoteById(quote.name);
            res.json(resp);
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    updateQuote: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let quote;
            if (user.role === 'bco') {
                body.clientId = user.companyId;
            }
            if (['bco', 'dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update quote');
            } else {
                quote = await models.Quote.findById(body.name);
                await quote.updateAttributes(body, {
                    transaction: tr,
                });

                // containers
                const containers = await quote.getContainer();
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
                        await quote.addContainer(handler, {
                            transaction: tr,
                        });
                    }
                }));

                await tr.commit();
                const resp = await getExpandedQuoteById(quote.name);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    proposeForQuote: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let container;
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to provide quote');
            } else {
                container = await models.Container.findById(body.id);
                await container.updateAttributes(
                    {
                        quotedAmt: body.amount,
                    },
                    {
                        transaction: tr,
                    },
                );

                // quote status
                const quote = await container.getQuote();

                await tr.commit();
                const resp = await getExpandedQuoteById(quote.name);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    releaseQuote: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let quote;
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to provide quote');
            } else {
                quote = await models.Quote.findById(body.id);

                await quote.updateAttributes(
                    {
                        status: 'Quoted',
                    },
                    {
                        transaction: tr,
                    },
                );
                await tr.commit();
                const resp = await getExpandedQuoteById(quote.name);
                //send email first:
                const emailObj = {};
                emailObj.quotationNo = resp.name;
                emailObj.quoteDate = moment(resp.createdAt).day;
                emailObj.instruction = resp.remarks;
                emailObj.client = _.get(resp, 'client.name');
                emailObj.containers = [];
                let total = 0;
                _.map(resp.container, con => {
                    const container = {
                        containerSeqNo: con.seqNo,
                        totalCharge: parseFloat(con.quotedAmt || 0)
                            .toFixed(2),
                        reqDelvDate: moment(con.deliveryDate)
                            .format('MM/DD/YYYY'),
                        pickupFrom: _.get(con, 'pickupFromLocation.name'),
                        deliverTo: _.get(con, 'deliverToLocation.name'),
                        containerType: con.type,
                        options: 'haz',
                        grossWeight: con.grossWeight,
                    };
                    total += parseFloat(con.quotedAmt || 0);
                    emailObj.containers.push(container);
                });
                emailObj.total = parseFloat(total)
                    .toFixed(2);
                emailHelper.sendQuoteNotification(
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
};
