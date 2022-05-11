const connection = require("../../config/connection")();
const Rank = connection.models["Rank"];

class RankRepository {
  /**
   * receive정보로 기록 생성
   * @param receive
   * @returns {Promise<rank>} rank
   */
  async createRankByReceive(receive) {
    const rank = new Rank({
      walletAddress: receive.walletAddress,
      receiveCount: receive.receiveCount,
      receiveTotal: receive.receiveTotal,
      receiveRank: receive.receiveRank,
    });
    return rank.save();
  }

  /**
   * send정보로 기록 생성
   * @param send
   * @returns {Promise<rank>} rank
   */
  async createRankBySend(send) {
    const rank = new Rank({
      walletAddress: send.walletAddress,
      sendCount: send.receiveCount,
      sendTotal: send.receiveTotal,
      sendRank: send.receiveRank,
    });
    return rank.save();
  }

  /**
   * receive정보로 기록 수정
   * @param receive
   * @returns {Promise<rank>} rank
   */
  async updateRankByReceive(receive) {
    return Rank.updateOne(
      { walletAddress: receive.walletAddress },
      {
        receiveCount: receive.receiveCount,
        receiveTotal: receive.receiveTotal,
        receiveRank: receive.receiveRank,
      },
    );
  }

  /**
   * send정보로 기록 수정
   * @param send
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
    return Rank.find({ walletAddress })
      .select("walletAddress receiveCount receiveTotal receiveRank")
      .lean();
  }

  /**
   * walletAddress로 후원받은 금액 순위를 계산한다.
   * @param {string} walletAddress
   * @returns {Promise<rank|null>} rank|null
   */
  async getReceiveRankByWalletAddress(walletAddress) {
    return Rank.sort({ receiveTotal: -1 }).find({ walletAddress }).count();
  }

  /**
   * walletAddress로 후원한 금액에 관한 기록을 가져온다
   * @param {string} walletAddress
   * @returns {Promise<rank|null>} rank|null
   */
  async getSendRankListByWalletAddress(walletAddress) {
    return Rank.find({ walletAddress })
      .select("walletAddress sendCount sendTotal sendRank")
      .lean();
  }

  /**
   * walletAddress로 후원한 금액 순위를 계산한다.
   * @param {string} walletAddress
   * @returns {Promise<rank|null>} rank|null
   */
  async getSendRankByWalletAddress(walletAddress) {
    return Rank.sort({ sendTotal: -1 }).find({ walletAddress }).count();
  }
}

module.exports = RankRepository;
