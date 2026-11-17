require('dotenv').config({ path: require('path').join(__dirname, '../.env'), quiet: true });
const connection = { use_env_variable: 'DATABASE_URL', dialect: 'postgres', logging: false };
module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
  },
  test: { ...connection },
  production: { ...connection },
};
