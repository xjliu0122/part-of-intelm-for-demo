const nodemailer = require('nodemailer');
const logger = require('../../util/logger');
// Assumes we use gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: 'admin@intelmodal.com',
        pass: 'intelmO@1234',
    },
});
// SMTP Username:
// AKIAIZVE2E2X3OSKQCUA
// SMTP Password:
// AoghEDNU8MntDNJwN+glceYP860RE7wPLqExSgRn5xsy
module.exports = mailOptions => {
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return logger.verbose(err);
        }
        // if (info) { return logger.log('info', JSON.stringify(info), { tags: 'email' }); }
        return null;
    });
};
