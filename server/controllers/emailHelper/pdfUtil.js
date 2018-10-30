const _ = require('lodash');

const pdfMakePrinter = require('pdfmake/src/printer');

function generatePdf(docDefinition, callback) {
    try {
        const fontDescriptors = {
            Roboto: {
                normal: `${global.appRoot}/fonts/Roboto-Regular.ttf`,
                bold: `${global.appRoot}/fonts/Roboto-Medium.ttf`,
                italics: `${global.appRoot}/fonts/Roboto-Italic.ttf`,
                bolditalics: `${global.appRoot}/fonts/Roboto-MediumItalic.ttf`,
            },
        };
        const printer = new pdfMakePrinter(fontDescriptors);
        const doc = printer.createPdfKitDocument(docDefinition);

        const chunks = [];

        doc.on('data', chunk => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            const result = Buffer.concat(chunks);
            callback(`${result.toString('base64')}`);
        });

        doc.end();
    } catch (err) {
        throw err;
    }
}
module.exports = {
    generateDeliveryReceiptPdf: async (obj, imgStr, ext) => {
        const docDefinition = {
            content: [
                {
                    image: `${global.appRoot}/controllers/emailHelper/logo.png`,
                    width: 400,
                    alignment: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                },
                {
                    text: 'Delivery Receipt',
                    style: 'header',
                },
                {
                    text: `Delivery Date / Time (of POD): ${obj.dateTime}`,
                    style: ['body', 'firstBody'],
                },
                {
                    text: `BL#/Bk#: ${obj.blBKNo}`,
                    style: 'body',
                },
                {
                    text: `Client Ref#: ${obj.clientRefNo}`,
                    style: 'body',
                },
                {
                    text: `Container Type: ${obj.containerType}`,
                    style: 'body',
                },
                {
                    text: `Container #: ${obj.containerNo}`,
                    style: 'body',
                },
                {
                    text: `Location: ${obj.stopAt}`,
                    style: 'body',
                },
                {
                    text: `Signed by: ${obj.signedBy}`,
                    style: 'body',
                },
                {
                    text: 'Please see below for signatures',
                    style: 'body',
                },
                {
                    image: imgStr,
                    width: 500,
                },
            ],

            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: 'center',
                },
                firstBody: {
                    marginTop: 20,
                },
                body: {
                    marginLeft: 60,
                    marginBottom: 20,
                },
            },
        };

        const dd = await new Promise((resolve, reject) => {
            generatePdf(docDefinition, data => {
                resolve(data);
            });
        });
        return dd;
    },
    generatePickupReceiptPdf: async (obj, imgStr, ext) => {
        const docDefinition = {
            content: [
                {
                    image: `${global.appRoot}/controllers/emailHelper/logo.png`,
                    width: 400,
                    alignment: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                },
                {
                    text: 'Pickup Receipt',
                    style: 'header',
                },
                {
                    text: `Pickup Date/Time: ${obj.dateTime}`,
                    style: ['body', 'firstBody'],
                },
                {
                    text: `BL#/Bk#: ${obj.blBKNo}`,
                    style: 'body',
                },
                {
                    text: `Client Ref#: ${obj.clientRefNo}`,
                    style: 'body',
                },
                {
                    text: `Container Type: ${obj.containerType}`,
                    style: 'body',
                },
                {
                    text: `Container #: ${obj.containerNo}`,
                    style: 'body',
                },
                {
                    text: `Location: ${obj.stopAt}`,
                    style: 'body',
                },
                {
                    text: `Signed by: ${obj.signedBy}`,
                    style: 'body',
                },
                {
                    text: 'Please see below for signatures',
                    style: 'body',
                },
                {
                    image: imgStr,
                    width: 500,
                },
            ],

            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: 'center',
                },
                firstBody: {
                    marginTop: 20,
                },
                body: {
                    marginLeft: 60,
                    marginBottom: 20,
                },
            },
        };

        const dd = await new Promise((resolve, reject) => {
            generatePdf(docDefinition, data => {
                resolve(data);
            });
        });
        return dd;
    },
    generateWeeklyPaymentReportPdf: async (items, range, total, mc) => {
        const content = [
            {
                image: `${global.appRoot}/controllers/emailHelper/logo.png`,
                width: 400,
                alignment: 'center',
                marginTop: 20,
                marginBottom: 20,
            },
            {
                text: 'Weekly Payment Report',
                style: 'header',
            },
            {
                text: `${range}`,
                style: 'dateRange',
            },
        ];
        _.map(items, item => {
            content.push({
                text: '',
                style: 'lineBreak',
            });
            content.push({
                text: `${item.paymentDate}  ${item.paymentType}               $ ${
                    item.amount
                }`,
                style: 'bodyWholeLine',
            });
            content.push({
                text: `Cnt#: ${item.containerNo || 'N/A'}  Cnt Type: ${
                    item.containerType
                }`,
                style: 'bodyWholeLine',
            });
            if (item.fromDate) {
                content.push({
                    text: `Trip Date: ${item.fromDate}`,
                    style: 'bodyWholeLine',
                });
            }
            if (item.fromName) {
                content.push({
                    text: `From: ${item.fromName}   ${item.fromAddress}`,
                    style: 'bodyWholeLine',
                });
            }
            if (item.toName) {
                content.push({
                    text: `To: ${item.toName}   ${item.toAddress}`,
                    style: 'bodyWholeLine',
                });
            }
            //bodyHalfLine
        });
        content.push({
            text: `Total: $ ${total}`,
            style: 'lineBreak',
        });
        const docDefinition = {
            content,
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                },
                dateRange: {
                    fontSize: 14,
                    marginTop: 15,
                    alignment: 'center',
                },
                lineBreak: {
                    fontSize: 16,
                    bold: true,
                    marginTop: 15,
                    marginLeft: 60,
                },
                bodyWholeLine: {
                    marginLeft: 60,
                    marginBottom: 5,
                },
            },
        };

        const dd = await new Promise((resolve, reject) => {
            generatePdf(docDefinition, data => {
                resolve(data);
            });
        });
        return dd;
    },
};
