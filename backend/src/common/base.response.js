const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const SUCCESS_RESPONSE = {
  statusCode: StatusCodes.OK,
  responseBody: {
    result: "success",
  },
};

const UNAUTHORIZED_RESPONSE = {
  statusCode: StatusCodes.UNAUTHORIZED,
  responseBody: {
    result: "fail",
    message: ReasonPhrases.UNAUTHORIZED,
  },
};

const BAD_REQUEST_RESPONSE = {
  statusCode: StatusCodes.BAD_REQUEST,
  responseBody: {
    result: "fail",
    message: ReasonPhrases.BAD_REQUEST,
  },
};

const NOT_FOUND_RESPONSE = {
  statusCode: StatusCodes.NOT_FOUND,
  responseBody: {
    result: "fail",
    message: ReasonPhrases.NOT_FOUND,
  },
};

const CONFLICT_RESPONSE = {
  statusCode: StatusCodes.CONFLICT,
  responseBody: {
    result: "fail",
    message: ReasonPhrases.CONFLICT,
  },
};

module.exports = {
  SUCCESS_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  CONFLICT_RESPONSE,
};
