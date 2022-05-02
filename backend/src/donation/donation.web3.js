const logger = require("../../config/logger");
const { web3, connection } = require("../../config/web3.connection");
const DonationRepository = require("./donation.repository");
const donationRepository = new DonationRepository();
const UserRepository = require("../auth/user.repository");
const userRepository = new UserRepository();
const { Types } = require("mongoose");
const { io } = require("../../sockapp");

/**
 * 지갑 주소에 해당하는 유저를 가져오거나 새로 유저를 추가
 * @param {string} walletAddress
 */
async function getUserOrCreate(walletAddress) {
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

/**
 * 트랜잭션을 받아 중복 없이 업데이트 하는 함수
 *
 * @param {*} tx
 * @returns
 */
async function updateTransactionWithoutDuplication(tx) {
  const meta = tx.meta;
  if (meta.err) return;
  try {
    const transaction = tx.transaction;

    // sendWallet과 receiveWallet을 알아냄
    /** @type {Array<web3.PublicKey>} */
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

    let amount;
    let paymentType;
    if (meta.postTokenBalances.length === 0) {
      amount = meta.postBalances[1] - meta.preBalances[1];
      paymentType = "sol";
    } else {
      amount = meta.postTokenBalances[1] - meta.preTokenBalances[1];
      paymentType = "usdc";
    }

    // txio 도큐먼트에 삽입할 데이터
    var data = {
      /**@type {string} data */
      txSignature: transaction.signatures[0],
      /**@type {"sol"|"usdc"} */
      paymentType: "sol",
      amount,
      sendUserId: sendUser._id,
      receiveUserId: receiveUser._id,
      blockTime: tx.blockTime * 1000,
      block: tx.slot,
    };

    // txid를 얻어냄.
    const memo = meta.logMessages[1],
      txid = new Types.ObjectId(
        // eslint-disable-next-line quotes
        memo.substring(memo.indexOf('"') + 1, memo.length - 1),
      );

    //트랜잭션이 있는지 검사
    const txData = await donationRepository.getTransactionById(txid);
    if (!txData.txSignature) {
      //MongoDB의 트랜잭션을 업데이트 한다.
      const updatedTx = await donationRepository.updateTransactionById(
        txid,
        data,
      );
      const donation = {
        displayName: txData.displayName,
        message: txData.message,
        paymentType: txData.paymentType,
        amount,
      };
      io.to(updatedTx.receiveUserId.toString()).emit("donation", donation);
      logger.info(
        `updateTransactionWithoutDuplication 기존 데이터 업데이트: ${updatedTx}`,
      );
    } else {
      // 기존 데이터를 가져옴
      const donation = {
        displayName: txData.displayName,
        message: txData.message,
        paymentType: txData.paymentType,
        amount,
      };
      data = {
        ...data,
        platform: txData.platform,
        ...donation,
      };
      //트랜잭션 추가 및 io.to
      const createdTx = await donationRepository.createTransaction(data);
      io.to(createdTx.receiveUserId.toString()).emit("donation", donation);
      logger.info(
        `updateTransactionWithoutDuplication 새 데이터 삽입: ${createdTx}`,
      );
    }
  } catch (err) {
    //getUserOrCreate, getTransactionById, createTransaction 또는 기타 에러들
    logger.error(`updateTransactionWithoutDuplication 에러 발생: ${err}}`);
    return;
  }
}

/**
 * 상점에 트랜잭션이 발생하면 트랜잭션을 받아 갱신 함수 동작.
 * updateTransactionWithoutDuplication에 transaction을 넘겨줌.
 *
 * @param {*} context
 */
function logCallback(context) {
  connection
    .getTransaction(context.signature)
    .then(updateTransactionWithoutDuplication);
}

/**
 * 서버 부팅시 동작할 함수.
 *
 * @returns
 */
async function recoverTransaction() {
  // db 가장 최신 값에서 tx_signature
  try {
    const tx = await donationRepository.getLatestTransaction();
    if (!tx) return;
    // 상점 주소
    const shopWallet = new web3.PublicKey(process.env.DDD_SHOP_WALLET);
    const transactions = await connection.getSignaturesForAddress(shopWallet, {
      until: tx.txSignature,
    });
    for (let tran of transactions) {
      if (tran.err) continue;
      const transaction = await connection.getTransaction(tran.signature);
      updateTransactionWithoutDuplication(transaction);
    }
  } catch (err) {
    logger.error(`recoverTransaction 에러 발생: ${err}`);
  }
}

recoverTransaction(); //서버 부팅시 동작

connection.onLogs(
  new web3.PublicKey(process.env.DDD_SHOP_WALLET),
  logCallback,
  "confirmed",
);
