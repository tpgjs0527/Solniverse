import { getAccessToken } from "utils/getAccessToken";

export default async function checkToken(
  accessToken: string,
  walletAddress: string
) {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/accessToken`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (res.status === 200 || res.status === 304) {
      // 토큰 정상
      return accessToken;
    } else if (res.status === 400) {
      // 토큰 없음
      const newAccessToken = await getAccessToken(walletAddress);
      return newAccessToken;
    } else if (res.status === 401) {
      // 토큰 만료
      const newAccessToken = await getAccessToken(walletAddress);
      return newAccessToken;
    } else {
      // 그 외
      const error = new Error(res.statusText);
      throw error;
    }
  } catch (error) {
    console.log("그 외 error");
  }
}
