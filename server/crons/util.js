// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const models = require('../models');

const Op = models.Sequelize.Op;
const getAuthToken = async user => {
    const authObj = user.dataValues.miscFields;
    // 1. check access token expired or not.
    const now = new Date()
        .getTime();
    const aTokenExp = parseInt(authObj.accessTokenExpire, 0);
    const rTokenExp = parseInt(authObj.refreshTokenExpire, 0);

    if (rTokenExp - now < 300000) {
        // log
    }
    // give 5 mins gap. otherwise get a new access token
    if (aTokenExp - now < 300000) {
        const authKey = global.appConfig.qboAuthKey,
            authKeyBase64 = Buffer.from(authKey)
                .toString('base64');
        const response = await axios({
            headers: {
                Authorization: `Basic ${authKeyBase64}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer ',
            method: 'post',
            data: `grant_type=refresh_token&refresh_token=${
                authObj.refreshToken
            }`,
        });

        const { data } = response;
        data.expires_in *= 1000;
        data.x_refresh_token_expires_in *= 1000;
        const date = new Date()
            .getTime();
        const authToUpdate = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpire: (date + data.expires_in).toString(),
            refreshTokenExpire: (
                date + data.x_refresh_token_expires_in
            ).toString(),
        };
        await user.updateAttributes({
            miscFields: authToUpdate,
        });
        await user.reload();
        return authToUpdate.accessToken;
    }
    return authObj.accessToken;
};
module.exports = {
    getAuthToken,
    getAuthObject: async () => {
        const serviceUser = await models.User.findOne({
            where: {
                role: 'dispatcher',
                isAdmin: true,
                'miscFields.accessToken': {
                    [Op.ne]: null,
                },
            },
        });
        global.accessToken = await getAuthToken(serviceUser);
    },
    getQboAxiosConfig: (path, token) => {
        return {
            headers: {
                Accept: 'application/json',
                Authorization: token
                    ? `bearer ${token}`
                    : `bearer ${global.accessToken}`,
            },
            url: `${global.appConfig.qboBaseURL ||
                'https://sandbox-quickbooks.api.intuit.com/v3/company/'}${
                global.appConfig.qboCompanyId
            }${path}`,
        };
    },
};
