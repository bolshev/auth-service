const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');

router.use(checkToken);

router.param('userId', function (req, res, next, userId) {
    req.userId = userId;
    next();
});

router
// get user's list
    .get('/', function (req, res, next) {
        res.send('respond with a resource');
    })
    // get user by id
    .get('/:userId', function (req, res, next) {
        res.send('respond with a resource');
    })
    // create new user
    .post('/', function (req, res, next) {
        res.send('respond with a resource');
    })
    // update user
    .put('/:userId', function (req, res, next) {
        res.send('respond with a resource');
    })
    // deactivate user
    .delete('/:userId', function (req, res, next) {
        res.send('respond with a resource');
    });

module.exports = router;
