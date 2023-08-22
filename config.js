require('dotenv').config();

// console.log(process.env.MYSQL_HOST);

const config = {
  db: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || '3306',
    user: process.env.MYSQL_USER_NAME || 'root', /* MySQL User */
    password: process.env.MYSQL_PASSWORD || 'root123', /* MySQL Password */
    database: process.env.MYSQL_DB_NAME || 'db_zenblog' /* MySQL Database */
  },
  listPerPage: 10,
};

module.exports = config;