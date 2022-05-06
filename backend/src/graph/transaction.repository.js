/**
 * user collection Manipulations
 * user collection에 접근합니다.
 *
 */

const connection = require("../../config/connection")();
const Transaction = connection.models["Transaction"];

class GraphRepository {
  // TODO 작성해야함.

  /**
   * 받는사람의 id를 확인하여 트랙잭션 리스트를 가져온다
   * @param {string} receiveUserId
   * @returns {Promise<transaction|null>} transaction|null
   */
  async getTransactionsByRecieveUserId(receiveUserId) {
    return Transaction.find({ receiveUserId })
      .populate("receiveUserId", "walletAddress twitch")
      .populate("sendUserId", "walletAddress twitch")
      .lean();
  }

  /**
   * 보낸사람의 id를 확인하여 트랙잭션 리스트를 가져온다
   * @param {string} sendUserId
   * @returns {Promise<transaction|null>} transaction|null
   */
  async getTransactionBySendUserId(sendUserId) {
    return Transaction.find({ sendUserId })
      .populate("receiveUserId", "walletAddress twitch")
      .populate("sendUserId", "walletAddress twitch")
      .lean();
  }
}

module.exports = GraphRepository;
