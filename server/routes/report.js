const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

router.get('/coninv', getUserToReq, isIM, Controller.report.getConInvReport);
router.post('/bcoStatement', Controller.report.getBCOStatement);
router.post(
    '/bcoDashboard',
    getUserToReq,
    Controller.report.getBCODashboardData,
);
router.get('/invoicepdf/:id', Controller.report.getQBOInvoicePDF);

module.exports = router;
