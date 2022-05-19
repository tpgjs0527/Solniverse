import * as solanaWeb3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const LAMPORTS_PER_SOL = solanaWeb3.LAMPORTS_PER_SOL;

const createConnection = () => {
  return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"));
};

const createPublicKey = (publicKey: string) => {
  return new solanaWeb3.PublicKey(publicKey);
};

// 실시간 solana 가격 (USD)
const getSolanaPrice = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  return data.solana.usd;
};

// 지갑 잔액
const getBalance = async (walletAddress: string) => {
  const connection = createConnection();
  const publicKey = createPublicKey(walletAddress);

  const lamports = await connection.getBalance(publicKey).catch((err) => {
    console.error(`Error: ${err}`);
  });

  if (lamports) {
    // 잔액이 0이 아닐 때
    const sol = lamports / LAMPORTS_PER_SOL; // 0.000000001 단위로 처리
    return sol;
  } else {
    // 잔액이 0일 때
    return lamports;
  }
};

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new solanaWeb3.PublicKey(
  `${process.env.REACT_APP_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID}`
);

// 연결된 토큰 계정 찾기
async function findAssociatedTokenAddress(
  walletAddress: solanaWeb3.PublicKey,
  mintAddress: solanaWeb3.PublicKey
): Promise<solanaWeb3.PublicKey> {
  return (
    await solanaWeb3.PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}

// SPL 토큰 계정의 토큰 잔액을 반환
const getTokenBalance = async (publicKey: string, splToken: string) => {
  const connection = createConnection();

  const account = await findAssociatedTokenAddress(
    createPublicKey(publicKey),
    createPublicKey(splToken)
  );

  try {
    const balance = await connection.getTokenAccountBalance(
      createPublicKey(account.toString())
    );
    // return balance;
    return Number(balance.value.amount) / 1000000;
  } catch (e) {
    return 0;
  }
};

export {
  LAMPORTS_PER_SOL,
  createConnection,
  createPublicKey,
  getSolanaPrice,
  getBalance,
  findAssociatedTokenAddress,
  getTokenBalance,
};
