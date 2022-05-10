const {
  BaseResponse,
  BAD_REQUEST_RESPONSE,
  SUCCESS_RESPONSE,
} = require("../common/base.response");
const CandyMachineRepository = require("./candyMachine.repository");
const candyMachineRepository = new CandyMachineRepository();
const badRequestResponse = new BaseResponse(BAD_REQUEST_RESPONSE);

class CandyMachineService {
  /**
   * 캔디머신의 데이터를 DB에 추가한다.
   *
   * @param {string} publicKey
   * @param {string} name
   */
  async createCandyMachine(publicKey, name) {
    const data = {
      publicKey,
      name,
    };
    return candyMachineRepository
      .createCandyMachineByData(data)
      .then(new BaseResponse(SUCCESS_RESPONSE))
      .catch((err) => {
        return badRequestResponse;
      });
  }

  /**
   * 캔디머신 데이터 리스트를 DB에서 조회해서 반환한다.
   */
  async getCandyMachineList() {
    return candyMachineRepository
      .getAllCandyMachineList()
      .then((data) => {
        let res = new BaseResponse(SUCCESS_RESPONSE);
        res.responseBody.chandyMachine = data;
        return res;
      })
      .catch((err) => {
        return badRequestResponse;
      });
  }
}

module.exports = CandyMachineService;
