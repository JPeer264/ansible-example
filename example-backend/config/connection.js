module.exports = {
  database: process.env.DB_NAME || 'test',
  username: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'test',
  host: 'localhost',
  dialect: 'postgres',
};
