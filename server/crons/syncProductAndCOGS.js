// IntelModal Sync Products and COGS Accounts

// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const models = require('../models');
const Util = require('./util');

const Op = models.Sequelize.Op;

const findServices = async () => {
    const conf = Util.getQboAxiosConfig("/query?query=select * from Item Where Type='Service'");

    try {
        const resp = await axios({
            ...conf,
            method: 'GET',
            'Content type': 'text/plain',
        });

        if (resp.status === 200) {
            return _.get(resp, 'data.QueryResponse.Item') || [];
        }
    } catch (err) {
        console.error(err);
    }
};

const findCOGS = async () => {
    const conf = Util.getQboAxiosConfig("/query?query=select * from Account Where AccountType='Cost of Goods Sold'");

    try {
        const resp = await axios({
            ...conf,
            method: 'GET',
            'Content type': 'text/plain',
        });

        if (resp.status === 200) {
            return _.get(resp, 'data.QueryResponse.Account') || [];
        }
    } catch (err) {
        console.error(err);
    }
};

// now do the actual job.
const doWork = async () => {
    try {
        // 0. get service credentials.
        await Util.getAuthObject();
        //1. sync COGS.
        const accounts = await findCOGS();
        if (_.size(accounts) > 0) {
            await Promise.all(_.map(accounts, async acc => {
                // if exist, just update
                const oAcc = await models.QBOProduct.find({
                    where: {
                        name: _.get(acc, 'Name'),
                        type: 'COGS',
                    },
                });
                if (oAcc) {
                    await oAcc.updateAttributes({
                        type: 'COGS',
                        qboId: _.get(acc, 'Id'),
                        name: _.get(acc, 'Name'),
                    });
                } else {
                    await models.QBOProduct.create({
                        type: 'COGS',
                        qboId: _.get(acc, 'Id'),
                        name: _.get(acc, 'Name'),
                    });
                }
            }));
        }

        //2. sync sales service.
        const services = await findServices();
        if (_.size(services) > 0) {
            await Promise.all(_.map(services, async src => {
                // if exist, just update
                const oSrc = await models.QBOProduct.find({
                    where: {
                        name: _.get(src, 'Name'),
                        type: 'Service',
                    },
                });
                if (oSrc) {
                    await oSrc.updateAttributes({
                        type: 'Service',
                        qboId: _.get(src, 'Id'),
                        name: _.get(src, 'Name'),
                    });
                } else {
                    await models.QBOProduct.create({
                        type: 'Service',
                        qboId: _.get(src, 'Id'),
                        name: _.get(src, 'Name'),
                    });
                }
            }));
        }

        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
