const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');

const Op = models.Sequelize.Op;
module.exports = {
    getAll: async (req, res, next) => {
        try {
            let companyId;
            if (req.params.id) {
                companyId = req.params.id;
            } else {
                companyId = req.user.companyId;
            }

            const locConditions = {};
            if (req.user.role !== 'dispatcher') {
                locConditions.type = { [Op.notIn]: ['Business'] };
            }
            const locations = await models.Location.findAll({
                where: {
                    [Op.or]: [
                        {
                            managedByCompanyId: global.appConfig.IMCompanyId,
                            active: true,
                            ...locConditions,
                        },
                        {
                            managedByCompanyId: companyId,
                            active: true,
                        },
                    ],
                },
                include: ['geoLocation', 'createdBy', 'managedByCompany'],
                order: [['createdAt', 'DESC']],
            });
            res.json(locations);
        } catch (err) {
            next(err);
        }
    },
    getAllPorts: async (req, res, next) => {
        try {
            const locations = await models.Location.findAll({
                where: {
                    type: 'OCEANPORT',
                },
                order: [['name', 'DESC']],
            });
            res.json(locations);
        } catch (err) {
            next(err);
        }
    },
    createLocation: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            // create location now

            // first, check if same name exist
            const oldLocation = await models.Location.findOne({
                where: { name: body.name, managedByCompanyId: user.companyId },
            });
            if (oldLocation) {
                util.throwApiException('Duplicate location Found. Please use a different name');
                // res
                //     .status(500)
                //     .send({
                //         ErrorMessage:
                //             'Duplicate Business Found. Please use a different name',
                //     });

                return;
            }
            const newLocation = await models.Location.create(
                {
                    ...body,
                    geoLocation: {
                        ...body.address,
                        coordinates: {
                            type: 'Point',
                            coordinates: [body.address.lat, body.address.lng],
                        },
                    },
                    address: body.address.address,
                    type: body.locationType,
                },
                {
                    transaction: tr,
                    include: [
                        {
                            model: models.GeoLocation,
                            as: 'geoLocation',
                        },
                    ],
                },
            );
            const company = await models.Company.findOne({
                where: {
                    id: user.companyId,
                },
            });
            newLocation.setManagedByCompany(company);
            newLocation.setCreatedBy(user);

            await tr.commit();
            await newLocation.reload({
                include: [
                    {
                        model: models.GeoLocation,
                        as: 'geoLocation',
                    },
                    {
                        model: models.Company,
                        as: 'managedByCompany',
                    },
                    {
                        model: models.User,
                        as: 'createdBy',
                    },
                ],
            });
            res.json(newLocation);
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    updateLocation: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            await models.Location.update(
                {
                    ..._.omit(body, 'id'),
                    address: body.address.address,
                    type: body.locationType,
                },
                { returning: true, where: { id: body.id }, transaction: tr },
            );
            let newLocation = await models.Location.findOne({
                where: {
                    id: body.id,
                },
            });
            const geoLocation = await newLocation.getGeoLocation();
            await geoLocation.updateAttributes(
                {
                    ..._.omit(body.address, 'id'),
                    coordinates: {
                        type: 'Point',
                        coordinates: [body.address.lat, body.address.lng],
                    },
                },
                { transaction: tr },
            );

            await newLocation.setGeoLocation(geoLocation, {
                transaction: tr,
            });
            await tr.commit();
            newLocation = await models.Location.findOne({
                where: {
                    id: body.id,
                },
                include: [
                    {
                        model: models.GeoLocation,
                        as: 'geoLocation',
                    },
                    {
                        model: models.Company,
                        as: 'managedByCompany',
                    },
                    {
                        model: models.User,
                        as: 'createdBy',
                    },
                ],
            });
            res.json(newLocation);
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    deleteLocation: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const location = await models.Location.findOne({
                where: {
                    id: body.id,
                },
            });
            //const geoLocation = await location.getGeoLocation();

            //delete location
            await location.updateAttributes(
                { active: false },
                { transaction: tr },
            );
            //await geoLocation.destroy({ transaction: tr });

            await tr.commit();

            res.json({ id: body.id });
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
};
