/**
 * Services Logics related to Digital Assets(item)
 * Service/Repository 레이어의 함수를 호출해야합니다.
 *
 * @format
 */

const {
  BaseResponse,
  BAD_REQUEST_RESPONSE,
  SUCCESS_RESPONSE,
} = require("../common/base.response");
const DonationRepository = require("./donation.repository");
const donationRepository = new DonationRepository();
const badeRequestResponse = new BaseResponse(BAD_REQUEST_RESPONSE);

class DonationService {
  // TODO 작성해야함.
  /**
   *
   * @param {string} displayName
   * @param {string} message
   * @param {string} platform
   */
  async createTransaction(displayName, message, platform) {
    const data = {
      displayName,
      message,
      platform,
    };
    return donationRepository
      .createTransaction(data)
      .then((tx) => {
        let res = new BaseResponse(SUCCESS_RESPONSE);
        res.responseBody.txid = tx._id;
        res.responseBody.shopAddress = process.env.DDD_SHOP_WALLET;
        return res;
      })
      .catch((err) => {
        return badeRequestResponse;
      });
  }
}

module.exports = DonationService;
