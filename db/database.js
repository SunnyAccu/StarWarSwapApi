const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('starwar', 'user', 'pass', {
  dialect: 'sqlite',
  host: './dev.sqlite',
});

module.exports = sequelize;
