const { BaseResponse, BAD_REQUEST_RESPONSE } = require("./base.response");
const { verifyAddressBySignature } = require("../auth/auth.service");

const badRequestResponse = new BaseResponse(BAD_REQUEST_RESPONSE);

const verifySignatureMiddleware = async (req, res, next) => {
  const signature = req.body["signature"];
  const walletAddress = req.body["walletAddress"];

  const user = await verifyAddressBySignature(signature, walletAddress);
  if (!user) {
    const { statusCode, responseBody } = badRequestResponse;
    res.status(statusCode).send(responseBody);
    return;
  }
  req.user = user;
  next();
};

module.exports = verifySignatureMiddleware;
