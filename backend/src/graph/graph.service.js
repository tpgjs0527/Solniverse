/**
 * Services Logics related to Digital Assets(item)
 * Service/Repository 레이어의 함수를 호출해야합니다.
 *
 * @format
 */

const UserSchema = require("../../model/User");
const UserRepository = require("../auth/user.repository");
const userRepository = new UserRepository();
const {
  BAD_REQUEST_RESPONSE,
  SUCCESS_RESPONSE,
  NOT_FOUND_RESPONSE,
  CONFLICT_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  BaseResponse,
  JWT_EXPIRED_MESSAGE,
} = require("../common/base.response");
const TransactionRepository = require("./transaction.repository");
const transactionRepository = new TransactionRepository();

/**
 * 재활용 response들
 */
const badRequestResponse = new BaseResponse(BAD_REQUEST_RESPONSE);
const notFoundResponse = new BaseResponse(NOT_FOUND_RESPONSE);
const conflictResponse = new BaseResponse(CONFLICT_RESPONSE);

// const message =
//   "Sign this message for authenticating with your wallet. Nonce: ";
class AuthService {
  /**
   * walletAddress받아서 후원받은 내역을 조회한다.
   * @param {string} walletAddress
   * @returns response
   */
  async receive(walletAddress) {
    const { _id } = await userRepository.getUserByWalletAddress(walletAddress);

    const transaction = await transactionRepository.receive(_id);
    if (!transaction) return notFoundResponse;

    let res = new BaseResponse(SUCCESS_RESPONSE),
      responseBody = res.responseBody;
    responseBody.transaction = transaction;
    return res;
  }

  /**
   * walletAddress받아서 후원한 내역을 조회한다.
   * @param {string} walletAddress
   * @returns response
   */
  async give(walletAddress) {
    const { _id } = await userRepository.getUserByWalletAddress(walletAddress);

    const transaction = await transactionRepository.give(_id);
    if (!transaction) return notFoundResponse;

    let res = new BaseResponse(SUCCESS_RESPONSE),
      responseBody = res.responseBody;
    responseBody.transaction = transaction;
    return res;
  }
}

module.exports = AuthService;
