/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');

/**
 * server configuration
 */
const config = require('../config/');
const database = require('../config/database');

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const port = process.env.PORT_ENV || config.port;
const mappedRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');

// environment: development, testing, production
const environment = process.env.NODE_ENV;

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// fill routes for express appliction
app.use('/', mappedRoutes);

server.listen(port, () => (
  database
    .sync()
    .then(() => {
      // keep data in database after restart
      return database
        .sync()
        .then(() => {
          console.log(`There we go ♕\nStarted in ${environment}\nGladly listening on http://127.0.0.1:${port}`);
          console.log('Connection to the database has been established successfully');
        });
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    })
));
