const Sequelize = require('sequelize');


const dbConfig = {
  database: 'creditsystem',
  username: 'root',
  password: '123456',
  host: '127.0.0.1',
  dialect: 'mysql',
};


const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the MySQL database:', err);
  });

module.exports = sequelize;
