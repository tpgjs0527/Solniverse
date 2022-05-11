/**
 * DB 연동을 위한 설정
 * MongoDB
 *
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

/**
 * 라우터별로 하나씩 동작하기 때문에 동시성 문제가 생기는 것은 주의해야함.
 * @returns conn
 */
module.exports = function connectionFactory() {
  const conn = mongoose.createConnection(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  //connection에 model 연결
  conn.model("User", require("../model/User"));
  conn.model("Transaction", require("../model/Transaction"));
  conn.model("RefreshToken", require("../model/RefreshToken"));
  conn.model("Rank", require("../model/Rank"));
  conn.model("CandyMachine", require("../model/CandyMachine"));

  return conn;
};

// module.exports = connection;
