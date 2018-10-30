const _ = require('lodash');
const sgMail = require('@sendgrid/mail');
const pdfUtil = require('./pdfUtil');

const apiKey = global.appConfig.sendGridKey;
sgMail.setApiKey(apiKey);
sgMail.setSubstitutionWrappers('%', '%'); // Configure the substitution tag wrappers globally
module.exports = {
    sendInviteUserEmail: async (inviterName, toEMail, code) => {
        const msg = {
            to: toEMail,
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'aa57a6fd-60bc-49d8-b14a-be7d6a631e11',
            substitutions: {
                inviter: inviterName,
                code,
            },
        };
        await sgMail.send(msg);
    },
    sendIMNewBCOMCNotification: async (name, type) => {
        const msg = {
            to: 'admin@intelmodal.com',
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-a8635e65e36841e7a752591324c663ba',
            dynamic_template_data: {
                name,
                type,
            },
        };
        await sgMail.send(msg);
    },
    sendQuoteNotification: async (toEMail, obj) => {
        const msg = {
            to: toEMail,
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-2e2956e5f6ad4520b509f6036fba48a2',
            dynamic_template_data: obj,
        };
        await sgMail.send(msg);
    },
    sendBookingConfirmation: async (toEMail, obj) => {
        const msg = {
            to: toEMail,
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-883c1a5f824440309e9f4c89fa0bdcaa',
            dynamic_template_data: obj,
        };
        await sgMail.send(msg);
    },
    sendDeliveryNotice: async (toEMail, obj) => {
        const msg = {
            to: toEMail,
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-1a7c49fc1c9d4dc88ba5597988a27b6d',
            dynamic_template_data: obj,
        };
        await sgMail.send(msg);
    },
    sendPickupNotice: async (toEMail, obj) => {
        const msg = {
            to: toEMail,
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-f76eb6be88544deb92d241bc44033ed3',
            dynamic_template_data: obj,
        };
        await sgMail.send(msg);
    },
    sendDeliveryReceipt: async (toEMail, obj, imgStr, ext) => {
        const pdfData = await pdfUtil.generateDeliveryReceiptPdf(
            obj,
            imgStr,
            ext,
        );
        const msg = {
            to: toEMail,
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-fd8b59f6ff9f410f9fdf482038925aef',
            dynamic_template_data: obj,
            attachments: [
                {
                    content: pdfData,
                    type: 'application/pdf',
                    cid: 'recieptCid',
                    filename: 'receipt.pdf',
                },
            ],
        };
        await sgMail.send(msg);
    },
    sendPickupReceipt: async (toEMail, obj, imgStr, ext) => {
        const pdfData = await pdfUtil.generatePickupReceiptPdf(
            obj,
            imgStr,
            ext,
        );
        const msg = {
            to: toEMail,
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-bac92b1d1d1d44b1962fabd76e9025de',
            dynamic_template_data: obj,
            attachments: [
                {
                    content: pdfData,
                    type: 'application/pdf',
                    cid: 'recieptCid',
                    filename: 'receipt.pdf',
                },
            ],
        };
        await sgMail.send(msg);
    },
    sendPaymentReport: async (apItems, toEmail, emailObj, total, mc) => {
        const pdfData = await pdfUtil.generateWeeklyPaymentReportPdf(
            apItems,
            emailObj.dateRange,
            total,
            mc,
        );
        const msg = {
            to: toEmail,
            cc: 'admin@intelmodal.com',
            from: { email: 'admin@intelmodal.com', name: 'Intelmodal' },
            template_id: 'd-21cb77fdc2f64779a5ad0e2c05667e37',
            dynamic_template_data: emailObj,
            attachments: [
                {
                    content: pdfData,
                    type: 'application/pdf',
                    cid: 'recieptCid',
                    filename: 'report.pdf',
                },
            ],
        };
        await sgMail.send(msg);
    },
};
