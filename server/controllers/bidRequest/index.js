const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');
const TripController = require('../trip/index');
const notificationHelper = require('../notificationHelper');

const Op = models.Sequelize.Op;

module.exports = {
    requestBids: async (req, res, next) => {
        const transaction = await models.sequelize.transaction();
        try {
            const user = req.user;
            const data = req.body;

            if (user.role === 'dispatcher') {
                // get existing bids for included trips
                const existingBids = await models.BidRequest.findAll({
                    where: {
                        tripId: {
                            [Op.in]: data.trips,
                        },
                        companyId: data.driverCompanyId,
                    },
                });

                // handle new bid request
                _.map(data.trips, trip => {
                    const handler = _.find(
                        existingBids,
                        bid => bid.tripId === trip,
                    );
                    if (handler) {
                        _.pull(data.trips, handler.tripId);
                    }
                });

                // only create bid for trips which tc was never request for bid for
                await models.BidRequest.bulkCreate(
                    _.map(data.trips, trip => {
                        return {
                            requestedByIM: true,
                            companyId: data.driverCompanyId,
                            tripId: trip,
                        };
                    }),
                    { transaction },
                );

                // send notification
                const driverUser = await models.User.findOne({
                    where: { companyId: data.driverCompanyId },
                });
                if (driverUser.mobilePushToken) {
                    await notificationHelper.send(
                        driverUser.mobilePushToken,
                        'You have new bid requests',
                    );
                }
                await transaction.commit();
            }
            res.json([]);
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    },
    getBidRequestsByStatus: async (req, res, next) => {
        //const results = [];
        try {
            const user = req.user;
            const companyId = user.companyId;
            const data = req.body;
            let addtionalFilter = {};
            if (data.requestedByIM) {
                addtionalFilter = {
                    requestedByIM: true,
                };
            }
            let bids = [];
            if (user.role === 'tc') {
                // get bids for current user
                bids = await models.BidRequest.findAll({
                    order: [
                        [
                            { model: models.Trip, as: 'trip' },
                            'estimatedStartTime',
                            'ASC',
                        ],
                        [
                            { model: models.Trip, as: 'trip' },
                            { model: models.Stop, as: 'stop' },
                            'stopNo',
                            'ASC',
                        ],
                    ],
                    where: {
                        status: data.status,
                        ...addtionalFilter,
                        companyId,
                    },

                    include: [
                        {
                            model: models.Trip,
                            as: 'trip',
                            required: true,
                            where: {
                                assigneeId: data.assigneeId || null,
                                estimatedStartTime: {
                                    [Op.gte]: moment()
                                        .startOf('day')
                                        .toString(),
                                },
                            },
                            include: [
                                {
                                    model: models.Location,
                                    as: 'startGeoLocation',
                                    include: ['geoLocation'],
                                },
                                {
                                    model: models.Location,
                                    as: 'endGeoLocation',
                                    include: ['geoLocation'],
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
                        },
                    ],
                });
            }
            res.json(bids);
        } catch (err) {
            next(err);
        }
    },
    submitBidForRequest: async (req, res, next) => {
        const transaction = await models.sequelize.transaction();
        try {
            const user = req.user;
            const data = req.body;

            if (user.role === 'tc') {
                // get existing bid request
                const request = await models.BidRequest.findOne({
                    where: {
                        id: data.requestId,
                    },
                    include: ['trip'],
                });
                if (request) {
                    await request.updateAttributes(
                        {
                            amount: data.amount,
                            status: _.get(request, 'trip.fixedAmount')
                                ? 'Accepted'
                                : 'Bid',
                        },
                        { transaction },
                    );
                }

                await transaction.commit();
            } else {
                util.throwApiException('You are not allowed for this API');
            }
            res.send(data.requestId);
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    },
    rejectBidRequest: async (req, res, next) => {
        const transaction = await models.sequelize.transaction();
        try {
            const user = req.user;
            const { id } = req.params;

            if (user.role === 'tc') {
                // get existing bid request
                const request = await models.BidRequest.findOne({
                    where: {
                        id,
                    },
                });
                if (request) {
                    await request.updateAttributes(
                        {
                            amount: 0,
                            status: 'Rejected',
                        },
                        { transaction },
                    );
                }

                await transaction.commit();
            } else {
                util.throwApiException('You are not allowed for this API');
            }
            res.send(id);
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    },
    withdrawBid: async (req, res, next) => {
        const transaction = await models.sequelize.transaction();
        try {
            const user = req.user;
            const { id } = req.params;

            if (user.role === 'tc') {
                // get existing bid request
                const request = await models.BidRequest.findOne({
                    where: {
                        id,
                    },
                });
                if (request) {
                    await request.updateAttributes(
                        {
                            amount: 0,
                            status: 'Sent',
                        },
                        { transaction },
                    );
                }

                await transaction.commit();
            } else {
                util.throwApiException('You are not allowed for this API');
            }
            res.send(id);
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    },
    setAsRead: async (req, res, next) => {
        const transaction = await models.sequelize.transaction();
        try {
            const user = req.user;
            const { id } = req.params;

            if (user.role === 'tc') {
                // get existing bid request
                const request = await models.BidRequest.findOne({
                    where: {
                        id,
                    },
                });
                if (request) {
                    await request.updateAttributes(
                        {
                            unread: false,
                        },
                        { transaction },
                    );
                }

                await transaction.commit();
            } else {
                util.throwApiException('You are not allowed for this API');
            }
            res.send(id);
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    },
};
