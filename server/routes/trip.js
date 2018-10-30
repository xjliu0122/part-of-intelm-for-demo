const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
// const isAdmin = require('./auth').isAdmin;
// const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

// router.get('/:id', getUserToReq, Controller.trip.getTripsByContainerId);
router.post('/', getUserToReq, Controller.trip.createTrip);
router.post('/list', getUserToReq, Controller.trip.getTripsByFilter);
router.post(
    '/findsuggestions',
    getUserToReq,
    Controller.trip.getTripSuggestions,
);
router.post('/search', getUserToReq, Controller.trip.searchTripsForManagement);
router.put('/', getUserToReq, Controller.trip.updateTrip);
router.delete('/:id', getUserToReq, Controller.trip.deleteTrip);
router.post('/assign', getUserToReq, Controller.trip.assignTrip);
router.post('/completeStop', getUserToReq, Controller.trip.completeStop);
router.get('/getSignatureOrPOD/:id', Controller.trip.getSignatureOrPOD);
router.get('/:id', getUserToReq, Controller.trip.getSingleTrip);
router.get('/cancelTrip/:id', getUserToReq, Controller.trip.cancelTrip);
router.put('/adjustTripOrder', getUserToReq, Controller.trip.adjustTripOrder);
module.exports = router;
