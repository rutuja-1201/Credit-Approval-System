
const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

const Loan = sequelize.define('Loan', {
  customer_id: Sequelize.INTEGER,
  loan_amount: Sequelize.FLOAT,
  interest_rate: Sequelize.FLOAT,
  tenure: Sequelize.INTEGER,
  
});

module.exports = Loan;
