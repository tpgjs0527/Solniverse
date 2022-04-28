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

// donationRepository.findExistTransaction(
//   "RpigkMduJPjCobrBJXaK68kRLGTJ3UbEwxRgFDADFNC",
// );
// console.log("here!");

async function getLatestTransaction() {
  // db 가장 최신 값에서 tx_signature
  const test = await donationRepository.getLatestTransaction();
  const latestSignature = test.tx_signature;

  // gettrancaction 테스트용
  // const tran = await connection.getTransaction(test[0].tx_signature);
  // console.log(tran.transaction.message.accountKeys[0]);
  // getSignaturesForAddress용 월렛 아이디
  const shopWallet = new web3.PublicKey(process.env.DDD_SHOP_WALLET);
  const tran2 = await connection.getSignaturesForAddress(
    (address = shopWallet),
    (options = {
      until:
        // latestSignature
        "5WjSK9BqFrED7t9Le9aEMEQExVk3p9CF7BqDLUKMjHrYx8zFieazjZe4gJ15eU6B7gU2vHeM1utwthxYzEnQnxc7",
    }),
  );
  // console.log(tran2);
  if (tran2.length > 0) {
    for (let i = 0; i < tran2.length; i++) {
      const memo = tran2[i].memo;
      const start = memo.indexOf("[");
      const end = memo.indexOf("]");
      const txid = memo.substring(start + 1, end);
      const existTx = await donationRepository.findExistTransaction(txid);
      if (existTx) {
        continue;
      } else {
        try {
          const tran = await connection.getTransaction(tran2[i].signature);
          // const signiture = tran.transanction.signatures;
          // console.log(signiture);

          const accountKeys = tran.transaction.message.accountKeys;

          const sendWallet = accountKeys[0].toString();
          const receiveWallet = accountKeys[1].toString();

          // const send_user = await getUserOrCreate(sendWallet);

          // const receive_user = await getUserOrCreate(receiveWallet);
          const meta = tran.meta;
          let amount = meta.postBalances[1] - meta.preBalances[1];

          const data = {
            // _id에 숫자 넣는거 아니었나?
            // _id: new Types.ObjectId(txid),
            tx_signature: tran2[i].signature,
            payment_type: "sol",
            amount: amount,
            // getUserOrCreate로 수정해야함
            send_user_id: sendWallet,
            receive_user_id: receiveWallet,
          };
          // db에 저장
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
    }
  } else {
    console.log("wow");
  }
  // console.log(tran2);
}
getLatestTransaction();

module.exports = app;
