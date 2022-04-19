/**
 * user collection Manipulations
 * user collection에 접근합니다.
 *
 */

const connection = require("../../config/connection")();
const User = connection.models["User"];

class UserRepository {
  // TODO 작성해야함.

  /**
   * 유저를 생성함. Create
   * @param {*} walletAddress
   * @returns null & user
   */
  async createUser(walletAddress) {
    //생성 혹은 업데이트
    const user = new User({ wallet_address: walletAddress });
    const result = await user
      .save()
      .then((res) => {
        //생성일 경우 반환이 안되므로 조회
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    return result;
  }

  /**
   * WalletAddress로 유저를 찾아냄. Read
   * @param {*} walletAddress
   * @returns null & user
   */
  async getUser(walletAddress) {
    //생성 혹은 업데이트
    const result = User.find({ wallet_address: walletAddress })
      .then((res) => {
        //반환이 안되므로 조회
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    return result;
  }

  /**
   * WalletAddress로 유저 nonce를 업데이트 시킴. Update
   * @param {*} walletAddress
   * @returns null & user
   */
  async updateNonce(walletAddress) {
    // Nonce 업데이트
    const result = User.findOneAndUpdate(
      { wallet_address: walletAddress },
      { nonce: new mongoose.Types.ObjectId() }
    )
      .then((res) => {
        //생성일 경우 반환이 안되므로 조회
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    return result;
  }
}

module.exports = UserRepository;
