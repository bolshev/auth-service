const Sequelize = require('sequelize');

const userSystem = {
    name: 'userSystem',
    options: {
        active: {type: Sequelize.BOOLEAN, defaultValue: true}
    }, functions: {}
};

module.exports = userSystem;