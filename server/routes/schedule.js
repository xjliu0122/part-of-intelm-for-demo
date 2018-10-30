const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
// const isAdmin = require('./auth').isAdmin;
// const isIM = require('./auth').isIM;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

// router.get('/:id', getUserToReq, Controller.trip.getTripsByContainerId);
router.post('/', getUserToReq, Controller.schedule.createSchedule);
router.post('/list', getUserToReq, Controller.schedule.getSchedulesByFilter);
router.put('/:id', getUserToReq, Controller.schedule.updateSchedule);
router.delete('/:id', getUserToReq, Controller.schedule.deleteSchedule);

module.exports = router;
