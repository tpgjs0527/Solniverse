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
const axios = require("axios");

const authJwtMiddleware = require("../../config/authJwtMiddleware");
const jwtUtil = require("../common/jwt-util");
const { BAD_REQUEST_RESPONSE } = require("../common/base.response");
// 아래와 jwt 인증이 필요한 부분에서 미들웨어로 사용가능.
// 아래 작성 후에 라우터를 작성하면 req.walletAddress 와 같이 접근 가능
// router.post("/connect", authJwtMiddleware);

/**
 * @TODO OAuth 2.0 Authorization code 정보 혹은 access Token을 받아 백엔드에 기록
 * Authorization code 정보일 경우엔 OAuth Access Token은 백엔드에서 트위치 Authorization 서버에서 받아와야함.
 */

/**
 * WalletAddress와 signature를 request body로 받아 인증을 거쳐 jwt access token refresh token 반환
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
    const refreshToken = await jwtUtil.refresh(walletAddress);
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });
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
 * 리프레시 토큰과  user 추가. 기본적인 public key값 검증이 이루어짐
 */
router.post("/refresh", async function (req, res) {
  const refreshToken = req.cookies["refreshtoken"];
  const walletAddress = req.body["walletAddress"];

  const { statusCode, responseBody } = await authService.refreshAccessToken(
    walletAddress,
    refreshToken
  );
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

  const userinfo = {
    access_token : "",
    refresh_token : "",
    token_type : "",
    login : "",
    display_name : "",
    profileimage_url : ""
  };

  // 토큰 받아와서 트위치 프로필 정보까지 받아오기
  axios.post(
    'https://id.twitch.tv/oauth2/token',
    'client_id=uve26y4qxaoq0p6t5elsja089p1gn4'+
    '&client_secret=1mh4jp98i7t3jobse6dtdntoojnsz7'+
    '&code='+req.code+
    '&grant_type=authorization_code'+
    '&redirect_uri=http://localhost:3000',
    {'Content-Type': 'application/x-www-form-urlencoded'}
  ).then((res)=>{
    console.log(res);

    userinfo.access_token = res.access_token;
    userinfo.refresh_token = res.refresh_token;
    userinfo.token_type = res.token_type;

    

  });

  // DB에 저장
  const responseBody = await authService.insertUserInfo(userinfo);

  //res send
  res.statusCode = 200;
  res.send(responseBody);
});

module.exports = router;
