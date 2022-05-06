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
      { walletAddress },
      { token },
      { upsert: true },
    );
  }

  /**
   *
   * @param {string} token
   * @param {string} walletAddress
   * @returns
   */
  async findRefreshTokenByWalletAddress(walletAddress) {
    return RefreshToken.findOne({ walletAddress });
  }
}
module.exports = RefreshTokenRepository;
