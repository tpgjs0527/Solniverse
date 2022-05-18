const express = require("express");
const { walletAddressParamCheck } = require("../common/validationMiddleware");
const router = express.Router();
const RankService = require("./rank.service");
const rankService = new RankService();

/**
 * walletAddress를 통해 후원 받은 랭크 가져오기
 */

router.get(
  "/receive/:walletAddress",
  walletAddressParamCheck,
  async function (req, res) {
    const walletAddress = req.params["walletAddress"];

    const { statusCode, responseBody } = await rankService.getRecieveRank(
      walletAddress,
    );

    //res send
    res.statusCode = statusCode;
    res.send(responseBody);
  },
);

/**
 * walletAddress를 통해 후원한 랭크 가져오기
 */

router.get(
  "/send/:walletAddress",
  walletAddressParamCheck,
  async function (req, res) {
    const walletAddress = req.params["walletAddress"];

    const { statusCode, responseBody } = await rankService.getSendRank(
      walletAddress,
    );

    //res send
    res.statusCode = statusCode;
    res.send(responseBody);
  },
);

module.exports = router;
