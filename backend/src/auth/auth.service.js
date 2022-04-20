/**
 * Services Logics related to Digital Assets(item)
 * Service/Repository 레이어의 함수를 호출해야합니다.
 *
 * @format
 */

const {
  BAD_REQUEST_RESPONSE,
  SUCCESS_RESPONSE,
  NOT_FOUND_RESPONSE,
  CONFLICT_RESPONSE,
} = require("../common/base.response");
const UserRepository = require("./user.repository");
const { web3 } = require("../../config/web3.connection");
const nacl = require("tweetnacl");
const base58 = require("bs58");
const userRepository = new UserRepository();

class AuthService {
  /**
   * Signature 받아 address를 얻어내고 인증을 생성한다.
   * @param {string} nonce
   * @param {string} signature
   * @param {string} walletAddress
   * @returns response
   */
  async verifyAddressFromSignature(nonce, signature, walletAddress) {
    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
    const messageBytes = new TextEncoder().encode(message);

    const publicKeyBytes = base58.decode(signature);
    const signatureBytes = base58.decode(walletAddress);

    const result = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    if (!result) {
      return BAD_REQUEST_RESPONSE;
    }
    //완료됐으니 nonce 업데이트
    await userRepository.updateNonceByWalletAddress(walletAddress);
    return SUCCESS_RESPONSE;
  }

  /**
   * WalletAddress를 받아 User를 생성한다.
   * @param {string} walletAddress
   * @returns response
   */
  async createUserByWalletAddress(walletAddress) {
    try {
      const publicKey = new web3.PublicKey(walletAddress);
      if (!(await web3.PublicKey.isOnCurve(publicKey))) {
        return BAD_REQUEST_RESPONSE;
      }
    } catch (error) {
      return BAD_REQUEST_RESPONSE;
    }
    return await userRepository
      .createUserByWalletAddress(walletAddress)
      .then((user) => {
        var res = SUCCESS_RESPONSE;
        res.responseBody.user = {
          walletAddress: user.wallet_address,
          createdAt: user.createdAt,
        };
        return SUCCESS_RESPONSE;
      })
      .catch((err) => {
        switch (err.code) {
          case 11000:
            return CONFLICT_RESPONSE;
          default:
            return BAD_REQUEST_RESPONSE;
        }
      });
  }

  /**
   * WalletAddress를 받아 user를 반환한다.
   * @param {string} walletAddress
   * @returns response
   */
  async getUserByWalletAddress(walletAddress) {
    return await userRepository
      .getUserByWalletAddress(walletAddress)
      .then((user) => {
        if (!user) return NOT_FOUND_RESPONSE;
        var res = SUCCESS_RESPONSE;
        res.responseBody.user = {
          wallet_address: user.wallet_address,
          createdAt: user.createdAt,
        };
        /**
         * @TODO 플랫폼 list collection으로 기능 추가 필요.
         * subdocument로 변경시 다시 또 변경 필요.
         */
        let platforms = ["twitch"];
        for (let platform of platforms) {
          if (user[platform]) {
            res.responseBody.user[platform] = {
              id: user[platform].id,
              displayName: user[platform].display_name,
              profileImageUrl: user[platform].profile_image_url,
            };
          }
        }
        return SUCCESS_RESPONSE;
      })
      .catch(() => {
        return BAD_REQUEST_RESPONSE;
      });
  }

  /**
   * WalletAddress를 받아 nonce를 반환한다.
   * @param {string} walletAddress
   * @returns response
   */
  async getNonceByWalletAddress(walletAddress) {
    return await userRepository
      .getUserByWalletAddress(walletAddress)
      .then((user) => {
        if (!user) return NOT_FOUND_RESPONSE;
        var res = SUCCESS_RESPONSE;
        res.responseBody.nonce = user.nonce;
        return SUCCESS_RESPONSE;
      })
      .catch(() => {
        return BAD_REQUEST_RESPONSE;
      });
  }
}

module.exports = AuthService;
