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
  UNAUTHORIZED_RESPONSE,
} = require("../common/base.response");
const UserRepository = require("./user.repository");
const userRepository = new UserRepository();
const { web3 } = require("../../config/web3.connection");
const nacl = require("tweetnacl");
const base58 = require("bs58");
const jwtUtil = require("../common/jwt-util");
const { default: axios } = require("axios");

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
      publicKeyBytes,
    );

    if (!result) {
      return BAD_REQUEST_RESPONSE;
    }
    const user = await userRepository
      .getUserByWalletAddress(walletAddress)
      .then((user) => {
        if (user) return user;
      });
    if (!user) {
      return BAD_REQUEST_RESPONSE;
    }
    var response = SUCCESS_RESPONSE;
    //액세스 토큰 발급
    response.responseBody.accessToken = jwtUtil.sign(user);
    //완료됐으니 nonce 업데이트
    await userRepository.updateNonceByWalletAddress(walletAddress);
    return response;
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
   * WalletAddress와 refreshToken을 받아 Access token 반환.
   * @param {string} walletAddress
   * @param {string} refreshToken
   * @returns
   */
  async refreshAccessToken(walletAddress, refreshToken) {
    var response;
    if (await jwtUtil.refreshVerify(refreshToken, walletAddress)) {
      //user 가져오기.
      const user = await userRepository.getUserByWalletAddress(walletAddress);
      response = SUCCESS_RESPONSE;
      //user로 access token 발행
      response.responseBody.accessToken = jwtUtil.sign(user);
      return response;
    }
    response = UNAUTHORIZED_RESPONSE;
    response.responseBody.message = "jwt expired";
    return response;
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
          if (JSON.stringify(user[platform]) !== "{}") {
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

  /**
   * WalletAddress와 code를 받아 access token을 발급받는다
   * access token을 통해 twitch api를 호출하여 프로필 정보를 받아온다
   * 이 모든 내용을 db에 저장한다
   * @param {string} walletAddress
   * @param {string} code
   * @returns response
   */
  async insertUserInfo(walletAddress, code) {
    /**
     * AuthCode를 받아 Twitch에서 Access Token을 발급받습니다.
     *
     * @param {string} authCode
     * @returns AxiosPromise
     */
    const getAccessTokenFromAuthCode = (authCode) => {
      return axios({
        url: "https://id.twitch.tv/oauth2/token",
        method: "post",
        data:
          `client_id=${process.env.TWITCH_CLIENT_ID}` +
          `&client_secret=${process.env.TWITCH_CLIENT_SECRET}` +
          "&code=" +
          authCode +
          "&grant_type=authorization_code" +
          `&redirect_uri=${process.env.SERVER_URL}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    };

    /**
     * AccessToken를 받아 Twitch에서 해당 코드의 User정보를 받아온다.
     *
     * @param {string} accessToken
     * @returns AxiosPromise
     */
    const getTwitchUserFromAccessToken = (accessToken) => {
      return axios({
        url: "https://api.twitch.tv/helix/users",
        method: "get",
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    };

    const twitchInfo = {
      id: "",
      display_name: "",
      profile_image_url: "",
      oauth: {
        access_token: "",
        refresh_token: "",
      },
    };

    // 토큰 받아와서 트위치 프로필 정보까지 받아오기
    return await getAccessTokenFromAuthCode(code)
      .then((res) => {
        twitchInfo.oauth.access_token = res.data.access_token;
        twitchInfo.oauth.refresh_token = res.data.refresh_token;

        // Access Token으로 Twitch 유저 정보 가져오기
        return getTwitchUserFromAccessToken(twitchInfo.oauth.access_token)
          .then((res) => {
            twitchInfo.id = res.data.data[0].login;
            twitchInfo.display_name = res.data.data[0].display_name;
            twitchInfo.profile_image_url = res.data.data[0].profile_image_url;

            //유저에 가져온 정보 삽입
            return userRepository
              .updateTwitchInfoFromWalletAddress(walletAddress, twitchInfo)
              .then(() => {
                // 우리 백엔드 유저 정보 반환
                return this.getUserByWalletAddress(walletAddress);
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        //log를 보고 싶거나 기록하고 싶으면 여기만 기록하면 됨.
        return BAD_REQUEST_RESPONSE;
      });
  }
}

module.exports = AuthService;
