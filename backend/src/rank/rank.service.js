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
const defaultReceiveBody = {
  receiveCount: 0,
  receiveTotal: 0,
  receiveRank: "b",
  ranking: -1,
};
const defaultSendBody = {
  sendCount: 0,
  sendTotal: 0,
  sendRank: "b",
  ranking: -1,
};

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

    let res = new BaseResponse(SUCCESS_RESPONSE),
      responseBody = res.responseBody;
    if (!ranklist) {
      responseBody.ranklist = defaultReceiveBody;
      return res;
    }

    const ranking = await rankRepository.getReceiveRankingByWalletAddress(
      walletAddress,
    );

    responseBody.ranklist = { ...ranklist, ranking };
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

    let res = new BaseResponse(SUCCESS_RESPONSE),
      responseBody = res.responseBody;
    if (!ranklist) {
      responseBody.ranklist = defaultSendBody;
      return res;
    }

    const ranking = await rankRepository.getSendRankingByWalletAddress(
      walletAddress,
    );

    responseBody.ranklist = { ...ranklist, ranking };
    return res;
  }
}

module.exports = RankService;
