// react query fetcher

// 후원한 목록
export async function fetchGive(walletAddress: string) {
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/graph/give/${walletAddress}`
  ).then((response) => response.json());
}

// 후원받은 목록
export async function fetchReceive(walletAddress: string) {
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/graph/receive/${walletAddress}`
  ).then((response) => response.json());
}
// walletAddress로 로그인 혹은 유저 데이터 만들기
export async function fetchWallet(walletAddress: string, method = "GET") {
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/auth/connect/${walletAddress}`,
    {
      method: method,
    }
  );
}
