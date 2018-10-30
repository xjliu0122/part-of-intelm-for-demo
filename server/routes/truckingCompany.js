const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
const isAdmin = require('./auth').isAdmin;
const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

router.post(
    '/list',
    getUserToReq,
    isIM,
    Controller.truckingCompany.getTruckingCompaniesByCoordinates,
);
router.get(
    '/',
    getUserToReq,
    isIM,
    Controller.truckingCompany.getAllTruckingCompanies,
);
router.post(
    '/searchByText',
    getUserToReq,
    isIM,
    Controller.truckingCompany.searchTCByText,
);

module.exports = router;
