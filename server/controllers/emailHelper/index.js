const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const mailer = require('./emailUtil');
const handlebars = require('handlebars');
const pdfUtil = require('./pdfUtil');

AWS.config.loadFromPath(`${global.appRoot}/aws.json`);
const saveToS3 = async data => {
    const bucketName = 'pdfdocbuckintelm';
    const fileName = `${uuid.v4()}.pdf`;

    const objectParams = {
        ACL: 'public-read',
        Bucket: bucketName,
        Key: fileName,
        Body: data,
    };
    // Create object upload promise
    const uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' })
        .putObject(objectParams)
        .promise();
    await uploadPromise;

    // .catch(err => {
    //     console.error(err, err.stack);
    // });
    return `https://s3-us-west-2.amazonaws.com/pdfdocbuckintelm/${fileName}`;
};
module.exports = {
    sendInviteUserEmail: async (inviterName, toEMail, code) => {
        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/inviteUser.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEMail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: `${inviterName} invited to join Intelmodal platform`,
            html: template({
                inviter: inviterName,
                code,
            }),
        };
        await mailer(msg);
    },
    sendIMNewBCOMCNotification: async (name, type) => {
        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/newSignup.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: 'admin@intelmodal.com',
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: 'There is a new signup',
            html: template({
                name,
                type,
            }),
        };
        await mailer(msg);
    },
    sendQuoteNotification: async (toEMail, obj) => {
        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/quoteNotification.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEMail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: 'Your Freight Quote from Intelmodal',
            html: template(obj),
        };
        await mailer(msg);
    },
    sendBookingConfirmation: async (toEMail, obj) => {
        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/bookingConfirmation.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEMail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: 'Your Booking Confirmed by Intelmodal',
            html: template(obj),
        };
        await mailer(msg);
    },
    sendDeliveryNotice: async (toEMail, obj) => {
        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/deliveryNotice.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEMail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: 'You have a delivery scheduled for today',
            html: template(obj),
        };
        await mailer(msg);
    },
    sendPickupNotice: async (toEMail, obj) => {
        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/pickupNotice.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEMail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: 'You have a pickup scheduled for today',
            html: template(obj),
        };
        await mailer(msg);
    },
    sendDeliveryReceipt: async (toEMail, obj, imgStr, ext) => {
        const pdfData = await pdfUtil.generateDeliveryReceiptPdf(
            obj,
            imgStr,
            ext,
        );

        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/deliveryReceipt.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEMail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: 'Your delivery receipt is enclosed',
            html: template(obj),
            attachments: [
                {
                    content: Buffer.from(pdfData, 'base64'),
                    contentType: 'application/pdf',
                    filename: 'receipt.pdf',
                },
            ],
        };
        await mailer(msg);
        const link = await saveToS3(Buffer.from(pdfData, 'base64'));
        return link;
    },
    sendPickupReceipt: async (toEMail, obj, imgStr, ext) => {
        const pdfData = await pdfUtil.generateDeliveryReceiptPdf(
            obj,
            imgStr,
            ext,
        );

        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/pickupReceipt.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEMail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            subject: 'Your pickup receipt is enclosed',
            html: template(obj),
            attachments: [
                {
                    content: Buffer.from(pdfData, 'base64'),
                    contentType: 'application/pdf',
                    filename: 'receipt.pdf',
                },
            ],
        };
        await mailer(msg);
        const link = await saveToS3(Buffer.from(pdfData, 'base64'));
        return link;
    },
    sendPaymentReport: async (apItems, toEmail, emailObj, total, mc) => {
        const pdfData = await pdfUtil.generateWeeklyPaymentReportPdf(
            apItems,
            emailObj.dateRange,
            total,
            mc,
        );
        const source = fs.readFileSync(
            path.join(
                global.appRoot,
                '/controllers/emailHelper/templates/weeklyPaymentReport.hbs',
            ),
            'utf8',
        );
        const template = handlebars.compile(source);
        const msg = {
            to: toEmail,
            from: { address: 'admin@intelmodal.com', name: 'Intelmodal' },
            cc: 'admin@intelmodal.com',
            subject: 'Your weekly payment report is enclosed',
            html: template(emailObj),
            attachments: [
                {
                    content: Buffer.from(pdfData, 'base64'),
                    contentType: 'application/pdf',
                    filename: 'report.pdf',
                },
            ],
        };
        await mailer(msg);
    },
};
