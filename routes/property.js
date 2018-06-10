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

router.param('propertyId', function (req, res, next, propertyId) {
    req.propertyId = propertyId;
    next();
});

router
    .route("/:systemId/:userId")
    // add user's system property
    .post(function (req, res, next) {
        res.send('respond with a resource' + req.userId + req.systemId + req.propertyId);
    })
    // delete user's system properties
    .delete(function (req, res, next) {
        res.send('respond with a resource' + req.userId + req.systemId + req.propertyId);
    });

router
// delete user's system property
    .delete("/:systemId/:userId/:propertyId", function (req, res, next) {
        res.send('respond with a resource' + req.userId + req.systemId + req.propertyId);
    });

module.exports = router;
