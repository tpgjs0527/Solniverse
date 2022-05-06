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
   * @param {string} _id
   * @returns {Promise<transaction|null>} transaction|null
   */
  async receive(_id) {
    return Transaction.find({ receiveUserId: _id })
      .populate("receiveUserId", "walletAddress twitch")
      .populate("sendUserId", "walletAddress twitch")
      .lean();
  }

  /**
   * 보낸사람의 id를 확인하여 트랙잭션 리스트를 가져온다
   * @param {string} _id
   * @returns {Promise<transaction|null>} transaction|null
   */
  async give(_id) {
    return Transaction.find({ sendUserId: _id })
      .populate("receiveUserId", "walletAddress twitch")
      .populate("sendUserId", "walletAddress twitch")
      .lean();
  }
}

module.exports = GraphRepository;
