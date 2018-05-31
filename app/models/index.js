const config = require('config');
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.database.instance,
  config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
  });

// load model definition from external files
const User = sequelize.import(path.resolve(__dirname, 'user'));
const Account = sequelize.import(path.resolve(__dirname, 'account'));
const Transaction = sequelize.import(path.resolve(__dirname, 'transaction'));

// Define model relationships
User.hasMany(Account);
Account.belongsTo(User);
Account.hasMany(Transaction);
Transaction.belongsTo(Account);

module.exports = sequelize;