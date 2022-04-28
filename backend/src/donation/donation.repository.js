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

  async getLatestTransaction() {
    const latestTransaction = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(1);
    return latestTransaction;
  }

  async findExistTransaction(txId) {
    try {
      const transaction = await Transaction.find({ _id: txId });
      const meta = transaction[0];
      // 트랜잭션이 있는 경우(= 누군가 QR을 재활용하고 있다는 뜻)에만 실행
      const tx = new Transaction({
        display_name: meta.display_name,
        message: meta.message,
        platform: meta.platform,
        payment_type: meta.payment_type,
        amount: meta.amount,
        tx_signature: meta.tx_signature,
        send_user_id: meta.send_user_id,
        receive_user_id: meta.receive_user_id,
      });
      tx.save();
      return true;
    } catch (err) {
      return false;
    }
  }
  async createUnDoneTransaction(data) {
    const tx = new Transaction({
      display_name: data.display_name,
      message: data.message,
      platform: data.platform,
      payment_type: data.payment_type,
      amount: data.amount,
      tx_signature: data.tx_signature,
      send_user_id: data.send_user_id,
      receive_user_id: data.receive_user_id,
    });
    tx.save();
  }
}

module.exports = DonationRepository;

