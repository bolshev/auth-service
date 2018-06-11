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

    const SystemDefinition = require('./dao/system');
    const SystemDao = this.createModel(SystemDefinition.name, SystemDefinition.options, SystemDefinition.functions);

    const PropertyDefinition = require('./dao/property');
    const PropertyDao = this.createModel(PropertyDefinition.name, PropertyDefinition.options, PropertyDefinition.functions);

    const UserSystemDefinition = require('./dao/userSystem');
    const UserSystemDao = this.createModel(UserSystemDefinition.name, UserSystemDefinition.options, UserSystemDefinition.functions);

    UserDao.belongsToMany(SystemDao, {through: UserSystemDefinition.name, as: 'systems'});
    SystemDao.belongsToMany(UserDao, {through: UserSystemDefinition.name, as: 'users'});

    SystemDao.hasMany(PropertyDao);
    PropertyDao.belongsTo(SystemDao);
    UserDao.hasMany(PropertyDao);
    PropertyDao.belongsTo(UserDao);

    UserDao.sync();
    SystemDao.sync();
    PropertyDao.sync();
    UserSystemDao.sync();

    // force: true will drop the table if it already exists
    UserDao.sync().then(() => {
        // Table created
        const jsonWebToken = require('jsonwebtoken');
        UserDao.create({
            login: 'admin',
            name: 'Administrator',
            password: jsonWebToken.sign('secret', config.secretPhrase)
        }).then(user => {
            SystemDao.create({
                systemName: 'sis'
            }).then(system => {
                system.addUser(user).then(value => {
                    PropertyDao.create({
                        'propertyKey': 'key1',
                        'propertyValue': 'value1',
                        'systemSystemId': system.systemId,
                        'userLogin': user.login
                    })
                });
            });
        });
    });
};

Storage.prototype.getDao = function (name) {
    return this.models[name];
};

var storage = module.exports = exports = new Storage;