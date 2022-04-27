//@ts-check
const { PublicKey } = require("@solana/web3.js");
const { web3, connection } = require("../../config/web3.connection");
const DonationRepository = require("./donation.repository");
const donationRepository = new DonationRepository();
const UserRepository = require("../auth/user.repository");
const { Types } = require("mongoose");
const userRepository = new UserRepository();

/**
 * 지갑 주소에 해당하는 유저를 가져오거나 새로 유저를 추가
 * @param {string} walletAddress
 */
function getUserOrCreate(walletAddress) {
  return userRepository
    .getUserByWalletAddress(walletAddress)
    .then(async (result) => {
      if (result) {
        return result;
      } else {
        // 비어있을 경우
        return await userRepository
          .createUserByWalletAddress(walletAddress)
          .then((user) => {
            return user;
          });
      }
    });
}

async function txCallback(tx) {
  const meta = tx.meta;
  if (!meta.err) {
    try {
      const transaction = tx.transaction;

      // sendWallet과 receiveWallet을 알아냄
      /** @type {Array<PublicKey>} */
      const accountKeys = transaction.message.accountKeys,
        // 아래는 string 타입임
        sendWallet = accountKeys[0].toString(),
        receiveWallet = accountKeys[1].toString();

      // DB에서 비동기적으로 sendWallet과 receiveWallet의 user를 얻어냄
      /** @type {[{_id:Types.ObjectId}, {_id:Types.ObjectId}]} */
      const [sendUser, receiveUser] = await Promise.all([
        getUserOrCreate(sendWallet),
        getUserOrCreate(receiveWallet),
      ]);

      const amount = meta.postBalances[1] - meta.preBalances[1];

      // txid를 얻어냄.
      const memo = meta.logMessages[1],
        // eslint-disable-next-line quotes
        from = memo.indexOf('"') + 1,
        // 성능을 위해 할당 횟수를 줄이고 인라인으로 사용함.
        txid = new Types.ObjectId(
          // eslint-disable-next-line quotes
          memo.substring(from, memo.indexOf('"', from)),
        );

      // txio 도큐먼트에 삽입할 데이터
      const data = {
        /**@type {string} data */
        txSignature: transaction.signatures[0],
        /**@type {"sol"|"usdc"} */
        paymentType: "sol",
        amount,
        sendUserId: sendUser._id,
        receiveUserId: receiveUser._id,
      };
      donationRepository.updateTransactionById(txid, data).then(() => {
        //여기서 도네이션 메시지를 프론트에 전송
      });
    } catch (err) {
      return;
    }
  }
}

function logCallback(context) {
  connection.getTransaction(context.signature).then(txCallback);
}

connection.onLogs(
  new web3.PublicKey(process.env.DDD_SHOP_WALLET),
  logCallback,
  "confirmed",
);
