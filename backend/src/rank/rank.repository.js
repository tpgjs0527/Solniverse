const connection = require("../../config/connection")();
const Rank = connection.models["Rank"];

class RankRepository {
  /**
   * receive정보로 기록 생성
   * @param {Object} receive
   * @returns {Promise<rank>} rank
   */
  async createRankByReceive(receive) {
    const rank = new Rank({
      ...receive,
    });
    return rank.save();
  }

  /**
   * send정보로 기록 생성
   * @param {Object} send
   * @returns {Promise<rank>} rank
   */
  async createRankBySend(send) {
    const rank = new Rank({
      ...send,
    });
    return rank.save();
  }

  /**
   * receive정보로 기록 수정
   * @param {Object} receive
   * @returns {Promise<rank>} rank
   */
  async updateRankByReceive(receive) {
    return Rank.updateOne(
      { walletAddress: receive.walletAddress },
      {
        ...receive,
      },
    );
  }

  /**
   * send정보로 기록 수정
   * @param {Object} send
   * @returns {Promise<rank>} rank
   */
  async updateRankBySend(send) {
    return Rank.updateOne(
      { walletAddress: send.walletAddress },
      {
        sendCount: send.sendCount,
        sendTotal: send.sendTotal,
        sendRank: send.sendRank,
      },
    );
  }

  /**
   * walletAddress로 후원받은 금액에 관한 기록을 가져온다
   * @param {string} walletAddress
   * @returns {Promise<rank|null>} rank|null
   */
  async getReceiveRankListByWalletAddress(walletAddress) {
    return Rank.findOne({ walletAddress })
      .select("walletAddress receiveCount receiveTotal receiveRank")
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
   * sendTotal로 후원한 금액 순위를 계산한다.
   * @param {Number} sendTotal
   * @returns {Number}
   */
  async getSendRankingBySendTotal(sendTotal) {
    return Rank.find().gt("sendTotal", sendTotal).count();
  }
}

module.exports = RankRepository;
