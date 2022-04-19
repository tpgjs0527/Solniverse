const { ReasonPhrases, StatusCodes } = require("http-status-codes");

var SUCCESS_RESPONSE = {
  statusCode: StatusCodes.OK,
  responseBody: {
    result: "success",
  },
};

var UNAUTHORIZED_RESPONSE = {
  statusCode: 401,
  responseBody: {
    result: "fail",
    message: ReasonPhrases.UNAUTHORIZED,
  },
};

var BAD_REQUEST_RESPONSE = {
  statusCode: 400,
  responseBody: {
    result: "fail",
    message: ReasonPhrases.BAD_REQUEST,
  },
};

module.exports = {
  SUCCESS_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  BAD_REQUEST_RESPONSE,
};
