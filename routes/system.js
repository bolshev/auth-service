const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');

router.use(checkToken);

router.param('userId', function (req, res, next, userId) {
    req.userId = userId;
    next();
});

router.param('systemId', function (req, res, next, systemId) {
    req.systemId = systemId;
    next();
});

router
    .get('/:systemId', function (req, res, next) {
        res.send('respond with a resource');
    })
    .post('/', function (req, res, next) {
        res.send('respond with a resource');
    })
    .put('/:systemId', function (req, res, next) {
        res.send('respond with a resource');
    })
    .delete('/:systemId', function (req, res, next) {
        res.send('respond with a resource');
    });

router
    .route("/:systemId/:userId")
    // get user with properties
    .get(function (req, res, next) {
        res.send('respond with a resource');
    })
    // add/activate user in system
    .post(function (req, res, next) {
        res.send('respond with a resource');
    })
    // deactivate user in system
    .delete(function (req, res, next) {
        res.send('respond with a resource');
    });

module.exports = router;
