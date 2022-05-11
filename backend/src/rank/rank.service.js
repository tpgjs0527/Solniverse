// const UserSchema = require("../../model/User");
// const UserRepository = require("../auth/user.repository");
// const userRepository = new UserRepository();
const {
  SUCCESS_RESPONSE,
  NOT_FOUND_RESPONSE,
  BaseResponse,
} = require("../common/base.response");
const RankRepository = require("./rank.repository");
const rankRepository = new RankRepository();

/**
 * 재활용 response들
 */
const notFoundResponse = new BaseResponse(NOT_FOUND_RESPONSE);

class RankService {
  /**
   * walletAddress받아서 후원받은 내역에 대한 랭크 기록을 가져온다.
   * @param {string} walletAddress
   * @returns response
   */
  async getRecieveRank(walletAddress) {
    const ranklist = await rankRepository.getReceiveRankListByWalletAddress(
      walletAddress,
    );
    if (!ranklist) return notFoundResponse;

    const rank = await rankRepository.getReceiveRankByWalletAddress(
      walletAddress,
    );

    let res = new BaseResponse(SUCCESS_RESPONSE),
      responseBody = res.responseBody;
    responseBody.ranklist = ranklist;
    responseBody.ranklist.rank = rank;
    return res;
  }

  /**
   * walletAddress받아서 후원한 내역에 대한 랭크 기록을 가져온다.
   * @param {string} walletAddress
   * @returns response
   */
  async getSendRank(walletAddress) {
    const ranklist = await rankRepository.getSendRankListByWalletAddress(
      walletAddress,
    );
    if (!ranklist) return notFoundResponse;

    const rank = await rankRepository.getSendRankByWalletAddress(walletAddress);

    let res = new BaseResponse(SUCCESS_RESPONSE),
      responseBody = res.responseBody;
    responseBody.ranklist = ranklist;
    responseBody.ranklist.rank = rank;
    return res;
  }
}

module.exports = RankService;
