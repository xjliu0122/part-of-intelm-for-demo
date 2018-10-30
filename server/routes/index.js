const express = require('express');
const auth = require('./auth');
const isAuthenticated = require('./auth').isAuthenticated;
const controller = require('../controllers');

const router = express.Router();

router.use('/user', isAuthenticated, require('./user'));
router.use('/company', isAuthenticated, require('./company'));
router.use('/location', isAuthenticated, require('./location'));
router.use('/job', isAuthenticated, require('./job'));
router.use('/trip', isAuthenticated, require('./trip'));
router.use('/schedule', isAuthenticated, require('./schedule'));
router.use('/tc', isAuthenticated, require('./truckingCompany'));
router.use('/bid', isAuthenticated, require('./bid'));
router.use('/quote', isAuthenticated, require('./quote'));
router.use('/qbo', require('./qboOauth'));
router.use('/webhook', require('./webhook'));
router.use('/accounting', isAuthenticated, require('./accounting'));
router.use('/report', isAuthenticated, require('./report'));

router.get('/verifyEmail', (req, res) => auth.verifyEmail(req, res));

router.get('/heartbeat', isAuthenticated, (req, res) => {
    res.send(200);
});
router.get('/ports', controller.location.getAllPorts);
router.post(
    '/registerMCUserAndCompany',
    controller.user.createMCUserAndCompany,
);
router.use('*', (req, res) => {
    res.status(404)
        .send();
});
module.exports = router;
