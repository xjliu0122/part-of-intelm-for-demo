const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const models = require(`${global.appRoot}/models`);
const express = require('express');
const isAuthenticated = require('./auth').isAuthenticated;
const axios = require('axios');
const getUserToReq = require('./auth').getUserToReq;

const composeAuthURL = (req, res) => {
    const user = req.user;
    const url = `${global.appConfig.qboAuthUrl}${user.id}`;

    //
    res.json({ url });
};
const persistQBOTokens = (req, res) => {
    const authKey = global.appConfig.qboAuthKey,
        authKeyBase64 = Buffer.from(authKey)
            .toString('base64');
    axios({
        headers: {
            Authorization: `Basic ${authKeyBase64}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
        method: 'post',
        data:
            `grant_type=authorization_code&code=${
                req.query.code
            }&redirect_uri=${global.appConfig.qboRedirectUrl}`,
    })
        .then(async response => {
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
            if (req.query.state) {
                await models.User.update(
                    { miscFields: authToUpdate },
                    {
                        where: { id: req.query.state },
                    },
                );
                res.send('authoriazted.');
            }
        })
        .catch(error => {
            console.log(error);
            res.send('not authorizaed. please try again.');
        });
};
const router = express.Router();
router.get('/getAuthUrl', isAuthenticated, getUserToReq, composeAuthURL);
router.get('/callback', persistQBOTokens);

module.exports = router;
