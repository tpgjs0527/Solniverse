/**
 * /donation APIs
 * 주석처리되어 있는 코드들은 모두 구현과 관련없이 참고용으로만 써야함.
 * 완전히 다른 방식으로 구현해야할 수도 있음.
 *
 * @format
 */

const express = require("express");
const { body } = require("express-validator");
const platforms = require("../../config/platforms");
const {
  BAD_REQUEST_RESPONSE,
  BaseResponse,
} = require("../common/base.response");
const { validate } = require("../common/validationMiddleware");
const router = express.Router();
const DonationService = require("./donation.service");
const donationService = new DonationService();

/**
 * 후원 실제로 보내기 전 받는 POST 라우터
 */
router.post(
  "/send",
  validate([
    body("displayName").trim().isLength({ min: 1, max: 15 }),
    body("message").trim().isLength({ max: 50 }),
    body("platform")
      .trim()
      .isLength({ max: 14 })
      .bail()
      .custom((value) => /(^$|twitch|youtube)/g.exec(value)[0] === value),
  ]),
  async function (req, res) {
    const displayName = req.body["displayName"],
      message = req.body["message"],
      platform = req.body["platform"] || "";
    if (!platforms.includes(platform)) {
      const { statusCode: badCode, responseBody: badBody } = new BaseResponse(
        BAD_REQUEST_RESPONSE,
      );
      res.statusCode = badCode;
      res.send(badBody);
      return;
    }
    const { statusCode, responseBody } =
      await donationService.createTransaction(displayName, message, platform);
    res.statusCode = statusCode;
    res.send(responseBody);
  },
);

module.exports = router;
