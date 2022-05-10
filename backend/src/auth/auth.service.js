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
  BaseResponse,
  JWT_EXPIRED_MESSAGE,
} = require("../common/base.response");
const UserRepository = require("./user.repository");
const userRepository = new UserRepository();
const { web3 } = require("../../config/web3.connection");

const jwtUtil = require("../common/jwt-util");
const { default: axios } = require("axios");
const platforms = require("../../config/platforms");

/**
 * 재활용 response들
 */
const badRequestResponse = new BaseResponse(BAD_REQUEST_RESPONSE);
const notFoundResponse = new BaseResponse(NOT_FOUND_RESPONSE);
const conflictResponse = new BaseResponse(CONFLICT_RESPONSE);

const {
  message,
  verifyAddressBySignature,
} = require("../common/verifySignature");

class AuthService {
  /**
   * Signature 받아 address를 얻어내고 인증을 생성한다.
   * @param {string} signature
   * @param {string} walletAddress
   * @returns response
   */
  async getAccessTokenByVerify(signature, walletAddress) {
    try {
      const user = await verifyAddressBySignature(signature, walletAddress);
      if (!user) {
        return badRequestResponse;
      }

      let response = new BaseResponse(SUCCESS_RESPONSE);
      //액세스 토큰 발급
      response.responseBody.accessToken = jwtUtil.sign(user);
      //완료됐으니 nonce 업데이트
      await userRepository.updateNonceByWalletAddress(walletAddress);
      return response;
    } catch (err) {
      return badRequestResponse;
    }
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
        return badRequestResponse;
      }
      const user = await userRepository.createUserByWalletAddress(
        walletAddress,
      );
      let res = new BaseResponse(SUCCESS_RESPONSE);
      res.responseBody.user = {
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      };
      return res;
    } catch (error) {
      switch (error.code) {
        case 11000:
          return conflictResponse;
        default:
          return badRequestResponse;
      }
    }
  }

  /**
   * WalletAddress와 refreshToken을 받아 Access token 반환.
   * @param {string} walletAddress
   * @param {string} refreshToken
   * @returns
   */
  async refreshAccessToken(walletAddress, refreshToken) {
    try {
      let res;
      if (await jwtUtil.refreshVerify(refreshToken, walletAddress)) {
        //user 가져오기.
        const user = await userRepository.getUserByWalletAddress(walletAddress);
        res = new BaseResponse(SUCCESS_RESPONSE);
        //user로 access token 발행
        res.responseBody.accessToken = jwtUtil.sign(user);
        return res;
      }
      res = new BaseResponse(UNAUTHORIZED_RESPONSE);
      res.responseBody.message = JWT_EXPIRED_MESSAGE;
      return res;
    } catch (err) {
      return badRequestResponse;
    }
  }

  /**
   * WalletAddress를 받아 user를 반환한다.
   * @param {string} walletAddress
   * @returns response
   */
  async getUserByWalletAddress(walletAddress) {
    try {
      const user = await userRepository.getUserByWalletAddress(walletAddress);
      if (!user) return notFoundResponse;
      let res = new BaseResponse(SUCCESS_RESPONSE),
        responseBody = res.responseBody;
      responseBody.user = {
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      };
      /**
       * @TODO 플랫폼 list collection으로 기능 추가 필요.
       * subdocument로 변경시 다시 또 변경 필요.
       */
      for (let platform of platforms) {
        if (user[platform]) {
          responseBody.user[platform] = {
            id: user[platform].id,
            displayName: user[platform].displayName,
            profileImageUrl: user[platform].profileImageUrl,
          };
        }
      }
      return res;
    } catch (err) {
      return badRequestResponse;
    }
  }

  /**
   * WalletAddress를 받아 nonce를 반환한다.
   * @param {string} walletAddress
   * @returns response
   */
  async getSignMessageByWalletAddress(walletAddress) {
    return userRepository
      .getUserByWalletAddress(walletAddress)
      .then((user) => {
        if (!user) return notFoundResponse;
        let res = new BaseResponse(SUCCESS_RESPONSE);
        res.responseBody.signMessage = message + user.nonce;
        return res;
      })
      .catch(() => {
        return badRequestResponse;
      });
  }

  /**
   * WalletAddress를 받아 userKey를 반환한다.
   * @param {string} walletAddress
   * @returns response
   */
  async getUserKeyByWalletAddress(walletAddress) {
    return userRepository
      .getUserByWalletAddress(walletAddress)
      .then((user) => {
        if (!user) return notFoundResponse;
        let res = new BaseResponse(SUCCESS_RESPONSE);
        res.responseBody.userKey = user.userKey;
        return res;
      })
      .catch(() => badRequestResponse);
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
    const getTokensByAuthCode = (authCode) => {
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
    const getTwitchUserByAccessToken = (accessToken) => {
      return axios({
        url: "https://api.twitch.tv/helix/users",
        method: "get",
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    };

    try {
      const { data: tokens } = await getTokensByAuthCode(code);
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      const { data: twitchUsers } = await getTwitchUserByAccessToken(
        accessToken,
      );
      const twitchUser = twitchUsers.data[0];

      const twitchInfo = {
        id: twitchUser.login,
        displayName: twitchUser.display_name,
        profileImageUrl: twitchUser.profile_image_url,
        oauth: {
          accessToken,
          refreshToken,
        },
      };
      await userRepository.updateTwitchInfoByWalletAddress(
        walletAddress,
        twitchInfo,
      );
      return this.getUserByWalletAddress(walletAddress);
    } catch (err) {
      return badRequestResponse;
    }
  }
}

module.exports = AuthService;
