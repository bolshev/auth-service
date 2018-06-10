const sequelize = require('sequelize');
const config = require('../config/_config');

function Storage() {
    this.sequelize = null;
    this.models = {};
}

Storage.prototype.createConnection = function () {
    this.sequelize = new sequelize(config.db_name, config.db_user, config.db_password, config.db_options);

    this.sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
};

Storage.prototype.createModel = function (name, options, functions) {
    return this.models[name] = this.sequelize.define(name, options, functions);
};

Storage.prototype.initDao = function () {
    const UserDefinition = require('./dao/user');
    const UserDao = this.createModel(UserDefinition.name, UserDefinition.options, UserDefinition.functions);

    // force: true will drop the table if it already exists
    UserDao.sync().then(() => {
        // Table created
        const jsonWebToken = require('jsonwebtoken');
        return UserDao.create({
            login: 'admin',
            name: 'Administrator',
            password: jsonWebToken.sign('secret', config.secretPhrase)
        });
    });
};

Storage.prototype.getDao = function (name) {
    return this.models[name];
};


var storage = module.exports = exports = new Storage;