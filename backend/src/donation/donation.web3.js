const logger = require("../../config/logger");
const { web3, connection } = require("../../config/web3.connection");
const DonationRepository = require("./donation.repository");
const donationRepository = new DonationRepository();
const UserRepository = require("../auth/user.repository");
const userRepository = new UserRepository();
const RankRepository = require("../rank/rank.repository");
const rankRepository = new RankRepository();
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

/**
 * 서버 부팅시 usdPerSol를 업데이트
 * 10분마다 usdPerSol를 업데이트 하도록 하는 구문
 */
getUsdPerSol();
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
 * 이전 금액과 나중 sol의 데이터들을 받아 정제된 데이터를 반환하는 순수 함수.
 * amount, paymentType, decimal을 반환한다.
 *
 * @param {number} preBalance
 * @param {number} postBalance
 * @returns
 */
function getDataFromBanlance(preBalance, postBalance) {
  return {
    amount: postBalance - preBalance,
    paymentType: "sol",
    decimal: SOL_DECIMAL, // 원시타입이므로 Pass By Value
  };
}

/**
 * 이전 금액과 나중 토큰 데이터들을 받아 정제된 데이터를 반환하는 순수 함수.
 * amount, paymentType, decimal을 반환한다.
 *
 * @param {number} preTokenBalance
 * @param {number} postTokenBalance
 * @param {string} symbol
 * @returns
 */
function getDataFromTokenBanlance(preTokenBalance, postTokenBalance, symbol) {
  const senderPreToken = preTokenBalance.uiTokenAmount;
  return {
    amount: postTokenBalance.uiTokenAmount.amount - senderPreToken.amount,
    paymentType: symbol,
    decimal: 10 ** senderPreToken.decimals,
  };
}

function checkRank(total) {
  if (total >= 12500) return "Diamond";
  else if (total >= 2500) return "Platinum";
  else if (total >= 500) return "Gold";
  else if (total >= 100) return "Silver";
  else return "Bronze";
}

/**
 * 트랜잭션을 받아 중복 없이 업데이트 하는 함수
 *
 * @param {Object} tx
 * @param {Object} tx.transaction
 * @param {Object} tx.transaction.
 * @param {Array<string>} tx.transaction.signatures
 * @param {Array} tx.meta.preBalances
 * @param {Array} tx.meta.postBalances
 * @param {Array} tx.meta.preTokenBalances
 * @param {Array} tx.meta.postTokenBalances
 * @param {Array<string>} tx.meta.logMessages
 * @param {Object} tx.meta.err
 * @returns
 */
async function updateTransactionWithoutDuplication(tx) {
  try {
    if (!tx || !tx.meta || tx.meta.err) {
      throw `Tx가 잘못됨 tx=${tx}`;
    }
    const {
      transaction,
      meta: {
        preBalances = [],
        postBalances = [],
        preTokenBalances = [],
        postTokenBalances = [],
        logMessages = [],
      },
    } = tx;
    if (logMessages.length != 6 && logMessages.length != 8) {
      throw `logMessages의 길이가 6 또는 8이 아님. Len=${logMessages.length} logMessages=${logMessages}`;
    }

    // sendWallet과 receiveWallet을 알아냄
    const { sendWallet, receiveWallet } =
      getSenderReceiverPublicKey(transaction);

    // DB에서 비동기적으로 sendWallet과 receiveWallet의 user를 얻어냄
    /** @type {[{_id:Types.ObjectId}, {_id:Types.ObjectId}]} */
    const [sendUser, receiveUser] = await Promise.all([
      getUserOrCreate(sendWallet.toString()),
      getUserOrCreate(receiveWallet.toString()),
    ]);

    const senderPreTokenBalance = preTokenBalances.at(1);
    const { amount, paymentType, decimal } = !senderPreTokenBalance
      ? getDataFromBanlance(preBalances.at(1), postBalances.at(1))
      : getDataFromTokenBanlance(
          senderPreTokenBalance,
          postTokenBalances.at(1),
          getSymbolByTokenAddress(senderPreTokenBalance.mint),
        );

    const txSignature = transaction.signatures.at(0);
    // txio 도큐먼트에 삽입할 데이터
    var data = {
      txSignature,
      /**@type {"sol"|"usdc"} */
      paymentType,
      amount,
      sendUserId: sendUser._id,
      receiveUserId: receiveUser._id,
      blockTime: tx.blockTime * 1000,
      block: tx.slot,
    };

    // txid를 얻어냄.
    const txid = getTxid(logMessages.at(1));

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
      alertAndSendSnv(
        decimal,
        donation,
        sendWallet.toString(),
        receiveWallet.toString(),
      );
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
      alertAndSendSnv(
        decimal,
        donation,
        sendWallet.toString(),
        receiveWallet.toString(),
      );
      logger.info(
        `updateTransactionWithoutDuplication 새 데이터 삽입: ${createdTx}`,
      );
    }
  } catch (err) {
    //getUserOrCreate, getTransactionById, createTransaction 또는 기타 에러들
    logger.error(
      `updateTransactionWithoutDuplication 에러 발생: error=${err}}`,
    );
  }
}

/**
 * Token주소를 받아 symbol이나 type을 반환하는 함수
 *
 * @param {string} tokenAddress
 * @returns
 */
function getSymbolByTokenAddress(tokenAddress) {
  switch (tokenAddress) {
    case USDC_TOKEN:
      return "usdc";
    default:
      throw "Invalid token type";
  }
}

/**
 * Transaction 객체를 받아 Sendwallet과 ReceiveWallet PublicKey를 반환한다.
 *
 * @param {Object} transaction
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
 * @param {string} memo
 * @returns {Types.ObjectId} txid
 */
function getTxid(memo) {
  return new Types.ObjectId(
    // eslint-disable-next-line quotes
    memo.substring(memo.indexOf('"') + 1, memo.length - 1),
  );
}

/**
 * 정보들을 받아 알림과 sendwallet에 SNV 토큰을 전송하는 순수 함수.
 * 외부적 종속성이 없음. 내부적 종속 = sendSnvToken
 * sendSnvToken는 PublicKey 타입을 참조 전달 받음.
 *
 * @param {number} decimal 액수 십진수 곰셈 값
 * @param {Object} donation 도네이션 객체
 * @param {string} donation.displayName 도네이션 알림 객체
 * @param {string} donation.message 도네이션 알림 객체
 * @param {string} donation.paymentType 도네이션 알림 객체
 * @param {number} donation.amount 도네이션 알림 객체
 * @param {string} sendWallet
 * @param {string} receiveUserId
 *
 * @returns {void}
 */
function alertAndSendSnv(
  decimal,
  { displayName = "", message = "", paymentType = "", amount = 0 } = {},
  sendWallet,
  receiveWallet,
) {
  (async () => {
    const toWallet = new web3.PublicKey(sendWallet);
    try {
      const usdcAmount = Math.floor(
        paymentType == "sol" ? await getUsdFromSol(amount) : amount,
      );
      updateRank(sendWallet, receiveWallet, usdcAmount / 10 ** 6);
      sendSnvToken(toWallet, usdcAmount * 10);
    } catch (err) {
      logger.error(
        `alertAndSendSnv 에러 발생: to=${toWallet.toString()} error=${err}`,
      );
    }
  })();
  amount = amount / decimal;

  logger.info(
    `Donation 알림 전송 to=${receiveWallet} displayName=${displayName} message=${message} paymentType=${paymentType} amount=${amount}`,
  );
  io.to(receiveWallet).emit("donation", {
    displayName,
    message,
    paymentType,
    amount,
  });
}

/**
 * 랭크 변경
 *
 * @param {string} sendWalletAddress
 * @param {string} receiveWalletAddress
 * @param {number} uscAmount
 */
async function updateRank(sendWalletAddress, receiveWalletAddress, uscAmount) {
  try {
    const [receive, send] = await Promise.all([
      rankRepository.getReceiveRankListByWalletAddress(receiveWalletAddress),
      rankRepository.getSendRankListByWalletAddress(sendWalletAddress),
    ]);
    // 해당 WalletAddress로 기록이 존재하지 않으면 생성 후 기록
    if (!receive) {
      const receiveRank = {
        walletAddress: receiveWalletAddress,
        receiveCount: 1,
        receiveTotal: uscAmount,
        receiveRank: checkRank(uscAmount),
      };
      rankRepository.createRankByReceive(receiveRank);
    } else {
      receive.receiveCount++;
      receive.receiveTotal += uscAmount;
      receive.receiveRank = checkRank(receive.receiveTotal);
      rankRepository.updateRankByReceive(receive);
    }
    if (!send) {
      const sendRank = {
        walletAddress: sendWalletAddress,
        sendCount: 1,
        sendTotal: uscAmount,
        sendRank: checkRank(uscAmount),
      };
      rankRepository.createRankBySend(sendRank);
    } else {
      send.sendCount++;
      send.sendTotal += uscAmount;
      send.sendRank = checkRank(send.sendTotal);
      rankRepository.updateRankBySend(send);
    }
  } catch (error) {
    logger.error(`updateRank 에러 발생: error=${error}`);
  }
}

/**
 * Solana Amount를 입력받아 Decimal 6의 USD 환산 값을 반환하는 함수.
 * 전역변수 usdPerSol에 의존성을 가짐.
 *
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
    } else resolve(usdPerSol * (amount / 1000));
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
    console.log(err);
  }
}

/**
 * 상점에 트랜잭션이 발생하면 트랜잭션을 받아 갱신 함수 동작.
 * updateTransactionWithoutDuplication에 transaction을 넘겨줌.
 *
 * @param {*} context
 */
async function logCallback(context) {
  if (context.err) {
    logger.error(`logCallback 에러 발생: error=${context.error}`);
    return;
  }
  try {
    const interval = setInterval(async () => {
      try {
        const response = await connection.getSignatureStatus(context.signature);
        const status = response.value;
        if (status) {
          const confirmation = status.confirmations || 0;
          if (confirmation >= 32 || status.confirmationStatus === "finalized") {
            clearInterval(interval);
            const transaction = await connection.getTransaction(
              context.signature,
            );
            updateTransactionWithoutDuplication(transaction);
          }
        }
      } catch (err) {
        clearInterval(interval);
        logger.error(`logCallback interval 에러 발생: error=${err}`);
      }
    }, 1000);
  } catch (err) {
    logger.error(`logCallback 에러 발생: error=${err}`);
  }
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
    transactions
      .filter(({ err }) => !err)
      .map(async ({ signature }) => {
        const transaction = await connection.getTransaction(signature);
        updateTransactionWithoutDuplication(transaction);
      });
  } catch (err) {
    logger.error(`recoverTransaction 에러 발생: error=${err}`);
  }
}

recoverTransaction().then(() => {
  connection.onLogs(
    new web3.PublicKey(process.env.DDD_SHOP_WALLET),
    logCallback,
    "confirmed",
  );
}); //서버 부팅시 동작

const WEB_RPC_OPEN = "solana webrpc opend";
const WEB_RPC_ERROR = "solana webrpc error";
const WEB_RPC_CLOSE = "solana webrpc closed";

connection._rpcWebSocket.on("open", () => {
  logger.info(WEB_RPC_OPEN);
});
connection._rpcWebSocket.on("close", () => {
  logger.info(WEB_RPC_CLOSE);
});
connection._rpcWebSocket.on("error", (err) => {
  const { error: error } = err;
  logger.error(`${WEB_RPC_ERROR}: error=${error}`);
});
