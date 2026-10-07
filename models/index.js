const { Sequelize } = require('sequelize');
const config = require('../config/config');
const defineDocument = require('./document');
const defineUser = require('./user');

const environment = process.env.NODE_ENV || 'development';
const databaseConfig = config[environment];
const databaseUrl = process.env[databaseConfig.use_env_variable];

if (!databaseUrl) {
  throw new Error('Не задана переменная окружения DATABASE_URL');
}

const sequelizeOptions = { ...databaseConfig };
delete sequelizeOptions.use_env_variable;
const sequelize = new Sequelize(databaseUrl, sequelizeOptions);
const Document = defineDocument(sequelize, Sequelize.DataTypes);
const User = defineUser(sequelize, Sequelize.DataTypes);

module.exports = {
  sequelize,
  Sequelize,
  Document,
  User,
};
