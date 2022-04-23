const createError = require("http-errors");
const express = require("express");
require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const cookie = require("cookie-parser");
global.logger || (global.logger = require("./config/logger")); // → 전역에서 사용
const morganMiddleware = require("./config/morganMiddleware");

const authRouter = require("./src/auth/auth.controller");
const donationRouter = require("./src/donation/donation.controller");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://www.solniverse.net/", /localhost:*/],
    credentials: true,
  }),
);
app.use(cookie());
app.use(morganMiddleware); // 콘솔창에 통신결과 나오게 해주는 것
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// 개발용
app.use("/api/auth", authRouter);
app.use("/api/donation", donationRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.status(404);
  res.send(createError(404));
});

// error handler
app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
