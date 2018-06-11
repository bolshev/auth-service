const Sequelize = require('sequelize');

const property = {
    name: 'property',
    options: {
        propertyId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        propertyKey: Sequelize.STRING,
        propertyValue: Sequelize.STRING
    }, functions: {}
};

module.exports = property;