/**
 * user collection Manipulations
 * user collection에 접근합니다.
 *
 */

const connection = require("../../config/connection")();
const crypto = require("crypto");
const User = connection.models["User"];

class UserRepository {
  // TODO 작성해야함.

  /**
   * 유저를 생성함. Create
   * @param {string} walletAddress
   * @throws {error}
   * @returns {Promise<user>} user
   */
  async createUserByWalletAddress(walletAddress) {
    //생성
    const user = new User({
      wallet_address: walletAddress,
      nonce: crypto.randomBytes(16).toString("base64"),
    });

    return user
      .save()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * WalletAddress로 유저를 찾아냄. Read
   * @param {string} walletAddress
   * @returns {Promise<user|null>} user|null
   */
  async getUserByWalletAddress(walletAddress) {
    return User.findOne({ wallet_address: walletAddress })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * WalletAddress로 유저 nonce를 업데이트 시킴. Update
   * @param {string} walletAddress
   * @returns {Promise<user>} user
   */
  async updateNonceByWalletAddress(walletAddress) {
    // Nonce 업데이트
    const result = User.updateOne(
      { wallet_address: walletAddress },
      { nonce: crypto.randomBytes(16).toString("base64") }
    )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
    return result;
  }

  async insertUserInfo(walletAddress,userinfo) {
    
    const result = User.updateOne(
      { wallet_address: walletAddress },
      { twitch: userinfo }
    )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
    return result;
  } 
}

module.exports = UserRepository;
