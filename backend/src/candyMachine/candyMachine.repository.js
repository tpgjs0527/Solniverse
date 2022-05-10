const connection = require("../../config/connection")();
const CandyMachine = connection.models["CandyMachine"];

/**
 * @typedef {Object} ChandyMachine
 * @property {string} ChandyMachine.publicKey
 * @property {string} ChandyMachine.name
 * @property {number} ChandyMachine.createdAt
 * @property {number} ChandyMachine.updatedAt
 */
class ChandyMachineRepository {
  // TODO 작성해야함.

  /**
   * Data를 받아 캔디머신을 생성함.
   *
   * @param {Object} data
   * @param {string} data.publicKey
   * @param {string} data.name
   * @throws {error}
   * @returns {Promise<ChandyMachine>} data
   */
  async createCandyMachineByData(data) {
    //생성
    const candyMachine = new CandyMachine(data);
    return candyMachine.save().lean();
  }

  /**
   * 모든 캔디 머신의 리스트를 반환함.
   *
   * @returns {Promise<ChandyMachine>} data
   */
  async getAllCandyMachineList() {
    return CandyMachine.find({}).lean();
  }
}

module.exports = ChandyMachineRepository;
