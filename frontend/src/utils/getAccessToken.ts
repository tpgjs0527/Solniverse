// refreshToken을 사용하여 accessToken 재발급 받는 함수

import { getTokens } from "./getTokens";

export async function getAccessToken(walletAddress: string) {
  if (!walletAddress)
    return alert("지갑이 연결되어있지 않습니다! 지갑 연결을 해주세요!!");
  else {
    const response = await (
      await fetch(`${process.env.REACT_APP_BASE_URL}/auth/refresh`, {
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
      console.log("이미 리프레쉬토큰이 있으니, 액세스토큰만 재발급할게요");
      return response.accessToken;
    } else {
      console.log("리프레쉬토큰없음");
      try {
        const token = await getTokens(walletAddress);
        console.log("리프레쉬토큰있음", token);
        return token;
      } catch (error) {
        alert("에러 발생");
      }
    }
    // return
  }
}
