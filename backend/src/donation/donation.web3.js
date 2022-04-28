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
      const memo = meta.logMessages[1];
      // eslint-disable-next-line quotes
      const from = memo.indexOf('"') + 1;
      // eslint-disable-next-line quotes
      const to = memo.indexOf('"', from);

      /** @type {string} */
      const txid = memo.substring(from, to);
      /** @type {Array<PublicKey>} */
      const accountKeys = transaction.message.accountKeys;

      const sendWallet = accountKeys[0].toString();
      const receiveWallet = accountKeys[1].toString();
      /** @type {{_id:Types.ObjectId}} */
      const send_user = await getUserOrCreate(sendWallet);
      /** @type {{_id:Types.ObjectId}} */
      const receive_user = await getUserOrCreate(receiveWallet);

      const amount = meta.postBalances[1] - meta.preBalances[1];

      const data = {
        _id: new Types.ObjectId(txid),
        /**@type {string} data */
        tx_signature: transaction.signatures[0],
        /**@type {"sol"|"usdc"} */
        payment_type: "sol",
        amount,
        send_user_id: send_user._id,
        receive_user_id: receive_user._id,
      };
      donationRepository.updateTransactionById(data).then(() => {
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

