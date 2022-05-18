const UserSchema = require("../../model/User");
const UserRepository = require("../auth/user.repository");
const userRepository = new UserRepository();
const {
  SUCCESS_RESPONSE,
  NOT_FOUND_RESPONSE,
  BaseResponse,
} = require("../common/base.response");
const TransactionRepository = require("./transaction.repository");
const transactionRepository = new TransactionRepository();

/**
 * 재활용 response들
 */
const notFoundResponse = new BaseResponse(NOT_FOUND_RESPONSE);

class GraphService {
  /**
   * walletAddress받아서 후원받은 내역을 조회한다.
   * @param {string} walletAddress
   * @returns response
   */
  async getRecieveList(walletAddress) {
    const { _id } = await userRepository.getUserByWalletAddress(walletAddress);

    const transaction =
      await transactionRepository.getTransactionsByRecieveUserId(_id);
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
  async getSendList(walletAddress) {
    const { _id } = await userRepository.getUserByWalletAddress(walletAddress);

    const transaction = await transactionRepository.getTransactionBySendUserId(
      _id,
    );
    if (!transaction) return notFoundResponse;

    let res = new BaseResponse(SUCCESS_RESPONSE),
      responseBody = res.responseBody;
    responseBody.transaction = transaction;
    return res;
  }
}

module.exports = GraphService;
