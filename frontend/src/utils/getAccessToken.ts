// refreshToken을 사용하여 accessToken 재발급 받는 함수

import { getTokens } from "./getTokens";

export async function getAccessToken(walletAddress: string) {
  const response = await (
    await fetch(`http://localhost:3000/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // cookie 같이 넘겨주려면 include해야함
      credentials: "include",
      body: JSON.stringify({ walletAddress }),
    })
  ).json();
  if (response.result === "success") {
    return response.accessToken;
  } else {
    getTokens(walletAddress);
  }
}
