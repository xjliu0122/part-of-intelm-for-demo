// IntelModal Sync QBO Vendors to Local

// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const models = require('../models');
const Util = require('./util');

const Op = models.Sequelize.Op;

const getVendorWebHooks = async () => {
    const results = [];
    try {
        const notifsdb = await models.QboNotification.findAll({
            type: 'Vendor',
        });
        if (_.size(notifsdb) > 0) {
            let notifs = [];
            _.map(notifsdb, notifdb => {
                notifs.push(notifdb.qboId);
            });
            notifs = _.uniqBy(notifs, e => e);

            // first, remove vendors which are MC.
            const notifAfterFiltering = [];
            await Promise.all(_.map(notifs, async notif => {
                const company = await models.Company.findOne({
                    where: {
                        qboCompanyId: notif,
                        type: {
                            [Op.in]: ['Trucking Company', 'Owner Operator'],
                        },
                    },
                });
                if (!company) {
                    notifAfterFiltering.push(notif);
                } else {
                    //delete the notification entry
                    await models.QboNotification.destroy({
                        where: {
                            qboId: notif,
                            type: 'Vendor',
                        },
                    });
                }
            }));

            await Promise.all(_.map(notifAfterFiltering, async notif => {
                results.push(await fetchVendorsFromQBO(notif));
            }));
        }
    } catch (err) {
        console.error(err);
    }
    return results;
};

const fetchVendorsFromQBO = async id => {
    const conf = Util.getQboAxiosConfig(`/query?query=select * from Vendor Where Id='${id}'`);

    try {
        const vendorResponse = await axios({
            ...conf,
            method: 'GET',
            'Content type': 'text/plain',
        });

        if (vendorResponse.status === 200) {
            const qbVendor = _.get(
                vendorResponse,
                'data.QueryResponse.Vendor[0]',
            );
            return qbVendor;
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
        const vendors = await getVendorWebHooks();
        await Promise.all(_.map(vendors, async vendor => {
            // see if vendor in local db
            if (!vendor) return;
            const vendorDb = await models.Vendor.findOne({
                where: { qboId: vendor.Id },
            });
            if (vendorDb) {
                // update
                await vendorDb.updateAttributes({
                    name: vendor.CompanyName || vendor.DisplayName,
                    qboId: vendor.Id,
                });
            } else {
                // create
                await models.Vendor.create({
                    name: vendor.CompanyName || vendor.DisplayName,
                    qboId: vendor.Id,
                });
            }

            //delete the notification entry
            await models.QboNotification.destroy({
                where: {
                    qboId: vendor.Id,
                    type: 'Vendor',
                },
            });
        }));
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
