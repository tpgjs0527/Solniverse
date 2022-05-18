/**
 * donation collection Manipulations
 * donation 컬렉션에 접근합니다.
 */
//@ts-check

const connection = require("../../config/connection")();
const Transaction = connection.models["Transaction"];

/**
 * 반환 타입 정의
 *
 * @typedef {import("mongoose").ObjectId} ObjectId
 * @typedef {Object} Tx
 * @property {ObjectId} Tx._id
 * @property {string} Tx.displayName
 * @property {string} Tx.message
 * @property {string} Tx.platform
 * @property {string} Tx.txSignature
 * @property {number} Tx.blockTime
 * @property {number} Tx.block
 * @property {string} Tx.splToken
 * @property {Number} Tx.amount
 * @property {ObjectId} Tx.sendUserId
 * @property {ObjectId} Tx.receiveUserId
 * @property {string} Tx.nftToken
 *
 */
class DonationRepository {
  /**
   * 트랜잭션을 생성함. Create
   * @param {Object} data
   * @param {string} data.displayName this string is required
   * @param {string} data.platform
   * @param {string} data.message
   * @param {string} [data.txSignature]
   * @param {number} [data.blockTime]
   * @param {number} [data.block]
   * @param {number} [data.amount],
   * @param {ObjectId} [data.sendUserId]
   * @param {ObjectId} [data.receiveUserId]
   * @param {string} [data.splToken] optional
   * @param {string} [data.nftToken] optional
   * @returns {Promise<Tx>} tx
   */
  async createTransaction(data) {
    //생성
    const tx = new Transaction({
      ...data,
    });
    return tx.save();
  }

  /**
   * 트랜잭션을 업데이트 한다.
   *
   * @param {ObjectId} _id
   * @param {Object} data
   * @param {string} data.txSignature
   * @param {number} data.blockTime
   * @param {number} data.block
   * @param {"sol"|"usdc"} data.paymentType
   * @param {number} data.amount
   * @param {ObjectId} data.sendUserId
   * @param {ObjectId} data.receiveUserId
   * @param {string} [data.splToken] optional
   * @param {string} [data.nftToken] optional
   *
   * @returns {Promise<Tx>} tx
   */
  async updateTransactionById(_id, data) {
    //생성
    return Transaction.findByIdAndUpdate(
      {
        _id,
      },
      {
        ...data,
      },
      { new: true },
    ).lean();
  }

  /**
   * 마지막 트랜잭션을 찾습니다.
   * @returns {Promise<Tx>} tx
   */
  async getLatestTransaction() {
    return Transaction.findOne()
      .sort({ block: -1 })
      .limit(1)
      .where("block")
      .ne(null)
      .lean();
  }

  /**
   * txId 에 해당하는 트랜잭션을 찾습니다.
   *
   * @param {ObjectId} txId
   * @returns {Promise<Tx>} tx
   */
  async getTransactionById(txId) {
    return Transaction.findOne({ _id: txId }).lean();
  }
}

module.exports = DonationRepository;
