import { getProvider } from "./getProvider";
import base58 from "bs58";
import { getWallet } from "./getWallet";

// signature 전달해서 refresthToken 및 accessToken 받기

interface IuserData {
  walletAddress: string;
  signature: string;
}
let phantom = "";
export const getTokens = async (walletAddress: string) => {
  if (!walletAddress) return alert("지갑 주소 없음");
  const provider = getProvider();

  if (provider) {
    // 현재 지갑 연결되어있으면 연결하기
    try {
      phantom = await (
        await provider.connect({ onlyIfTrusted: true })
      ).publicKey.toString();
      console.log(phantom);
      // 지갑 연결 끊겨있으면 수동으로 연결하기
    } catch (error) {
      phantom = await (await provider.connect()).publicKey.toString();
    }
    // 연결안되어있으면 연결하기

    // sign message 받기
    const res = await (
      await fetch(`${process.env.REACT_APP_BASE_URL}/auth/sign/${phantom}`, {
        method: "GET",
      })
    ).json();

    const messageBytes = new TextEncoder().encode(res.signMessage);
    const signRes = await provider?.signMessage(messageBytes);
    const signature = base58.encode(signRes.signature);

    const userData: IuserData = {
      walletAddress: walletAddress,
      signature: signature,
    };

    const response = await (
      await fetch(`${process.env.REACT_APP_BASE_URL}/auth/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      })
    ).json();
    console.log("리프레쉬토큰 발급 완료", response);

    // accessToken 반환
    // refreshToken은 자동으로 cookie에 저장됨
    return response.accessToken;
  }
};
