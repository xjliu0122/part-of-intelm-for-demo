const util = require(`${global.appRoot}/util`);
const admin = require('firebase-admin');
const axios = require('axios');
const _ = require('lodash');

const models = require(`${global.appRoot}/models`);

// init firebase.

const serviceAccount = global.appConfig.firebase;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Authorization Middlewares

module.exports = {
    verifyEmail: (req, res) => {
        const apiKey = _.get(req.query, 'apiKey');
        const oobCode = _.get(req.query, 'oobCode');
        const continueUrl = _.get(req.query, 'redirectUrl');
        res.send(`<!doctype html>
        <html lang="en">        
        <head>
            <title>IntelModal</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">                
        </head>        
        <body>
            <h1 id="root"></h1>
            <script src="https://www.gstatic.com/firebasejs/5.4.1/firebase.js"></script>
            <script>
                function handleVerifyEmail(auth, actionCode, continueUrl) {
                   
                    auth.applyActionCode(actionCode).then(function(resp) {
                        document.getElementById('root').innerHTML += 'Email Verified!';
                        setTimeout(function(){ window.location = continueUrl; }, 3000);
                        
                    }).catch(function(error) {
                        document.getElementById('root').innerHTML += 'Opps there is something wrong! <br /> Please resend your verification email from login page and try again.';
                    });
                }
                document.addEventListener('DOMContentLoaded', function () {
                    // Get the one-time code from the query parameter.
                    var actionCode = "${oobCode}";
                    // (Optional) Get the API key from the query parameter.
                    var apiKey = "${apiKey}";                  
                    var continueUrl = "${continueUrl}";  
                   
                    var config = {
                        'apiKey': apiKey
                    };
                    var app = firebase.initializeApp(config);
                    var auth = app.auth();        
                    handleVerifyEmail(auth, actionCode, continueUrl);
                }, false);
            </script>           
        </body>
        </html>`);
    },
    isAuthenticated: (req, res, next) => {
        const idToken = req.headers.authorization;
        admin
            .auth()
            .verifyIdToken(idToken)
            .then(decodedToken => {
                const uid = decodedToken.uid;
                req.uid = uid;
                next();
            })
            .catch(error => {
                res.status(401)
                    .send();
            });
    },
    getUserToReq: (req, res, next) => {
        models.User.findOne({
            where: { uid: req.uid },
        })
            .then(user => {
                if (!user) {
                    util.throwApiException('User does not exist');
                } else {
                    req.user = user;
                    next();
                }
            })
            .catch(err => {
                util.throwApiException(err.message);
            });
    },
    qboAuthorization: async (req, res, next) => {
        const authObj = req.user.dataValues.miscFields;
        // 1. check access token expired or not.
        const now = new Date()
            .getTime();
        const aTokenExp = parseInt(authObj.accessTokenExpire, 0);
        const rTokenExp = parseInt(authObj.refreshTokenExpire, 0);

        if (rTokenExp - now < 300000) {
            res.status(400)
                .json({
                    ErrorMessage:
                    'Please authroize Intelmodal to access your QBO Account ',
                });
        }
        // give 5 mins gap. otherwise get a new access token
        if (aTokenExp - now < 300000000) {
            const authKey =
                    'Q0Kzz98oNIkJzB7UYcsadlSyonONr768bzY5g1cHfCViSEFNnB' +
                    ':' +
                    'Qa92f4AfoGJer9OsmtqfBPtZRvE9ql6uO9GIgBS0',
                authKeyBase64 = Buffer.from(authKey)
                    .toString('base64');
            axios({
                headers: {
                    Authorization: `Basic ${authKeyBase64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                url:
                    'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer ',
                method: 'post',
                data: `grant_type=refresh_token&refresh_token=${
                    authObj.refreshToken
                }`,
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

                    await req.user.updateAttributes({
                        miscFields: authToUpdate,
                    });
                    await req.user.reload();
                    next();
                })
                .catch(err => {
                    res.status(400)
                        .json({
                            ErrorMessage:
                            'Please authroize Intelmodal to access your QBO Account ',
                        });
                });
        }
    },
    isAdmin: (req, res, next) => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(400)
                .json({
                    message: 'You are not authorized to do this action',
                });
        }
    },
    isIM: (req, res, next) => {
        if (req.user.role === 'dispatcher') {
            next();
        } else {
            res.status(400)
                .json({
                    message: 'You are not authorized to do this action',
                });
        }
    },
};
