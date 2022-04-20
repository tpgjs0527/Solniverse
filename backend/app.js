const createError = require("http-errors");
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const cookie = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
global.logger || (global.logger = require("./config/logger")); // → 전역에서 사용
const morganMiddleware = require("./config/morganMiddleware");
require("dotenv").config();

const authRouter = require("./src/auth/auth.controller");
const donationRouter = require("./src/donation/donation.controller");

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookie());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      //세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      //세션 만료시 삭제
      autoRemove: "interval",
      autoRemoveInterval: 60 * 24,
      //세션 변경 이외에 새로운 요청을 보낼 때마다 세션이 새로 저장되는 것이 아닌 24시간에 한 번 저장
      touchAfter: 24 * 3600,
    }),
  })
);
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
