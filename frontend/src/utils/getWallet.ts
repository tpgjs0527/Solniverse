import { useWallet } from "@solana/wallet-adapter-react";
import { getProvider } from "./getProvider";

// 지갑연결해서 해당 리턴값 반환

export const getWallet = async () => {
  const provider = getProvider();

  // provider가 undefined면 팬텀지갑 공식홈페이지로 이동
  if (provider) {
    const response = await provider.connect();
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/auth/connect/${response.publicKey.toString()}`,
        {
          method: "GET",
        }
      );
      if (res.status >= 200 && res.status < 400) {
        const data = await res.json();
        return data;
      } else {
        const error = new Error(res.statusText);
        throw error;
      }
    } catch (error) {
      console.log(error);
      const res = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/auth/connect/${response.publicKey.toString()}`,
        {
          method: "POST",
        }
      );
      if (res.status >= 200 && res.status < 400) {
        const data = await res.json();
        console.log(data);
        return data;
      } else {
        const error = new Error(res.statusText);
        console.log(error);
        alert("지갑 연결이 안되네요");
      }
    }
  }
};
