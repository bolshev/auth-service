const Sequelize = require('sequelize');
const config = require('../../config/_config');

const user = {
    name: 'user',
    options: {
        login: {type: Sequelize.STRING, primaryKey: true},
        name: Sequelize.STRING,
        password: Sequelize.STRING,
        admin: {type: Sequelize.BOOLEAN, defaultValue: false}
    }, functions: {}
};

module.exports = user;