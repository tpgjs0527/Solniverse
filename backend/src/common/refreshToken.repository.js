const connection = require("../../config/connection")();
const RefreshToken = connection.models["RefreshToken"];

class RefreshTokenRepository {
  /**
   *
   * @param {string} token
   * @param {string} walletAddress
   * @returns
   */
  async upsertRefreshTokenByWalletAddress(token, walletAddress) {
    return RefreshToken.updateOne(
      { wallet_address: walletAddress },
      { token },
      { upsert: true },
    )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   *
   * @param {string} token
   * @param {string} walletAddress
   * @returns
   */
  async findRefreshTokenByWalletAddress(walletAddress) {
    return RefreshToken.findOne({ wallet_address: walletAddress })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
}
module.exports = RefreshTokenRepository;
