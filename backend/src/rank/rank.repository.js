const connection = require("../../config/connection")();
const Rank = connection.models["Rank"];
const { Types } = require("mongoose");

class RankRepository {
  /**
   * 랭크 기록 생성
   *
   * @param {Object} data
   * @returns {Promise<rank>} rank
   */
  async createRank(data) {
    const rank = new Rank({
      ...data,
    });
    return rank.save();
  }

  /**
   * Data 정보로 기록 수정
   * @param {Object} data
   * @returns {Promise<rank>} rank
   */
  async updateRankByData(data) {
    return Rank.updateOne(
      { walletAddress: data.walletAddress },
      {
        ...data,
      },
    );
  }

  /**
   * walletAddress로 후원받은 금액에 관한 기록을 가져온다
   * @param {String} walletAddress
   * @returns {Promise<rank|null>} rank|null
   */
  async getReceiveRankListByWalletAddress(walletAddress) {
    return Rank.findOne({ walletAddress })
      .select("walletAddress receiveCount receiveTotal receiveRank")
      .lean();
  }

  /**
   * walletAddress로 후원한 금액에 관한 기록을 가져온다
   * @param {string} walletAddress
   * @returns {Promise<rank|null>} rank|null
   */
  async getSendRankListByWalletAddress(walletAddress) {
    return Rank.findOne({ walletAddress })
      .select("walletAddress sendCount sendTotal sendRank")
      .lean();
  }

  /**
   * walletAddress로 후원받은 금액에 관한 기록을 가져온다
   * @param {number} receiveTotal
   * @param {string} cond
   * @param {number} limit
   * @returns {Promise<rank|null>} rank|null
   */
  async getListByReceiveTotalAndCondAndLimit(receiveTotal, cond, limit) {
    return Rank.find({ receiveTotal: { [cond]: receiveTotal } })
      .select("walletAddress receiveCount receiveTotal receiveRank")
      .limit(limit)
      .sort({ receiveTotal: cond === "$gt" ? 1 : -1 })
      .populate("user", "twitch.displayName")
      .lean();
  }

  /**
   * walletAddress로 후원받은 금액에 관한 기록을 가져온다
   * @param {number} sendTotal
   * @param {string} cond
   * @param {number} limit
   * @returns {Promise<rank|null>} rank|null
   */
  async getListBySendTotalAndCondAndLimit(sendTotal, cond, limit) {
    return Rank.find({ sendTotal: { [cond]: sendTotal } })
      .select("walletAddress sendCount sendTotal sendRank")
      .limit(limit)
      .sort({ sendTotal: cond === "$gt" ? 1 : -1 })
      .populate("user", "twitch.displayName")
      .lean();
  }

  /**
   * receiveTotal로 후원받은 금액 순위를 계산한다.
   * @param {Number} receiveTotal
   * @returns {Number}
   */
  async getReceiveRankingByReceiveTotal(receiveTotal) {
    return Rank.find().gt("receiveTotal", receiveTotal).count();
  }

  /**
   * sendTotal로 후원한 금액 순위를 계산한다.
   * @param {Number} sendTotal
   * @returns {Number}
   */
  async getSendRankingBySendTotal(sendTotal) {
    return Rank.find().gt("sendTotal", sendTotal).count();
  }
}

module.exports = RankRepository;
