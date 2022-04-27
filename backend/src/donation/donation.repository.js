/**
 * donation collection Manipulations
 * donation 컬렉션에 접근합니다.
 */
//@ts-check

const { Types } = require("mongoose");

const connection = require("../../config/connection")();
const Transaction = connection.models["Transaction"];
class DonationRepository {
  /**
   * 트랜잭션을 생성함. Create
   * @param {Object} data
   * @param {string} data.displayName this string is required
   * @param {string} data.message
   * @param {string} data.platform
   * @returns
   */
  async createTransaction(data) {
    //생성
    const tx = new Transaction({
      displayName: data.displayName,
      message: data.message,
      platform: data.platform,
    });
    return tx.save();
  }

  /**
   * 트랜잭션을 업데이트 한다.
   *
   * @param {Types.ObjectId} _id
   * @param {Object} data
   * @param {string} data.txSignature
   * @param {string} [data.splToken] optional
   * @param {"sol"|"usdc"} data.paymentType
   * @param {number} data.amount
   * @param {Types.ObjectId} data.sendUserId
   * @param {Types.ObjectId} data.receiveUserId
   * @param {string} [data.nftToken] optional
   *
   * @returns
   */
  async updateTransactionById(_id, data) {
    //생성
    return Transaction.updateOne(
      {
        _id,
      },
      {
        ...data,
      },
    );
  }
}

module.exports = DonationRepository;
