const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');

const Op = models.Sequelize.Op;

module.exports = {
    getTruckingCompaniesByCoordinates: async (req, res, next) => {
        try {
            const user = req.user;
            const filter = req.body;
            const anchorCoordinates = filter.coordinates;
            const anchorLocation = models.sequelize.literal(`ST_GeomFromText('POINT(${anchorCoordinates[0]} ${
                anchorCoordinates[1]
            })')`);
            const distanceValue = models.sequelize.fn(
                'CT_distance',
                models.sequelize.col('garageAddress.coordinates'),
                anchorLocation,
            );
            const attributes = Object.keys(models.GeoLocation.attributes);
            attributes.push([distanceValue, 'distance']);

            if (user.role === 'dispatcher') {
                const tcs = await models.Company.findAll({
                    where: {
                        active: true,
                        suspended: { [Op.not]: true },
                        type: {
                            [Op.in]: ['Trucking Company', 'Owner Operator'],
                        },
                    },
                    include: [
                        {
                            model: models.CarrierStateAreas,
                            as: 'operationStateArea',
                            ...(filter.portId
                                ? {
                                    where: {
                                        type: 'area',
                                        portId: filter.portId,
                                    },
                                }
                                : {}),
                        },
                        {
                            model: models.GeoLocation,
                            as: 'garageAddress',
                            attributes,
                            order: [['distance']],
                            where: models.sequelize.where(distanceValue, {
                                [Op.lte]: filter.distance,
                            }),
                        },
                        {
                            model: models.CarrierInfo,
                            as: 'carrierInfo',
                        },
                        {
                            model: models.User,
                            as: 'user',
                        },
                    ],
                });
                // get bids for included trips

                const bids = await models.BidRequest.findAll({
                    where: {
                        tripId: {
                            [Op.in]: filter.tripIds,
                        },
                    },
                });

                // set bids to each driver
                const result = [];
                _.map(tcs, tc => {
                    result.push({
                        ...tc.dataValues,
                        bids: _.filter(bids, bid => bid.companyId === tc.id),
                    });
                });

                res.json(result);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    },
    searchTCByText: async (req, res, next) => {
        const { searchText } = req.body;

        if (!searchText) return res.json([]);

        const tcs = await models.Company.findAll({
            where: {
                name: { [Op.like]: `%${searchText}%` },
                type: {
                    [Op.in]: ['Trucking Company', 'Owner Operator'],
                },
            },
        });
        const result = [];
        _.map(tcs, tc => {
            result.push({
                id: tc.id,
                name: tc.name,
            });
        });
        res.json(result);
    },
    getAllTruckingCompanies: async (req, res, next) => {
        try {
            const user = req.user;
            if (user.role === 'dispatcher') {
                const tcs = await models.Company.findAll({
                    where: {
                        type: {
                            [Op.in]: ['Trucking Company', 'Owner Operator'],
                        },
                    },
                    include: [
                        {
                            model: models.GeoLocation,
                            as: 'geoLocation',
                        },
                        {
                            model: models.CarrierStateAreas,
                            as: 'operationStateArea',
                        },
                        {
                            model: models.CarrierInfo,
                            as: 'carrierInfo',
                        },
                        {
                            model: models.User,
                            as: 'user',
                        },
                    ],
                });

                res.json(tcs);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    },
};
