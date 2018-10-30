const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const admin = require('firebase-admin');
const _ = require('lodash');
const emailHelper = require('../emailHelper');
const controller = require('../index');

module.exports = {
    getUserById: async (req, res, next) => {
        try {
            const user = await models.User.findOne({
                where: { uid: req.params.id },
            });
            if (!user) {
                util.throwApiException('User does not exist');
            }
            res.send(user);
        } catch (err) {
            next(err);
        }
    },
    getAllUsers: async (req, res, next) => {
        try {
            const users = await models.User.findAll({
                where: {
                    companyId: req.user.companyId,
                },
            });
            res.send(users);
        } catch (err) {
            next(err);
        }
    },
    deleteUserById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await models.User.findOne({
                where: { id },
            });
            if (!user) {
                util.throwApiException('User not found');
            } else {
                delete user.isAdmin;
                await user.updateAttributes({
                    active: false,
                });

                res.send(user.id);
            }
        } catch (err) {
            next(err);
        }
    },

    getUserInfo: async (req, res, next) => {
        try {
            const user = req.user;
            if (req.query.token) {
                const currentToken = user.mobilePushToken;
                if (!_.isEqual(currentToken, req.query.token)) {
                    // update
                    await user.updateAttributes({
                        mobilePushToken: req.query.token,
                    });
                }
            }
            const company = await user.getCompany({
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
            });
            res.send({
                ...user.dataValues,
                company,
            });
        } catch (err) {
            next(err);
        }
    },
    createUser: async (req, res, next) => {
        try {
            const { body } = req;
            const Op = models.Sequelize.Op;
            let user = await models.User.findOne({
                where: { [Op.or]: [{ uid: body.uid }, { email: body.email }] },
            });
            if (user) {
                util.throwApiException('User exists already.');
            } else {
                delete body.isAdmin;
                user = await models.User.create({
                    ...body,
                });
                res.send();
            }
        } catch (err) {
            next(err);
        }
    },
    createMCUserAndCompany: async (req, res, next) => {
        try {
            const { body } = req;
            const Op = models.Sequelize.Op;

            let user = await models.User.findOne({
                where: { [Op.or]: [{ uid: body.uid }, { email: body.email }] },
            });
            if (user) {
                util.throwApiException('User exists already.');
            } else {
                // first to create firebase User.
                const firebaseUser = await admin.auth()
                    .createUser({
                        email: body.email,
                        emailVerified: false,
                        password: body.password,
                        disabled: false,
                    });

                if (firebaseUser) {
                    // local user
                    user = await models.User.create({
                        uid: firebaseUser.uid,
                        name: body.userName,
                        role: 'tc',
                        isAdmin: true,
                        email: body.email,
                        phone: body.phone,
                    });
                    //create company
                    await controller.company.createCompany(
                        req,
                        res,
                        next,
                        user,
                    );
                    res.send();
                }
            }
        } catch (err) {
            res.status(400)
                .json({ code: err.code, message: err.message });
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const { body } = req;
            const { id } = req.user;
            const user = await models.User.findOne({
                where: { id: _.get(body, 'id') || id },
            });
            if (!user) {
                util.throwApiException('User not found');
            } else {
                await user.updateAttributes({
                    ...body,
                });
                await user.reload();
                res.send(user);
            }
        } catch (err) {
            next(err);
        }
    },
    inviteUser: async (req, res, next) => {
        try {
            const { body, user } = req;
            const invitedUser = await models.User.findOne({
                where: { email: body.email },
            });
            // if (invitedUser) {
            //     util.throwApiException('User already registered in our system.');
            // } else {

            const inviter = user;
            const existingInvitation = await models.UserInvitation.findOne({
                where: { email: body.email },
            });

            if (existingInvitation) await existingInvitation.destroy();
            const code = Math.floor(Math.random() * 900000) + 100000;
            await models.UserInvitation.create({
                email: body.email,
                code, // generate 6 digits number
                company: inviter.companyId,
            });
            await emailHelper.sendInviteUserEmail(
                inviter.name,
                body.email,
                code,
            );
            res.send();
            // }
        } catch (err) {
            next(err);
        }
    },
};
