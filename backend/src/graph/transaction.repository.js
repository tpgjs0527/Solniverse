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
      .select(
        "_id displayName message platform paymentType amount block blockTime receiveUserId sendUserId txSignature",
      )
      .populate("receiveUserId", "walletAddress twitch.displayName")
      .populate("sendUserId", "walletAddress twitch.displayName")
      .lean();
  }

  /**
   * 보낸사람의 id를 확인하여 트랙잭션 리스트를 가져온다
   * @param {string} sendUserId
   * @returns {Promise<transaction|null>} transaction|null
   */
  async getTransactionBySendUserId(sendUserId) {
    return Transaction.find({ sendUserId })
      .select(
        "_id displayName message platform paymentType amount block blockTime receiveUserId sendUserId txSignature",
      )
      .populate("receiveUserId", "walletAddress twitch.displayName")
      .populate("sendUserId", "walletAddress twitch.displayName")
      .lean();
  }
}

module.exports = GraphRepository;
