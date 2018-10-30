// IntelModal Sync QBO Vendors to Local

// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const models = require('../models');
const Util = require('../controllers/emailHelper');
const moment = require('moment');

const Op = models.Sequelize.Op;

// now do the actual job.
const doWork = async () => {
    try {
        const stop = await models.Stop.findById(
            '10aafd18-382c-4358-856a-57a2daf7219c',
            {
                include: ['stopLocation'],
            },
        );
        const trip = await models.Trip.findById(stop.tripId);
        const container = await trip.getContainer();
        const job = await container.getJob();
        const jobExp = await job.getJobExportDetail();
        const emailObj = {
            dateTime: moment()
                .format('MM/DD/YYYY'),
            blBKNo: _.get(jobExp, 'booking'),
            clientRefNo: _.get(job, 'clientRefNo') || '',
            containerType: _.get(container, 'type') || '',
            containerNo: _.get(container, 'equipmentNo') || '',
            stopAt: _.get(stop, 'stopLocation.name'),
            signedBy: _.get(stop, 'signature.signedBy') || '',
            carrierName: 'Marer',
            //  imageData: _.get(data, 'signature.data'),
        };
        await Util.sendDeliveryReceipt(
            'yangzhengcn@gmail.com',
            emailObj,
            _.get(stop, 'signature.data'),
            'jpeg',
        );
        // const json =
        //     '{"quotationNo": "Q123", "quoteDate": "08/01/2018", "instruction": "test instruction", "client": "YANG BCO2", "containers": [{"containerSeqNo": "1", "totalCharge": "456.2", "reqDelvDate": "08/01/2018", "pickupFrom": "Snowhill Inc. 24691 Mendocino Ct, Laguna Hills, CA, 92653", "containerType": "22G1", "deliverTo": "Snowhill Inc. 24691 Mendocino Ct, Laguna Hills, CA, 92653", "options": "", "grossWeight": "1000"}, {"containerSeqNo": "2", "totalCharge": "123.1", "reqDelvDate": "08/01/2018", "pickupFrom": "Snowhill Inc. 24691 Mendocino Ct, Laguna Hills, CA, 92653", "containerType": "22G1", "deliverTo": "Snowhill Inc. 24691 Mendocino Ct, Laguna Hills, CA, 92653", "options": "hazmat", "grossWeight": ""}], "total": "1333.21", "jobType": "Import"}';
        // await Util.sendQuoteNotification('yangzhengcn@gmail.com', JSON.parse(json));
        //process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
