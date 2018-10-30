// IntelModal Send Trip Delivery/Pickup notice

// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');
const models = require('../models');
const emailHelper = require('../controllers/emailHelper');

const toMoment = moment()
    .add(1, 'day');
const fromMoment = moment();
const Op = models.Sequelize.Op;
const sendDeliveryNoticeHandler = async (trip, stop) => {
    const emailObj = {
        clientRefNo: _.get(trip, 'container.job.clientRefNo') || '',
        deliveryDateTime: moment(_.get(stop, 'plannedDateTime') || _.get(trip, 'estimatedStartTime'))
            .format('MM/DD/YYYY HH:MM'),
        blBKNo:
            _.get(trip, 'container.job.jobImportDetail.billOfLading') ||
            _.get(trip, 'container.job.jobExportDetail.booking'),
        containerType: _.get(trip, 'container.type'),
        stopAction: _.get(stop, 'action'),
        containerNo: _.get(trip, 'container.equipmentNo'),
    };
    const toEmail = _.get(trip, 'container.job.client.email');
    await emailHelper.sendDeliveryNotice(toEmail, emailObj);
    await trip.updateAttributes({
        noticeSent: true,
    });
};
const sendPickupNoticeHandler = async (trip, stop) => {
    const emailObj = {
        clientRefNo: _.get(trip, 'container.job.clientRefNo'),
        pickupDateTime: moment(_.get(stop, 'plannedDateTime') || _.get(trip, 'estimatedStartTime'))
            .format('MM/DD/YYYY HH:MM'),
        blBKNo:
            _.get(trip, 'container.jobImportDetail.billOfLading') ||
            _.get(trip, 'container.jobExportDetail.booking'),
        containerType: _.get(trip, 'container.type'),
        stopAction: _.get(stop, 'action'),
        containerNo: _.get(trip, 'container.equipmentNo'),
    };
    await emailHelper.sendPickupNotice('', emailObj);
    await trip.updateAttributes({
        noticeSent: true,
    });
};

// now do the actual job.
const doWork = async () => {
    try {
        //1. find trips pending notification
        const trips = await models.Trip.findAll({
            where: {
                estimatedStartTime: {
                    [Op.gte]: fromMoment,
                    [Op.lte]: toMoment,
                },
                noticeSent: false,
            },
            include: [
                'stop',
                {
                    model: models.Container,
                    as: 'container',
                    include: [
                        {
                            model: models.Job,
                            as: 'job',
                            include: [
                                'jobImportDetail',
                                'jobExportDetail',
                                'client',
                            ],
                        },
                    ],
                },
            ],
        });

        await Promise.all(_.map(trips, async trip => {
            let sendDeliveryNotice,
                sendDeliveryNoticeStop,
                sendPickupNotice,
                sendPickupNoticeStop;
            _.map(trip.stop, s => {
                if (_.get(trip, 'container.job.type') === 'Export') {
                    if (
                        s.type === 'shipper' &&
                            s.action === 'drop-off empty'
                    ) {
                        sendDeliveryNotice = true;
                        sendDeliveryNoticeStop = s;
                    }
                    if (
                        s.type === 'shipper' &&
                            s.action === 'pick-up load'
                    ) {
                        sendPickupNotice = true;
                        sendPickupNoticeStop = s;
                    }
                }
                if (_.get(trip, 'container.job.type') === 'Import') {
                    if (
                        s.type === 'consignee' &&
                            s.action === 'drop-off load'
                    ) {
                        sendDeliveryNotice = true;
                        sendDeliveryNoticeStop = s;
                    }
                    if (
                        s.type === 'consignee' &&
                            s.action === 'pick-up empty'
                    ) {
                        sendPickupNotice = true;
                        sendPickupNoticeStop = s;
                    }
                }
            });

            if (sendDeliveryNotice) {
                await sendDeliveryNoticeHandler(
                    trip,
                    sendDeliveryNoticeStop,
                );
            }
            if (sendPickupNotice) {
                await sendPickupNoticeHandler(trip, sendPickupNoticeStop);
            }
        }));
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
