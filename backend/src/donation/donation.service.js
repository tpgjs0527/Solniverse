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
const DonationWeb3 = require("./donation.web3");
const { Types } = require("mongoose");
const { io } = require("../../sockapp");

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

  async findExistTransactionAndUpdate(Transaction, flag) {
    // console.log(Transaction);
    const Memo = Transaction.meta.logMessages[1];
    // console.log(Memo);
    const Start = Memo.indexOf('"');
    const txId = Memo.substring(Start + 1, Memo.length - 1);
    // console.log(txId);

    const txid = "626a35092452d45c3da63ae4";

    const findTransaction = await donationRepository.findExistTransaction(txid);
    // console.log(findTransaction);

    if (findTransaction !== false && findTransaction.length !== 0) {
      // 트랜잭션 길이가 바뀌면 false리턴, 트랜잭션 길이가 정확히 맞고 있으면 db값 리턴 => 중복이므로 복사 해서 새로 넣어야 함
      // 길이는 맞는데 없으면 [] 리턴() => 비정상적인 방법(딥링크 실험, 악의적)넣지 말아야 함.
      // 추가 발견한 오류
      // txId가 자리가 맞아도 구성된 문자에 따라 false, []가 나오는 경우가 있음
      // findTransaction이 false도 아니고, []도 아닌 경우 findTransaction[0] = transaction
      const transaction = findTransaction[0];
      // db에 트랜잭션은 있는데 임시등록된 경우(plaform, message, displayName만 있는 경우)
      const isExist = transaction.sendUserId;
      console.log(isExist);
      if (isExist !== undefined) {
        console.log(transaction);
        // txId가 정상적인 id이고, db에 트랜잭션이 정상적으로 있고([]가 아니고), 이미 존재하는 트랜잭션인 경우 => 이미 존재하는 트랜잭션을 복사해서 새로 추가하고 1 리턴
        const data = {
          txSignature: transaction.txSignature,
          displayName: transaction.displayName,
          platform: transaction.platform,
          message: transaction.message,
          amount: transaction.amount,
          sendUserId: transaction.sendUserId,
          receiveUserId: transaction.receiveUserId,
        };
        if (flag === 1) {
          donationRepository.createUnDoneTransaction(data).then((user) => {
            const donation = {
              displayName: user.displayName,
              message: user.message,
              paymentType: user.paymentType,
              amount: user.amount,
            };
            io.to(user._id.toString()).emit("donation", donation);
          });
        } else {
          console.log("here");
          await donationRepository.createUnDoneTransaction(data);
        }
      } else {
        // txId가 정상적인 id이고,
        // db에 트랜잭션은 있는데 임시등록된 경우(plaform, message, displayName만 있는 경우)
        // isExist === undefined
        // = 결제할 때 임시저장만 된 상태이므로 나머지 넣어서 db에 저장
        const accountKeys = Transaction.transaction.message.accountKeys;
        const sendWallet = accountKeys[0].toString();
        const receiveWallet = accountKeys[1].toString();

        // DB에서 비동기적으로 sendWallet과 receiveWallet의 user를 얻어냄
        /** @type {[{_id:Types.ObjectId}, {_id:Types.ObjectId}]} */
        const [sendUser, receiveUser] = await Promise.all([
          DonationWeb3.getUserOrCreate(sendWallet),
          DonationWeb3.getUserOrCreate(receiveWallet),
        ]);

        const meta = Transaction.meta;
        let amount = meta.postBalances[1] - meta.preBalances[1];

        const data = {
          _id: new Types.ObjectId(txid),
          txSignature: Transaction.transaction.signatures,
          /**@type {"sol"|"usdc"} */
          paymentType: "sol",
          amount: amount,
          sendUserId: sendUser._id,
          receiveUserId: receiveUser._id,
        };
        if (flag === 1) {
          donationRepository.updateTransactionById(txid, data).then((user) => {
            const donation = {
              displayName: user.displayName,
              message: user.message,
              paymentType: user.paymentType,
              amount: user.amount,
            };
            console.log("dotaion", donation);
            io.to(user._id.toString()).emit("donation", donation);
          });
        } else {
          await donationRepository.updateTransactionById(txid, data);
          console.log(data);
          return 2;
        }
      }
    } else {
      console.log("[], false");
      return 3;
    }
  }
}

module.exports = DonationService;
