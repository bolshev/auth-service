const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');
const storage = require('../storage');
const jsonWebToken = require("jsonwebtoken");
const config = require("../config/_config");

router.use(checkToken);

router.param('userId', function (req, res, next, userId) {
    req.userId = userId;
    next();
});

router
// get user's list
    .get('/', function (req, res) {
        const User = storage.getDao("user");
        User.findAll({attributes: {exclude: ['password', 'admin']}}).then(users => res.json(users || []));
    })
    // get user by id
    .get('/:userId', function (req, res) {
        const User = storage.getDao("user");
        User.findOne({
            where: {login: req.userId},
            attributes: {exclude: ['password', 'admin']}
        }).then(users => res.json(users || []));
    })
    // create new user
    .post('/', function (req, res) {
        const User = storage.getDao("user");
        User.findOne({
            where: {login: req.body.login},
            attributes: {exclude: ['password', 'admin']}
        }).then(user => {
            if (user) {
                res.status(406).json({
                    error: true,
                    code: 406,
                    message: 'User is already exist',
                    data: user
                });
            } else {
                User.create(req.body).then(createdUser => {
                    delete createdUser.dataValues.password;
                    delete createdUser.dataValues.admin;

                    res.json({
                        code: 200,
                        message: 'User created',
                        data: createdUser
                    })
                })
            }
        })
    })
    // update user
    .put('/:userId', function (req, res, next) {
        if (req.userId !== req.body.login) {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Incorrect parameters',
                data: {}
            });
            return;
        }

        const User = storage.getDao("user");
        User.findById(req.userId).then(user => {
            if (user) {
                user.name = req.body.name;
                if (req.isAdmin) {
                    user.password = jsonWebToken.sign(req.body.password, config.secretPhrase);
                    user.admin = req.body.admin || false;
                }
                user.save().then(user => {
                    delete user.dataValues.password;
                    delete user.dataValues.admin;

                    res.json({
                        code: 200,
                        message: 'User updated',
                        data: user
                    })
                });
            } else {
                res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'User not found',
                    data: {}
                });
            }
        });
    })
    // delete user
    .delete('/:userId', function (req, res) {
        if (req.isAdmin) {
            const User = storage.getDao("user");
            User.findById(req.userId).then(user => {
                if (user) {
                    user.destroy();
                    res.json({
                        code: 200,
                        message: 'User deleted',
                        data: {}
                    });
                } else {
                    res.status(404).json({
                        error: true,
                        code: 404,
                        message: 'User not found',
                        data: {}
                    });
                }
            });
        } else {
            res.status(406).json({
                error: true,
                code: 406,
                message: 'Current user have not rights to delete users',
                data: {}
            });
        }
    });

module.exports = router;
