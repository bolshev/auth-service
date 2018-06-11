const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');
const storage = require('../storage');

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
    .post(function (req, res) {
        const User = storage.getDao("user");
        const System = storage.getDao("system");
        const Property = storage.getDao("property");

        System.findOne({
            where: {systemId: req.systemId},
        }).then(system => {
            User.findOne({
                where: {login: req.userId},
            }).then(user => {
                if (system && user) {
                    Property.create({
                        propertyKey: req.body.propertyKey,
                        propertyValue: req.body.propertyValue,
                        systemSystemId: req.systemId,
                        userLogin: req.userId
                    }).then(() => {
                        res.json({
                            code: 200,
                            message: 'Property was added to User/System pair',
                            data: {}
                        })
                    })
                } else {
                    res.status(404).json({
                        error: true,
                        code: 404,
                        message: 'System or user is not found',
                        data: {}
                    });
                }
            })
        });
    })
    // delete user's system properties
    .delete(function (req, res) {
        const Property = storage.getDao("property");

        Property.destroy({
            where: {
                systemSystemId: req.systemId,
                userLogin: req.userId
            },
        }).then(() => {
            res.json({
                code: 200,
                message: 'Properties were deleted',
                data: {}
            })
        });
    });

router
// delete user's system property
    .delete("/:systemId/:userId/:propertyId", function (req, res) {
        const Property = storage.getDao("property");

        Property.findOne({
            where: {
                propertyId: req.propertyId,
                systemSystemId: req.systemId,
                userLogin: req.userId
            },
        }).then(property => {
            if (property) {
                property.destroy();
                res.json({
                    code: 200,
                    message: 'Property was deleted',
                    data: {}
                })
            } else {
                res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'Property is not found',
                    data: {}
                });
            }
        });
    });

module.exports = router;
