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

const jwtUtil = require("../common/jwt-util");
const authJwtMiddleware = require("../../config/authJwtMiddleware");
const {
  BaseResponse,
  SUCCESS_RESPONSE,
  BAD_REQUEST_RESPONSE,
} = require("../common/base.response");
const {
  walletAddressParamCheck,
  walletAndsignatureBodyCheck,
  validate,
} = require("../common/validationMiddleware");
const { cookie } = require("express-validator");
// 아래와 jwt 인증이 필요한 부분에서 미들웨어로 사용가능.
// 아래 작성 후에 라우터를 작성하면 req.walletAddress 와 같이 접근 가능

router.get("/accessToken", authJwtMiddleware, function (req, res) {
  const { statusCode, responseBody } = new BaseResponse(SUCCESS_RESPONSE);
  res.status(statusCode).send(responseBody);
});

/**
 * WalletAddress와 signature를 request body로 받아 인증을 거쳐 jwt access token refresh token 반환
 */
router.post("/connect", walletAndsignatureBodyCheck, async function (req, res) {
  const walletAddress = req.body["walletAddress"];
  const signature = req.body["signature"];

  const { statusCode, responseBody } = await authService.getAccessTokenByVerify(
    signature,
    walletAddress,
  );
  if (statusCode == StatusCodes.OK) {
    const refreshToken = await jwtUtil.refresh(walletAddress);
    if (refreshToken)
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
    else {
      const { statusCode: badCode, responseBody: badBody } = new BaseResponse(
        BAD_REQUEST_RESPONSE,
      );
      res.status(badCode).send(badBody);
      return;
    }
  }
  res.statusCode = statusCode;
  res.send(responseBody);
});

/**
 * 사용자 지갑 주소를 입력받으면 user 추가. 기본적인 public key값 검증이 이루어짐
 */
router.post(
  "/connect/:walletAddress",
  walletAddressParamCheck,
  async function (req, res) {
    const walletAddress = req.params["walletAddress"];
    const { statusCode, responseBody } =
      await authService.createUserByWalletAddress(walletAddress);

    res.statusCode = statusCode;
    res.send(responseBody);
  },
);

/**
 * Refresh token을 이용해서 유효한 토큰이면 Access Token을 반환 받음.
 */
router.post(
  "/refresh",
  validate([cookie("refreshtoken").isLength({ max: 300 })]),
  async function (req, res) {
    const refreshToken = req.cookies["refreshtoken"];
    const walletAddress = req.body["walletAddress"];

    const { statusCode, responseBody } = await authService.refreshAccessToken(
      walletAddress,
      refreshToken,
    );
    res.statusCode = statusCode;
    res.send(responseBody);
  },
);

/**
 * 사용자 지갑 주소를 입력받으면 user를 반환.
 */
router.get(
  "/connect/:walletAddress",
  walletAddressParamCheck,
  async function (req, res) {
    const walletAddress = req.params["walletAddress"];
    const { statusCode, responseBody } =
      await authService.getUserByWalletAddress(walletAddress);
    res.statusCode = statusCode;
    res.send(responseBody);
  },
);

/**
 * 사용자 지갑 주소를 입력받으면 sign할 평문을 반환. 추가로 nonce를 cookie로 전달.
 */
router.get(
  "/sign/:walletAddress",
  walletAddressParamCheck,
  async function (req, res) {
    const walletAddress = req.params["walletAddress"];
    const { statusCode, responseBody } =
      await authService.getSignMessageByWalletAddress(walletAddress);
    res.statusCode = statusCode;
    res.send(responseBody);
  },
);

/**
 * 사용자 jwt access 코드를 받으면 userKey를 전달.
 */
router.get("/userKey", authJwtMiddleware, async function (req, res) {
  const walletAddress = req.walletAddress;
  const { statusCode, responseBody } =
    await authService.getUserKeyByWalletAddress(walletAddress);
  res.statusCode = statusCode;
  res.send(responseBody);
});

/**
 * 트위치 OAuth 를 통한 정보 수정.
 * @TODO Twitch 뿐만 아닌 다른 platform 별 switch로 동작하기 변경. jwt middleware를 사용하도록 변경
 */

router.post("/oauth", authJwtMiddleware, async function (req, res) {
  const walletAddress = req.walletAddress;
  const code = req.body["code"];

  const { statusCode, responseBody } = await authService.insertUserInfo(
    walletAddress,
    code,
  );

  //res send
  res.statusCode = statusCode;
  res.send(responseBody);
});

module.exports = router;
