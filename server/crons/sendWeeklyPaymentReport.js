// IntelModal Send Weekly Payment Report

// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');
const models = require('../models');
const emailHelper = require('../controllers/emailHelper');

const startDateTime =
    process.env.START_DATE ||
    moment()
        .startOf('week')
        .subtract(7, 'day');
const endDateTime = moment(startDateTime)
    .add(7, 'day');

const Op = models.Sequelize.Op;
const sendPaymentReport = async (apItems, toEmail, mc) => {
    const emailObj = {
        dateRange: `${moment(startDateTime)
            .format('MM/DD/YYYY')} to ${moment(endDateTime)
            .subtract(1, 'day')
            .format('MM/DD/YYYY')}`,
        name: mc.name,
    };
    let total = 0;
    _.map(apItems, ap => {
        total += parseFloat(ap.amount || 0, 2);
    });
    await emailHelper.sendPaymentReport(apItems, toEmail, emailObj, total, mc);
};
const processMC = async mc => {
    const aps = await models.ContainerAP.findAll({
        where: {
            createdAt: {
                [Op.gte]: startDateTime,
                [Op.lte]: endDateTime,
            },
            payeeId: mc.payeeId,
        },
        include: [
            {
                model: models.Container,
                as: 'container',
                include: [
                    {
                        model: models.Trip,
                        as: 'trip',
                        where: {
                            assigneeId: mc.payeeId,
                        },
                        include: [
                            {
                                model: models.Stop,
                                as: 'stop',
                                include: [
                                    {
                                        model: models.Location,
                                        as: 'stopLocation',
                                        include: ['geoLocation'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
        order: [['createdAt', 'ASC']],
    });
    const apItems = [];
    _.map(aps, ap => {
        const { tripRowNoInContainer, container } = ap;
        const trips = _.get(container, 'trip');
        let lineItem = {
            amount: _.get(ap, 'amount'),
            containerNo: _.get(container, 'equipmentNo'),
            containerType: _.get(container, 'type'),
            paymentDate: moment(_.get(ap, 'createdAt'))
                .format('MM/DD/YYYY'),
            paymentType: _.get(ap, 'type'),
        };
        if (tripRowNoInContainer) {
            const trip = _.find(trips, {
                rowNo: parseInt(tripRowNoInContainer, 0),
            });
            if (trip) {
                lineItem = {
                    ...lineItem,
                    fromName: _.get(trip, 'stop[0].stopLocation.name'),
                    fromAddress: _.get(
                        trip,
                        'stop[0].stopLocation.geoLocation.address',
                    ),
                    fromAction: _.get(trip, 'stop[0].action'),
                    fromDate: _.get(trip, 'stop[0].actualTime')
                        ? moment(_.get(trip, 'stop[0].actualTime'))
                            .format('MM/DD/YYYY')
                        : '',
                    toDate: _.get(
                        trip,
                        `stop[${_.size(trip.stop) - 1}].actualTime`,
                    )
                        ? moment(_.get(
                            trip,
                            `stop[${_.size(trip.stop) - 1}].actualTime`,
                        ))
                            .format('MM/DD/YYYY')
                        : '',
                    toName: _.get(
                        trip,
                        `stop[${_.size(trip.stop) - 1}].stopLocation.name`,
                    ),
                    toAddress: _.get(
                        trip,
                        `stop[${_.size(trip.stop) -
                            1}].stopLocation.geoLocation.address`,
                    ),
                    toAction: _.get(
                        trip,
                        `stop[${_.size(trip.stop) - 1}].action`,
                    ),
                };
            }
        }
        apItems.push(lineItem);
    });
    const mcCompany = await models.Company.findById(mc.payeeId);

    await sendPaymentReport(apItems, _.get(mcCompany, 'email'), mcCompany);
};
// now do the actual job.
const doWork = async () => {
    // step 0  get all MC which have payments in the given period .
    try {
        const mcCompanies = await models.ContainerAP.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startDateTime,
                    [Op.lte]: endDateTime,
                },
            },
            group: ['payeeId'],
            attributes: ['payeeId'],
        });
        await Promise.all(_.map(mcCompanies, async mc => {
            await processMC(mc);
        }));
        setTimeout(() => {
            process.exit(0);
        }, 100000);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
