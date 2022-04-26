import { getProvider } from "./getProvider";
import base58 from "bs58";

// signature 전달해서 refresthToken 및 accessToken 받기

interface IuserData {
  walletAddress: string;
  signature: string;
}

export const getTokens = async (walletAddress: string) => {
  const provider = getProvider();
  console.log(provider);
  if (provider) {
    // 연결해서 sign message 받기

    const res = await (
      await fetch(
        `${process.env.REACT_APP_BASE_URL}/auth/sign/${walletAddress}`,
        {
          method: "GET",
        }
      )
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
    console.log(response);

    // accessToken 반환
    // refreshToken은 자동으로 cookie에 저장됨
    return response.accessToken;
  }
};
