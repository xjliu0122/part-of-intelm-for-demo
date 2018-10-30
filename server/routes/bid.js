const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

router.post('/request', getUserToReq, isIM, Controller.bidRequest.requestBids);
router.post(
    '/search',
    getUserToReq,
    Controller.bidRequest.getBidRequestsByStatus,
);
router.post(
    '/submitBidForRequest',
    getUserToReq,
    Controller.bidRequest.submitBidForRequest,
);
router.get(
    '/rejectBidRequest/:id',
    getUserToReq,
    Controller.bidRequest.rejectBidRequest,
);
router.get(
    '/withdraw/:id',
    getUserToReq,
    Controller.bidRequest.withdrawBid,
);
router.get(
    '/setasread/:id',
    getUserToReq,
    Controller.bidRequest.setAsRead,
);

module.exports = router;
