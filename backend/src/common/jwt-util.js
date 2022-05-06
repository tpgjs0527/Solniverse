const jwt = require("jsonwebtoken");
const RefreshTokenRepository = require("./refreshToken.repository");
const refreshTokenRepository = new RefreshTokenRepository();
const secret = process.env.JWT_SECRET;

module.exports = {
  /**
   * User 객체를 받아 access token을 발행
   * @param {user} user
   * @returns access token
   */
  sign: (user) => {
    // access token 발급
    const payload = {
      // access token에 들어갈 payload
      walletAddress: user.walletAddress,
      authority: user.authority,
    };

    return jwt.sign(payload, secret, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: "1h", // 유효기간
    });
  },
  /**
   * Access token을 받아 검증 결과를 반환
   * @param {string} token
   * @returns
   */
  verify: (token) => {
    // access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return {
        ok: true,
        walletAddress: decoded.walletAddress,
        authority: decoded.authority,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },

  /**
   * Access token을 받아 payload를 디코드 해서 반환. 검증 아님
   * @param {string} token
   * @returns
   */
  decode: (token) => {
    // access token 디코드 => payload를 반환함.
    try {
      const decoded = jwt.decode(token);
      return {
        walletAddress: decoded.walletAddress,
        authority: decoded.authority,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },

  /**
   * WalletAddress를 받아 refresh 토큰을 가져오거나 만료됐다면 발급 및 저장
   * 백엔드에서 갱신 및 조회를 사용하므로 async await를 사용한다.
   *
   * @param {string} walletAddress
   * @returns
   */
  refresh: async (walletAddress) => {
    // 현재 refresh token이 만료되지 않았다면 반환
    try {
      const currentToken =
        await refreshTokenRepository.findRefreshTokenByWalletAddress(
          walletAddress,
        );
      try {
        jwt.verify(currentToken, secret);
        return currentToken;
      } catch (err) {
        //만료됐다면 새로 발급
        const token = jwt.sign({}, secret, {
          // refresh token은 payload 없이 발급
          algorithm: "HS256",
          expiresIn: "14d",
        });
        // refresh token 저장
        await refreshTokenRepository.upsertRefreshTokenByWalletAddress(
          token,
          walletAddress,
        );
        return token;
      }
    } catch (error) {
      return;
    }
  },

  /**
   * RefreshToken과 walletAddress를 받아 리프레시 토큰 검증.
   * 백엔드에서 조회를 사용하므로 async await를 사용한다.
   *
   * @param {string} token
   * @param {string} walletAddress
   * @returns
   */
  refreshVerify: async (token, walletAddress) => {
    // refresh token 검증
    return await refreshTokenRepository
      .findRefreshTokenByWalletAddress(walletAddress)
      .then((data) => {
        if (token === data.token) {
          try {
            jwt.verify(token, secret);
            return true;
          } catch (err) {
            return false;
          }
        } else {
          return false;
        }
      })
      .catch(() => {
        return false;
      });
  },
};
