# express-boilerplate

> Express REST API with JWT Authentication and support for sqlite, mysql, and postgres

- authentication via [JWT](https://jwt.io/)
- routes mapping via [express-routes-mapper](https://github.com/aichbauer/express-routes-mapper)
- support for [sqlite](https://www.sqlite.org/), [mysql](https://www.mysql.com/), and [postgres](https://www.postgresql.org/)
- environments for `development`, `testing`, and `production`
- linting via [eslint](https://github.com/eslint/eslint)
- integration tests running on [AVA](https://github.com/avajs/ava)
- built with [npm sripts](#npm-scripts)
- example for User model and User controller, with jwt authentication, simply type `npm i` and `npm start`

## Table of Contents

- [Install & Use](#install-and-use)
- [Folder Structure](#folder-structure)
- [Controllers](#controllers)
  - [Create a Controller](#create-a-controller)
- [Models](#models)
  - [Create a Model](#create-a-model)
- [Policies](#policies)
  - [auth.policy](#authpolicy)
- [Services](#services)
- [Config](#config)
  - [Connection and Database](#connection-and-database)
- [Routes](#routes)
  - [Create Routes](#create-routes)
- [Test](#test)
  - [Setup](#setup)
- [npm Scripts](#npm-scripts)

## Install and Use

Start by cloning this repository

```sh
# HTTPS
$ git clone https://github.com/aichbauer/express-boilerplate.git
```

then

```sh
# cd into project root
$ yarn
# to use mysql
$ yarn add mysql2
# to use postgres
$ yarn add pg pg-hstore
```

or

```sh
# cd into project root
$ npm i
# to use mysql
$ npm i mysql2 -S
# to use postgres
$ yarn i -S pg pg-hstore
```

sqlite is supported out of the box as it is the default.

## Folder Structure

This boilerplate has 4 main directories:

- api - for controllers, models, services, etc.
- config - for routes, database, etc.
- db - this is only a dir for the sqlite db, the default for NODE_ENV development
- test - using [AVA](https://github.com/avajs/ava)

```sh
src
├── api
│   ├── controllers
│   │   └── UserController.js
│   ├── models
│   │   └── User.js
│   ├── policies
│   │   └── auth.policy.js
│   ├── services
│   │   ├── auth.service.js
│   │   └── bcrypt.service.js
│   └── api.js
├── config
│   ├── connection.js
│   ├── database.js
│   ├── index.js
│   ├── privateRoutes.js
│   └── publicRoutes.js
├── db
│   └── database.sqlite
└── test
    ├── controllers
    │   └── UserController.test.js
    ├── models
    │   └── User.test.js
    └── setup
         └── _setup.js
```

## Controllers

### Create a Controller

Controllers in this boilerplate have a naming convention: `ModelnameController.js`  and uses an object factory pattern.
To use a model inside of your controller you have to require it.
We use [Sequelize](http://docs.sequelizejs.com/) as ORM, if you want further information read the [Docs](http://docs.sequelizejs.com/).

Example Controller for all **CRUD** oparations:

```js
const Model = require('../models/Model');

const ModelController = () => {
  const create = (req, res) => {
    // body is part of a form-data
    const value = req.body.value;

    Model.create({
      key: value
    }).then((model) => {
      if(!model) {
        return res.status(400).json({ msg: 'Bad Request: Model not found' });
      }

      return res.status(200).json({ model });
    }).catch((err) => {
      // better save it to log file
      console.error(err);

      return res.status(500).json({ msg: 'Internal server error' });
    });
  };

  const getAll = (req, res) {
    Model.findAll().then((models) => {
      if(!models){
        return res.status(400).json({ msg: 'Bad Request: Models not found' });
      }

      return res.status(200).json({ models });
    }).catch((err) => {
      // better save it to log file
      console.error(err);

      return res.status(500).json({ msg: 'Internal server error' });
    });
  };

  const get = (req, res) => {
    // params is part of an url
    const id = req.params.id;

    Model.findOne({
      where: {
        id,
      },
    }).then((model) => {
      if(!model) {
        return res.status(400).json({ msg: 'Bad Request: Model not found' });
      }

      return res.status(200).json({ model });
    }).catch((err) => {
      // better save it to log file
      console.error(err);

      return res.status(500).json({ msg: 'Internal server error' });
    });
  };

  const update = (req, res) => {
    // params is part of an url
    const id = req.params.id;

    // body is part of form-data
    const value = req.body.value;

    Model.findById(id).then((model) => {
      if(!model) {
        return res.status(400).json({ msg: 'Bad Request: Model not found' });
      }

      return model
        .update({
          key: value,
        }).then((updatedModel) => {
          return res.status(200).json({ updatedModel });
        });
    }).catch((err) => {
      // better save it to log file
      console.error(err);

      return res.status(500).json({ msg: 'Internal server error' });
    });
  };

  const destroy = (req, res) => {
    // params is part of an url
    const id = req.params.id;

    Model.findById(id).then((model) => {
      if(!model) {
        return res.status(400).json({ msg: 'Bad Request: Model not found' })
      }

      model.destroy().then(() => {
        return res.status(200).json({ msg: 'Successfully destroyed model' });
      }).catch((err) => {
        // better save it to log file
        console.error(err);

        return res.status(500).json({ msg: 'Internal server error' });
      });
    }).catch((err) => {
      // better save it to log file
      console.error(err);

      return res.status(500).json({ msg: 'Internal server error' });
    });
  };

  // IMPORTANT
  // don't forget to return the functions
  return {
    create,
    getAll,
    get,
    update,
    destroy,
  };
};

// IMPORTANT
// don't forget to export the Controller
model.exports = ModelController;
```

## Models

### Create a Model

Controllers in this boilerplate have a naming convention: `Model.js` and uses [Sequelize](http://docs.sequelizejs.com/) to define our Models, if you want further information read the [Docs](http://docs.sequelizejs.com/).

Example User Model:

```js
const Sequelize = require('sequelize');

// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(user) {
    user.password = bcryptSevice.password(user);
  },
};

// instanceMethods are functions that run on instances of our model
// toJSON runs before delivering it to our client
// we delete the password, that the client has no sensitive data
const instanceMethods = {
  toJSON() {
    const values = Object.assign({}, this.get());

    delete values.password;

    return values;
  },
};

// naming the table in DB
const tableName = 'users';

// the actual model
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
}, { hooks, instanceMethods, tableName });

// IMPORTANT
// don't forget to export the Model
module.exports = User;
```

## Policies

Policies are middleware functions that can run before hitting a apecific or more specified route(s).

Example policy:

Only allow if the user is marked as admin.

> Note: this is not a secure example, only for presentation puposes

```js
module.exports = (req, res, next) => {
  if(req.body.userrole === 'admin') {
    // do some verification stuff
    const verified = verifyAdmin(req.body.userid);

    if(verified) {
      return next();
    }

    return res.status(401).json({ msg: 'Unauthorized' });
  }

  return res.status(401).json({ msg: 'Unauthorized' });
};
```

To use this policy on all routes that only admins are allowed:

api.js

```js
const adminPolicy = require('./policies/admin.policy');

app.all('/admin/*', (req,res,next) => adminPolicy(req,res,next));
```

Or for one specific route

api.js

```js
const adminPolicy = require('./policies/admin.policy');

app.get('/admin/myroute',
  (req,res,next) => adminPolicy(req,res,next),
  (req,res) => {
  //do some fancy stuff
});
```

## auth.policy

The `auth.policy` checks wether a `JSON Web Token` ([further information](https://jwt.io/)) is send in the header of an request as `Authorization: Bearer [JSON Web Token]` or inside of the body of an request as `token: [JSON Web Token]`.
The policy runs default on all api routes that are are prefixed with `/private`. To map multiple routes read the [docs](https://github.com/aichbauer/express-routes-mapper/blob/master/README.md) from `express-routes-mapper`.

To use this policy on all routes of a specific prefix:

app.js

```js
app.use('/prefix', yourRoutes);
app.all('/prefix', (req, res, next) => auth(req, res, next));
```

or to use this policy on one specific route:

app.js

```js
app.get('/specificRoute',
  (req, res, next) => auth(req, res, next),
  (req, res) => {
  // do some fancy stuff
});
```

## Services

Services are little useful snippets, or calls to another API that are not the main focus of your API.

Example service:

Get comments from another API:

```js
module.exports = {
  getComments: () => (
    fetch('https://jsonplaceholder.typicode.com/comments', {
      method: 'get'
    }).then(function(res) {
      // do some fancy stuff with the response
    }).catch(function(err) {
      // Error :(
    })
  );
};
```

## Config

Holds all the server configurations.

## Connection and Database

> Note: if you use msql make sure mysql server is running on the machine

> Note: if you use postgres make sure postgres server is running on the machine

This two files are the way to establish a connaction to a database.

You only need to touch connection.js, default for `development` is sqlite, but it is easy as typing `mysql` or `postgres` to switch to another db.

> Note: to run a mysql db install these package with: `yarn add mysql2` or `npm i mysql2 -S`

> Note: to run a postgres db run these package with: `yarn add pg pg-hstore` or `npm i -S pg pg-hstore`

Now simple configure the keys with your credentials.

```js
{
  database: 'databasename',
  username: 'username',
  password: 'password',
  host: 'localhost',
  dialect: 'sqlite' || 'mysql' || 'postgres',
}
```

To not configure the production code.

To start let the DB now the credentials for production, add `environment variables` by typing e.g. `export DB_USER_ENV=yourusername` before starting the api.

## Routes

Here you define all your routes for your api. It doesn't matter how you structure them. By default they are mapped on `privateRoutes` and `publicRoutes`. You can define as much routes files as you want e.g. for every model or for specific use cases, e.g. normal user and admins.

## Create Routes

For further information read the [docs](https://github.com/aichbauer/express-routes-mapper/blob/master/README.md) of express-routes-mapper.

Example for User Model:

> Note: Only supported Methods are **POST**, **GET**, **PUT**, and **DELETE**. So no **PATCH** for updates, etc...

userRoutes.js

```
module.exports = {
  'POST /user': 'UserController.create',
  'GET /users': 'UserController.getAll',
  'GET /user/:id': 'UserController.get,
  'PUT /user/:id': 'UserController.update,
  'DELETE /user/',
};
```

To use these routes in your application, require them in the config/index.js and export them.

```js
const userRoutes = require('./userRoutes');

module.exports = {
  allTheOtherStuff,
  userRoutes,
};
```

api.js

```js
const mappedUserRoutes = mapRoutes(config.userRoutes, 'api/controllers/');

app.use('/prefix', mappedUserRoutes);

// to protect them with authentication
app.all('/prefix/*', (req, res, next) => auth(req, res, next));
```

# Test

All test for this boilerplate uses [AVA](https://github.com/avajs/ava) and [supertest](https://github.com/visionmedia/superagent) for integration testing. So read their docs on further information.

## Setup

The setup directory holds the `_setup.js` which holds `beforeAction` which starts a test express application and connects to your test database, and a `afterAction` which closes the db connection.

## Controller

> Note: those request are asynchronous, we use `async await` syntax.

> Note: As we don't use import statements inside the api we also use the require syntax for tests

To test a Controller we create `fake requests` to our api routes.

Example `GET /user` from last example with prefix `prefix`:

```js
const test = require('ava');
const request = require('supertest');
const {
  beforeAction,
  afterAction,
} = require('../setup/_setup');

let api;

test.before(async () => {
  api = await beforeAction();
});

test.after(() => {
  afterAction();
});

test('test', async (t) => {
  const token = 'this-should-be-a-valid-token';

  await request(api)
  .get('/prefix/user')
  .set('Accept', /json/)
  // if auth is needed
  .set('Authorization', `Bearer ${token}`)
  .set('Content-Type', 'application/json')
  .expect(200)
  .then((res) => {
    // do some fancy stuff
    t.truthy(res.body.users);
  });
});

```

## Models

Are usually automatically tested as the Controller uses the Models, but you can test them separatly.

## npm scripts

There are no automation tool or task runner like [grunt](https://gruntjs.com/) or [gulp](http://gulpjs.com/) used for this boilerplate. These boilerplate only uses npm scripts dfor automatization.

### Why?

All you can do with these scripts you can do with npm scripts, and cli tools, etc in much more readable and less code.
Most of the tasks you define in `grunt` or `gulp` are have multple lines and you need for everything a new plugin which means more dependencies.

### npm start

This is the entry for a developer. This command:

- a **nodemon watch task** for the all files conected to `.api/api.js`
- sets the **environment variable** `NODE_ENV` to `development`
- opens the db connection for `development`
- starts the server on 127.0.0.1:3333

### npm test

This command:

- runs linting ([eslint](http://eslint.org/)) with the [airbnb styleguide](https://github.com/airbnb/javascript) without arrow-parens rule for **better readability**
- sets the **environment variable** `NODE_ENV` to `testing`
- runs `nyc` the cli-tool for [istanbul](https://istanbul.js.org/) for test coverage
- runs ava -s for testing with [AVA](https://github.com/avajs/ava)

## npm run production

This command:

- sets the **environment variable** to `production`
- opens the db connection for `production`
- starts the server on 127.0.0.1:3333 or on 127.0.0.1:PORT_ENV

Before running on production you have to set the **environment vaiables**:

- DB_ENV - database name
- DB_USER_ENV - user for the production database
- DB_PW_ENV - password for production database user
- SECRET_ENV - secret for json web token

Optional:

- PORT_ENV - the port your api on 127.0.0.1, default to 3333

### other commands

- `npm run dev` - simply start the server withou a watcher
- `npm run dropDB` - drops **ONLY** the sqlite database
- `npm run lint` - linting with [eslint](http://eslint.org/)
- `npm run nodemon` - same as `npm start``
- `npm run prepush` - a hook wich runs before pushing to a repository, runs `npm test` and `npm run dropDB`
- `pretest` - runs linting before `npm test`
- `test-ci` - only runs tests, nothing in pretest, nothing in posttest, for better use with ci tools

