const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
const isAdmin = require('./auth').isAdmin;
const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

router.get('/bco', getUserToReq, Controller.company.getAllBCO);

router.get(
    '/:id/listUser',
    getUserToReq,
    Controller.company.getAllUsersByClient,
);

router.post('/searchClients', getUserToReq, Controller.company.searchClients);
router.post('/', getUserToReq, isAdmin, Controller.company.createCompany);
router.post('/join', getUserToReq, Controller.company.joinCompany);
router.put('/', getUserToReq, isAdmin, Controller.company.updateCompany);
router.put(
    '/addressInfo',
    isAdmin,
    getUserToReq,
    Controller.company.updateCompanyAddressInfo,
);

module.exports = router;
