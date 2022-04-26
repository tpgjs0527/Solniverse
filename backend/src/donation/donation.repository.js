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
   * @param {string} data.display_name this string is required
   * @param {string} data.message
   * @param {string} data.platform
   * @returns
   */
  async createTransaction(data) {
    //생성
    const tx = new Transaction({
      display_name: data.display_name,
      message: data.message,
      platform: data.platform,
    });
    return tx.save();
  }

  /**
   * 트랜잭션을 업데이트 한다.
   * @param {Object} data
   * @param {Types.ObjectId} data._id
   * @param {string} data.tx_signature
   * @param {string} [data.spl_token] optional
   * @param {"sol"|"usdc"} data.payment_type
   * @param {number} data.amount
   * @param {Types.ObjectId} data.send_user_id
   * @param {Types.ObjectId} data.receive_user_id
   * @param {string} [data.nft_token] optional
   *
   * @returns
   */
  async updateTransactionById(data) {
    //생성
    return Transaction.updateOne(
      {
        _id: data._id,
      },
      {
        tx_signature: data.tx_signature,
        spl_token: data.spl_token,
        payment_type: data.payment_type,
        amount: data.amount,
        send_user_id: data.send_user_id,
        receive_user_id: data.receive_user_id,
        nft_token: data.nft_token,
      },
    );
  }
}

module.exports = DonationRepository;
