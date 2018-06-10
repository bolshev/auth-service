const express = require('express');
const router = express.Router();
const jsonWebToken = require('jsonwebtoken');
const config = require('../config/_config');
const storage = require('../storage');

router.post('/', function (req, res) {
    const User = storage.getDao("user");
    User.findById(req.body.login).then(user => {
            if (user && user.password === jsonWebToken.sign(req.body.password, config.secretPhrase)) {
                res.json(generateSuccessResponse(user))
            } else {
                res.status(401).json({
                    error: true,
                    code: 401,
                    message: 'Login/Password is incorrect',
                    data: {}
                })
            }
        }
    );
});

function generateSuccessResponse(user) {
    return {
        code: 200,
        message: "OK",
        data: {
            user: {
                login: user.login,
                name: user.name
            }
        },
        token: jsonWebToken.sign(user.login, config.secretPhrase)
    }
}

module.exports = router;
