const Sequelize = require('sequelize');
const path = require('path');

const connection = require('./connection');

module.exports = (
  new Sequelize(
    connection.database,
    connection.username,
    connection.password,
    {
      host: connection.host,
      dialect: connection.dialect,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    }
  )
);
