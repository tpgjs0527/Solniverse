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
      walletAddress,
      nonce: crypto.randomBytes(16).toString("base64"),
    });

    return user.save();
  }

  /**
   * WalletAddress로 유저를 찾아냄. Read
   * @param {string} walletAddress
   * @returns {Promise<user|null>} user|null
   */
  async getUserByWalletAddress(walletAddress) {
    return User.findOne({ walletAddress }).lean();
  }

  /**
   * UserKey로 유저를 찾아냄. Read
   *
   * @param {string} userKey
   *
   * @typedef {import("mongoose").ObjectId} ObjectId
   * @returns {Promise<ObjectId>} UserId
   */
  async getWalletAddressByUserKey(userKey) {
    //Javascript 최적화되어 _id만 반환
    return User.findOne({ userKey }).select("walletAddress").lean();
  }

  /**
   * WalletAddress로 유저 nonce를 업데이트 시킴. Update
   * @param {string} walletAddress
   * @returns {Promise<user>} user
   */
  async updateNonceByWalletAddress(walletAddress) {
    // Nonce 업데이트
    return User.updateOne(
      { walletAddress },
      { nonce: crypto.randomBytes(16).toString("base64") },
    );
  }

  /**
   * WalletAddress로 유저 Twtich 정보를 업데이트 시킴.
   * @param {string} walletAddress
   * @param {string} twitchInfo
   * @returns
   */
  async updateTwitchInfoByWalletAddress(walletAddress, twitchInfo) {
    return User.updateOne({ walletAddress }, { twitch: twitchInfo });
  }
}

module.exports = UserRepository;
