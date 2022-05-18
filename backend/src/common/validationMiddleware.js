const { validationResult, body, param } = require("express-validator");
const { BAD_REQUEST_RESPONSE, BaseResponse } = require("./base.response");
const { statusCode, responseBody } = new BaseResponse(BAD_REQUEST_RESPONSE);

/**
 * 비동기식 유효성 검사
 *
 * @param {Array} validations
 * @returns
 */
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(statusCode).send(responseBody);
  };
};

/**
 * 지갑 주소 검사
 */
const walletAddressParamCheck = validate([
  param("walletAddress")
    .trim()
    .isLength({ min: 20, max: 64 })
    .bail()
    .isAlphanumeric("en-US"),
]);

/**
 * 지갑 주소 검사
 */
const walletAddressBodyCheck = validate([
  body("walletAddress")
    .trim()
    .isLength({ min: 20, max: 64 })
    .bail()
    .isAlphanumeric("en-US"),
]);

/**
 * Signature 검사
 */
const walletAndsignatureBodyCheck = validate([
  body("walletAddress")
    .trim()
    .isLength({ min: 20, max: 64 })
    .bail()
    .isAlphanumeric("en-US"),
  body("signature")
    .trim()
    .isLength({ min: 20, max: 255 })
    .bail()
    .isAlphanumeric("en-US"),
]);

module.exports = {
  validate,
  walletAddressParamCheck,
  walletAddressBodyCheck,
  walletAndsignatureBodyCheck,
};
