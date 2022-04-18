/**
 * /auth APIs
 * 주석처리되어 있는 코드들은 모두 구현과 관련없이 참고용으로만 써야함.
 * 완전히 다른 방식으로 구현해야할 수도 있음.
 *
 * @format
 */

const express = require("express");
const router = express.Router();
const AuthService = require("./auth.service");
const authService = new AuthService();

/**
 * TODO OAuth 2.0 Authorization code 정보 혹은 access Token을 받아 백엔드에 기록
 * Authorization code 정보일 경우엔 OAuth Access Token은 백엔드에서 트위치 Authorization 서버에서 받아와야함.
 */
router.post("/connect", async function (req, res) {
  const responseBody = {
    result: "success",
    data: {
      // 이 내용을 jwt로 제공해야할 수도 있음.
      user: {
        id: 0,
        name: "더미",
        walletAddress: "지갑주소",
        twitch: {
          test: "대충 테스트 정보들",
        },
      },
    },
  };

  res.statusCode = 200;
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
