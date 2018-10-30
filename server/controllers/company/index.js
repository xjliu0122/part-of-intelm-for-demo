const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const qbHelper = require('../qbHelper');
const emailHelper = require('../emailHelper');

const Op = models.Sequelize.Op;

const determineUserRole = company => {
    let role;
    switch (company.type) {
        case 'Owner Operator':
            role = 'tc';
            break;
        case 'Trucking Company':
            role = 'tc';
            break;
        case 'Dispatcher':
            role = 'dispatcher';
            break;
        default:
            role = 'bco';
            break;
    }
    return role;
};
module.exports = {
    getAllBCO: async (req, res, next) => {
        try {
            const user = req.user;
            if (user.role === 'dispatcher') {
                const bcos = await models.Company.findAll({
                    where: {
                        type: {
                            [Op.notIn]: ['Trucking Company', 'Owner Operator'],
                        },
                    },
                });
                const result = [];
                _.map(bcos, bco => {
                    result.push(bco.dataValues);
                });
                res.json(result);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    },
    searchClients: async (req, res, next) => {
        try {
            const { user, body } = req;
            const whereCond = {};
            if (body.term) {
                whereCond.name = {
                    [Op.like]: `%${body.term}%`,
                };
            }
            if (body.type === 'BCO') {
                whereCond.type = {
                    [Op.notIn]: ['Trucking Company', 'Owner Operator'],
                };
            } else {
                whereCond.type = {
                    [Op.in]: ['Trucking Company', 'Owner Operator'],
                };
            }
            if (user.role === 'dispatcher') {
                const clients = await models.Company.findAll({
                    where: {
                        ...whereCond,
                    },
                });
                const result = [];
                _.map(clients, client => {
                    result.push(client.dataValues);
                });
                res.json(result);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    },
    getAllUsersByClient: async (req, res, next) => {
        try {
            const { user, params } = req;

            if (user.role === 'dispatcher') {
                const users = await models.User.findAll({
                    where: {
                        companyId: params.id,
                    },
                });

                res.json(users);
            } else {
                res.json([]);
            }
        } catch (err) {
            next(err);
        }
    },
    createCompany: async (req, res, next, mcUser = null) => {
        const tr = await models.sequelize.transaction();
        try {
            let { body } = req;
            const Op = models.Sequelize.Op;
            let company = await models.Company.findOne({
                where: {
                    [Op.or]: [{ name: body.name }, { taxId: body.taxId }],
                },
            });
            if (company) {
                util.throwApiException('Company exists already.');
            } else {
                const operationArea = [];
                const operationState = [];
                const uid = mcUser ? mcUser.uid : req.uid;
                let user;
                if (!mcUser) {
                    user = await models.User.findOne({
                        where: { uid },
                    });
                }

                if (
                    ['Trucking Company', 'Owner Operator'].indexOf(body.type) !== -1
                ) {
                    _.map(body.stateServed, val => {
                        if (val) {
                            operationState.push({
                                type: 'state',
                                name: val,
                                miscFields: {},
                            });
                        }
                    });

                    _.map(body.operationArea, val => {
                        if (val) {
                            operationArea.push({
                                type: 'area',
                                portId: val,
                                miscFields: {},
                            });
                        }
                    });
                } else {
                    body = _.omit(body, 'carrierInfo');
                }

                // populate initial payment/billing address using company data.

                const accAddressObj = _.pick(body, [
                    'name',
                    'phone',
                    'fax',
                    'email',
                ]);
                accAddressObj.address = body.address.address;
                accAddressObj.sameAsCompany = true;

                const accSettingObj = {
                    creditLimit: 1000,
                    status: 'pending approval',
                    statusUpdatedByUser: true,
                };
                let garageAddress = {};
                if (body.garageAddress) {
                    garageAddress = {
                        ...body.garageAddress,
                        coordinates: {
                            type: 'Point',
                            coordinates: [
                                body.garageAddress.lat,
                                body.garageAddress.lng,
                            ],
                        },
                    };
                }
                company = await models.Company.create(
                    {
                        ...body,
                        suspended: true,
                        geoLocation: {
                            ...body.address,
                            coordinates: {
                                type: 'Point',
                                coordinates: [
                                    body.address.lat,
                                    body.address.lng,
                                ],
                            },
                        },
                        ...garageAddress,
                        address: body.address.address,
                        operationStateArea: _.merge(
                            operationArea,
                            operationState,
                        ),
                        billingAddress: {
                            ...accAddressObj,
                            type: 'billing',
                        },
                        paymentAddress: {
                            ...accAddressObj,
                            type: 'payment',
                        },
                        accSetting: accSettingObj,
                    },
                    {
                        transaction: tr,
                        include: [
                            {
                                model: models.GeoLocation,
                                as: 'geoLocation',
                            },
                            {
                                model: models.GeoLocation,
                                as: 'garageAddress',
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
                                model: models.AccAddress,
                                as: 'billingAddress',
                            },
                            {
                                model: models.AccAddress,
                                as: 'paymentAddress',
                            },
                            {
                                model: models.AccSetting,
                                as: 'accSetting',
                            },
                        ],
                    },
                );
                //sendIMNewBCOMCNotification

                emailHelper.sendIMNewBCOMCNotification(
                    _.get(company, 'name'),
                    _.get(company, 'type'),
                );

                if (!mcUser) {
                    await user.setCompany(company, { transaction: tr });
                    user.role = determineUserRole(company);
                    await user.save({ transaction: tr });
                    await tr.commit();
                    res.json(util.successfulResponse('Company created successfully'));
                } else {
                    await mcUser.setCompany(company, { transaction: tr });
                    await tr.commit();
                }
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    updateCompanyAddressInfo: async (req, res, next) => {
        const { body } = req;
        try {
            const addressInfo = await models.AccAddress.findOne({
                where: { id: body.id },
            });
            await addressInfo.updateAttributes({
                ...body,
            });
            res.json(util.successfulResponse('Address updated successfully'));
        } catch (err) {
            next(err);
        }
    },
    updateCompany: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        let { body } = req;
        try {
            const company = await models.Company.findOne({
                where: { id: body.id },
            });
            if (!company) {
                util.throwApiException('Cannot find company'); // should never happen
            }

            const operationStateArea = [];
            const user = req.user;

            if (
                user.role === 'tc'
                // ['Trucking Company', 'Owner Operator'].indexOf(body.type) !== -1
            ) {
                _.map(body.stateServed, val => {
                    if (val) {
                        operationStateArea.push({
                            type: 'state',
                            name: val,
                            miscFields: {},
                        });
                    }
                });

                _.map(body.operationArea, val => {
                    if (val) {
                        operationStateArea.push({
                            type: 'area',
                            portId: val,
                            miscFields: {},
                        });
                    }
                });

                await models.CarrierStateAreas.destroy({
                    where: { companyId: company.id },
                    transaction: tr,
                });
                const operationStateCreated = await models.CarrierStateAreas.bulkCreate(
                    operationStateArea,
                    {
                        transaction: tr,
                    },
                );

                await company.setOperationStateArea(operationStateCreated, {
                    transaction: tr,
                });
            } else {
                body = _.omit(body, 'carrierInfo');
            }
            if (body.address) {
                const geoLocation = await models.GeoLocation.findById(company.geoLocationId);
                await geoLocation.updateAttributes(
                    {
                        ...body.address,
                        coordinates: {
                            type: 'Point',
                            coordinates: [body.address.lat, body.address.lng],
                        },
                    },
                    { transaction: tr },
                );
            }
            if (body.carrierInfo) {
                const carrierInfo = await models.CarrierInfo.findOne({
                    where: { companyId: body.id },
                });
                await carrierInfo.updateAttributes(
                    {
                        ...body.carrierInfo,
                    },
                    { transaction: tr },
                );
            }
            if (body.address) body.address = body.address.address;
            await models.Company.update(
                {
                    ..._.omit(body, 'id'),
                },
                {
                    transaction: tr,
                    where: { id: body.id },
                },
            );
            await tr.commit();
            res.json(util.successfulResponse('Company updated successfully'));
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    joinCompany: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        const { body, user } = req,
            { code } = body;
        try {
            const invitation = await models.UserInvitation.findOne({
                where: { email: user.email },
            });
            if (!invitation) {
                util.throwApiException('Wrong code, please ask your administrator to send you a new one.');
            }
            if (invitation.code === code) {
                if (!invitation.company) throw new Error('');
                const company = await models.Company.findOne({
                    where: { id: invitation.company },
                });
                if (!company) throw new Error('');
                await user.updateAttributes(
                    {
                        role: determineUserRole(company),
                        companyId: company.id,
                        isAdmin: false,
                    },
                    { transaction: tr },
                );
                await invitation.destroy({ transaction: tr });
                await tr.commit();
                res.json(util.successfulResponse('Joined company successfully'));
            } else {
                util.throwApiException('Wrong code, please ask your administrator to send you a new one.');
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
};
