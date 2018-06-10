const express = require('express');
const router = express.Router();
const jsonWebToken = require('jsonwebtoken');
const config = require('../config/_config');


router.post('/', function (req, res, next) {
    res.json(generateSuccessResponse('user'));
});

function generateSuccessResponse(user) {
    return {
        code: 200,
        message: "OK",
        data: {
            user: user
        },
        token: jsonWebToken.sign(user, config.secretPhrase)
    }
}

module.exports = router;
