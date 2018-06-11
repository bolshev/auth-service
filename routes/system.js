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

router
    .get('/:systemId', function (req, res) {
        const User = storage.getDao("user");
        const System = storage.getDao("system");

        System.findOne({
            where: {systemId: req.systemId},
            include: [{
                model: User,
                as: 'users',
                attributes: {exclude: ['password', 'admin']},
                required: false,
                through: {
                    where: {active: true}
                }
            }]
        }).then(system => res.json(system || {}));
    })
    .post('/', function (req, res) {
        if (!req.isAdmin) {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Current user have not rights to do this action',
                data: {}
            });
            return;
        }

        const System = storage.getDao("system");
        System.findOne({
            where: {systemId: req.body.systemId},
        }).then(system => {
            if (system) {
                res.status(406).json({
                    error: true,
                    code: 406,
                    message: 'System is already exist',
                    data: system
                });
            } else {
                System.create(req.body).then(createdSystem => {
                    res.json({
                        code: 200,
                        message: 'System created',
                        data: createdSystem
                    })
                })
            }
        });
    })
    .put('/:systemId', function (req, res) {
        if (!req.isAdmin) {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Current user have not rights to do this action',
                data: {}
            });
            return;
        }

        if (req.systemId !== req.body.systemId) {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Incorrect parameters',
                data: {}
            });
            return;
        }

        const System = storage.getDao("system");
        System.findById(req.userId).then(system => {
            if (system) {
                system.systemName = req.body.systemName;
                system.systemUrl = req.body.systemUrl;

                system.save().then(user => {
                    res.json({
                        code: 200,
                        message: 'System updated',
                        data: user
                    })
                });
            } else {
                res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'System not found',
                    data: {}
                });
            }
        });
    })
    .delete('/:systemId', function (req, res) {
        if (!req.isAdmin) {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Current user have not rights to do this action',
                data: {}
            });
            return;
        }

        const System = storage.getDao("system");
        System.findById(req.systemId).then(system => {
            if (system) {
                system.destroy();
                res.json({
                    code: 200,
                    message: 'System deleted',
                    data: {}
                });
            } else {
                res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'System not found',
                    data: {}
                });
            }
        });
    });

router
    .route("/:systemId/:userId")
    // get user with properties
    .get(function (req, res) {
        const User = storage.getDao("user");
        const Property = storage.getDao("property");

        User.findOne({
            where: {login: req.userId},
            attributes: {exclude: ['password', 'admin']},
            include: [{
                model: Property,
                as: 'properties',
                required: false,
                where: {systemSystemId: req.systemId}
            }]
        }).then(user => res.json(user || {}));
    })
    // add/activate user in system
    .post(function (req, res) {
        if (!req.isAdmin) {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Current user have not rights to do this action',
                data: {}
            });
            return;
        }

        const User = storage.getDao("user");
        const System = storage.getDao("system");
        System.findOne({
            where: {systemId: req.systemId},
        }).then(system => {
            User.findOne({
                where: {login: req.userId},
            }).then(user => {
                if (system && user) {
                    system.addUser(user).then(() => {
                        res.json({
                            code: 200,
                            message: 'User was added to System',
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
    // deactivate user in system
    .delete(function (req, res) {
        if (!req.isAdmin) {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Current user have not rights to do this action',
                data: {}
            });
            return;
        }

        const User = storage.getDao("user");
        const System = storage.getDao("system");
        System.findOne({
            where: {systemId: req.systemId},
        }).then(system => {
            User.findOne({
                where: {login: req.userId},
            }).then(user => {
                if (system && user) {
                    system.removeUser(user).then(() => {
                        res.json({
                            code: 200,
                            message: 'User was removed from System',
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
    });

module.exports = router;
