import axios from "axios";
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

// const getTokenBalance = async (walletAddress: string) => {
//   const tokenMintAddress = "9UGMFdqeQbNqu488mKYzsAwBu6P2gLJnsFeQZ29cGSEw";
//   const response = await axios({
//     url: `https://api.devnet.solana.com`,
//     method: "post",
//     headers: { "Content-Type": "application/json" },
//     data: {
//       jsonrpc: "2.0",
//       id: 1,
//       method: "getTokenAccountsByOwner",
//       params: [
//         walletAddress,
//         {
//           mint: tokenMintAddress,
//         },
//         {
//           encoding: "jsonParsed",
//         },
//       ],
//     },
//   });
//   if (
//     Array.isArray(response?.data?.result?.value) &&
//     response?.data?.result?.value?.length > 0 &&
//     response?.data?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount
//       ?.amount > 0
//   ) {
//     return (
//       Number(
//         response?.data?.result?.value[0]?.account?.data?.parsed?.info
//           ?.tokenAmount?.amount
//       ) / 1000000
//     );
//   } else {
//     return 0;
//   }
// };

async function findAssociatedTokenAddress(
  walletAddress: solanaWeb3.PublicKey,
  mintAddress: solanaWeb3.PublicKey
): Promise<solanaWeb3.PublicKey> {
  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new solanaWeb3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  );
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

export {
  LAMPORTS_PER_SOL,
  createConnection,
  createPublicKey,
  getSolanaPrice,
  getBalance,
  findAssociatedTokenAddress,
};
