const Controller = require(`${global.appRoot}/controllers`); //eslint-disable-line
const express = require('express');
const isAdmin = require('./auth').isAdmin;
const getUserToReq = require('./auth').getUserToReq;

const router = express.Router();

router.get('/list', getUserToReq, Controller.user.getAllUsers); // get all.
router.get('/:id', Controller.user.getUserById); // get by id.
router.delete('/:id', Controller.user.deleteUserById); // get by id.
router.get('/', getUserToReq, Controller.user.getUserInfo); // get current user info.
router.post('/', Controller.user.createUser);
router.put('/', getUserToReq, Controller.user.updateUser);
router.post('/invite', getUserToReq, isAdmin, Controller.user.inviteUser);

router.use('*', (req, res) => {
    res.status(404)
        .send();
});
module.exports = router;
