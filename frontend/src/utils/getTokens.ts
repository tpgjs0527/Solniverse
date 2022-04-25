import { getProvider } from "./getProvider";
import base58 from "bs58";

// signature 전달해서 refresthToken 및 accessToken 받기

interface IuserData {
  walletAddress: string;
  signature: string;
}

export const getTokens = async (walletAddress: string) => {
  const provider = getProvider();
  // sign message 받기
  const res = await (
    await fetch(`http://localhost:3000/api/auth/sign/${walletAddress}`, {
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
    await fetch(`http://localhost:3000/api/auth/connect`, {
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
};
