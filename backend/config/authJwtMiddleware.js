const { StatusCodes } = require("http-status-codes");
const {
  BaseResponse,
  BAD_REQUEST_RESPONSE,
} = require("../src/common/base.response");
const { verify } = require("../src/common/jwt-util");

const authJwtMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    // header에서 access token을 가져옴
    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token) {
      const { statusCode, responseBody } = new BaseResponse(
        BAD_REQUEST_RESPONSE,
      );
      res.status(statusCode).send(responseBody);
      return;
    }

    const result = verify(token); // token 검증
    if (result.ok) {
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수(다음 미들웨어)로 이동
      req.walletAddress = result.walletAddress;
      req.authority = result.authority;
      next();
    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답
      res.status(StatusCodes.UNAUTHORIZED).send({
        result: "fail",
        message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'
      });
    }
  } else {
    const { statusCode, responseBody } = new BaseResponse(BAD_REQUEST_RESPONSE);
    res.status(statusCode).send(responseBody);
    return;
  }
};

module.exports = authJwtMiddleware;
