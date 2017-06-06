/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');
const mapRoutes = require('express-routes-mapper');
const UserController = require('./controllers/UserController');

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


// environment: development, testing, production
const environment = process.env.NODE_ENV;

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

app.use(cors());

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/user', (req, res) => UserController().create(req, res));
app.get('/users', (req, res) => UserController().getAll(req, res));


server.listen(port, () => (
  database
    .sync()
    .then(() => {
      // keep data in database after restart
      console.log(`There we go ♕\nStarted in ${environment}\nGladly listening on http://127.0.0.1:${port}`);
      console.log('Connection to the database has been established successfully');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    })
));
