const publicRoutes = require('./publicRoutes');

module.exports = {
  keep: false,
  publicRoutes,
  port: process.env.PORT || '3333',
};
