const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const SUCCESS_RESPONSE = {
  statusCode: StatusCodes.OK,
};

const UNAUTHORIZED_RESPONSE = {
  statusCode: StatusCodes.UNAUTHORIZED,
  message: ReasonPhrases.UNAUTHORIZED,
};

const BAD_REQUEST_RESPONSE = {
  statusCode: StatusCodes.BAD_REQUEST,
  message: ReasonPhrases.BAD_REQUEST,
};

const NOT_FOUND_RESPONSE = {
  statusCode: StatusCodes.NOT_FOUND,
  message: ReasonPhrases.NOT_FOUND,
};

const CONFLICT_RESPONSE = {
  statusCode: StatusCodes.CONFLICT,
  message: ReasonPhrases.CONFLICT,
};

const JWT_EXPIRED_MESSAGE = "jwt expired";

class BaseResponse {
  /**
   * BaseResponse 생성자.
   * @param {SUCCESS_RESPONSE|UNAUTHORIZED_RESPONSE|BAD_REQUEST_RESPONSE|NOT_FOUND_RESPONSE|CONFLICT_RESPONSE} type
   */
  constructor(type) {
    this.statusCode = type.statusCode;
    this.responseBody = {
      result: type.statusCode == StatusCodes.OK ? "success" : "fail",
      message: type.message,
    };
  }
}

module.exports = {
  SUCCESS_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  CONFLICT_RESPONSE,
  JWT_EXPIRED_MESSAGE,
  BaseResponse,
};
