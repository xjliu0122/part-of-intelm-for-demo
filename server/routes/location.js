const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
// const isAdmin = require('./auth').isAdmin;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

router.post('/', getUserToReq, Controller.location.createLocation);
router.put('/', Controller.location.updateLocation);
router.get('/:id*?', getUserToReq, Controller.location.getAll);
router.delete('/', Controller.location.deleteLocation);

module.exports = router;
