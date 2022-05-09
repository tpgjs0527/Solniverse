// react query fetcher

// 후원받은 목록
export async function fetchReceivedDonation(walletAddress: string) {
  return fetch(
    `${process.env.REACT_APP_BASE_URL}/graph/receive/${walletAddress}`
  ).then((response) => response.json());
}
