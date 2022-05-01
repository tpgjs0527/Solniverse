/**
 * /donation APIs
 * 주석처리되어 있는 코드들은 모두 구현과 관련없이 참고용으로만 써야함.
 * 완전히 다른 방식으로 구현해야할 수도 있음.
 *
 * @format
 */

const express = require("express");
const platforms = require("../../config/platforms");
const {
  BAD_REQUEST_RESPONSE,
  BaseResponse,
} = require("../common/base.response");
const router = express.Router();
const DonationService = require("./donation.service");
const donationService = new DonationService();

/**
 * 후원 실제로 보내기 전 받는 POST 라우터
 */
router.post("/send", async function (req, res) {
  const displayName = req.body["displayName"],
    message = req.body["message"],
    platform = req.body["platform"] || "";
  if (!platforms.includes(platform)) {
    const { statusCode, responseBody } = new BaseResponse(BAD_REQUEST_RESPONSE);
    res.statusCode = statusCode;
    res.send(responseBody);
    return;
  }
  const { statusCode, responseBody } = await donationService.createTransaction(
    displayName,
    message,
    platform,
  );
  res.statusCode = statusCode;
  res.send(responseBody);
});

/**
 * TODO 보낸 후원 리스트 조회
 */
router.get("/list/send", async function (req, res) {
  // const itemId = req.params["itemId"];
  // const data = req.body;

  //   const { statusCode, responseBody } =
  //     await donationService.대충보낸후원내역GET(
  //       walletAddress
  //     );
  const responseBody = {
    result: "success",
    data: {
      list: [
        {
          name: "더미",
          type: "usdc",
          amount: 100,
          message: "더미데이터입니다.",
          time: Date.now(),
        },
        {
          name: "더미2",
          type: "usdc",
          amount: 200,
          message: "더미데이터2입니다.",
          time: Date.now(),
        },
      ],
    },
  };

  // res.statusCode = statusCode;
  res.statusCode = 200;
  res.send(responseBody);
});

/**
 * TODO 받은 후원 리스트 조회
 */
router.get("/list/receive", async function (req, res) {
  //   const { statusCode, responseBody } =
  //     await donationService.대충받은후원내역GET(
  //       walletAddress
  //     );

  const responseBody = {
    result: "success",
    data: {
      list: [
        {
          name: "더미",
          type: "usdc",
          amount: 100,
          message: "더미데이터입니다.",
          time: Date.now(),
        },
        {
          name: "더미2",
          type: "usdc",
          amount: 200,
          message: "더미데이터2입니다.",
          time: Date.now(),
        },
      ],
    },
  };

  // res.statusCode = statusCode;
  res.statusCode = 200;
  res.send(responseBody);
});

/**
 * TODO 받은 NFT 목록 조회
 */
router.get("/list/nft", async function (req, res) {
  //   const { statusCode, responseBody } =
  //     await donationService.대충얻은NFT목록GET(
  //       walletAddress
  //     );

  const responseBody = {
    result: "success",
    data: {
      list: [
        {
          name: "더미",
          type: "usdc",
          amount: 100,
          message: "더미데이터입니다.",
          time: Date.now(),
        },
        {
          name: "더미2",
          type: "usdc",
          amount: 200,
          message: "더미데이터2입니다.",
          time: Date.now(),
        },
      ],
    },
  };

  // res.statusCode = statusCode;
  res.statusCode = 200;
  res.send(responseBody);
});

/**
 * TODO 보낸 후원 차트 데이터
 */
router.get("/chart/send", async function (req, res) {
  // 차트 데이터는 dc 차트 https://dc-js.github.io/dc.js/  와  https://github.com/dc-js/dc.js
  // 를 참고해서 반환해야할듯
  //   const { statusCode, responseBody } =
  //     await donationService.대충얻은NFT목록GET(
  //       walletAddress
  //     );

  const responseBody = {
    result: "success",
    data: {
      list: [
        {
          name: "더미",
          type: "usdc",
          amount: 100,
          message: "더미데이터입니다.",
          time: Date.now(),
        },
        {
          name: "더미2",
          type: "usdc",
          amount: 200,
          message: "더미데이터2입니다.",
          time: Date.now(),
        },
      ],
    },
  };

  // res.statusCode = statusCode;
  res.statusCode = 200;
  res.send(responseBody);
});

/**
 * TODO 보낸 후원 차트 데이터
 */
router.get("/chart/receive", async function (req, res) {
  // 차트 데이터는 dc 차트 https://dc-js.github.io/dc.js/  와  https://github.com/dc-js/dc.js
  // 를 참고해서 반환해야할듯
  //   const { statusCode, responseBody } =
  //     await donationService.대충얻은NFT목록GET(
  //       walletAddress
  //     );

  const responseBody = {
    result: "success",
    data: {
      list: [
        {
          name: "더미",
          type: "usdc",
          amount: 100,
          message: "더미데이터입니다.",
          time: Date.now(),
        },
        {
          name: "더미2",
          type: "usdc",
          amount: 200,
          message: "더미데이터2입니다.",
          time: Date.now(),
        },
      ],
    },
  };

  // res.statusCode = statusCode;
  res.statusCode = 200;
  res.send(responseBody);
});

module.exports = router;
