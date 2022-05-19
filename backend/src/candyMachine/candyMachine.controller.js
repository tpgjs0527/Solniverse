/**
 * /candyMachine APIs
 * 주석처리되어 있는 코드들은 모두 구현과 관련없이 참고용으로만 써야함.
 * 완전히 다른 방식으로 구현해야할 수도 있음.
 *
 * @format
 */

const express = require("express");
const {
  BAD_REQUEST_RESPONSE,
  BaseResponse,
} = require("../common/base.response");
const verifySignatureMiddleware = require("../common/verifySignatureMiddleware");
const router = express.Router();
const CandyMachineService = require("./candyMachine.service");
const candyMachineService = new CandyMachineService();

const badRequestResponse = new BaseResponse(BAD_REQUEST_RESPONSE);

/**
 * POST 요청시 캔디머신 데이터를 받아 추가하는 라우터
 */
router.post("/", verifySignatureMiddleware, async function (req, res) {
  if (req.user.authority != "normal") {
    const { statusCode: badCode, responseBody: badBody } = badRequestResponse;
    res.status(badCode).send(badBody);
    return;
  }
  const { statusCode, responseBody } =
    await candyMachineService.createCandyMachine("", "");
  res.status(statusCode).send(responseBody);
});

/**
 * GET 요청시 캔디머신 리스트를 반환해주는 라우터
 */
router.get("/", async function (req, res) {
  const { statusCode, responseBody } =
    await candyMachineService.getCandyMachineList();
  res.status(statusCode).send(responseBody);
});

module.exports = router;
