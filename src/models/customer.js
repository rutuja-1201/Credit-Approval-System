
const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

const Customer = sequelize.define('Customer', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  age: Sequelize.INTEGER,
  monthly_income: Sequelize.INTEGER,
  approved_limit: Sequelize.INTEGER,
  phone_number: Sequelize.INTEGER,
});

module.exports = Customer;
