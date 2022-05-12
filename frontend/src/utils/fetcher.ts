// react query fetcher

// 후원한 목록
export async function fetchSend(walletAddress: string) {
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

// 후원한 내역 통계
export async function fetchSendDashboard(walletAddress: string) {
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/rank/send/${walletAddress}`
  ).then((response) => response.json());
}

// 후원받은 내역 통계
export async function fetchReceiveDashboard(walletAddress: string) {
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/rank/receive/${walletAddress}`
  ).then((response) => response.json());
}

// 지갑주소에 따른 유저 로그인 혹은 회원가입
export async function fetchWallet(walletAddress: string, method = "GET") {
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/auth/connect/${walletAddress}`,
    {
      method: method,
    }
  );
}
