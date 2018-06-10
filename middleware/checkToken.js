const jsonWebToken = require('jsonwebtoken');
const config = require('../config/_config');
const storage = require('../storage');

const checkToken = function (req, res, next) {
    let token = req.headers['x-access-token'];

    if (token) {
        req.isAdmin = false;
        jsonWebToken.verify(token, config.secretPhrase, function (err, decoded) {
            if (err) {
                res.status(401).json({
                    error: true,
                    code: 401,
                    message: "Failed to authenticate token",
                    data: {}
                })
            } else {
                const User = storage.getDao("user");
                User.findById(decoded).then(user => {
                        if (user && user.admin === true) {
                            req.isAdmin = true;
                        }
                        next();
                    }
                );
            }
        });
    } else {
        res.status(403).send({
            error: true,
            code: 403,
            message: "No token provided",
            data: {}
        });
    }
};

module.exports = checkToken;
