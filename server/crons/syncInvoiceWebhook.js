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
const getQboInvoiceById = async invoiceId => {
    const config = await Util.getQboAxiosConfig(`/invoice/${invoiceId}`);

    try {
        const resp = await axios({
            ...config,
            method: 'GET',
        });
        const invoice = _.get(resp, 'data.Invoice');
        return invoice;
    } catch (err) {
        console.log(err);
        return null;
    }
};
const getInvoicesFromWebHooks = async () => {
    const results = [];
    try {
        const notifsdb = await models.QboNotification.findAll({
            where: {
                type: 'Invoice',
            },
        });
        if (_.size(notifsdb) > 0) {
            let notifs = [];
            await Promise.all(_.map(notifsdb, async notifdb => {
                if (notifdb.operation === 'Delete') {
                    // delete invoice .
                    await models.ContainerAR.destroy({
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
                results.push(await getQboInvoiceById(notif));
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
        const invoices = await getInvoicesFromWebHooks();
        await Promise.all(_.map(invoices, async invoice => {
            // update local entries
            if (invoice) {
                const localARs = await models.ContainerAR.findAll({
                    where: { qboDocNo: invoice.Id },
                });
                    // deleted lines
                await Promise.all(_.map(localARs, async ar => {
                    if (
                        !_.find(invoice.Line, {
                            LineNum: parseInt(ar.qboDocItemNo, 0),
                        })
                    ) {
                        await ar.destroy();
                    }
                }));
                // updated lines
                await Promise.all(_.map(invoice.Line, async line => {
                    if (!line.DetailType === 'SalesItemLineDetail') {
                        return;
                    }
                    const handler = await models.ContainerAR.findOne({
                        where: {
                            qboDocNo: invoice.Id,
                            qboDocItemNo: line.LineNum,
                        },
                    });
                    if (handler) {
                        const qboInvoiceStatus =
                                    invoice.Balance > 0 ? 'Synced' : 'Paid';
                        await handler.updateAttributes({
                            qboSyncToken: invoice.SyncToken,
                            amount: _.get(line, 'Amount'),
                            status: qboInvoiceStatus,
                        });
                    }
                }));

                await models.QboNotification.destroy({
                    where: {
                        qboId: invoice.Id,
                        type: 'Invoice',
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
