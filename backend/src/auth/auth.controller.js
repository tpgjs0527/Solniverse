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
const axios = require("axios");

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
