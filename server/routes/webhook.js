const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');

const router = express.Router();

// router.get('/:id', getUserToReq, Controller.job.getJobById);
router.post('/', Controller.webhook.processNotifications);

module.exports = router;
