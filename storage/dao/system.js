const Sequelize = require('sequelize');

const system = {
    name: 'system',
    options: {
        systemId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        systemName: Sequelize.STRING,
        systemUrl: Sequelize.STRING
    }, functions: {}
};

module.exports = system;