const createError = require("http-errors");
const express = require("express");
require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const cookie = require("cookie-parser");
global.logger || (global.logger = require("./config/logger")); // → 전역에서 사용
const morganMiddleware = require("./config/morganMiddleware");
const { Types } = require("mongoose");

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

require("./src/donation/donation.web3");

const { web3, connection } = require("./config/web3.connection");
const DonationRepository = require("./src/donation/donation.repository");
const donationRepository = new DonationRepository();
const DonationService = require("./src/donation/donation.service");
const donationService = new DonationService();
// donationRepository.findExistTransaction(
//   "RpigkMduJPjCobrBJXaK68kRLGTJ3UbEwxRgFDADFNC",
// );

async function getLatestTransaction() {
  // db 가장 최신 값에서 tx_signature
  const test = await donationRepository.getLatestTransaction();
  const latestSignature = test.txSignature;

  // gettrancaction 테스트용
  // const tran = await connection.getTransaction(test[0].tx_signature);
  // console.log(tran.transaction.message.accountKeys[0]);
  // getSignaturesForAddress용 월렛 아이디
  const shopWallet = new web3.PublicKey(process.env.DDD_SHOP_WALLET);
  const tran2 = await connection.getSignaturesForAddress(shopWallet, {
    until:
      // latestSignature
      "2pdsaV9LWDzfPRbqjTpSLJkV88TGwzSkQeVBTZrM2nLjX9CMAjdFhj56e3sqC7yE5bHi28n7Ctv2zdEtjEDfEUh1",
  });
  // console.log(tran2);
  if (tran2.length > 0) {
    for (let i = 0; i < tran2.length; i++) {
      const memo = tran2[i].memo;
      const start = memo.indexOf("]");
      // const txId = memo.substring(start + 2);
      const txId = "626aba62d7a5ef5e5d799d8f";
      // const signature = tran2[i].signature;
      const signature =
        "3SwGCYz2NGhTkvUzznXM9TnCVGB6qdiSjapgvrutsbnAPi6fEpzyBiqSnixjNEEqGmyrErMqPc7NTsTyN39eomZW";
      // console.log(txId);

      // const existTx = await donationRepository.findExistTransaction(txId);

      const transaction = await connection.getTransaction(signature);

      const ExistTx = await donationService.findExistTransactionAndUpdate(
        transaction,
        0,
      );
    }
  } else {
    // 미수신된 메세지가 없을 때
    console.log("wow");
    return;
  }
  console.log("끝");
}
getLatestTransaction();

module.exports = app;
