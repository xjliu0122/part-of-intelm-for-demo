const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
// const isAdmin = require('./auth').isAdmin;
// const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

// router.get('/:id', getUserToReq, Controller.job.getJobById);
router.post('/', getUserToReq, Controller.job.createJob);
router.post('/list', getUserToReq, Controller.job.getJobsByFilter);
router.put('/', getUserToReq, Controller.job.updateJob);
router.post('/invoice', getUserToReq, Controller.job.invoiceJob);
router.post('/sendconfirmation', getUserToReq, Controller.job.sendConfirmation);
router.post('/markRAStatus', getUserToReq, Controller.job.markRAStatus);

module.exports = router;
