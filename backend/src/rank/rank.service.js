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
  receiveRank: "Bronze",
  ranking: -1,
};
const defaultSendBody = {
  sendCount: 0,
  sendTotal: 0,
  sendRank: "Bronze",
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
    if (!ranklist || ranklist.receiveCount == 0) {
      responseBody.ranklist = defaultReceiveBody;
      return res;
    }

    const receiveTotal = ranklist.receiveTotal;

    /** @type {[Array<any>, Array<any>]} */
    const [previousList, nextList] = await Promise.all([
      rankRepository.getListByReceiveTotalAndCondAndLimit(
        receiveTotal,
        "$gt",
        5,
      ),
      rankRepository.getListByReceiveTotalAndCondAndLimit(
        receiveTotal,
        "$lt",
        5,
      ),
    ]);

    const ranking =
      (await rankRepository.getReceiveRankingByReceiveTotal(receiveTotal)) + 1;

    responseBody.ranklist = {
      ...ranklist,
      ranking,
      previousList: previousList.reverse(),
      nextList,
    };
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
    if (!ranklist || ranklist.sendCount == 0) {
      responseBody.ranklist = defaultSendBody;
      return res;
    }

    const sendTotal = ranklist.sendTotal;

    const [previousList, nextList] = await Promise.all([
      rankRepository.getListBySendTotalAndCondAndLimit(sendTotal, "$gt", 5),
      rankRepository.getListBySendTotalAndCondAndLimit(sendTotal, "$lt", 5),
    ]);

    const ranking =
      (await rankRepository.getSendRankingBySendTotal(sendTotal)) + 1;

    responseBody.ranklist = {
      ...ranklist,
      ranking,
      previousList: previousList.reverse(),
      nextList,
    };
    return res;
  }
}

module.exports = RankService;
