const jsonWebToken = require('jsonwebtoken');
const config = require('../config/_config');

const checkToken = function (req, res, next) {
    let token = req.headers['x-access-token'];

    if (token) {
        jsonWebToken.verify(token, config.secretPhrase, function (err, decoded) {
            if (err) {
                res.json({
                    error: true,
                    code: 401,
                    message: "Failed to authenticate token",
                    data: {}
                })
            } else {
                next();
            }
        });
    } else {
        res.status(403).send({
            code: 403,
            message: "No token provided",
            data: {}
        });
    }
};

module.exports = checkToken;
