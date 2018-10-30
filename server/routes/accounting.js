const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');

const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

// router.get('/:id', getUserToReq, Controller.job.getJobById);
router.post('/submit', getUserToReq, Controller.accounting.updateItems);
router.post('/searchPayee', Controller.accounting.getPayeeBySearchText);
router.post('/list', Controller.accounting.getItemsByFilter);
router.post('/sync', getUserToReq, Controller.accounting.syncToQBO);
router.post('/ap/list', getUserToReq, Controller.accounting.getAPItemsByFilter); // this is for mobile
router.post(
    '/ap/getContainerInfo',
    getUserToReq,
    Controller.accounting.getContainerDataForAPPage,
); // this is for mobile
router.post(
    '/ap/getContainerInfoWeb',
    Controller.accounting.getContainerDataForAPForWeb,
); // this is for Web app

module.exports = router;
