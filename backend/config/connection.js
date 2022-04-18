/**
 * DB 연동을 위한 설정
 * MongoDB
 *
 * @format
 */

// const mysql = require("mysql2");
// require("dotenv").config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_SCHEMA,
// });

// module.exports = connection;
const mongoose = require("mongoose");
require("dotenv").config();

const connection = mongoose.createConnection(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
