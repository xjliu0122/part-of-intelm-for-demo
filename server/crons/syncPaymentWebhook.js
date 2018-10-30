// IntelModal Sync QBO Vendors to Local

// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const models = require('../models');
const Util = require('./util');
const Config = require('../controllers/qbHelper/config');

const Op = models.Sequelize.Op;
const getQboPaymentById = async id => {
    const config = await Util.getQboAxiosConfig(`/bill/${id}`);

    try {
        const resp = await axios({
            ...config,
            method: 'GET',
        });
        const invoice = _.get(resp, 'data.Bill');
        return invoice;
    } catch (err) {
        return null;
    }
};
const getBillsFromWebHooks = async () => {
    const results = [];
    try {
        const notifsdb = await models.QboNotification.findAll({
            where: {
                type: 'Bill',
            },
        });
        if (_.size(notifsdb) > 0) {
            let notifs = [];
            await Promise.all(_.map(notifsdb, async notifdb => {
                if (notifdb.operation === 'Delete') {
                    // delete invoice .
                    await models.ContainerAP.destroy({
                        where: {
                            qboDocNo: notifdb.qboId,
                        },
                    });
                    await notifdb.destroy();
                } else if (notifdb.operation === 'Update') {
                    notifs.push(notifdb.qboId);
                } else {
                    // do not process Create event
                    await notifdb.destroy();
                }
            }));
            notifs = _.uniqBy(notifs, e => e); //updated

            await Promise.all(_.map(notifs, async notif => {
                results.push(await getQboPaymentById(notif));
            }));
        }
    } catch (err) {
        console.error(err);
    }
    return results;
};

// now do the actual job.
const doWork = async () => {
    try {
        // 0. get service credentials.
        await Util.getAuthObject();
        const bills = await getBillsFromWebHooks();
        await Promise.all(_.map(bills, async bill => {
            // update local entries
            if (bill) {
                const localAPs = await models.ContainerAP.findAll({
                    where: { qboDocNo: bill.Id },
                });
                    // deleted lines
                await Promise.all(_.map(localAPs, async ap => {
                    if (
                        !_.find(bill.Line, {
                            Id: ap.qboDocItemNo,
                        })
                    ) {
                        await ap.destroy();
                    }
                }));
                // updated lines
                await Promise.all(_.map(bill.Line, async line => {
                    if (
                        !line.DetailType ===
                                'AccountBasedExpenseLineDetail'
                    ) {
                        return;
                    }
                    const handler = await models.ContainerAP.findOne({
                        where: {
                            qboDocNo: bill.Id,
                            qboDocItemNo: line.Id,
                        },
                    });
                    if (handler) {
                        const status =
                                    bill.Balance > 0 ? 'Synced' : 'Paid';
                        await handler.updateAttributes({
                            qboSyncToken: bill.SyncToken,
                            amount: _.get(line, 'Amount'),
                            status,
                        });
                    }
                }));

                await models.QboNotification.destroy({
                    where: {
                        qboId: bill.Id,
                        type: 'Bill',
                    },
                });
            }
        }));
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
