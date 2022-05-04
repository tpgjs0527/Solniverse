const logger = require("../../config/logger");
const { web3, connection } = require("../../config/web3.connection");
const DonationRepository = require("./donation.repository");
const donationRepository = new DonationRepository();
const UserRepository = require("../auth/user.repository");
const userRepository = new UserRepository();
const { Types } = require("mongoose");
const { io } = require("../../sockapp");
const bs58 = require("bs58");
const {
  getOrCreateAssociatedTokenAccount,
  transfer,
  mintTo,
} = require("@solana/spl-token");
const { default: axios } = require("axios");
const { Keypair, PublicKey } = web3;
const MINT_SECRET = process.env.DDD_MINT_SECRET_KEY;
const USDC_TOKEN = process.env.USDC_TOKEN;
const fromWallet = Keypair.fromSecretKey(bs58.decode(MINT_SECRET));
const mint = new PublicKey(process.env.DDD_SNV_TOKEN);

const SOL_DECIMAL = 10 ** 9;

var usdPerSol;

/**
 * 단위 Sol당 Usd가격을 받아 usdPerSol를 업데이트 하는 함수
 */
async function getUsdPerSol() {
  try {
    const {
      data: {
        solana: { usd },
      },
    } = await axios({
      url: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      method: "get",
      headers: { Accept: "application/json" },
    });
    usdPerSol = usd;
  } catch (err) {
    logger.error("getUsdPerSol 에러 발생: error=Axios가 제대로 응답하지 않음.");
  }
}

getUsdPerSol(); //서버 부팅시 usdPerSol를 업데이트
/**
 * 10분마다 usdPerSol를 업데이트 하도록 하는 구문
 */
setInterval(getUsdPerSol, 1000 * 60 * 10);

const fromTokenAccountGlobal = (async () => {
  return await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey,
  );
})();

/**
 * Transaction의 metadata를 받아 amount, paymentType, decimal의 정제된 데이터를 반환.
 * @param {*} meta
 * @returns
 */
function getPostProcessDataFromTx(meta) {
  const senderPreBal = meta.preTokenBalances[1];
  if (!senderPreBal) {
    return {
      amount: meta.postBalances[1] - meta.preBalances[1],
      paymentType: "sol",
      decimal: SOL_DECIMAL, // 원시타입이므로 Pass By Value
    };
  } else if (meta.preTokenBalances[1].mint === USDC_TOKEN) {
    const senderPreToken = senderPreBal.uiTokenAmount;
    return {
      amount:
        meta.postTokenBalances[1].uiTokenAmount.amount - senderPreToken.amount,
      paymentType: "usdc",
      decimal: 10 ** senderPreToken.decimals,
    };
  } else {
    throw `Invalid token type: ${meta.preTokenBalances[1].mint}`;
  }
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
    const { sendWallet, receiveWallet } =
      getSenderReceiverPublicKey(transaction);

    // DB에서 비동기적으로 sendWallet과 receiveWallet의 user를 얻어냄
    /** @type {[{_id:Types.ObjectId}, {_id:Types.ObjectId}]} */
    const [sendUser, receiveUser] = await Promise.all([
      getUserOrCreate(sendWallet.toString()),
      getUserOrCreate(receiveWallet.toString()),
    ]);

    const { amount, paymentType, decimal } = getPostProcessDataFromTx(meta);

    // txio 도큐먼트에 삽입할 데이터
    var data = {
      /**@type {string} data */
      txSignature: transaction.signatures[0],
      /**@type {"sol"|"usdc"} */
      paymentType,
      amount,
      sendUserId: sendUser._id,
      receiveUserId: receiveUser._id,
      blockTime: tx.blockTime * 1000,
      block: tx.slot,
    };

    // txid를 얻어냄.
    const txid = getTxid(meta);

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
        paymentType,
        amount,
      };
      alertAndSendSnv(decimal, donation, sendWallet, updatedTx);
      logger.info(
        `updateTransactionWithoutDuplication 기존 데이터 업데이트: ${updatedTx}`,
      );
    } else {
      // 기존 데이터를 가져옴
      const donation = {
        displayName: txData.displayName,
        message: txData.message,
        paymentType,
        amount,
      };
      data = {
        ...data,
        platform: txData.platform,
        ...donation,
      };
      //트랜잭션 추가 및 io.to
      const createdTx = await donationRepository.createTransaction(data);
      alertAndSendSnv(decimal, donation, sendWallet, createdTx);
      logger.info(
        `updateTransactionWithoutDuplication 새 데이터 삽입: ${createdTx}`,
      );
    }
  } catch (err) {
    //getUserOrCreate, getTransactionById, createTransaction 또는 기타 에러들
    logger.error(
      `updateTransactionWithoutDuplication 에러 발생: error=${err}}`,
    );
    return;
  }
}

/**
 * Transaction 객체를 받아 Sendwallet과 ReceiveWallet PublicKey를 반환한다.
 *
 * @param {*} transaction
 *
 * @returns
 */
function getSenderReceiverPublicKey(transaction) {
  /** @type {Array<web3.PublicKey>} */
  const accountKeys = transaction.message.accountKeys,
    // 아래는 string 타입임
    sendWallet = accountKeys[0],
    receiveWallet = accountKeys[1];
  return { sendWallet, receiveWallet };
}

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
 * Transaction의 metadata를 받아 txid를 반환한다.
 * @param {*} meta
 * @returns {Types.ObjectId} txid
 */
function getTxid(meta) {
  const memo = meta.logMessages[1];
  return new Types.ObjectId(
    // eslint-disable-next-line quotes
    memo.substring(memo.indexOf('"') + 1, memo.length - 1),
  );
}

/**
 *
 * @param {number} decimal 액수 십진수 곰셈 값
 * @param {number} donation 도네이션 알림 객체
 * @param {PublicKey} sendWallet
 * @param {Object} txDocument
 */
function alertAndSendSnv(decimal, donation, sendWallet, txDocument) {
  const amount = donation.amount; // 원시타입
  (async () => {
    try {
      const pointAmount =
        (decimal == SOL_DECIMAL ? await getUsdFromSol(amount) : amount) * 10;
      sendSnvToken(sendWallet, pointAmount);
    } catch (err) {
      logger.error(
        `SNV Transfer 에러 발생: to=${sendWallet.toString()} error=${err}`,
      );
    }
  })();

  donation.amount = amount / decimal;

  io.to(txDocument.receiveUserId.toString()).emit("donation", donation);
}

/**
 * Solana Amount를 입력받아 USD 환산 값을 반환.
 * @param {number} amount
 * @returns {Promise<number>} usdAmount
 */
function getUsdFromSol(amount) {
  return new Promise((resolve, reject) => {
    if (!usdPerSol || usdPerSol < 0) {
      var timeout = setTimeout(() => {
        clearInterval(interval);
        reject("usdPerSol값이 장시간 잘못됨");
      }, 1000 * 10);
      var interval = setInterval(() => {
        if (!usdPerSol || usdPerSol < 0) return;
        resolve();
        clearTimeout(timeout);
        clearInterval(interval);
      }, 1000);
    } else resolve((usdPerSol * amount) / 1000);
  });
}

/**
 * 인자로 받은 Wallet에 amount에 해당하는 SNV 토큰을 전송.
 *
 * @param {PublicKey} toWallet
 * @param {number} amount
 */
async function sendSnvToken(toWallet, amount) {
  if (!(amount > 0)) return;
  try {
    const fromTokenAccount = await fromTokenAccountGlobal;

    // 구조 분해 할당, 값 무시
    const [toTokenAccount, ,] = await Promise.all([
      getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet),
      mintTo(
        connection,
        fromWallet,
        await fromTokenAccount.mint,
        await fromTokenAccount.address,
        fromWallet.publicKey,
        amount,
      ),
    ]);

    const signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      amount,
    );
    logger.info(
      `SNV Transfer: tx=${signature} amount=${amount} to=${toWallet}`,
    );
  } catch (err) {
    logger.error(
      `SNV Transfer 에러 발생: amount: ${amount} to: ${toWallet} error=${err}`,
    );
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
    logger.error(`recoverTransaction 에러 발생: error=${err}`);
  }
}

recoverTransaction(); //서버 부팅시 동작

connection.onLogs(
  new web3.PublicKey(process.env.DDD_SHOP_WALLET),
  logCallback,
  "confirmed",
);
