const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
// const isAdmin = require('./auth').isAdmin;
// const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

router.post('/', getUserToReq, Controller.quote.createQuote);
router.post('/list', getUserToReq, Controller.quote.getQuotesByFilter);
router.put('/', getUserToReq, Controller.quote.updateQuote);
router.put('/propose', getUserToReq, Controller.quote.proposeForQuote);
router.put('/release', getUserToReq, Controller.quote.releaseQuote);

module.exports = router;
