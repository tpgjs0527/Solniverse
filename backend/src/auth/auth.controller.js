/**
 * /auth APIs
 * 주석처리되어 있는 코드들은 모두 구현과 관련없이 참고용으로만 써야함.
 * 완전히 다른 방식으로 구현해야할 수도 있음.
 *
 * @format
 */

const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();
const AuthService = require("./auth.service");
const authService = new AuthService();

/**
 * @TODO OAuth 2.0 Authorization code 정보 혹은 access Token을 받아 백엔드에 기록
 * Authorization code 정보일 경우엔 OAuth Access Token은 백엔드에서 트위치 Authorization 서버에서 받아와야함.
 */

/**
 * WalletAddress와 signature를 request body로 받아 인증을 거쳐 session verified 설정
 */
router.post("/connect", async function (req, res) {
  const nonce = req.cookies["nonce"];
  const walletAddress = req.body["walletAddress"];
  const signature = req.body["signature"];
  const { statusCode, responseBody } =
    await authService.verifyAddressFromSignature(
      nonce,
      walletAddress,
      signature
    );
  if (statusCode == StatusCodes.OK) {
    req.session.verified = true;
    req.session.save();
  }
  res.statusCode = statusCode;
  res.send(responseBody);
});

/**
 * 사용자 지갑 주소를 입력받으면 user 추가. 기본적인 public key값 검증이 이루어짐
 */
router.post("/connect/:walletAddress", async function (req, res) {
  const walletAddress = req.params["walletAddress"];
  const { statusCode, responseBody } =
    await authService.createUserByWalletAddress(walletAddress);

  res.statusCode = statusCode;
  res.send(responseBody);
});

/**
 * 사용자 지갑 주소를 입력받으면 user를 반환.
 */
router.get("/connect/:walletAddress", async function (req, res) {
  const walletAddress = req.params["walletAddress"];
  const { statusCode, responseBody } = await authService.getUserByWalletAddress(
    walletAddress
  );
  res.statusCode = statusCode;
  res.send(responseBody);
});

/**
 * 사용자 지갑 주소를 입력받으면 nonce를 반환. nonce를 cookie로 전달 및 body로 전달
 */
router.get("/nonce/:walletAddress", async function (req, res) {
  const walletAddress = req.params["walletAddress"];
  const { statusCode, responseBody } =
    await authService.getNonceByWalletAddress(walletAddress);
  if (statusCode == StatusCodes.OK) {
    res.cookie("nonce", responseBody.nonce, { httpOnly: true });
  }
  res.statusCode = statusCode;
  res.send(responseBody);
});

router.post("/oauth", async function (req, res) {
  const responseBody = {
    result: "success",
    data: {},
  };

  res.statusCode = 200;
  res.send(responseBody);
});

module.exports = router;
